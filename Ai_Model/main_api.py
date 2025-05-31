from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List
import os
import sys

# Tambahkan direktori tempat tes_gemini.py berada ke PYTHONPATH
# Asumsikan tes_gemini.py ada di direktori yang sama atau bisa diakses
sys.path.append(os.path.dirname(__file__)) 

# Impor model Anda
# Jika Anda menggunakan CareerChatbotModel dari tes_gemini.py
from tes_gemini import CareerChatbotModel 
# Atau jika Anda menggunakan GeminiModelImplementation dari tes_implement_gemini.py
from tes_implement_gemini import GeminiModelImplementation 

# Load environment variables (jika ada GOOGLE_API_KEY)
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

# Configure CORS (penting untuk frontend React Anda)
origins = [
    "http://localhost:5173",  # Ganti dengan URL frontend Anda (default Vite)  # Contoh lain
    "http://127.0.0.1:8000", #URL Laravel Backend Anda
    # Tambahkan domain produksi Anda di sini nanti
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inisialisasi model chatbot di startup aplikasi
# Pastikan GOOGLE_API_KEY diset di environment Anda
chatbot_model: CareerChatbotModel # Atau GeminiModelImplementation

@app.on_event("startup")
async def startup_event():
    global chatbot_model
    try:
        # Jika menggunakan CareerChatbotModel
        chatbot_model = CareerChatbotModel(api_key=os.getenv("GOOGLE_API_KEY"))
        # Atau jika menggunakan GeminiModelImplementation (jika Anda ingin memuat dari file pkl)
        # chatbot_model = GeminiModelImplementation(model_path="my_career_chatbot.pkl", api_key=os.getenv("GOOGLE_API_KEY"))
        # Jika model_path tidak ditemukan, GeminiModelImplementation akan raise error.

        print("Chatbot model initialized successfully!")
    except ValueError as e:
        raise HTTPException(status_code=500, detail=f"API Key Error: {e}. Please set GOOGLE_API_KEY environment variable.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load chatbot model: {e}")

# Definisikan Pydantic models untuk request dan response
class ChatRequest(BaseModel):
    user_message: str
    user_context: Dict[str, Any] = {}

class ProfileAssessmentRequest(BaseModel):
    interests: List[str]
    skills: List[str]
    experience_level: str
    education: str
    work_values: List[str]

# Endpoint untuk chatting
@app.post("/chat")
async def chat_with_ai(request: ChatRequest):
    try:
        response_text = chatbot_model.generate_response(request.user_message, request.user_context)
        return {"response": response_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating chat response: {str(e)}")

# Endpoint untuk asesmen karir
@app.post("/assess-career")
async def assess_career(profile: ProfileAssessmentRequest):
    try:
        # Ubah Pydantic model ke dictionary yang diharapkan oleh model Python Anda
        user_profile_dict = profile.model_dump() # Menggunakan .model_dump() untuk Pydantic v2
        recommendations = chatbot_model.assess_career_fit(user_profile_dict)
        return {"recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error assessing career fit: {str(e)}")

# Endpoint sederhana untuk cek status
@app.get("/status")
async def get_status():
    return {"status": "Career Chatbot API is running", "model_initialized": True if 'chatbot_model' in globals() else False}