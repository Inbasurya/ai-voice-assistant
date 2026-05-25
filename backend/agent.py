import logging
import os
from dotenv import load_dotenv
from livekit.agents import Agent, AgentSession, JobContext, WorkerOptions, cli
from livekit.plugins import deepgram, silero
from livekit.plugins.openai import LLM

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("restaurant-agent")

SYSTEM_PROMPT = """You are the friendly voice assistant for REACT Car Wash & Detailing.
Help customers with:
- Services and Pricing: 
  Basic Wash - 250, Exterior Polish - 450, Interior Vacuum - 150, Full Detailing - 1200, 
  Ceramic Coating - 3500, Engine Bay Cleaning - 400, Windshield Treatment - 180, 
  Wheel Rim Restoration - 300, Odor Eliminator - 120, Leather Conditioning - 250.
- Service Packages: Standard, Premium, Ultimate, Showroom Shine
- Locations: 
  1. Chennai - 23 Main St
  2. Bangalore - 46 Ave
  3. Hyderabad - 79 Rd
- Contact: phone 9123-956-790, email support@reactcarwash.com

CRITICAL RULES:
1. Keep responses very short, concise, and highly conversational. This is a real-time voice call.
2. If a customer books a package or service, calculate the exact total price and confirm it back to them clearly.
3. Ask for their vehicle type (Sedan, SUV, or Hatchback) if relevant to detailers.
4. If you don't know the answer, state that you don't know rather than inventing details."""


async def entrypoint(ctx: JobContext):
    logger.info("Agent dispatched, connecting to room")
    await ctx.connect()
    participant = await ctx.wait_for_participant()
    logger.info(f"Customer connected: {participant.identity}")

    session = AgentSession(
        stt=deepgram.STT(),
        llm=LLM(
            model="llama-3.1-8b-instant",
            base_url="https://api.groq.com/openai/v1",
            api_key=os.getenv("GROQ_API_KEY"),
        ),
        tts=deepgram.TTS(model="aura-2-andromeda-en"),
        vad=silero.VAD.load(),
        allow_interruptions=True,
        discard_audio_if_uninterruptible=True,
    )

    await session.start(
        room=ctx.room,
        agent=Agent(instructions=SYSTEM_PROMPT),
    )

    logger.info("Session started, sending greeting")
    await session.say("Welcome to REACT Car Wash & Detailing! How can I help you?")
    logger.info("Greeting sent.")


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
