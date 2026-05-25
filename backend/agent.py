import logging
import os
from dotenv import load_dotenv
from livekit.agents import Agent, AgentSession, JobContext, WorkerOptions, cli
from livekit.plugins import deepgram, silero
from livekit.plugins.openai import LLM

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("restaurant-agent")

SYSTEM_PROMPT = """You are a helpful phone assistant for REACT Car Wash. Speak in short, simple sentences (max 2 sentences). 

PRICES (Say as words, NEVER use symbols like ₹):
- Basic Wash - 250
- Exterior Polish - 450
- Interior Vacuum - 150
- Full Detailing - 1200
- Ceramic Coating - 3500
- Engine Bay Cleaning - 400
- Windshield Treatment - 180
- Wheel Rim Restoration - 300
- Odor Eliminator - 120
- Leather Conditioning - 250

LOCATIONS & CONTACT:
- Branches: Chennai, Bangalore, Hyderabad.
- Phone: 912-946-9789

OUR FEATURED PREMIUM SERVICES:
- Express Exterior Wash
- Interior Restoration
- Paint Correction and Polish
- Ceramic Shield Protection
RULES:
1. One question at a time. Never dump a list of all services.
2. If you don't know something, say: "I'm not sure, let me check with the manager."

BOOKING STEPS (Follow one-by-one):
1. Ask for their Name.
2. Ask for Vehicle Type (Hatchback, Sedan, SUV).
3. Ask which Service they want.
4. Confirm everything and state the final price."""


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
