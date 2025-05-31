import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, FileText, User, Menu, X, Home, Target } from 'lucide-react';

interface SidebarProps {
  activePage?: string;
  onNavigate?: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage = 'Home', onNavigate }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Buat ref untuk sidebar container
  const sidebarRef = useRef<HTMLDivElement>(null);
  // Buat ref untuk tombol toggle (hamburger)
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNavigation = (page: string) => {
    // Use React Router for navigation
    switch (page) {
      case 'home':
        navigate('/Home');
        break;
      case 'chatbot':
        navigate('/dashboard');
        break;
      case 'articles':
        navigate('/articles');
        break;
      case 'goals':
        navigate('/goals');
        break;
      default:
        navigate('/');
    }

    // Also call the onNavigate prop if provided (for compatibility)
    if (onNavigate) {
      onNavigate(page);
    }

    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768) { // md breakpoint = 768px
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
    {
      id: 'goals',
      label: 'Goals',
      icon: <Target className="w-5 h-5" />,
    },
  ];

  // Efek untuk mendeteksi klik di luar sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSidebarOpen &&
        sidebarRef.current && !sidebarRef.current.contains(event.target as Node) &&
        toggleButtonRef.current && !toggleButtonRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false); // Tutup sidebar
      }
    };

    // Tambahkan event listener saat sidebar terbuka
    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      // Hapus event listener saat sidebar tertutup untuk menghindari memory leaks
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup function: akan dijalankan saat komponen di-unmount atau sebelum useEffect dijalankan lagi
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]); // Dependency array: efek ini akan berjalan ulang ketika isSidebarOpen berubah

  return (
    <>
      {/* Sidebar Toggle Button - Fixed position */}
      <button
        ref={toggleButtonRef} // Pasang ref di sini
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-3 bg-gray-900/90 backdrop-blur-sm border border-gray-700/50 rounded-xl hover:bg-gray-800/90 transition-all duration-300 text-white"
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay (Opsional: ini juga bisa berfungsi sebagai penutup jika diklik) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)} // Klik overlay juga akan menutup sidebar
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef} // Pasang ref di sini
        className={`fixed top-0 left-0 h-full transition-transform duration-300 z-50 w-64 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '3px transparent solid',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div className="flex flex-col h-full p-6 pt-20">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <span className="text-3xl ml-3.5 font-bold bg-gradient-to-r from-pink-600 via-purple-500 to-purple-600 bg-clip-text text-transparent">
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
              <div className="w-8 h-8 bg-gradient-to-r from-pink-600 via-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm text-gray-300">My Profile</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;