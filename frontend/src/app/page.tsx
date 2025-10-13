import { Music } from "lucide-react";
import { Button } from "~/components/ui/button";
import Image from 'next/image'
import Link from "next/link";

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-svh">
            {/* Header */}
            <div className="absolute top-0 z-9999 flex w-full pt-2.5">
                <div className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-b-lg pr-5 md:pr-8">
                    <div className="flex items-center justify-center gap-1 rounded-2xl px-3 py-1 lg:gap-7">
                        <h1 className="text-2xl">MUSICA</h1>
                        <div className="flex items-center">
                            <Button variant="ghost" size="sm" className="hover:bg-transparent cursor-pointer">
                                <Link href="/auth/sign-up">Sign Up</Link>
                            </Button>
                            <Button variant="ghost" size="sm" className="hover:bg-transparent cursor-pointer">
                                <Link href="/auth/sign-in">Login</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grow bg-white">
                <main className="relative flex flex-col items-center justify-center min-h-svh text-center overflow-hidden">
                    {/* Background image with fade */}
                    <div className="absolute inset-0 z-10">
                        <Image
                        src="/wallpaper.png"
                        alt="Background"
                        width={500}
                        height={500}
                        className="w-full h-full object-cover opacity-25 [mask-image:linear-gradient(to_top,transparent_0%,black_30%,black_80%,transparent_100%)]"
                        />
                    </div>

                    {/* Main Text */}
                    <div className="flex flex-col items-center gap-8 lg:gap-10 px-6">
                        <h1 className="md:max-w-3xl max-w-xl font-ebgaramond text-[56px] lg:text-[80px] leading-[102%] font-medium tracking-[-1px]">
                            Your Personal AI Producer for Music
                        </h1>
                        <h2 className="md:max-w-3xl max-w-xl text-center text-[17px] lg:text-[19px] leading-[140%] font-medium tracking-[-0.02em]">
                            Bring your ideas to life. Your AI producer crafts custom beats, melodies, and samples that match your style and mood.
                        </h2>
                        <Button className="h-10 cursor-pointer z-9999" size="lg">
                            <Link href="/auth/sign-up">Get Started</Link>
                        </Button>
                    </div>
                </main>
            </div>
        </div>
    )
}