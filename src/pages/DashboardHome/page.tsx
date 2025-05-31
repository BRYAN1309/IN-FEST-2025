import { useState, useEffect } from 'react';
import { User, MessageCircle, FileText, TrendingUp, Clock, Award, Target, Book, ArrowRight, BarChart3, Zap, Calendar, LogOut } from 'lucide-react';
import { getProfile,logout } from '@/api/auth';
import { isAuthenticated } from '@/api/auth';
import { useNavigate } from 'react-router-dom';

const DashboardHome = () => {
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [userName, setUserName] = useState('Guest');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login'); 
            return;
        }
        const updateTime = () => {
            const now = new Date();
            
            setCurrentTime(now.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
            }));
            setCurrentDate(now.toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'long',
                day: 'numeric'
            }));
        };

        updateTime();
        const timer = setInterval(updateTime, 60000);
        
        const fetchUserData = async () => {
            try {
                const user = await getProfile();
                setUserName(user.name);
                localStorage.setItem('user_name', user.name);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch user profile', err);
                setError('Failed to load user data');
                // Fallback to localStorage if available
                const storedUser = localStorage.getItem('user_name');
                if (storedUser) {
                    setUserName(storedUser);
                }
                 if ((err as any).response?.status === 401) {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();

        return () => clearInterval(timer);
    }, []);
    
    
    const handleQuickAction = (route: string) => {
        // This will be handled by parent component or global navigation
        window.location.href = route;
    };

    const handleLogout = async () => {
        try {
            // Call the API logout endpoint
            await logout();
            
            // Clear localStorage
            localStorage.removeItem('user_name');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('token');
            localStorage.removeItem('user_email');
            
            // Redirect to login page or home
            window.location.href = '/';
        } catch (error) {
            console.error('Logout failed:', error);
            // Even if API logout fails, we should clear client-side storage
            localStorage.removeItem('user_name');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('token');
            localStorage.removeItem('user_email');
            window.location.href = '/';
        }
        };

    const quickActions = [
        {
        title: 'Start AI Chat',
        description: 'Get personalized career guidance',
        icon: <MessageCircle className="w-6 h-6" />,
        route: '/dashboard',
        color: 'from-pink-600 via-purple-500 to-purple-600',
        bgColor: 'bg-blue-500/10 hover:bg-blue-500/20'
        },
        {
        title: 'Browse Articles',
        description: 'Read career development articles',
        icon: <FileText className="w-6 h-6" />,
        route: '/articles',
        color: 'from-green-500 to-teal-600',
        bgColor: 'bg-green-500/10 hover:bg-green-500/20'
        },
        {
        title: 'Career Goals',
        description: 'Track your progress',
        icon: <Target className="w-6 h-6" />,
        route: '/goals',
        color: 'from-orange-500 to-red-600',
        bgColor: 'bg-orange-500/10 hover:bg-orange-500/20'
        }
    ];

    const stats = [
        { label: 'Chat Sessions', value: '12', icon: <MessageCircle className="w-5 h-5" />, color: 'text-blue-400' },
        { label: 'Articles Read', value: '8', icon: <Book className="w-5 h-5" />, color: 'text-green-400' },
        { label: 'Goals Achieved', value: '5', icon: <Award className="w-5 h-5" />, color: 'text-yellow-400' },
        { label: 'Weekly Streak', value: '15', icon: <Zap className="w-5 h-5" />, color: 'text-purple-400' }
    ];

    const recentActivities = [
        {
        title: 'Career Discussion Started',
        time: '2 hours ago',
        type: 'chat',
        description: 'Discussed software engineering career path'
        },
        {
        title: 'Article Completed',
        time: '1 day ago',
        type: 'article',
        description: 'How to Transition to Tech Industry'
        },
        {
        title: 'Goal Updated',
        time: '2 days ago',
        type: 'goal',
        description: 'Updated React learning progress'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-black p-6">
        <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Welcome Header */}
            <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Welcome back, <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">{userName}</span>! 👋
                    </h1>
                    <p className="text-gray-400">Ready to continue your career journey?</p>
                </div>
                <div className="text-right flex flex-col items-end gap-3">
                    <div>
                        <div className="text-xl font-bold text-white">{currentTime}</div>
                        <div className="text-gray-400 text-sm">{currentDate}</div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded-lg text-red-400 hover:text-red-300 transition-all duration-300 group"
                    >
                        <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium">Logout</span>
                    </button>
                </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                <div 
                    key={index} 
                    onClick={() => handleQuickAction(action.route)}
                    className={`${action.bgColor} border border-gray-700/50 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:border-gray-600/50 group`}
                >
                    <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {action.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{action.description}</p>
                    <div className="flex items-center text-blue-400 font-medium group-hover:text-blue-300">
                    Get Started <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Stats Section */}
                <div className="lg:col-span-1">
                <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    Your Stats
                    </h2>
                    <div className="space-y-3">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className={stat.color}>{stat.icon}</div>
                            <span className="text-gray-300 text-sm">{stat.label}</span>
                        </div>
                        <span className="text-xl font-bold text-white">{stat.value}</span>
                        </div>
                    ))}
                    </div>
                </div>
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-2">
                <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-400" />
                    Recent Activity
                    </h2>
                    <div className="space-y-3">
                    {recentActivities.map((activity, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            activity.type === 'chat' ? 'bg-blue-500/20 text-blue-400' :
                            activity.type === 'article' ? 'bg-green-500/20 text-green-400' :
                            'bg-orange-500/20 text-orange-400'
                        }`}>
                            {activity.type === 'chat' ? <MessageCircle className="w-4 h-4" /> :
                            activity.type === 'article' ? <FileText className="w-4 h-4" /> :
                            <Target className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-white text-sm">{activity.title}</h3>
                            <span className="text-xs text-gray-400">{activity.time}</span>
                            </div>
                            <p className="text-gray-400 text-xs">{activity.description}</p>
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
                </div>
            </div>

            {/* Progress Section */}
            <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-400" />
                Current Goals
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-700/30 rounded-lg">
                    <h3 className="font-medium text-white mb-2">Learn React & TypeScript</h3>
                    <div className="bg-gray-600 rounded-full h-2 mb-2">
                    <div className="bg-gradient-to-r from-pink-600 via-purple-500 to-purple-600 h-2 rounded-full" style={{width: '75%'}}></div>
                    </div>
                    <span className="text-sm text-gray-400">75% Complete</span>
                </div>
                <div className="p-4 bg-gray-700/30 rounded-lg">
                    <h3 className="font-medium text-white mb-2">Build Portfolio Project</h3>
                    <div className="bg-gray-600 rounded-full h-2 mb-2">
                    <div className="bg-gradient-to-r from-green-500 to-teal-600 h-2 rounded-full" style={{width: '40%'}}></div>
                    </div>
                    <span className="text-sm text-gray-400">40% Complete</span>
                </div>
                </div>
            </div>

            {/* Daily Tip */}
            <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Today's Career Tip
                </h2>
                <p className="text-gray-300">
                "Focus on building one skill at a time. Mastering the fundamentals will give you a solid foundation for advanced concepts."
                </p>
            </div>

            </div>
        </div>
    );
};

export default DashboardHome;