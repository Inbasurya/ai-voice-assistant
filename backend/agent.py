import logging
import os
from dotenv import load_dotenv
from livekit.agents import Agent, AgentSession, JobContext, WorkerOptions, cli
from livekit.plugins import deepgram, silero
from livekit.plugins.openai import LLM

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("restaurant-agent")

SYSTEM_PROMPT = """You are the friendly voice assistant for REACT Restaurant.
Help customers with:
- Menu and pricing:Pizza - 250,
            Idli - 25,
            vada - 20,
            Naan - 50,
            Smoothie - 120,
            Rice - 140,
            Burger - 280,
            Pasta - 280,
            Salad - 150,
            Drinks - 100,
            Biryani - 350,
            Dosa - 70,
            Chow Mein - 170,
            Desserts - 100,
- Cuisines offered: Indian, Italian, Mexican, Chinese
- Locations: 1. Chennai-23 Main St
          2. Bangalore-46 Ave
          3. Hyderabad-79  Rd
- Contact: phone 9123-956-790, email info@reactrestaurant.com

1.Keep responses short, concise, and highly conversational. This is a voice call, avoid reading out big paragraphs.
2. If a customer places an order, calculate the exact total price and confirm it back to them.
3. Be professional, friendly, and close the order nicely when they are finished.
4. If you don't know the answer to a question, say you don't know, rather than making something up."""


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
    await session.say("Welcome to REACT Restaurant! How can I help you?")
    logger.info("Greeting sent.")


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
