import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Target, Brain, Sparkles, ArrowRight, Star, TrendingUp, Award, BookOpen, Briefcase } from 'lucide-react';
import Navbar from './components/navbar';
import Footer from './components/Footer';

const App: React.FC = () => {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  // Navigate to different pages using React Router
  const navigateTo = (page: string) => {
    if (page === 'chatbot') {
      navigate('/dashboard');
    } else {
      // Handle other navigation if needed
      navigate(`/${page}`);
    }
  };

  // Animated counter hook
  const useCounter = (end: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      let startTime: number;
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, [end, duration]);
    
    return count;
  };

  const userCount = useCounter(10000);
  const careerCount = useCounter(500);
  const accuracyCount = useCounter(95);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Computer Science Student",
      content: "NextPath helped me discover my passion for UX design. The AI recommendations were spot-on!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "High School Senior",
      content: "I was confused about my career path, but NextPath gave me clarity and confidence.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Recent Graduate",
      content: "The personality analysis was incredibly accurate. Now I'm pursuing data science!",
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white overflow-x-hidden">
      {/* Navbar Component */}
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section id="home" className="relative min-h-screen flex items-center justify-center py-20">
          {/* Animated background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
          
          <div className="relative z-10 text-center px-6 py max-w-6xl mx-auto">
            <div className="animate-fade-in-up">
              <h1 className="text-8xl md:text-8xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                  NextPath
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                An AI-powered platform that provides personalized career recommendations for<br />
                students and young individuals. Built to analyze personality, interests, and strengths<br />
                delivering fast, accurate, and secure career insights tailored to each user.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                  onClick={() => navigateTo('home')}
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-r from-gray-900/50 to-gray-800/50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="group hover:scale-105 transition-transform duration-300">
                <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">
                  {userCount.toLocaleString()}+
                </div>
                <div className="text-gray-400 text-lg">Students Guided</div>
              </div>
              <div className="group hover:scale-105 transition-transform duration-300">
                <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">
                  {careerCount}+
                </div>
                <div className="text-gray-400 text-lg">Career Paths</div>
              </div>
              <div className="group hover:scale-105 transition-transform duration-300">
                <div className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2">
                  {accuracyCount}%
                </div>
                <div className="text-gray-400 text-lg">Accuracy Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" data-animate className={`py-24 transition-all duration-1000 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Why Choose <span className="text-blue-400">NextPath</span>?
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Discover your perfect career path with our cutting-edge AI technology
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Brain className="w-8 h-8" />,
                  title: "AI-Powered Analysis",
                  description: "Advanced algorithms analyze your personality, skills, and interests to provide accurate recommendations.",
                  color: "blue"
                },
                {
                  icon: <Target className="w-8 h-8" />,
                  title: "Personalized Matching",
                  description: "Get career suggestions tailored specifically to your unique profile and aspirations.",
                  color: "purple"
                },
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "Expert Guidance",
                  description: "Access insights from industry professionals and career counselors.",
                  color: "cyan"
                },
                {
                  icon: <BookOpen className="w-8 h-8" />,
                  title: "Learning Resources",
                  description: "Get access to courses, articles, and materials to help you grow in your chosen field.",
                  color: "green"
                },
                {
                  icon: <TrendingUp className="w-8 h-8" />,
                  title: "Market Insights",
                  description: "Stay updated with the latest job market trends and salary information.",
                  color: "orange"
                },
                {
                  icon: <Award className="w-8 h-8" />,
                  title: "Success Tracking",
                  description: "Monitor your progress and celebrate your achievements along the way.",
                  color: "pink"
                }
              ].map((feature, index) => (
                <div key={index} className="group relative bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 hover:border-gray-600 transition-all duration-300 hover:scale-105">
                  <div className={`inline-flex p-3 rounded-xl bg-${feature.color}-500/20 text-${feature.color}-400 mb-4 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-white transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" data-animate className={`py-24 bg-gradient-to-b from-gray-900/20 to-transparent transition-all duration-1000 ${isVisible['how-it-works'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                How It <span className="text-purple-400">Works</span>
              </h2>
              <p className="text-xl text-gray-400">
                Simple steps to discover your perfect career path
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Take Assessment",
                  description: "Complete our comprehensive personality and skills assessment.",
                  icon: <Briefcase className="w-6 h-6" />
                },
                {
                  step: "02",
                  title: "AI Analysis",
                  description: "Our AI analyzes your responses and matches you with suitable careers.",
                  icon: <Brain className="w-6 h-6" />
                },
                {
                  step: "03",
                  title: "Get Recommendations",
                  description: "Receive personalized career paths with detailed insights and next steps.",
                  icon: <Target className="w-6 h-6" />
                }
              ].map((step, index) => (
                <div key={index} className="relative text-center group">
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      {step.icon}
                    </div>
                    <div className="text-6xl font-bold text-gray-800 mb-4">{step.step}</div>
                    <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{step.description}</p>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-10 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" data-animate className={`py-24 transition-all duration-1000 ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-16">
              What Our <span className="text-cyan-400">Users Say</span>
            </h2>
            
            <div className="relative bg-gray-900/50 backdrop-blur-sm p-8 md:p-12 rounded-2xl border border-gray-800">
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <blockquote className="text-xl md:text-2xl text-gray-300 mb-8 italic leading-relaxed">
                "{testimonials[currentTestimonial].content}"
              </blockquote>
              
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonials[currentTestimonial].name.charAt(0)}
                </div>
                <div className="text-left">
                  <div className="font-semibold">{testimonials[currentTestimonial].name}</div>
                  <div className="text-gray-400">{testimonials[currentTestimonial].role}</div>
                </div>
              </div>
              
              <div className="flex justify-center mt-8 gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentTestimonial ? 'bg-blue-500' : 'bg-gray-600'
                    }`}
                    onClick={() => setCurrentTestimonial(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Discover Your <span className="text-blue-400">Perfect Career</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of students who have found their ideal career path with NextPath's AI-powered guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigateTo('chatbot')}
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Start Your Journey
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default App;