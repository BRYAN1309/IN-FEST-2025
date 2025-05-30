import React from 'react';
import { BookOpen, Clock, User, ArrowRight } from 'lucide-react';
import Sidebar from '@/components/sidebar';

interface ArticlesPageProps {
  onNavigate?: (page: string) => void;
}

const ArticlesPage: React.FC<ArticlesPageProps> = ({ onNavigate }) => {
  const handleNavigation = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const articles = [
    {
      id: 1,
      title: "10 High-Demand Tech Careers for 2025",
      excerpt: "Discover the most promising technology careers that are shaping the future job market.",
      author: "Sarah Chen",
      readTime: "5 min read",
      category: "Technology",
      image: "https://via.placeholder.com/400x200/3B82F6/ffffff?text=Tech+Careers"
    },
    {
      id: 2,
      title: "How to Transition from Student to Professional",
      excerpt: "Essential tips and strategies for making a smooth transition from academic life to your career.",
      author: "Michael Rodriguez",
      readTime: "7 min read",
      category: "Career Advice",
      image: "https://via.placeholder.com/400x200/8B5CF6/ffffff?text=Career+Transition"
    },
    {
      id: 3,
      title: "Understanding Your Personality Type for Career Success",
      excerpt: "Learn how different personality types can influence your career path and workplace satisfaction.",
      author: "Dr. Emily Johnson",
      readTime: "6 min read",
      category: "Self-Discovery",
      image: "https://via.placeholder.com/400x200/06B6D4/ffffff?text=Personality+Types"
    },
    {
      id: 4,
      title: "Remote Work Skills Every Professional Needs",
      excerpt: "Master the essential skills for thriving in today's remote and hybrid work environments.",
      author: "David Park",
      readTime: "4 min read",
      category: "Remote Work",
      image: "https://via.placeholder.com/400x200/10B981/ffffff?text=Remote+Work"
    },
    {
      id: 5,
      title: "Building a Strong Professional Network",
      excerpt: "Proven strategies for creating meaningful professional relationships that advance your career.",
      author: "Lisa Thompson",
      readTime: "8 min read",
      category: "Networking",
      image: "https://via.placeholder.com/400x200/F59E0B/ffffff?text=Networking"
    },
    {
      id: 6,
      title: "The Future of AI in Career Development",
      excerpt: "Explore how artificial intelligence is revolutionizing career guidance and professional development.",
      author: "Tech Team",
      readTime: "6 min read",
      category: "AI & Future",
      image: "https://via.placeholder.com/400x200/EF4444/ffffff?text=AI+Careers"
    }
  ];

  const categories = ["All", "Technology", "Career Advice", "Self-Discovery", "Remote Work", "Networking", "AI & Future"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-black to-purple-900/50 text-white">
      {/* Global Sidebar */}
      <Sidebar activePage="articles" onNavigate={handleNavigation} />

      {/* Main Content */}
      <div className="pl-4 pr-4 md:pl-6 md:pr-6">
        {/* Header */}
        <header className="pt-20 pb-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Career <span className="text-blue-400">Articles</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              Explore our collection of career guidance articles, industry insights, and professional development tips.
            </p>
          </div>
        </header>

        {/* Categories Filter */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 ${
                  category === "All"
                    ? "bg-purple-600/20 border border-purple-500/30 text-purple-300"
                    : "bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:text-white hover:border-gray-600/50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="max-w-6xl mx-auto pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <article
                key={article.id}
                className="group bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-gray-600 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                {/* Article Image */}
                <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-600/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs font-medium text-gray-300">
                      {article.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-white/60" />
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                  
                  {/* Article Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Load More Button */}
        <div className="max-w-6xl mx-auto text-center pb-12">
          <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
            Load More Articles
          </button>
        </div>

        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-1/4 left-0 w-72 h-72 opacity-10">
            <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-3xl"></div>
          </div>
          <div className="absolute bottom-1/4 right-0 w-72 h-72 opacity-10">
            <div className="w-full h-full bg-gradient-to-tl from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlesPage;