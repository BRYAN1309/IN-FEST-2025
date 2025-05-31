import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Target, Brain, Sparkles, ArrowRight, Star, TrendingUp, Award, BookOpen, Briefcase } from 'lucide-react';
import Navbar from './components/navbar'; // Pastikan Navbar ini juga responsif
import Footer from './components/Footer'; // Pastikan Footer ini juga responsif

const App: React.FC = () => {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({}); // Perbaiki tipe useState untuk isVisible

  // Navigate to different pages using React Router
  const navigateTo = (page: string) => {
    if (page === 'chatbot') {
      navigate('/dashboard');
    } else {
      // Handle other navigation if needed
      navigate(`/${page}`);
    }
  };

  // Animated counter hook (Tidak ada perubahan di sini, sudah baik)
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
      name: "Denzel Malik Ibrahim",
      role: "Computer Science Student",
      content: "NextPath helped me discover my passion for UX design. The AI recommendations were spot-on!",
      rating: 5
    },
    {
      name: "Bryan Thanaya",
      role: "Computer Science Student",
      content: "I was confused about my career path, but NextPath gave me clarity and confidence.",
      rating: 5
    },
    {
      name: "Franscelino Melvyn",
      role: "Computer Science Student",
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

  // Intersection Observer for animations (Tidak ada perubahan di sini, sudah baik)
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
    // Tambahkan padding vertikal yang lebih kecil untuk mobile (py-4) dan default py-6 untuk desktop
    <div className="min-h-screen flex flex-col bg-black text-white overflow-x-hidden p-4 md:p-6">
      {/* Navbar Component - PERHATIAN: Pastikan Navbar.tsx itu sendiri responsif (hamburger menu, dll.) */}
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section id="home" className="relative min-h-screen flex items-center justify-center py-16 md:py-20"> {/* Kurangi py di mobile */}
          {/* Animated background (sudah cukup responsif karena absolute dan w/h relatif) */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="relative z-10 text-center px-4 sm:px-6 max-w-6xl mx-auto"> {/* Kurangi px di mobile */}
            <div className="animate-fade-in-up">
              {/* Ukuran font Hero Heading: Kurangi font size untuk mobile (text-5xl) */}
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold mb-4 md:mb-8 items-center">
                <span className="bg-gradient-to-r from-pink-600 via-purple-500 to-purple-600 bg-clip-text text-transparent">
                  NextPath
                </span>
              </h1>
              {/* Ukuran font Hero Paragraph: Kurangi font size untuk mobile (text-base atau text-lg) dan hapus <br /> */}
              <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 md:mb-8 mt-4 md:mt-8 leading-relaxed">
                An AI-powered platform that provides personalized career recommendations for
                students and young individuals. Built to analyze personality, interests, and strengths
                delivering fast, accurate, and secure career insights tailored to each user.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"> {/* Kurangi gap di mobile */}
                <button
                  onClick={() => navigateTo('home')}
                  // Ukuran padding tombol: Kurangi px, py di mobile (px-6 py-3)
                  className="group bg-gradient-to-r from-pink-600 via-purple-500 to-purple-600 hover:from-pink-700 hover:via-purple-600 hover:to-purple-700 px-6 py-3 rounded-xl mt-4 sm:mt-8 font-semibold text-base sm:text-lg transition-all duration-500 transform hover:scale-105 flex items-center gap-2"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 md:py-20 bg-gradient-to-r from-gray-900/50 to-gray-800/50"> {/* Kurangi py di mobile */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6"> {/* Kurangi px di mobile */}
            {/* Tata letak grid: Default 1 kolom untuk mobile, 3 kolom untuk md */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 text-center"> {/* Tambahkan sm:grid-cols-2 untuk tablet kecil */}
              <div className="group hover:scale-105 transition-transform duration-300">
                {/* Ukuran font angka: Kurangi font size untuk mobile (text-3xl atau text-4xl) */}
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-pink-600 mb-2">
                  {userCount.toLocaleString()}+
                </div>
                {/* Ukuran font teks: Kurangi font size untuk mobile (text-base) */}
                <div className="text-gray-400 text-base sm:text-lg">Users Guided</div>
              </div>
              <div className="group hover:scale-105 transition-transform duration-300">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-400 mb-2">
                  {careerCount}+
                </div>
                <div className="text-gray-400 text-base sm:text-lg">Career Paths</div>
              </div>
              <div className="group hover:scale-105 transition-transform duration-300">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-600 mb-2">
                  {accuracyCount}%
                </div>
                <div className="text-gray-400 text-base sm:text-lg">Accuracy Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" data-animate className={`py-16 md:py-24 transition-all duration-1000 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}> {/* Kurangi py di mobile */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6"> {/* Kurangi px di mobile */}
            <div className="text-center mb-12 md:mb-16"> {/* Kurangi mb di mobile */}
              {/* Ukuran font heading: Kurangi font size untuk mobile (text-3xl atau text-4xl) */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
                Why Choose <span className="bg-gradient-to-r from-pink-600 via-purple-500 to-purple-600 text-transparent bg-clip-text">NextPath</span>?
              </h2>
              {/* Ukuran font paragraph: Kurangi font size untuk mobile (text-base atau text-lg) */}
              <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
                Discover your perfect career path with our cutting-edge AI technology
              </p>
            </div>

            {/* Tata letak grid: Default 1 kolom untuk mobile, 2 kolom untuk md, 3 kolom untuk lg */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"> {/* Kurangi gap di mobile */}
              {[
                // ... (data fitur, tidak ada perubahan di sini)
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
                <div key={index} className="group relative bg-gray-900/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-gray-800 hover:border-gray-600 transition-all duration-300 hover:scale-105"> {/* Kurangi padding di mobile */}
                  <div className={`inline-flex p-3 rounded-xl bg-${feature.color}-500/20 text-${feature.color}-400 mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}> {/* Kurangi mb di mobile */}
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 group-hover:text-white transition-colors"> {/* Kurangi font size dan mb di mobile */}
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm sm:text-base leading-relaxed"> {/* Kurangi font size di mobile */}
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" data-animate className={`py-16 md:py-24 bg-gradient-to-b from-gray-900/20 to-transparent transition-all duration-1000 ${isVisible['how-it-works'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}> {/* Kurangi py di mobile */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6"> {/* Kurangi px di mobile */}
            <div className="text-center mb-12 md:mb-16"> {/* Kurangi mb di mobile */}
              {/* Ukuran font heading: Kurangi font size untuk mobile (text-3xl atau text-4xl) */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
                How It <span className="text-blue-400">Works</span>
              </h2>
              {/* Ukuran font paragraph: Kurangi font size untuk mobile (text-base atau text-lg) */}
              <p className="text-base sm:text-lg text-gray-400">
                Simple steps to discover your perfect career path
              </p>
            </div>

            {/* Tata letak grid: Default 1 kolom untuk mobile, 3 kolom untuk md */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                // ... (data step, tidak ada perubahan di sini)
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
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-pink-600 via-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform"> {/* Kurangi ukuran icon background dan mb di mobile */}
                      {step.icon}
                    </div>
                    <div className="text-5xl sm:text-6xl font-bold text-gray-800 mb-2 sm:mb-4">{step.step}</div> {/* Kurangi font size dan mb di mobile */}
                    <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">{step.title}</h3> {/* Kurangi font size dan mb di mobile */}
                    <p className="text-gray-400 text-sm sm:text-base leading-relaxed">{step.description}</p> {/* Kurangi font size di mobile */}
                  </div>
                  {/* Panah penghubung: Sembunyikan di mobile, munculkan di md */}
                  {index < 2 && (
                    <div className="hidden md:block absolute top-10 -right-4 w-8 h-0.5 bg-gradient-to-r from-pink-600 via-purple-500 to-purple-600"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" data-animate className={`py-16 md:py-24 transition-all duration-1000 ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}> {/* Kurangi py di mobile */}
          <div className="max-w-xl md:max-w-4xl mx-auto px-4 sm:px-6 text-center"> {/* Kurangi max-w dan px di mobile */}
            {/* Ukuran font heading: Kurangi font size untuk mobile (text-3xl atau text-4xl) */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 md:mb-16">
              What Our <span className="text-blue-400">Users Say</span>
            </h2>

            <div className="relative bg-gray-900/50 backdrop-blur-sm p-6 sm:p-8 md:p-12 rounded-2xl border border-gray-800"> {/* Kurangi padding di mobile */}
              <div className="flex justify-center mb-4 sm:mb-6"> {/* Kurangi mb di mobile */}
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Ukuran font quote: Kurangi font size untuk mobile (text-lg atau text-xl) */}
              <blockquote className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 sm:mb-8 italic leading-relaxed">
                "{testimonials[currentTestimonial].content}"
              </blockquote>

              <div className="flex items-center justify-center gap-3 sm:gap-4"> {/* Kurangi gap di mobile */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-pink-600 via-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg"> {/* Kurangi ukuran avatar dan font di mobile */}
                  {testimonials[currentTestimonial].name.charAt(0)}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-sm sm:text-base">{testimonials[currentTestimonial].name}</div> {/* Kurangi font size di mobile */}
                  <div className="text-gray-400 text-xs sm:text-sm">{testimonials[currentTestimonial].role}</div> {/* Kurangi font size di mobile */}
                </div>
              </div>

              <div className="flex justify-center mt-6 sm:mt-8 gap-2"> {/* Kurangi mt di mobile */}
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${ // Kurangi ukuran dot di mobile
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
        <section className="py-16 md:py-24 bg-gradient-to-r from-blue-900/30 to-purple-900/30"> {/* Kurangi py di mobile */}
          <div className="max-w-xl md:max-w-4xl mx-auto px-4 sm:px-6 text-center"> {/* Kurangi max-w dan px di mobile */}
            {/* Ukuran font heading: Kurangi font size untuk mobile (text-3xl atau text-4xl) */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
              Ready to Discover Your <span className="text-blue-400">Perfect Career</span>?
            </h2>
            {/* Ukuran font paragraph: Kurangi font size untuk mobile (text-base atau text-lg) */}
            <p className="text-base sm:text-lg text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto">
              Join thousands of students who have found their ideal career path with NextPath's AI-powered guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"> {/* Kurangi gap di mobile */}
              <button
                onClick={() => navigateTo('chatbot')}
                // Ukuran padding tombol: Kurangi px, py di mobile (px-6 py-3)
                className="group bg-gradient-to-r from-pink-600 via-purple-500 to-purple-600 hover:from-pink-700 hover:via-purple-600 hover:to-purple-700 px-6 py-3 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Start Your Journey
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Component - PERHATIAN: Pastikan Footer.tsx itu sendiri responsif */}
      <Footer />
    </div>
  );
};

export default App;