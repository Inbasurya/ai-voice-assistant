import os
import uuid
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from livekit import api
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def read_root():
    return {"message": ""}
@app.get("/getToken")
def get_token():
    room_name = f"restaurant-{uuid.uuid4().hex[:8]}"
    identity = f"customer-{uuid.uuid4().hex[:4]}"
    
    token = api.AccessToken(
        os.getenv('LIVEKIT_API_KEY'), 
        os.getenv('LIVEKIT_API_SECRET')
    ).with_identity(identity).with_name("REACT Customer").with_grants(
        api.VideoGrants(
            room_join=True,
            room=room_name,
            can_publish=True,
            can_subscribe=True
        )
    )
    
    return {
        "url": os.getenv("wss://ai-voice-responder-oy0fiksj.livekit.cloud"),
        "token": token.to_jwt()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)