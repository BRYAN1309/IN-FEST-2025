import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, FileText, User, Menu, X, Home, Target, LogOut, ChevronDown } from 'lucide-react';
import { getProfile, logout } from '../api/auth';

interface UserInfo {
  name: string;
  email: string;
}

interface SidebarProps {
  activePage?: string;
  onNavigate?: (page: string) => void;
  userInfo?: UserInfo;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activePage = 'Home', 
  onNavigate, 
  userInfo: initialUserInfo = { name: 'User', email: 'user@example.com' },
  onLogout 
}) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>(initialUserInfo);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  
  const sidebarRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);


  // Fetch user data
  useEffect(() => {
     const fetchUserData = async () => {
      try {
        // Only fetch if we haven't already fetched and if we don't have valid initial data
        if (!hasFetched && (!initialUserInfo.name || initialUserInfo.name === 'User')) {
          const user = await getProfile();
          setUserInfo({
            name: user.name,
            email: user.email
          });
          // Store in localStorage for fallback
          localStorage.setItem('user_name', user.name);
          localStorage.setItem('user_email', user.email);
          setHasFetched(true);
        }
      } catch (error) {
        console.error('Failed to fetch user profile', error);
        // Fallback to localStorage if available
        const storedName = localStorage.getItem('user_name');
        const storedEmail = localStorage.getItem('user_email');
        if (storedName || storedEmail) {
          setUserInfo({
            name: storedName || 'User',
            email: storedEmail || ''
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [initialUserInfo, hasFetched]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = async () => {
    setIsProfileMenuOpen(false);
    setIsSidebarOpen(false);
    
    try {
      await logout();
      if (onLogout) {
        onLogout();
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_email');
        navigate('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        if (toggleButtonRef.current && !toggleButtonRef.current.contains(event.target as Node)) {
          setIsSidebarOpen(false);
        }
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // Efek untuk mendeteksi klik di luar sidebar dan profile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Tutup profile menu jika klik di luar
      if (
        isProfileMenuOpen &&
        profileMenuRef.current && 
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }

      // Tutup sidebar jika klik di luar
      if (
        isSidebarOpen &&
        sidebarRef.current && !sidebarRef.current.contains(event.target as Node) &&
        toggleButtonRef.current && !toggleButtonRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    // Tambahkan event listener
    if (isSidebarOpen || isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup function
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen, isProfileMenuOpen]);

  return (
    <>
      {/* Sidebar Toggle Button - Fixed position */}
      <button
        ref={toggleButtonRef}
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-3 bg-gray-900/90 backdrop-blur-sm border border-gray-700/50 rounded-xl hover:bg-gray-800/90 transition-all duration-300 text-white"
        aria-label="Toggle sidebar"
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
        ref={sidebarRef}
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

          {/* Profile Section with Dropdown */}
          <div className="mt-auto relative" ref={profileMenuRef}>
            <button
              onClick={toggleProfileMenu}
              className="w-full flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:bg-gray-700/50 transition-all duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-pink-600 via-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm text-gray-300 font-medium">
                  {userInfo.name || 'My Profile'}
                </p>
                {userInfo.email && (
                  <p className="text-xs text-gray-500 truncate">{userInfo.email}</p>
                )}
              </div>
              <ChevronDown 
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  isProfileMenuOpen ? 'transform rotate-180' : ''
                }`} 
              />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-lg overflow-hidden z-50">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-400 hover:bg-red-500/10 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;