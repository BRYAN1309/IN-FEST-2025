import React, { useEffect, useState } from 'react';
import { Target, Plus, Edit3, Trash2, CheckCircle, Clock, Calendar, TrendingUp, Star, Filter, Search, BarChart3, Award, Zap, BookOpen, Code, Briefcase, Users, X, Save } from 'lucide-react';
import Sidebar from '@/components/sidebar'; // Import your existing Sidebar component
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '@/api/auth';
const GoalsPage = () => {
    const [activePage, setActivePage] = useState('goals');
    const navigate = useNavigate();
    useEffect(() =>{
        if (!isAuthenticated()) {
            navigate('/login'); 
            return;
        }
    })
    const [goals, setGoals] = useState([
        {
        id: 1,
        title: 'Learn React & TypeScript',
        description: 'Master React fundamentals and TypeScript for better code quality',
        category: 'Technical Skills',
        priority: 'High',
        progress: 75,
        status: 'In Progress',
        dueDate: '2025-07-15',
        createdDate: '2025-01-15',
        tasks: [
            { id: 1, text: 'Complete React fundamentals course', completed: true },
            { id: 2, text: 'Build 3 React projects', completed: true },
            { id: 3, text: 'Learn TypeScript basics', completed: true },
            { id: 4, text: 'Convert existing project to TypeScript', completed: false },
            { id: 5, text: 'Build full-stack app with React + TS', completed: false }
        ]
        },
        {
        id: 2,
        title: 'Build Portfolio Website',
        description: 'Create a professional portfolio showcasing my projects and skills',
        category: 'Career Development',
        priority: 'High',
        progress: 40,
        status: 'In Progress',
        dueDate: '2025-08-01',
        createdDate: '2025-02-01',
        tasks: [
            { id: 1, text: 'Design portfolio mockup', completed: true },
            { id: 2, text: 'Set up development environment', completed: true },
            { id: 3, text: 'Build homepage and about section', completed: false },
            { id: 4, text: 'Add projects showcase', completed: false },
            { id: 5, text: 'Deploy to production', completed: false }
        ]
        },
        {
        id: 3,
        title: 'Get AWS Certification',
        description: 'Obtain AWS Solutions Architect Associate certification',
        category: 'Certifications',
        priority: 'Medium',
        progress: 25,
        status: 'In Progress',
        dueDate: '2025-09-30',
        createdDate: '2025-03-01',
        tasks: [
            { id: 1, text: 'Enroll in AWS course', completed: true },
            { id: 2, text: 'Complete first 3 modules', completed: false },
            { id: 3, text: 'Take practice exams', completed: false },
            { id: 4, text: 'Schedule certification exam', completed: false }
        ]
        },
        {
        id: 4,
        title: 'Network with Industry Professionals',
        description: 'Connect with 50 professionals in tech industry via LinkedIn',
        category: 'Networking',
        priority: 'Medium',
        progress: 60,
        status: 'In Progress',
        dueDate: '2025-06-30',
        createdDate: '2025-01-01',
        tasks: [
            { id: 1, text: 'Update LinkedIn profile', completed: true },
            { id: 2, text: 'Connect with 30 professionals', completed: true },
            { id: 3, text: 'Engage with industry content weekly', completed: true },
            { id: 4, text: 'Attend 2 virtual networking events', completed: false },
            { id: 5, text: 'Reach 50 connections milestone', completed: false }
        ]
        }
    ]);

    const [showAddGoal, setShowAddGoal] = useState(false);
    const [showEditGoal, setShowEditGoal] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletingGoalId, setDeletingGoalId] = useState(null);
    const [filterCategory, setFilterCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedGoal, setExpandedGoal] = useState(null);

    // Form state for add/edit goal
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Technical Skills',
        priority: 'Medium',
        dueDate: '',
        tasks: ['']
    });

    const categories = ['All', 'Technical Skills', 'Career Development', 'Certifications', 'Networking'];
    const priorityOptions = ['High', 'Medium', 'Low'];
    
    const priorityColors = {
        'High': 'text-red-400 bg-red-500/20',
        'Medium': 'text-yellow-400 bg-yellow-500/20',
        'Low': 'text-green-400 bg-green-500/20'
    };

    const categoryIcons = {
        'Technical Skills': <Code className="w-4 h-4" />,
        'Career Development': <Briefcase className="w-4 h-4" />,
        'Certifications': <Award className="w-4 h-4" />,
        'Networking': <Users className="w-4 h-4" />
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
        value: `${Math.round(goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length)}%`,
        icon: <TrendingUp className="w-5 h-5" />,
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/20'
        }
    ];

    const getDaysUntilDue = (dueDate: string | number | Date) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const toggleGoalExpansion = (goalId: number | React.SetStateAction<null>) => {
        setExpandedGoal(expandedGoal === goalId ? null : goalId);
    };

    const updateTaskStatus = (goalId: number, taskId: number) => {
        setGoals(goals.map(goal => {
        if (goal.id === goalId) {
            const updatedTasks = goal.tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
            );
            const completedTasks = updatedTasks.filter(task => task.completed).length;
            const newProgress = Math.round((completedTasks / updatedTasks.length) * 100);
            
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

    const handleAddGoal = () => {
        if (!formData.title.trim()) return;

        const newGoal = {
        id: Math.max(...goals.map(g => g.id), 0) + 1,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        progress: 0,
        status: 'In Progress',
        dueDate: formData.dueDate,
        createdDate: new Date().toISOString().split('T')[0],
        tasks: formData.tasks.filter(task => task.trim()).map((task, index) => ({
            id: index + 1,
            text: task,
            completed: false
        }))
        };

        setGoals([...goals, newGoal]);
        setShowAddGoal(false);
        resetForm();
    };

    const handleEditGoal = (goal) => {
        setEditingGoal(goal);
        setFormData({
        title: goal.title,
        description: goal.description,
        category: goal.category,
        priority: goal.priority,
        dueDate: goal.dueDate,
        tasks: goal.tasks.map((task: { text: any; }) => task.text)
        });
        setShowEditGoal(true);
    };

    const handleUpdateGoal = () => {
        if (!formData.title.trim()) return;

        const updatedGoals = goals.map(goal => {
        if (goal.id === editingGoal.id) {
            const updatedTasks = formData.tasks.filter(task => task.trim()).map((task, index) => ({
            id: index + 1,
            text: task,
            completed: goal.tasks[index]?.completed || false
            }));
            
            const completedTasks = updatedTasks.filter(task => task.completed).length;
            const newProgress = updatedTasks.length > 0 ? Math.round((completedTasks / updatedTasks.length) * 100) : 0;

            return {
            ...goal,
            title: formData.title,
            description: formData.description,
            category: formData.category,
            priority: formData.priority,
            dueDate: formData.dueDate,
            tasks: updatedTasks,
            progress: newProgress,
            status: newProgress === 100 ? 'Completed' : 'In Progress'
            };
        }
        return goal;
        });

        setGoals(updatedGoals);
        setShowEditGoal(false);
        setEditingGoal(null);
        resetForm();
    };

    const handleDeleteGoal = (goalId) => {
        setDeletingGoalId(goalId);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteGoal = () => {
        setGoals(goals.filter(goal => goal.id !== deletingGoalId));
        setShowDeleteConfirm(false);
        setDeletingGoalId(null);
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

    const handleNavigation = (page: React.SetStateAction<string>) => {
        setActivePage(page);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-950/50 via-black to-blue-950/50">
        {/* Include Sidebar */}
        <Sidebar activePage={activePage} onNavigate={handleNavigation} />
        
        <div className="p-6">
            <div className="max-w-7xl mx-auto space-y-6">
            
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
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
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
                const daysUntilDue = getDaysUntilDue(goal.dueDate);
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
                        <div className="flex items-center gap-2 ml-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[goal.priority]}`}>
                            {goal.priority}
                        </span>
                        </div>
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
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div className={`flex items-center gap-1 ${daysUntilDue < 7 ? 'text-red-400' : daysUntilDue < 30 ? 'text-yellow-400' : 'text-gray-400'}`}>
                            <Clock className="w-4 h-4" />
                            <span>{daysUntilDue > 0 ? `${daysUntilDue} days left` : 'Overdue'}</span>
                        </div>
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
                            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                        >
                            <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => handleDeleteGoal(goal.id)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
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
            {filteredGoals.length === 0 && (
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
                        {categories.slice(1).map(category => (
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
                    <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-300">Tasks</label>
                    <button
                        onClick={addTaskToForm}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                    >
                        + Add Task
                    </button>
                    </div>
                    <div className="space-y-2">
                    {formData.tasks.map((task, index) => (
                        <div key={index} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={task}
                            onChange={(e) => updateTaskInForm(index, e.target.value)}
                            className="flex-1 bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50"
                            placeholder={`Task ${index + 1}...`}
                        />
                        {formData.tasks.length > 1 && (
                            <button
                            onClick={() => removeTaskFromForm(index)}
                            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                            >
                            <X className="w-4 h-4" />
                            </button>
                        )}
                        </div>
                    ))}
                    </div>
                </div>
                </div>

                <div className="flex gap-3 mt-6">
                <button
                    onClick={() => { setShowAddGoal(false); resetForm(); }}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleAddGoal}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                    <Save className="w-4 h-4" />
                    Add Goal
                </button>
                </div>
            </div>
            </div>
        )}

        {/* Edit Goal Modal */}
        {showEditGoal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Edit Goal</h3>
                <button
                    onClick={() => { setShowEditGoal(false); setEditingGoal(null); resetForm(); }}
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
                            {categories.slice(1).map(category => (
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
                        <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-gray-300">Tasks</label>
                        <button
                            onClick={addTaskToForm}
                            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                        >
                            + Add Task
                        </button>
                        </div>
                        <div className="space-y-2">
                        {formData.tasks.map((task, index) => (
                            <div key={index} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={task}
                                onChange={(e) => updateTaskInForm(index, e.target.value)}
                                className="flex-1 bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50"
                                placeholder={`Task ${index + 1}...`}
                            />
                            {formData.tasks.length > 1 && (
                                <button
                                onClick={() => removeTaskFromForm(index)}
                                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                                >
                                <X className="w-4 h-4" />
                                </button>
                            )}
                            </div>
                        ))}
                        </div>
                    </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                    <button
                        onClick={() => { setShowEditGoal(false); setEditingGoal(null); resetForm(); }}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpdateGoal}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Update Goal
                    </button>
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

                    <div className="flex gap-3">
                    <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={confirmDeleteGoal}
                        className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Goal
                    </button>
                    </div>
                </div>
                </div>
            )}
            </div>
        );
};

export default GoalsPage;