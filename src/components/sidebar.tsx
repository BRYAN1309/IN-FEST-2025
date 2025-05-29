import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, FileText, User, Menu, X, Home } from 'lucide-react';

interface SidebarProps {
  activePage?: string;
  onNavigate?: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage = 'chatbot', onNavigate }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNavigation = (page: string) => {
    // Use React Router for navigation
    switch (page) {
      case 'home':
        navigate('/');
        break;
      case 'chatbot':
        navigate('/dashboard');
        break;
      case 'articles':
        // Add route for articles if needed
        navigate('/articles');
        break;
      default:
        navigate('/');
    }

    // Also call the onNavigate prop if provided (for compatibility)
    if (onNavigate) {
      onNavigate(page);
    }

    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const navigationItems = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: 'chatbot',
      label: 'AI Chatbot',
      icon: <MessageCircle className="w-5 h-5" />,
    },
    {
      id: 'articles',
      label: 'Articles',
      icon: <FileText className="w-5 h-5" />,
    },
  ];

  return (
    <>
      {/* Sidebar Toggle Button - Fixed position */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-3 bg-gray-900/90 backdrop-blur-sm border border-gray-700/50 rounded-xl hover:bg-gray-800/90 transition-all duration-300 text-white"
      >
        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900/95 backdrop-blur-sm border-r border-gray-700/50 transition-transform duration-300 z-50 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64`}
      >
        <div className="flex flex-col h-full p-6 pt-20">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold">N</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              NextPath
            </span>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left ${
                  activePage === item.id
                    ? 'bg-purple-600/20 border border-purple-500/30 text-purple-300'
                    : 'hover:bg-gray-700/50 text-gray-400 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Profile Section */}
          <div className="mt-auto">
            <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm text-gray-300">My Profile</span>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop for when sidebar is open */}
      <div
        className={`fixed inset-0 transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100 pointer-events-none' : 'opacity-0 pointer-events-none'
        }`}
      />
    </>
  );
};

export default Sidebar;