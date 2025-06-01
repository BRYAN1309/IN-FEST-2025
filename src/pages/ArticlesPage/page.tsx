import React, { useEffect, useState } from 'react';
import { Clock, User, ArrowRight } from 'lucide-react';
import Sidebar from '@/components/sidebar';
import { getArticles } from '@/api/auth';
import { isAuthenticated } from '@/api/auth';
import { useNavigate } from 'react-router-dom';
interface ArticlesPageProps {
  onNavigate?: (page: string) => void;
}
// const navigate = useNavigate();

interface Article {
  title: string;
  desc: string;
  publish_year: string;
  author: string;
  url_article: string;
  url_image: string;
}

const ArticlesPage: React.FC<ArticlesPageProps> = ({ onNavigate }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

   useEffect(() =>{
     if (!isAuthenticated()) {
        navigate('/login'); 
        return;
     }
  })
  
  const handleNavigation = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getArticles();
        setArticles(data);
      } catch (err) {
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (loading) {
    return <div className="text-white text-center pt-40">Loading articles...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-black to-purple-900/50 text-white">
      <Sidebar activePage="articles" onNavigate={handleNavigation} />
      <div className="pl-4 pr-4 md:pl-6 md:pr-6">
        <header className="pt-20 pb-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Career <span className="bg-gradient-to-r from-pink-600 via-purple-500 to-purple-600 text-transparent bg-clip-text">Articles</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              Explore our collection of career guidance articles, industry insights, and professional development tips.
            </p>
          </div>
        </header>

        <div className="max-w-6xl mx-auto pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, idx) => (
              <a
                key={idx}
                href={article.url_article}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-gray-600 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                {/* Image */}
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={article.url_image || 'https://via.placeholder.com/400x200'}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                    {article.desc}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{article.publish_year}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlesPage;
