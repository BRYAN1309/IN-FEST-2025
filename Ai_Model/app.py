from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
from dotenv import load_dotenv
import logging
from datetime import datetime

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

# Add current directory to PYTHONPATH
sys.path.append(os.path.dirname(__file__))

# Import model implementation
try:
    from tes_implement_gemini import GeminiModelImplementation
    logger.info("Successfully imported GeminiModelImplementation")
except ImportError as e:
    logger.error(f"Failed to import GeminiModelImplementation: {e}")
    sys.exit(1)

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000",
            "http://127.0.0.1:8000"
        ]
    }
})

chatbot_model = None
model_initialized = False

def initialize_model():
    global chatbot_model

    if chatbot_model is not None:
        return True

    try:
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            api_key = "AIzaSyDe6ybNaVlchUJfWsfkIh2YjJNpqGy3Xgk"
            logger.warning("Using hardcoded API key - set GOOGLE_API_KEY env variable")

        model_path = os.path.join("Ai_Model", "my_career_chatbot.pkl")
        if not os.path.exists(model_path):
            model_path = "my_career_chatbot.pkl"

        chatbot_model = GeminiModelImplementation(
            model_path=model_path,
            api_key=api_key
        )
        logger.info(f"Model loaded successfully from {model_path}")
        return True

    except FileNotFoundError:
        logger.warning("Pickle file not found, creating basic implementation")
        chatbot_model = BasicCareerChatbot(api_key=api_key)
        logger.info("Basic chatbot model initialized")
        return True

    except Exception as e:
        logger.error(f"Failed to initialize model: {e}")
        return False

class BasicCareerChatbot:
    def __init__(self, api_key):
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        self.conversation_history = []

        self.system_prompt = """
Anda adalah CareerMentorAI, seorang konselor karir profesional yang ahli membantu orang menemukan jalur karir yang tepat.

PERAN ANDA:
- Memberikan panduan karir yang personal dan relevan
- Membantu mengidentifikasi minat, bakat, dan potensi karir
- Memberikan informasi tentang berbagai profesi dan industri
- Menyarankan langkah-langkah pengembangan karir
- Memberikan motivasi dan dukungan dalam perjalanan karir

GAYA KOMUNIKASI:
- Ramah, supportif, dan profesional
- Menggunakan bahasa Indonesia yang mudah dipahami
- Memberikan jawaban yang praktis dan actionable
- Mengajukan pertanyaan yang membantu eksplorasi diri

Selalu berikan jawaban yang membantu dan konstruktif!
"""

    def generate_response(self, user_message: str, user_context: dict = None) -> str:
        try:
            context = self.system_prompt + "\n\n"

            if self.conversation_history:
                context += "Riwayat percakapan:\n"
                for conv in self.conversation_history[-3:]:
                    context += f"User: {conv['user']}\n"
                    context += f"Assistant: {conv['assistant'][:200]}...\n"

            context += f"\nUser: {user_message}\nCareerMentorAI:"
            response = self.model.generate_content(context)
            response_text = response.text

            self.conversation_history.append({
                "user": user_message,
                "assistant": response_text,
                "timestamp": str(datetime.now())
            })

            return response_text

        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return "Maaf, saya mengalami kendala teknis. Silakan coba lagi atau ajukan pertanyaan yang lebih spesifik."

    def assess_career_fit(self, user_profile: dict) -> list:
        try:
            assessment_prompt = f"""
Berdasarkan profil berikut, berikan 3-5 rekomendasi karir terbaik:

PROFIL USER:
- Minat: {', '.join(user_profile.get('interests', []))}
- Skills: {', '.join(user_profile.get('skills', []))}
- Pengalaman: {user_profile.get('experience_level', 'Tidak disebutkan')}
- Pendidikan: {user_profile.get('education', 'Tidak disebutkan')}

Berikan rekomendasi dalam format yang jelas dengan alasan mengapa cocok.
"""
            response = self.model.generate_content(self.system_prompt + "\n\n" + assessment_prompt)

            return [{
                "career_title": "Business Analyst",
                "match_score": 80,
                "reasons": ["Cocok dengan skill analisis", "Peluang karir yang baik"],
                "next_steps": ["Pelajari tools analisis", "Dapatkan sertifikasi"],
                "salary_range": "Rp 8,000,000 - Rp 20,000,000/bulan",
                "growth_prospect": "Tinggi"
            }]

        except Exception as e:
            logger.error(f"Error in career assessment: {e}")
            return [{
                "career_title": "Konsultasi Lebih Lanjut Diperlukan",
                "match_score": 50,
                "reasons": ["Perlu informasi lebih detail"],
                "next_steps": ["Diskusi dengan konselor karir"],
                "salary_range": "Bervariasi",
                "growth_prospect": "Tergantung pilihan"
            }]

# Safe model initialization for Flask 3.0+
@app.before_request
def ensure_model_initialized():
    global model_initialized
    if not model_initialized:
        if initialize_model():
            model_initialized = True
        else:
            logger.error("Failed to initialize model")

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "status": "AI Career Chatbot API is running",
        "model_initialized": chatbot_model is not None,
        "endpoints": ["/chat", "/assess-career", "/status"]
    })

@app.route('/status', methods=['GET'])
def status():
    is_model_initialized = chatbot_model is not None
    model_info = {}

    if chatbot_model and hasattr(chatbot_model, 'get_model_info'):
        try:
            model_info = chatbot_model.get_model_info()
        except:
            model_info = {"basic_info": "Model loaded"}

    return jsonify({
        "status": "AI Flask API is running",
        "model_initialized": is_model_initialized,
        "model_info": model_info
    })

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400

        user_message = data.get('user_message')
        user_context = data.get('user_context', {})

        if not user_message:
            return jsonify({"error": "No user_message provided"}), 400

        response_text = chatbot_model.generate_response(user_message, user_context)

        return jsonify({
            "response": response_text,
            "status": "success"
        })

    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        return jsonify({"error": f"Failed to get response from AI: {str(e)}"}), 500

@app.route('/assess-career', methods=['POST'])
def assess_career():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400

        required_fields = ["interests", "skills", "experience_level", "education"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        user_profile = {
            "interests": data.get("interests", []),
            "skills": data.get("skills", []),
            "experience_level": data.get("experience_level"),
            "education": data.get("education"),
            "work_values": data.get("work_values", [])
        }

        recommendations = chatbot_model.assess_career_fit(user_profile)

        return jsonify({
            "recommendations": recommendations,
            "status": "success"
        })

    except Exception as e:
        logger.error(f"Error in assess-career endpoint: {e}")
        return jsonify({"error": f"Failed to get career assessment: {str(e)}"}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "error": "Endpoint not found",
        "available_endpoints": ["/", "/chat", "/assess-career", "/status"]
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    initialize_model()
    app.run(host='0.0.0.0', port=5000, debug=True)
