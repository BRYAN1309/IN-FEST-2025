import google.generativeai as genai
import json
import os
import pickle
from datetime import datetime
from typing import Dict, List, Optional, Any
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CareerChatbotModel:
    def __init__(self, api_key: str = None):
        """
        Initialize Career Chatbot with Gemini AI
        
        Args:
            api_key: Google AI API key. If None, will look for GOOGLE_API_KEY env variable
        """
        self.api_key = api_key or os.getenv("GOOGLE_API_KEY")
        if not self.api_key:
            raise ValueError("Google AI API key is required")
        
        # Configure Gemini AI
        genai.configure(api_key=self.api_key)
        
        # Initialize model
        self.model = genai.GenerativeModel('gemini-pro')
        
        # Model configuration
        self.generation_config = {
            'temperature': 0.7,
            'top_p': 0.8,
            'top_k': 40,
            'max_output_tokens': 1024,
        }
        
        # Safety settings
        self.safety_settings = [
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            }
        ]
        
        # System prompt
        self.system_prompt = self._create_system_prompt()
        
        # Career database for context
        self.career_database = self._load_career_database()
        
        # Conversation history
        self.conversation_history = []
        
        logger.info("Career Chatbot Model initialized successfully")
    
    def _create_system_prompt(self) -> str:
        """Create comprehensive system prompt for career counseling"""
        return """Anda adalah NextPath AI, seorang konselor karir profesional yang berpengalaman dengan keahlian mendalam dalam:

PERAN & TANGGUNG JAWAB:
- Konselor karir berpengalaman 15+ tahun
- Ahli dalam assessment kepribadian dan minat
- Pakar trend industri dan pasar kerja Indonesia
- Mentor pengembangan skill dan kompetensi
- Advisor strategi karir jangka panjang

KEAHLIAN SPESIFIK:
1. Assessment Karir:
   - Holland Code (RIASEC) assessment
   - Big Five personality traits
   - Skills gap analysis
   - Work values assessment
   - Career anchors identification

2. Pengetahuan Industri:
   - Teknologi & Digital (Software, Data Science, AI/ML, Cybersecurity)
   - Bisnis & Finance (Banking, Consulting, Investment, Startup)
   - Kreatif & Media (Design, Content, Marketing, Entertainment)
   - Kesehatan & Life Sciences (Healthcare, Pharma, Biotech)
   - Pendidikan & Public Service
   - Manufaktur & Engineering

3. Market Intelligence:
   - Salary benchmarking Indonesia
   - Job market trends 2024-2025
   - Skills demand forecasting
   - Remote work opportunities
   - Startup ecosystem Indonesia

METODOLOGI KONSELING:
1. Discovery Phase:
   - Eksplorasi latar belakang pendidikan
   - Identifikasi minat dan passion
   - Mapping skill teknis dan soft skill
   - Analisis nilai-nilai kerja (work values)
   - Assessment kepribadian sederhana

2. Analysis Phase:
   - Career matching berdasarkan profil
   - Skills gap identification
   - Market opportunity analysis
   - Risk & benefit assessment

3. Planning Phase:
   - Career roadmap development
   - Skill development plan
   - Network building strategy
   - Timeline dan milestone setting

4. Action Phase:
   - Concrete next steps
   - Resource recommendations
   - Progress tracking suggestions

GAYA KOMUNIKASI:
- Bahasa Indonesia yang ramah dan profesional
- Empati tinggi dan non-judgmental
- Practical dan actionable advice
- Menggunakan contoh konkret dan real-world cases
- Bertanya secara strategis untuk menggali informasi
- Memberikan encouragement dan motivasi

FRAMEWORK PERTANYAAN:
- "Ceritakan tentang momen ketika Anda merasa paling engaged dalam bekerja/belajar"
- "Apa yang membuat Anda bangga dari pencapaian Anda sejauh ini?"
- "Jika tidak ada batasan finansial, apa yang ingin Anda lakukan?"
- "Skill apa yang orang lain sering minta bantuan dari Anda?"
- "Seperti apa lingkungan kerja ideal untuk Anda?"

OUTPUT FORMAT:
- Berikan rekomendasi yang spesifik dan dapat ditindaklanjuti
- Sertakan resource konkret (course, sertifikasi, buku, platform)
- Breakdown timeline realistis untuk pencapaian tujuan
- Alternative paths jika rencana utama tidak feasible
- Expected salary range dan career progression

BATASAN:
- Tidak memberikan nasihat finansial spesifik di luar salary benchmarking
- Tidak menggantikan konseling psikologi profesional
- Fokus pada career development, bukan personal counseling
- Berikan disclaimer untuk keputusan besar (resign, career pivot)

KONTEKS INDONESIA:
- Memahami budaya kerja Indonesia
- Job market trends lokal dan regional
- Startup ecosystem dan peluang entrepreneur
- Government policies impact on employment
- Educational system dan skill development options

Mulai setiap percakapan dengan assessment ringan untuk memahami konteks user, lalu berikan guidance yang personal dan practical."""

    def _load_career_database(self) -> Dict:
        """Load career database for context and recommendations"""
        return {
            "technology": {
                "software_engineer": {
                    "title": "Software Engineer",
                    "description": "Mengembangkan aplikasi dan sistem software",
                    "skills_required": ["Programming", "Problem Solving", "System Design", "Testing"],
                    "education": "S1 Informatika/Teknik Komputer atau bootcamp intensif",
                    "salary_range": "Rp 8,000,000 - Rp 35,000,000/bulan",
                    "growth_prospects": "Sangat Tinggi",
                    "career_path": "Junior → Mid → Senior → Tech Lead → Engineering Manager",
                    "trending_skills": ["Python", "JavaScript", "Cloud Computing", "DevOps", "AI/ML"]
                },
                "data_scientist": {
                    "title": "Data Scientist",
                    "description": "Menganalisis data untuk insight bisnis",
                    "skills_required": ["Statistics", "Machine Learning", "Python/R", "SQL", "Data Visualization"],
                    "education": "S1/S2 Statistik, Matematika, atau Computer Science",
                    "salary_range": "Rp 12,000,000 - Rp 40,000,000/bulan",
                    "growth_prospects": "Sangat Tinggi",
                    "career_path": "Data Analyst → Data Scientist → Senior DS → Data Science Manager",
                    "trending_skills": ["Deep Learning", "MLOps", "Big Data", "NLP", "Computer Vision"]
                },
                "product_manager": {
                    "title": "Product Manager",
                    "description": "Mengelola pengembangan produk digital",
                    "skills_required": ["Strategic Thinking", "User Research", "Analytics", "Communication"],
                    "education": "S1 berbagai jurusan + product management course",
                    "salary_range": "Rp 15,000,000 - Rp 45,000,000/bulan",
                    "growth_prospects": "Tinggi",
                    "career_path": "Associate PM → PM → Senior PM → Principal PM → VP Product",
                    "trending_skills": ["Growth Hacking", "User Experience", "A/B Testing", "Agile", "AI Product Strategy"]
                }
            },
            "business": {
                "business_analyst": {
                    "title": "Business Analyst",
                    "description": "Menganalisis proses bisnis dan memberikan rekomendasi",
                    "skills_required": ["Analytical Thinking", "Process Mapping", "Stakeholder Management", "Documentation"],
                    "education": "S1 Bisnis, Ekonomi, atau Teknik Industri",
                    "salary_range": "Rp 8,000,000 - Rp 22,000,000/bulan",
                    "growth_prospects": "Tinggi",
                    "career_path": "Junior BA → BA → Senior BA → Principal BA → Business Consultant",
                    "trending_skills": ["Data Analytics", "Process Automation", "Digital Transformation", "Agile"]
                },
                "digital_marketing": {
                    "title": "Digital Marketing Specialist",
                    "description": "Mengelola marketing digital dan campaign online",
                    "skills_required": ["Content Creation", "Social Media", "Analytics", "SEO/SEM", "Campaign Management"],
                    "education": "S1 Marketing, Komunikasi, atau self-taught",
                    "salary_range": "Rp 6,000,000 - Rp 20,000,000/bulen",
                    "growth_prospects": "Tinggi",
                    "career_path": "Marketing Executive → Specialist → Manager → Head of Marketing",
                    "trending_skills": ["Marketing Automation", "Influencer Marketing", "TikTok Marketing", "Performance Marketing"]
                }
            },
            "creative": {
                "ux_designer": {
                    "title": "UX/UI Designer",
                    "description": "Mendesain pengalaman dan interface pengguna",
                    "skills_required": ["Design Thinking", "User Research", "Prototyping", "Visual Design", "Empathy"],
                    "education": "S1 DKV, Psikologi, atau design bootcamp",
                    "salary_range": "Rp 8,000,000 - Rp 25,000,000/bulan",
                    "growth_prospects": "Tinggi",
                    "career_path": "Junior Designer → UX Designer → Senior Designer → Lead Designer → Design Director",
                    "trending_skills": ["Service Design", "Design Systems", "Accessibility", "AR/VR Design"]
                }
            }
        }

    def generate_response(self, user_message: str, user_context: Dict = None) -> str:
        """
        Generate AI response based on user message and context
        
        Args:
            user_message: User's input message
            user_context: Additional context about user (assessment data, history, etc.)
        
        Returns:
            AI generated response
        """
        try:
            # Build conversation context
            conversation_context = self._build_context(user_message, user_context)
            
            # Generate response
            response = self.model.generate_content(
                conversation_context,
                generation_config=self.generation_config,
                safety_settings=self.safety_settings
            )
            
            # Store conversation
            self.conversation_history.append({
                "user": user_message,
                "assistant": response.text,
                "timestamp": datetime.now().isoformat(),
                "context": user_context
            })
            
            return response.text
            
        except Exception as e:
            logger.error(f"Error generating response: {str(e)}")
            return self._get_fallback_response()

    def _build_context(self, user_message: str, user_context: Dict = None) -> str:
        """Build complete context for AI model"""
        
        context_parts = [self.system_prompt]
        
        # Add user context if available
        if user_context:
            context_parts.append(f"\nKONTEKS USER:")
            if user_context.get("assessment_data"):
                assessment = user_context["assessment_data"]
                context_parts.append(f"- Minat: {', '.join(assessment.get('interests', []))}")
                context_parts.append(f"- Skills: {', '.join(assessment.get('skills', []))}")
                context_parts.append(f"- Pengalaman: {assessment.get('experience_level', 'Tidak disebutkan')}")
                context_parts.append(f"- Pendidikan: {assessment.get('education', 'Tidak disebutkan')}")
                context_parts.append(f"- Work Values: {', '.join(assessment.get('work_values', []))}")
            
            if user_context.get("career_stage"):
                context_parts.append(f"- Career Stage: {user_context['career_stage']}")
            
            if user_context.get("goals"):
                context_parts.append(f"- Goals: {user_context['goals']}")
        
        # Add recent conversation history
        if self.conversation_history:
            context_parts.append(f"\nRIWAYAT PERCAKAPAN TERBARU:")
            for conv in self.conversation_history[-3:]:  # Last 3 conversations
                context_parts.append(f"User: {conv['user']}")
                context_parts.append(f"CareerMentorAI: {conv['assistant'][:200]}...")
        
        # Add current user message
        context_parts.append(f"\nUser: {user_message}")
        context_parts.append("CareerMentorAI:")
        
        return "\n".join(context_parts)

    def _get_fallback_response(self) -> str:
        """Fallback response when AI generation fails"""
        return """Maaf, saya mengalami kendala teknis saat ini. 
        
Sebagai alternatif, saya tetap bisa membantu Anda dengan:
- Memberikan informasi umum tentang berbagai profesi
- Membantu Anda memahami skill yang dibutuhkan untuk karir tertentu  
- Memberikan panduan pengembangan karir secara umum

Silakan ajukan pertanyaan spesifik Anda, dan saya akan berusaha membantu dengan pengetahuan yang ada."""

    def assess_career_fit(self, user_profile: Dict) -> List[Dict]:
        """
        Assess career fit based on user profile
        
        Args:
            user_profile: Dictionary containing user's interests, skills, etc.
        
        Returns:
            List of career recommendations with fit scores
        """
        recommendations = []
        
        try:
            # Build assessment prompt
            assessment_prompt = f"""
Berdasarkan profil berikut, berikan 5 rekomendasi karir terbaik dengan scoring:

PROFIL USER:
- Minat: {', '.join(user_profile.get('interests', []))}
- Skills: {', '.join(user_profile.get('skills', []))}
- Pengalaman: {user_profile.get('experience_level', 'Tidak disebutkan')}
- Pendidikan: {user_profile.get('education', 'Tidak disebutkan')}
- Work Values: {', '.join(user_profile.get('work_values', []))}

Format output sebagai JSON dengan struktur:
[
  {{
    "career_title": "Nama Profesi",
    "match_score": 85,
    "reasons": ["Alasan 1", "Alasan 2"],
    "next_steps": ["Langkah 1", "Langkah 2"],
    "salary_range": "Range gaji",
    "growth_prospect": "Prospek karir"
  }}
]
"""
            
            response = self.model.generate_content(
                self.system_prompt + "\n\n" + assessment_prompt,
                generation_config=self.generation_config
            )
            
            # Try to parse JSON response
            try:
                recommendations = json.loads(response.text)
            except json.JSONDecodeError:
                # If JSON parsing fails, create structured response manually
                recommendations = self._create_basic_recommendations(user_profile)
            
        except Exception as e:
            logger.error(f"Error in career assessment: {str(e)}")
            recommendations = self._create_basic_recommendations(user_profile)
        
        return recommendations

    def _create_basic_recommendations(self, user_profile: Dict) -> List[Dict]:
        """Create basic recommendations when AI assessment fails"""
        user_skills = [skill.lower() for skill in user_profile.get('skills', [])]
        user_interests = [interest.lower() for interest in user_profile.get('interests', [])]
        
        recommendations = []
        
        # Simple matching logic
        if any(skill in ['programming', 'coding', 'software'] for skill in user_skills):
            recommendations.append({
                "career_title": "Software Engineer",
                "match_score": 80,
                "reasons": ["Memiliki skill programming", "Sesuai dengan trend teknologi"],
                "next_steps": ["Perkuat portfolio coding", "Pelajari framework terbaru"],
                "salary_range": "Rp 8,000,000 - Rp 35,000,000/bulan",
                "growth_prospect": "Sangat Tinggi"
            })
        
        if any(skill in ['data', 'analysis', 'statistics'] for skill in user_skills):
            recommendations.append({
                "career_title": "Data Scientist",
                "match_score": 75,
                "reasons": ["Memiliki kemampuan analisis", "Data science sedang berkembang"],
                "next_steps": ["Pelajari machine learning", "Buat project data analysis"],
                "salary_range": "Rp 12,000,000 - Rp 40,000,000/bulan",
                "growth_prospect": "Sangat Tinggi"
            })
        
        # Add more basic recommendations...
        if not recommendations:
            recommendations.append({
                "career_title": "Business Analyst",
                "match_score": 60,
                "reasons": ["Karir yang versatile", "Cocok untuk berbagai background"],
                "next_steps": ["Pelajari business analysis fundamentals", "Dapatkan sertifikasi"],
                "salary_range": "Rp 8,000,000 - Rp 22,000,000/bulan",
                "growth_prospect": "Tinggi"
            })
        
        return recommendations

    def save_model_config(self, filepath: str = "career_chatbot_model.pkl"):
        """Save model configuration and conversation history"""
        model_data = {
            "system_prompt": self.system_prompt,
            "generation_config": self.generation_config,
            "safety_settings": self.safety_settings,
            "career_database": self.career_database,
            "conversation_history": self.conversation_history,
            "model_version": "1.0",
            "created_at": datetime.now().isoformat()
        }
        
        try:
            with open(filepath, 'wb') as f:
                pickle.dump(model_data, f)
            logger.info(f"Model configuration saved to {filepath}")
        except Exception as e:
            logger.error(f"Error saving model: {str(e)}")

    def load_model_config(self, filepath: str = "career_chatbot_model.pkl"):
        """Load model configuration and conversation history"""
        try:
            with open(filepath, 'rb') as f:
                model_data = pickle.load(f)
            
            self.system_prompt = model_data.get("system_prompt", self.system_prompt)
            self.generation_config = model_data.get("generation_config", self.generation_config)
            self.safety_settings = model_data.get("safety_settings", self.safety_settings)
            self.career_database = model_data.get("career_database", self.career_database)
            self.conversation_history = model_data.get("conversation_history", [])
            
            logger.info(f"Model configuration loaded from {filepath}")
            return True
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            return False

    def get_model_info(self) -> Dict:
        """Get model information and statistics"""
        return {
            "model_name": "gemini-1.5-pro-002",
            "system_prompt_length": len(self.system_prompt),
            "career_database_size": sum(len(category) for category in self.career_database.values()),
            "conversation_count": len(self.conversation_history),
            "generation_config": self.generation_config,
            "last_interaction": self.conversation_history[-1]["timestamp"] if self.conversation_history else None
        }

def main():
    """Example usage of the Career Chatbot Model"""
    
    # Initialize model (make sure to set GOOGLE_API_KEY environment variable)
    try:
        chatbot = CareerChatbotModel()
        
        # Example user profile for assessment
        user_profile = {
            "interests": ["Technology", "Problem Solving", "Innovation"],
            "skills": ["Python", "Data Analysis", "Communication", "Leadership"],
            "experience_level": "3 years experience",
            "education": "S1 Teknik Informatika",
            "work_values": ["Work-life balance", "Learning opportunities", "Career growth"]
        }
        
        # Generate career assessment
        print("=== CAREER ASSESSMENT ===")
        recommendations = chatbot.assess_career_fit(user_profile)
        for rec in recommendations:
            print(f"Career: {rec['career_title']} (Match: {rec['match_score']}%)")
            print(f"Reasons: {', '.join(rec['reasons'])}")
            print("-" * 50)
        
        # Example conversation
        print("\n=== CONVERSATION EXAMPLE ===")
        user_context = {"assessment_data": user_profile}
        
        response1 = chatbot.generate_response(
            "Saya lulusan IT dengan pengalaman 3 tahun, ingin transisi ke data science. Apa yang harus saya lakukan?",
            user_context
        )
        print("AI Response:", response1)
        
        # Save model configuration
        chatbot.save_model_config("my_career_chatbot.pkl")
        
        # Get model info
        info = chatbot.get_model_info()
        print(f"\n=== MODEL INFO ===")
        for key, value in info.items():
            print(f"{key}: {value}")
            
    except Exception as e:
        print(f"Error: {str(e)}")
        print("Make sure to set GOOGLE_API_KEY environment variable")

if __name__ == "__main__":
    main()