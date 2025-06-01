import { useEffect, useState, type SetStateAction } from 'react';
import { Target, Plus, Edit3, Trash2, CheckCircle, Clock, Calendar, TrendingUp, Filter, Search, Award, Code, Briefcase, Users, X, Loader2 } from 'lucide-react';
import Sidebar from '@/components/sidebar';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, fetchGoals } from '@/api/auth';
import api from '@/api/axios';

const GoalsPage = () => {
    const [activePage, setActivePage] = useState('goals');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Initialize with empty array instead of hardcoded data
    type GoalTask = { id: number; text: string; completed: boolean };
    type Priority = 'High' | 'Medium' | 'Low';
    type Goal = {
                id: number;
                title: string;
                description: string;
                category: keyof typeof categoryIcons;
                priority: Priority;
                progress: number;
                status: string;
                due_date?: string;
                dueDate?: string;
                created_at?: string;  // Make this optional
                createdDate?: string; // Or add this to the type
                tasks: GoalTask[];
            };
    const [goals, setGoals] = useState<Goal[]>([]);

    const [showAddGoal, setShowAddGoal] = useState(false);
    const [showEditGoal, setShowEditGoal] = useState(false);
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletingGoalId, setDeletingGoalId] = useState<number | null>(null);
    const [filterCategory, setFilterCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedGoal, setExpandedGoal] = useState<number | null>(null);

    // Form state for add/edit goal
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Technical Skills',
        priority: 'Medium',
        dueDate: '',
        tasks: ['']
    });

    // Helper function to set auth token
    const setAuthToken = () => {
        const token = localStorage.getItem('token');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete api.defaults.headers.common['Authorization'];
        }
}   ;

    // Helper function to handle auth errors
    const handleAuthError = (error: any) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
            return true;
        }
        return false;
    };

    // Check authentication and fetch goals on component mount
    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }
        loadGoals();
    }, [navigate]);

    // Function to load goals from API
    const loadGoals = async () => {
        try {
            setLoading(true);
            setError(null);
            const goalsData = await fetchGoals();
            
            // Transform the API data to match your component's expected format
            const transformedGoals = goalsData.map((goal: any) => ({
                id: goal.id,
                title: goal.title,
                description: goal.description || '',
                category: goal.category || 'Technical Skills',
                priority: goal.priority || 'Medium',
                progress: goal.progress || 0,
                status: goal.status || 'In Progress',
                dueDate: goal.due_date || goal.dueDate,
                createdDate: goal.created_at ? goal.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
                tasks: Array.isArray(goal.tasks) 
                    ? goal.tasks.map((task: any, idx: number) => {
                        if (typeof task === 'string') {
                            return {
                                id: idx + 1,
                                text: task,
                                completed: false
                            };
                        }
                        return {
                            id: task.id ?? idx + 1,
                            text: task.text ?? task,
                            completed: typeof task.completed === 'boolean' ? task.completed : false
                        };
                    })
                    : []
            }));
            
            setGoals(transformedGoals);
        } catch (err) {
            console.error('Failed to fetch goals:', err);
            setError('Failed to load goals. Please try again.');
            if (handleAuthError(err)) return;
        } finally {
            setLoading(false);
        }
    };

    // Function to create a new goal via API
    const createGoal = async (goalData: any) => {
        try {
            setAuthToken();
            
            const response = await api.post('/auth/goals', {
                title: goalData.title,
                description: goalData.description,
                category: goalData.category,
                priority: goalData.priority,
                due_date: goalData.dueDate,
                tasks: goalData.tasks.filter((task: string) => task.trim())
            });
            
            return response.data;
        } catch (error: any) {
            console.error('Failed to create goal:', error);
            if (handleAuthError(error)) return;
            throw error;
        }
    };

    // Function to update a goal via API
    const updateGoal = async (goalId: number, goalData: any) => {
    try {
        setAuthToken();
        
        // Ensure we have a valid token
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            throw new Error('No authentication token found');
        }

        const response = await api.put(`/auth/goals/${goalId}`, {
            title: goalData.title,
            description: goalData.description,
            category: goalData.category,
            priority: goalData.priority,
            due_date: goalData.dueDate,
            tasks: goalData.tasks.filter((task: string) => task.trim())
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        return response.data;
    } catch (error: any) {
        console.error('Failed to update goal:', error);
        
        if (error.response) {
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
                throw new Error('Session expired. Please login again.');
            } else if (error.response.status === 403) {
                // Try refreshing token if 403 occurs
                try {
                    await refreshToken();
                    return updateGoal(goalId, goalData); // Retry with new token
                } catch (refreshError) {
                    throw new Error('You are not authorized to perform this action.');
                }
            }
        }
        
        throw error;
        }
    };

    // Function to delete a goal via API
    const deleteGoal = async (goalId: number) => {
    try {
        setAuthToken();
        
        // Ensure we have a valid token
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            throw new Error('No authentication token found');
        }

        await api.delete(`/auth/goals/${goalId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
    } catch (error: any) {
        console.error('Failed to delete goal:', error);
        
        if (error.response?.status === 401 || error.response?.status === 403) {
            try {
                await refreshToken();
                return deleteGoal(goalId); // Retry with new token
            } catch (refreshError) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        }
        
        throw error;
     }
    };
    const refreshToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token available');
        
        const response = await api.post('/auth/refresh', {
            refresh_token: refreshToken
        });
        
        localStorage.setItem('token', response.data.access_token);
        if (response.data.refresh_token) {
            localStorage.setItem('refreshToken', response.data.refresh_token);
        }
        
        return response.data;
    } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        navigate('/login');
        throw error;
    }
    };

    const categories = ['All', 'Technical Skills', 'Career Development', 'Certifications', 'Networking', 'Work'];
    const priorityOptions = ['High', 'Medium', 'Low'];
    
    const priorityColors: Record<'High' | 'Medium' | 'Low', string> = {
        'High': 'text-red-400 bg-red-500/20',
        'Medium': 'text-yellow-400 bg-yellow-500/20',
        'Low': 'text-green-400 bg-green-500/20'
    };

    const categoryIcons = {
        'Technical Skills': <Code className="w-4 h-4" />,
        'Career Development': <Briefcase className="w-4 h-4" />,
        'Certifications': <Award className="w-4 h-4" />,
        'Networking': <Users className="w-4 h-4" />,
        'Work': <Briefcase className="w-4 h-4" />
    };

    const filteredGoals = goals.filter(goal => {
        const matchesCategory = filterCategory === 'All' || goal.category === filterCategory;
        const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            goal.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const stats = [
        {
            label: 'Total Goals',
            value: goals.length,
            icon: <Target className="w-5 h-5" />,
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/20'
        },
        {
            label: 'In Progress',
            value: goals.filter(g => g.status === 'In Progress').length,
            icon: <Clock className="w-5 h-5" />,
            color: 'text-yellow-400',
            bgColor: 'bg-yellow-500/20'
        },
        {
            label: 'Completed',
            value: goals.filter(g => g.status === 'Completed').length,
            icon: <CheckCircle className="w-5 h-5" />,
            color: 'text-green-400',
            bgColor: 'bg-green-500/20'
        },
        {
            label: 'Avg Progress',
            value: goals.length > 0 ? `${Math.round(goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length)}%` : '0%',
            icon: <TrendingUp className="w-5 h-5" />,
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/20'
        }
    ];

    const getDaysUntilDue = (dueDate: string | number | Date) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const toggleGoalExpansion = (goalId: number) => {
        setExpandedGoal(expandedGoal === goalId ? null : goalId);
    };

    const updateTaskStatus = (goalId: number, taskId: number) => {
        setGoals(goals.map(goal => {
            if (goal.id === goalId) {
                const updatedTasks = Array.isArray(goal.tasks)
                    ? goal.tasks.map((task) =>
                        (task && typeof task.id === 'number')
                            ? (task.id === taskId ? { ...task, completed: !task.completed } : task)
                            : task
                      )
                    : [];
                const completedTasks = updatedTasks.filter((task) => task && task.completed).length;
                const newProgress = updatedTasks.length > 0
                    ? Math.round((completedTasks / updatedTasks.length) * 100)
                    : 0;
    
                return {
                    ...goal,
                    tasks: updatedTasks,
                    progress: newProgress,
                    status: newProgress === 100 ? 'Completed' : 'In Progress'
                };
            }
            return goal;
        }));
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            category: 'Technical Skills',
            priority: 'Medium',
            dueDate: '',
            tasks: ['']
        });
    };

    const handleAddGoal = async () => {
        if (!formData.title.trim()) return;

        try {
            setLoading(true);
            setError(null);
            await createGoal(formData);
            await loadGoals(); // Refresh goals list
            setShowAddGoal(false);
            resetForm();
        } catch (error: any) {
            setError(error.message || 'Failed to create goal. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditGoal = (goal: Goal) => {
        if (!goal) return;
        setEditingGoal(goal);
        setFormData({
            title: goal.title,
            description: goal.description,
            category: goal.category,
            priority: goal.priority,
            dueDate: goal.dueDate || '',
            tasks: goal.tasks.length > 0 ? goal.tasks.map((task) => task.text) : ['']
        });
        setShowEditGoal(true);
    };

    const handleUpdateGoal = async () => {
        if (!formData.title.trim() || !editingGoal) return;

        try {
            setLoading(true);
            setError(null);
            await updateGoal(editingGoal.id, formData);
            await loadGoals(); // Refresh goals list
            setShowEditGoal(false);
            setEditingGoal(null);
            resetForm();
        } catch (error: any) {
            setError(error.message || 'Failed to update goal. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteGoal = (goalId: number) => {
        setDeletingGoalId(goalId);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteGoal = async () => {
        if (deletingGoalId === null) return;
        
        try {
            setLoading(true);
            setError(null);
            await deleteGoal(deletingGoalId);
            await loadGoals(); // Refresh goals list
            setShowDeleteConfirm(false);
            setDeletingGoalId(null);
        } catch (error: any) {
            setError(error.message || 'Failed to delete goal. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const addTaskToForm = () => {
        setFormData({ ...formData, tasks: [...formData.tasks, ''] });
    };

    const removeTaskFromForm = (index: number) => {
        const newTasks = formData.tasks.filter((_, i) => i !== index);
        setFormData({ ...formData, tasks: newTasks });
    };

    const updateTaskInForm = (index: number, value: string) => {
        const newTasks = [...formData.tasks];
        newTasks[index] = value;
        setFormData({ ...formData, tasks: newTasks });
    };

    const handleNavigation = (page: SetStateAction<string>) => {
        setActivePage(page);
    };

    // Loading spinner component
    if (loading && goals.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-950/50 via-black to-blue-950/50">
                <Sidebar activePage={activePage} onNavigate={handleNavigation} />
                <div className="p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-center min-h-96">
                            <div className="text-center">
                                <Loader2 className="w-12 h-12 animate-spin text-blue-400 mx-auto mb-4" />
                                <p className="text-gray-400">Loading your goals...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-950/50 via-black to-blue-950/50">
            {/* Include Sidebar */}
            <Sidebar activePage={activePage} onNavigate={handleNavigation} />
            
            <div className="p-6">
                <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-3">
                            <X className="w-5 h-5 text-red-400" />
                            <span className="text-red-300">{error}</span>
                            <button 
                                onClick={() => setError(null)}
                                className="ml-auto text-red-400 hover:text-red-300"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
                
                {/* Header */}
                <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                    <Target className="w-5 h-5" />
                                </div>
                                Career Goals
                            </h1>
                            <p className="text-gray-400">Track your progress and achieve your career objectives</p>
                        </div>
                        <button
                            onClick={() => setShowAddGoal(true)}
                            disabled={loading}
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Plus className="w-5 h-5" />
                            Add New Goal
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((stat, index) => (
                            <div key={index} className={`${stat.bgColor} border border-gray-600/30 rounded-xl p-4`}>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`${stat.color}`}>{stat.icon}</div>
                                    <span className="text-gray-300 text-sm">{stat.label}</span>
                                </div>
                                <div className="text-2xl font-bold text-white">{stat.value}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search goals..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-gray-700/70 transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <Filter className="w-5 h-5 text-gray-400" />
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:bg-gray-700/70 transition-all"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Goals Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredGoals.map((goal) => {
                        const daysUntilDue = goal.dueDate ? getDaysUntilDue(goal.dueDate) : null;
                        const isExpanded = expandedGoal === goal.id;
                        
                        return (
                            <div key={goal.id} className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/60 transition-all duration-300">
                            
                                {/* Goal Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-white">{goal.title}</h3>
                                            <div className="flex items-center gap-2">
                                                {categoryIcons[goal.category]}
                                                <span className="text-xs text-gray-400">{goal.category}</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-400 text-sm mb-3">{goal.description}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[goal.priority as Priority]}`}>
                                        {goal.priority}
                                    </span>
                                </div>
                                
                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-300">Progress</span>
                                        <span className="text-sm font-semibold text-white">{goal.progress}%</span>
                                    </div>
                                    <div className="bg-gray-700 rounded-full h-2">
                                        <div 
                                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${goal.progress}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Goal Info */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                        {goal.dueDate && (
                                            <>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
                                                </div>
                                                {daysUntilDue !== null && (
                                                    <div className={`flex items-center gap-1 ${daysUntilDue < 7 ? 'text-red-400' : daysUntilDue < 30 ? 'text-yellow-400' : 'text-gray-400'}`}>
                                                        <Clock className="w-4 h-4" />
                                                        <span>{daysUntilDue > 0 ? `${daysUntilDue} days left` : 'Overdue'}</span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={() => toggleGoalExpansion(goal.id)}
                                        className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                                    >
                                        {isExpanded ? 'Hide Tasks' : 'View Tasks'} ({goal.tasks.filter(t => t.completed).length}/{goal.tasks.length})
                                    </button>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => handleEditGoal(goal)}
                                            disabled={loading}
                                            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all disabled:opacity-50"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteGoal(goal.id)}
                                            disabled={loading}
                                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded Tasks */}
                                {isExpanded && (
                                    <div className="mt-4 pt-4 border-t border-gray-700/50">
                                        <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-400" />
                                            Tasks
                                        </h4>
                                        <div className="space-y-2">
                                            {goal.tasks.map((task) => (
                                                <div key={task.id} className="flex items-center gap-3 p-2 hover:bg-gray-700/30 rounded-lg transition-colors">
                                                    <button
                                                        onClick={() => updateTaskStatus(goal.id, task.id)}
                                                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                                            task.completed 
                                                            ? 'bg-green-500 border-green-500 text-white' 
                                                            : 'border-gray-500 hover:border-green-400'
                                                        }`}
                                                    >
                                                        {task.completed && <CheckCircle className="w-3 h-3" />}
                                                    </button>
                                                    <span className={`text-sm ${task.completed ? 'text-gray-400 line-through' : 'text-gray-300'}`}>
                                                        {task.text}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* No Goals Message */}
                {filteredGoals.length === 0 && !loading && (
                    <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-12 text-center">
                        <Target className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No Goals Found</h3>
                        <p className="text-gray-400 mb-6">
                            {searchTerm || filterCategory !== 'All' 
                                ? 'Try adjusting your search or filter criteria.' 
                                : 'Start by creating your first career goal!'}
                        </p>
                        {!searchTerm && filterCategory === 'All' && (
                            <button
                                onClick={() => setShowAddGoal(true)}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                            >
                                Create Your First Goal
                            </button>
                        )}
                    </div>
                )}

                </div>
            </div>

            {/* Add Goal Modal */}
            {showAddGoal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-white">Add New Goal</h3>
                            <button
                                onClick={() => { setShowAddGoal(false); resetForm(); }}
                                className="p-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Goal Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50"
                                    placeholder="Enter your goal title..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 h-24 resize-none"
                                    placeholder="Describe your goal..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                                    >
                                        {categories.filter(cat => cat !== 'All').map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                                    >
                                        {priorityOptions.map(priority => (
                                            <option key={priority} value={priority}>{priority}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
                                    <input
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                        className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Tasks</label>
                                <div className="space-y-2">
                                    {formData.tasks.map((task, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={task}
                                                onChange={(e) => updateTaskInForm(index, e.target.value)}
                                                className="flex-1 bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50"
                                                placeholder={`Task ${index + 1}`}
                                            />
                                            {formData.tasks.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeTaskFromForm(index)}
                                                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={addTaskToForm}
                                    className="mt-2 flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Task
                                </button>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    onClick={() => { setShowAddGoal(false); resetForm(); }}
                                    className="px-6 py-2 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddGoal}
                                    disabled={loading || !formData.title.trim()}
                                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Saving...
                                        </span>
                                    ) : 'Save Goal'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Goal Modal */}
            {showEditGoal && editingGoal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-white">Edit Goal</h3>
                            <button
                                onClick={() => { setShowEditGoal(false); resetForm(); }}
                                className="p-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Goal Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50"
                                    placeholder="Enter your goal title..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 h-24 resize-none"
                                    placeholder="Describe your goal..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                                    >
                                        {categories.filter(cat => cat !== 'All').map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                                    >
                                        {priorityOptions.map(priority => (
                                            <option key={priority} value={priority}>{priority}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
                                    <input
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                        className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Tasks</label>
                                <div className="space-y-2">
                                    {formData.tasks.map((task, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={task}
                                                onChange={(e) => updateTaskInForm(index, e.target.value)}
                                                className="flex-1 bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50"
                                                placeholder={`Task ${index + 1}`}
                                            />
                                            {formData.tasks.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeTaskFromForm(index)}
                                                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={addTaskToForm}
                                    className="mt-2 flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Task
                                </button>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    onClick={() => { setShowEditGoal(false); resetForm(); }}
                                    className="px-6 py-2 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateGoal}
                                    disabled={loading || !formData.title.trim()}
                                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Updating...
                                        </span>
                                    ) : 'Update Goal'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-white">Confirm Deletion</h3>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="p-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-gray-300 mb-6">Are you sure you want to delete this goal? This action cannot be undone.</p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-6 py-2 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeleteGoal}
                                disabled={loading}
                                className="px-6 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Deleting...
                                    </span>
                                ) : 'Delete Goal'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GoalsPage;