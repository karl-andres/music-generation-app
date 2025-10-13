# Music Generation App (Musica)

An AI-powered platform that transforms user prompts into **original music and thumbnails**, built with modern full-stack and AI infrastructure.

---

## Overview

This project combines multiple AI models and serverless infrastructure to generate complete music experiences, from idea to audio and visuals, directly from user input.

---

## Tech Stack

| Layer | Tools |
|-------|-------|
| **Frontend** | Next.js, Tailwind, shadcn/ui |
| **Auth & Payments** | BetterAuth, Polar |
| **Backend** | Modal (FastAPI Endpoints), Inngest, Hugging Face |
| **Database** | NeonDB (PostgreSQL) + Prisma ORM |
| **Storage** | AWS S3 |
| **Infra** | Dockerized serverless containers (Modal) |

---

## Core Features

- **Prompt-to-Music Pipeline**  
  - **Qwen (Hugging Face)** → Converts natural language prompts into structured for ACE-STEP instructions.  
  - **Custom Music Model (ACE-STEP)** → Generates `.wav` files from the processed prompt.  
  - **Stability AI** → Generates custom artwork for each track.

- **Async Job Handling**  
  - **Inngest** powers background queues and orchestration for multi-step model workflows.  

- **Storage and Delivery**  
  - **AWS S3** stores generated `.wav` files and image assets.  
  - **NeonDB (PostgreSQL)** + **Prisma ORM** manage user data, track metadata, and generation history.

---

## Summary

This app demonstrates:
- Multi-model orchestration (LLM → Music and Image)
- Full-stack development with modern Next.js patterns  
- Production-ready async and storage architecture  
- Clean separation between marketing and authenticated app routes  

