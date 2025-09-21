import base64
from typing import List
import modal
import os
import uuid

from pydantic import BaseModel
import requests

app = modal.App("music-generator")

image = (
    modal.Image.debian_slim()
    .apt_install("git")
    .pip_install_from_requirements("requirements.txt")
    .run_commands(["git clone https://github.com/ace-step/ACE-Step.git /tmp/ACE-Step", "cd /tmp/ACE-Step && pip install ."])
    .env({"HF_HOME": "/.cache/huggingface"})
    .add_local_python_source("prompts")
)

model_volume = modal.Volume.from_name("ace-step-models", create_if_missing=True)
hf_volume = modal.Volume.from_name("qwen-hf-cache", create_if_missing=True)

music_gen_secrets = modal.Secret.from_name("music-gen-secret")

class AudioGenerationBase(BaseModel):
    audio_duration: float = 180.0
    seed: int = -1
    guidance_scale: float = 15.0
    infer_step: int = 60
    instrumental: bool = False

class GenerateFromDescriptionRequest(AudioGenerationBase):
    full_descibred_song: str
    

class GenerateWithCustomLyricsRequest(AudioGenerationBase):
    prompt: str
    lyrics: str


class GenerateWithDescribedLyricsRequest(AudioGenerationBase):
    prompt: str
    described_lyrics: str

    
class GenerateMusicResponseS3(BaseModel):
    s3_key: str
    cover_image_s3_key: str
    categories: List[str]

class GenerateMusicResponse(BaseModel):
    audio_data: str


@app.cls(
    image=image,
    gpu="L40S",
    volumes={"/models": model_volume, "/.cache/huggingface": hf_volume},
    secrets=[music_gen_secrets],
    scaledown_window=15
)
class MusicGenServer:
    @modal.enter()
    def load_model(self):
        from acestep.pipeline_ace_step import ACEStepPipeline
        from transformers import AutoModelForCausalLM, AutoTokenizer
        from diffusers import AutoPipelineForText2Image
        import torch

        # Music Generation Model
        self.music_model = ACEStepPipeline(
            checkpoint_dir='/models',
            dtype="bfloat16",
            torch_compile=False,
            cpu_offload=False,
            overlapped_decode=False
        )

        # Large Language Model
        model_id = "Qwen/Qwen2.5-7B-Instruct"
        self.tokenizer = AutoTokenizer.from_pretrained(model_id)

        self.llm_model = AutoModelForCausalLM.from_pretrained(
            model_id,
            torch_dtype="auto",
            device_map="auto",
            cache_dir="/.cache/huggingface"
        )

        # Stable Diffusion Model
        self.image_pipe = AutoPipelineForText2Image.from_pretrained("stabilityai/sdxl-turbo", torch_dtype=torch.float16, variant="fp16", cache_dir="/.cache/huggingface")
        self.image_pipe.to("cuda")

    @modal.fastapi_endpoint(method="POST")
    def generate(self) -> GenerateMusicResponse:
        output_dir = "tmp/outputs"
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, f"{uuid.uuid4()}.wav")
        
        self.music_model(
            prompt="hip-house, funk",
            lyrics="[verse]\n哎呀跳起来，脚尖踩节拍 (oo-yeah!)\n灯光闪烁像星星盛开 (uh-huh!)\n人人都醒来，把烦恼踹开 (get it!)\n热血沸腾，汗水自己安排\n\n[chorus]\n嘿，你还等啥？快抓住节拍 (come on!)\n光芒指引，让心都不存在 (whoa!)\n点燃热火，我们一起飙high (let’s go!)\n跳入午夜的狂欢时代\n\n[bridge]\n咚咚鼓声啊，让你的灵魂起飞 (woo!)\n手心拍一拍，能量翻倍 (ah-hah!)\n键盘响起来，如宇宙的交汇 (oh yeah!)\n就是这感觉，兄弟姐妹都陶醉\n\n[verse]\n灵魂从不睡，只想继续燃烧 (woo!)\n节奏像热浪，席卷这街道 (ow!)\n大伙儿涌上楼台，满面微笑 (yeah!)\n这一刻属于我们，无可替代\n\n[chorus]\n嘿，你还等啥？快抓住节拍 (come on!)\n光芒指引，让心都不存在 (whoa!)\n点燃热火，我们一起飙high (let’s go!)\n跳入午夜的狂欢时代\n\n[verse]\n世界多精彩，握紧把它打开 (alright!)\n每一步都像星球在摇摆 (uh-huh!)\n无边无际的律动像大海 (oo-yeah!)\n跟着光芒之舞，一起澎湃",
            audio_duration=204.19997916666668,
            infer_step=60,
            guidance_scale=15,
            save_path=output_path
        )
    
        with open(output_path, "rb") as f:
            audio_bytes = f.read()

        audio_b64 = base64.b64encode(audio_bytes).decode("utf-8")

        os.remove(output_path)

        return GenerateMusicResponse(audio_data=audio_b64)

@app.local_entrypoint()
def main():
    server = MusicGenServer()
    endpoint_url = server.generate.get_web_url()

    response = requests.post(endpoint_url)
    response.raise_for_status()
    result = GenerateMusicResponse(**response.json())

    audio_bytes = base64.b64decode(result.audio_data)
    output_filename = "generated.wav"
    with open(output_filename, "wb") as f:
        f.write(audio_bytes)