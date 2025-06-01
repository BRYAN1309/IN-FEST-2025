import api from './axios';

interface User {
  name: string;
  email: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface GoalTask {
  id: number;
  text: string;
  completed: boolean;
}

interface Goal {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  progress: number;
  status: string;
  due_date: string;
  created_at: string;
  tasks: GoalTask[];
}

// Helper function to ensure auth token is set
const ensureAuthToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  // Set default authorization header
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  return token;
};

export const register = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await api.post('auth/register', data);
    return response.data;
  } catch (error: any) {
    console.error('Registration failed', error);
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const login = async (data: { email: string; password: string }): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('auth/login', data);
    const { access_token } = response.data;
    
    // Store token
    localStorage.setItem('token', access_token);
    
    // Set default authorization header for future requests
    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    
    // Fetch and store user data immediately after login
    const user = await getProfile();
    localStorage.setItem('user_name', user.name);
    localStorage.setItem('user_email', user.email);
    
    return response.data;
  } catch (error: any) {
    console.error('Login failed', error);
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const getProfile = async (): Promise<User> => {
  try {
    ensureAuthToken();
    const response = await api.get<User>('/auth/me');
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch profile', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch profile');
  }
};

export const logout = async (): Promise<void> => {
  try {
    // Make API call to backend logout endpoint
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout API error:', error);
  } finally {
    // Always clear client-side storage and headers
    localStorage.removeItem('token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    localStorage.removeItem('auth_token');
    delete api.defaults.headers.common['Authorization'];
  }
};

export const refreshToken = async (): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/auth/refresh');
    const { access_token } = response.data;
    
    // Update stored token and headers
    localStorage.setItem('token', access_token);
    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    
    return response.data;
  } catch (error: any) {
    console.error('Token refresh failed', error);
    // Clear invalid tokens
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    throw new Error(error.response?.data?.message || 'Token refresh failed');
  }
};

// Goals API functions
export const fetchGoals = async (): Promise<Goal[]> => {
  try {
    ensureAuthToken();
    const response = await api.get('/auth/goals');
    // Handle both wrapped (Laravel resource) and direct responses
    return response.data.data ?? response.data;
  } catch (error: any) {
    if (error.response?.status === 403 || error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      throw new Error('Session expired. Please login again.');
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch goals');
  }
};

export const createGoal = async (goalData: {
  title: string;
  description: string;
  category: string;
  priority: string;
  due_date: string;
  tasks: Array<{ text: string }>;
}): Promise<Goal> => {
  try {
    ensureAuthToken();
    const response = await api.post('/auth/goals', {
      ...goalData,
      tasks: goalData.tasks.map(task => ({ text: task.text }))
    });
    return response.data.data ?? response.data;
  } catch (error: any) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      throw new Error('Session expired. Please login again.');
    }
    throw new Error(error.response?.data?.message || 'Failed to create goal');
  }
};

// Fixed updateGoal function
export const updateGoal = async (
  goalId: number,
  goalData: {
    title: string;
    description: string;
    category: string;
    priority: string;
    due_date: string;
    tasks: Array<{ text: string; completed?: boolean }>;
  }
): Promise<Goal> => {
  try {
    ensureAuthToken();
    
    // Use proper template literal syntax with backticks
    const response = await api.put(`/auth/goals/${goalId}`, goalData);
    return response.data.data ?? response.data;
  } catch (error: any) {
    console.error('Failed to update goal:', error);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      throw new Error('Session expired. Please login again.');
    } else if (error.response?.status === 403) {
      throw new Error('You are not authorized to update this goal');
    }
    
    throw new Error(error.response?.data?.message || 'Failed to update goal');
  }
};

// Fixed deleteGoal function
export const deleteGoal = async (goalId: number): Promise<void> => {
  try {
    ensureAuthToken();
    
    // Use proper template literal syntax with backticks
    await api.delete(`/auth/goals/${goalId}`);
  } catch (error: any) {
    console.error('Failed to delete goal:', error);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      throw new Error('Session expired. Please login again.');
    } else if (error.response?.status === 403) {
      throw new Error('You are not authorized to delete this goal');
    }
    
    throw new Error(error.response?.data?.message || 'Failed to delete goal');
  }
};

export const updateGoalTaskStatus = async (goalId: number, taskId: number, completed: boolean): Promise<Goal> => {
  try {
    ensureAuthToken();
    const response = await api.put(`/auth/goals/${goalId}/tasks/${taskId}`, {
      completed: completed
    });
    return response.data.data || response.data;
  } catch (error: any) {
    console.error('Failed to update task status', error);
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      throw new Error('Session expired. Please login again.');
    }
    
    throw new Error(error.response?.data?.message || 'Failed to update task status');
  }
};

export const transformGoalData = (apiGoal: Goal): Goal => ({
  id: apiGoal.id,
  title: apiGoal.title,
  description: apiGoal.description,
  category: apiGoal.category,
  priority: apiGoal.priority,
  progress: apiGoal.progress || 0,
  status: apiGoal.status || 'In Progress',
  due_date: apiGoal.due_date,
  created_at: apiGoal.created_at,
  tasks: apiGoal.tasks?.map(task => ({
    id: task.id,
    text: task.text,
    completed: task.completed || false
  })) || []
});

export const getArticles = async () => {
  try {
    ensureAuthToken();
    const response = await api.get('/auth/article');
    return response.data.data || response.data;
  } catch (error: any) {
    console.error('Failed to fetch articles', error);
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      throw new Error('Session expired. Please login again.');
    }
    
    throw new Error(error.response?.data?.message || 'Failed to fetch articles');
  }
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  if (token) {
    // Ensure the header is set if token exists
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  return !!token;
};