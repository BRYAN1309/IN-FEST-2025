import { useState, useEffect } from 'react';
import { User, MessageCircle, FileText, TrendingUp, Clock, Award, Target, Book, ArrowRight, BarChart3, LogOut } from 'lucide-react';
import { getProfile, logout, isAuthenticated } from '@/api/auth';
import { useNavigate } from 'react-router-dom';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// Types for BPS data
type BpsEmploymentData = {
  year: number;
  laborForce: number;
  employed: number;
  unemployed: number;
  unemploymentRate: number;
  employmentRate: number;
};

type RecentUpdate = {
  title: string;
  date: string;
  description: string;
  type: 'report' | 'survey' | 'publication';
};

const DashboardHome = () => {
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [userName, setUserName] = useState('Guest');
    const [, setLoading] = useState(true);
    const [, setError] = useState<string | null>(null);
    const [employmentData, setEmploymentData] = useState<BpsEmploymentData[]>([]);
    const [recentUpdates, setRecentUpdates] = useState<RecentUpdate[]>([]);
    const [selectedYear, setSelectedYear] = useState<number>(2023);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const navigate = useNavigate();
   
    useEffect(() => {
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
        if (!isAuthenticated()) {
                navigate('/login'); 
                return;
            }
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

        // Mock API call for BPS data (in a real app, this would be an actual API call)
        const fetchBpsData = async () => {
            try {
                setIsDataLoading(true);
                // Simulating API delay
                await new Promise(resolve => setTimeout(resolve, 800));
                
                // Mock data - in a real app, this would come from BPS API
                const mockData: BpsEmploymentData[] = [
                    { year: 2020, laborForce: 141010, employed: 128279, unemployed: 12731, unemploymentRate: 9.03, employmentRate: 90.97 },
                    { year: 2021, laborForce: 144010, employed: 131279, unemployed: 12731, unemploymentRate: 8.84, employmentRate: 91.16 },
                    { year: 2022, laborForce: 146010, employed: 133279, unemployed: 12731, unemploymentRate: 8.72, employmentRate: 91.28 },
                    { year: 2023, laborForce: 148010, employed: 136279, unemployed: 11731, unemploymentRate: 7.93, employmentRate: 92.07 },
                ];
                
                const mockUpdates: RecentUpdate[] = [
                    { 
                        title: 'February 2024 Labor Report', 
                        date: '2024-03-15', 
                        description: 'Latest unemployment rate shows improvement in manufacturing sector', 
                        type: 'report' 
                    },
                    { 
                        title: 'Quarterly Employment Survey', 
                        date: '2024-03-01', 
                        description: 'New data on youth employment trends available', 
                        type: 'survey' 
                    },
                    { 
                        title: 'Annual Labor Market Review', 
                        date: '2024-01-20', 
                        description: 'Comprehensive analysis of 2023 labor market conditions', 
                        type: 'publication' 
                    },
                ];
                
                setEmploymentData(mockData);
                setRecentUpdates(mockUpdates);
            } catch (err) {
                console.error('Failed to fetch BPS data', err);
                setError('Failed to load employment data');
            } finally {
                setIsDataLoading(false);
            }
        };

        fetchUserData();
        fetchBpsData();

        return () => clearInterval(timer);
    }, []);
    
    const handleQuickAction = (route: string) => {
        window.location.href = route;
    };

    const handleLogout = async () => {
        try {
            await logout();
            localStorage.removeItem('user_name');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('token');
            localStorage.removeItem('user_email');
            window.location.href = '/';
        } catch (error) {
            console.error('Logout failed:', error);
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

    // Prepare data for charts
    const selectedYearData = employmentData.find(data => data.year === selectedYear);
    const years = employmentData.map(data => data.year);
    
    // Line chart data for unemployment rate trend
    const lineChartData = {
        labels: years,
        datasets: [
            {
                label: 'Unemployment Rate (%)',
                data: employmentData.map(data => data.unemploymentRate),
                borderColor: 'rgba(236, 72, 153, 1)',
                backgroundColor: 'rgba(236, 72, 153, 0.2)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: 'rgba(236, 72, 153, 1)',
                pointBorderColor: '#fff',
                pointHoverRadius: 6,
                pointHoverBorderWidth: 2
            }
        ]
    };

    // Bar chart data for employment comparison
    const barChartData = {
        labels: years,
        datasets: [
            {
                label: 'Employed (thousands)',
                data: employmentData.map(data => data.employed / 1000),
                backgroundColor: 'rgba(16, 185, 129, 0.7)',
                borderColor: 'rgba(16, 185, 129, 1)',
                borderWidth: 1
            },
            {
                label: 'Unemployed (thousands)',
                data: employmentData.map(data => data.unemployed / 1000),
                backgroundColor: 'rgba(239, 68, 68, 0.7)',
                borderColor: 'rgba(239, 68, 68, 1)',
                borderWidth: 1
            }
        ]
    };

    // Pie chart data for current year employment status
    const pieChartData = selectedYearData ? {
        labels: ['Employed', 'Unemployed'],
        datasets: [
            {
                data: [selectedYearData.employed, selectedYearData.unemployed],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(239, 68, 68, 0.7)'
                ],
                borderColor: [
                    'rgba(16, 185, 129, 1)',
                    'rgba(239, 68, 68, 1)'
                ],
                borderWidth: 1,
                hoverOffset: 10
            }
        ]
    } : null;

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
                            <p className="text-gray-400">Indonesia Labor Market Dashboard</p>
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
                        <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 h-full">
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-blue-400" />
                                Key Indicators
                            </h2>
                            
                            {isDataLoading ? (
                                <div className="animate-pulse space-y-4">
                                    <div className="h-20 bg-gray-700/50 rounded-lg"></div>
                                    <div className="h-20 bg-gray-700/50 rounded-lg"></div>
                                    <div className="h-20 bg-gray-700/50 rounded-lg"></div>
                                </div>
                            ) : selectedYearData ? (
                                <div className="space-y-4">
                                    <div className="p-4 bg-gradient-to-r from-gray-700/50 to-gray-800/30 rounded-lg border border-gray-600/30">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-300 text-sm">Year</span>
                                            <select 
                                                value={selectedYear}
                                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                                                className="bg-gray-700/50 border border-gray-600/30 text-white text-sm rounded px-2 py-1"
                                            >
                                                {years.map(year => (
                                                    <option key={year} value={year}>{year}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:border-blue-500/30 transition-colors">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-gray-300 text-sm">Labor Force</span>
                                            <TrendingUp className="w-4 h-4 text-green-400" />
                                        </div>
                                        <div className="text-2xl font-bold text-white">
                                            {(selectedYearData.laborForce / 1000).toFixed(0)}K
                                        </div>
                                        <div className="text-xs text-gray-400">People aged 15+</div>
                                    </div>
                                    
                                    <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:border-green-500/30 transition-colors">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-gray-300 text-sm">Employment Rate</span>
                                            <div className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                                                {selectedYearData.employmentRate.toFixed(1)}%
                                            </div>
                                        </div>
                                        <div className="text-2xl font-bold text-white">
                                            {(selectedYearData.employed / 1000).toFixed(0)}K
                                        </div>
                                        <div className="text-xs text-gray-400">Employed population</div>
                                    </div>
                                    
                                    <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:border-red-500/30 transition-colors">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-gray-300 text-sm">Unemployment Rate</span>
                                            <div className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded-full">
                                                {selectedYearData.unemploymentRate.toFixed(1)}%
                                            </div>
                                        </div>
                                        <div className="text-2xl font-bold text-white">
                                            {(selectedYearData.unemployed / 1000).toFixed(0)}K
                                        </div>
                                        <div className="text-xs text-gray-400">Unemployed population</div>
                                    </div>
                                    
                                    {pieChartData && (
                                        <div className="mt-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                                            <div className="h-48">
                                                <Pie 
                                                    data={pieChartData}
                                                    options={{
                                                        responsive: true,
                                                        maintainAspectRatio: false,
                                                        plugins: {
                                                            legend: {
                                                                position: 'bottom',
                                                                labels: {
                                                                    color: '#E5E7EB',
                                                                    font: {
                                                                        size: 12
                                                                    }
                                                                }
                                                            },
                                                            tooltip: {
                                                                callbacks: {
                                                                    label: function(context) {
                                                                        const label = context.label || '';
                                                                        const value = context.raw || 0;
                                                                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                                                        const percentage = Math.round((Number(value) / total) * 100);
                                                                        return `${label}: ${(Number(value) / 1000).toFixed(0)}K (${percentage}%)`;
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-gray-400 text-center py-8">No data available</div>
                            )}
                        </div>
                    </div>

                    {/* Data Visualization Section */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Unemployment Trend Chart */}
                        <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-purple-400" />
                                Unemployment Rate Trend (2020-2023)
                            </h2>
                            <div className="h-64">
                                {isDataLoading ? (
                                    <div className="animate-pulse h-full bg-gray-700/50 rounded-lg"></div>
                                ) : (
                                    <Line 
                                        data={lineChartData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    labels: {
                                                        color: '#E5E7EB'
                                                    }
                                                },
                                                tooltip: {
                                                    callbacks: {
                                                        label: function(context) {
                                                            return `${context.dataset.label}: ${context.raw}%`;
                                                        }
                                                    }
                                                }
                                            },
                                            scales: {
                                                x: {
                                                    grid: {
                                                        color: 'rgba(255, 255, 255, 0.05)'
                                                    },
                                                    ticks: {
                                                        color: '#9CA3AF'
                                                    }
                                                },
                                                y: {
                                                    grid: {
                                                        color: 'rgba(255, 255, 255, 0.05)'
                                                    },
                                                    ticks: {
                                                        color: '#9CA3AF',
                                                        callback: function(value) {
                                                            return value + '%';
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                        
                        {/* Employment Comparison Chart */}
                        <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-400" />
                                Employment Comparison (in thousands)
                            </h2>
                            <div className="h-64">
                                {isDataLoading ? (
                                    <div className="animate-pulse h-full bg-gray-700/50 rounded-lg"></div>
                                ) : (
                                    <Bar 
                                        data={barChartData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    labels: {
                                                        color: '#E5E7EB'
                                                    }
                                                },
                                                tooltip: {
                                                    callbacks: {
                                                        label: function(context) {
                                                            return `${context.dataset.label}: ${context.raw}K`;
                                                        }
                                                    }
                                                }
                                            },
                                            scales: {
                                                x: {
                                                    grid: {
                                                        color: 'rgba(255, 255, 255, 0.05)'
                                                    },
                                                    ticks: {
                                                        color: '#9CA3AF'
                                                    }
                                                },
                                                y: {
                                                    grid: {
                                                        color: 'rgba(255, 255, 255, 0.05    )'
                                                    },
                                                    ticks: {
                                                        color: '#9CA3AF',
                                                        callback: function(value: string | number) {
                                                            return value + 'K';
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Updates */}
                <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-yellow-400" />
                        Recent BPS Updates
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {isDataLoading ? (
                            Array(3).fill(0).map((_, index) => (
                                <div key={index} className="animate-pulse h-32 bg-gray-700/50 rounded-lg"></div>
                            ))
                        ) : (
                            recentUpdates.map((update, index) => (
                                <div
                                    key={index}
                                    className="block p-4 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:border-gray-500/50 transition-colors group cursor-pointer"
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
                                        update.type === 'report' ? 'bg-blue-500/20 text-blue-400' :
                                        update.type === 'survey' ? 'bg-green-500/20 text-green-400' :
                                        'bg-purple-500/20 text-purple-400'
                                    }`}>
                                        {update.type === 'report' ? <FileText className="w-4 h-4" /> :
                                        update.type === 'survey' ? <Book className="w-4 h-4" /> :
                                        <Award className="w-4 h-4" />}
                                    </div>
                                    <h3 className="font-medium text-white mb-1 group-hover:text-blue-400 transition-colors">
                                        {update.title}
                                    </h3>
                                    <p className="text-gray-400 text-xs mb-2">{update.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500">{new Date(update.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                        <span className="text-xs text-blue-400 hover:text-blue-300 flex items-center">
                                            Details <ArrowRight className="w-3 h-3 ml-1" />
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Data Source */}
                <div className="text-center text-gray-500 text-xs">
                    Data Source: Badan Pusat Statistik (BPS) - Indonesia Central Bureau of Statistics
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;