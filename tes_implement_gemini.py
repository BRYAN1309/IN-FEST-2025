import pickle
import os
from typing import Any, Dict, List, Optional
import google.generativeai as genai
from datetime import datetime
import json
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GeminiModelImplementation:
    """
    Implementation class for loading and using a saved CareerChatbot configuration.
    """
    
    def __init__(self, model_path: str = "my_career_chatbot.pkl", api_key: Optional[str] = None):
        """
        Initialize the Gemini model implementation.
        
        Args:
            model_path (str): Path to the saved model configuration file
            api_key (str, optional): Google AI API key. If None, will try to get from environment
        """
        self.model_path = model_path
        self.model_data = None
        self.model = None
        
        # Configuration from saved data
        self.system_prompt = None
        self.generation_config = None
        self.safety_settings = None
        self.career_database = None
        self.conversation_history = []
        
        # Set up API key
        self.api_key = api_key or os.getenv('GOOGLE_API_KEY') or os.getenv('GOOGLE_AI_API_KEY')
        
        if not self.api_key:
            raise ValueError("Google AI API key is required. Set GOOGLE_API_KEY environment variable or pass api_key parameter.")
        
        genai.configure(api_key=self.api_key)
        
        self.load_model()
    
    def load_model(self):
        """Load the saved model configuration from pickle file."""
        try:
            with open(self.model_path, 'rb') as f:
                self.model_data = pickle.load(f)
            
            logger.info(f"Model configuration loaded successfully from {self.model_path}")
            
            # Extract configuration from saved data
            if isinstance(self.model_data, dict):
                self.system_prompt = self.model_data.get('system_prompt', '')
                self.generation_config = self.model_data.get('generation_config', {})
                self.safety_settings = self.model_data.get('safety_settings', [])
                self.career_database = self.model_data.get('career_database', {})
                self.conversation_history = self.model_data.get('conversation_history', [])
                
                # Initialize the Gemini model with loaded configuration
                self.model = genai.GenerativeModel('gemini-1.5-flash')
                
                logger.info("Model initialized successfully with loaded configuration")
                logger.info(f"System prompt length: {len(self.system_prompt)}")
                logger.info(f"Conversation history: {len(self.conversation_history)} messages")
                
            else:
                raise ValueError("Invalid model data format")
                
        except FileNotFoundError:
            logger.error(f"Model file {self.model_path} not found.")
            raise
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            raise
    
    def generate_response(self, user_message: str, user_context: Dict = None) -> str:
        """
        Generate a response using the loaded model configuration.
        
        Args:
            user_message (str): User's input message
            user_context (dict): Additional context about user
            
        Returns:
            str: Generated response
        """
        if not self.model:
            return "Error: Model not loaded properly."
        
        try:
            # Build conversation context (similar to original implementation)
            conversation_context = self._build_context(user_message, user_context)
            
            # Generate response
            response = self.model.generate_content(
                conversation_context,
                generation_config=self.generation_config,
                safety_settings=self.safety_settings
            )
            
            # Store conversation in history
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
        """Build complete context for AI model (same logic as original)"""
        
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
        Assess career fit based on user profile (same logic as original)
        
        Args:
            user_profile: Dictionary containing user's interests, skills, etc.
        
        Returns:
            List of career recommendations with fit scores
        """
        recommendations = []
        
        if not self.model:
            return self._create_basic_recommendations(user_profile)
        
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
        
        recommendations = []
        
        # Simple matching logic using career database
        if self.career_database:
            tech_careers = self.career_database.get('technology', {})
            business_careers = self.career_database.get('business', {})
            
            # Check for tech skills
            if any(skill in ['programming', 'coding', 'software', 'python'] for skill in user_skills):
                if 'software_engineer' in tech_careers:
                    career_data = tech_careers['software_engineer']
                    recommendations.append({
                        "career_title": career_data['title'],
                        "match_score": 80,
                        "reasons": ["Memiliki skill programming", "Sesuai dengan trend teknologi"],
                        "next_steps": ["Perkuat portfolio coding", "Pelajari framework terbaru"],
                        "salary_range": career_data['salary_range'],
                        "growth_prospect": career_data['growth_prospects']
                    })
            
            # Check for data skills
            if any(skill in ['data', 'analysis', 'statistics'] for skill in user_skills):
                if 'data_scientist' in tech_careers:
                    career_data = tech_careers['data_scientist']
                    recommendations.append({
                        "career_title": career_data['title'],
                        "match_score": 75,
                        "reasons": ["Memiliki kemampuan analisis", "Data science sedang berkembang"],
                        "next_steps": ["Pelajari machine learning", "Buat project data analysis"],
                        "salary_range": career_data['salary_range'],
                        "growth_prospect": career_data['growth_prospects']
                    })
        
        # Add fallback recommendation
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
    
    def chat_session(self):
        """Start an interactive chat session."""
        if not self.model:
            print("Error: Model not loaded properly.")
            return
        
        print("Starting Career Counseling Chat Session")
        print("Type 'quit', 'exit', or 'bye' to end the session")
        print("=" * 50)
        
        while True:
            user_input = input("\nAnda: ")
            if user_input.lower() in ['quit', 'exit', 'bye']:
                print("Terima kasih! Semoga konsultasi karir ini bermanfaat.")
                break
            
            try:
                response = self.generate_response(user_input)
                print(f"\nCareerMentorAI: {response}")
            except Exception as e:
                print(f"Error: {str(e)}")
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the loaded model."""
        if self.model_data:
            return {
                "model_path": self.model_path,
                "model_loaded": self.model is not None,
                "system_prompt_length": len(self.system_prompt) if self.system_prompt else 0,
                "career_database_size": sum(len(category) for category in self.career_database.values()) if self.career_database else 0,
                "conversation_count": len(self.conversation_history),
                "model_version": self.model_data.get("model_version", "Unknown"),
                "created_at": self.model_data.get("created_at", "Unknown"),
                "last_interaction": self.conversation_history[-1]["timestamp"] if self.conversation_history else None
            }
        return {"error": "No model data loaded"}


def main():
    """Main function to demonstrate usage."""
    print("Career Chatbot - Gemini Model Implementation")
    print("=" * 50)
    
    try:
        # Load the model (make sure to set your API key)
        model_impl = GeminiModelImplementation(
            model_path="my_career_chatbot.pkl", 
            api_key="AIzaSyDe6ybNaVlchUJfWsfkIh2YjJNpqGy3Xgk"  # Replace with your actual API key
        )
        
        # Show model information
        info = model_impl.get_model_info()
        print("Model Info:")
        for key, value in info.items():
            print(f"  {key}: {value}")
        
        print("\nChoose an option:")
        print("1. Single career question")
        print("2. Career assessment")
        print("3. Interactive chat session")
        print("4. Exit")
        
        choice = input("\nEnter your choice (1-4): ")
        
        if choice == "1":
            question = input("Enter your career question: ")
            response = model_impl.generate_response(question)
            print(f"\nResponse:\n{response}")
        
        elif choice == "2":
            print("Let's do a quick career assessment...")
            interests = input("What are your interests? (comma-separated): ").split(',')
            skills = input("What are your skills? (comma-separated): ").split(',')
            experience = input("Your experience level: ")
            education = input("Your education background: ")
            
            user_profile = {
                "interests": [i.strip() for i in interests],
                "skills": [s.strip() for s in skills],
                "experience_level": experience.strip(),
                "education": education.strip(),
                "work_values": ["Career growth", "Work-life balance"]
            }
            
            recommendations = model_impl.assess_career_fit(user_profile)
            
            print(f"\n=== CAREER RECOMMENDATIONS ===")
            for i, rec in enumerate(recommendations[:3], 1):  # Show top 3
                print(f"\n{i}. {rec['career_title']} (Match: {rec['match_score']}%)")
                print(f"   Reasons: {', '.join(rec['reasons'])}")
                print(f"   Next Steps: {', '.join(rec['next_steps'])}")
                print(f"   Salary Range: {rec.get('salary_range', 'N/A')}")
        
        elif choice == "3":
            model_impl.chat_session()
        
        elif choice == "4":
            print("Goodbye!")
        
        else:
            print("Invalid choice.")
    
    except Exception as e:
        print(f"Error initializing model: {str(e)}")
        print("Make sure:")
        print("1. The model file 'my_career_chatbot.pkl' exists")
        print("2. Your Google AI API key is correct")
        print("3. You have internet connection")


if __name__ == "__main__":
    main()