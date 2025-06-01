// src/api/auth.ts
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

export const register = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await api.post('/auth/register', data);
    return response.data;
  } catch (error) {
    console.error('Registration failed', error);
    throw error;
  }
};

export const login = async (data: { email: string; password: string }): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/auth/login', data);
    const { access_token } = response.data;
    
    // Store token
    localStorage.setItem('token', access_token);
    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    
    // Fetch and store user data immediately after login
    const user = await getProfile();
    localStorage.setItem('user_name', user.name);
    
    return response.data;
  } catch (error) {
    console.error('Login failed', error);
    throw error;
  }
};

export const getProfile = async (): Promise<User> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');
    
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = await api.get<User>('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch profile', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No token found - already logged out');
      return;
    }

    // Set authorization header
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Make API call to backend logout endpoint
    await api.post('/auth/logout');
    
  } catch (error) {
    console.error('Logout API error:', error);
    throw error; // Re-throw to handle in UI
  } finally {
    // Always clear client-side storage
    localStorage.removeItem('token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    localStorage.removeItem('auth_token'); // Remove any other auth items
    
    // Remove authorization header
    delete api.defaults.headers.common['Authorization'];
  }
};

export const refreshToken = async (): Promise<LoginResponse> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');
    
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = await api.post<LoginResponse>('/auth/refresh');
    const { access_token } = response.data;
    
    // Update stored token
    localStorage.setItem('token', access_token);
    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    
    return response.data;
  } catch (error) {
    console.error('Token refresh failed', error);
    throw error;
  }
};
export const getArticles = async () => {
  const token = localStorage.getItem('token');
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  const res = await api.get('/auth/article'); // or your correct endpoint
  return res.data;
};
export const fetchGoals = async () => {
  const token = localStorage.getItem('token');
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  const res = await api.get('/auth/goals'); // Adjust if your route is different
  return res.data;
};
export const isAuthenticated = () => {
  return !!localStorage.getItem('auth_token') || !!localStorage.getItem('token');
};
export const updateGoalTaskStatus = async (goalId: number, taskId: number, completed: boolean) => {
  const token = localStorage.getItem('token');
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  const response = await api.put(`/auth/goals/${goalId}/task-status`, {
    task_id: taskId,
    completed: completed
  });
  return response.data;
};

// Replace the updateTaskStatus function in your React component with this:
const updateTaskStatus = async (goals: any[], goalId: number, taskId: number) => {
    try {
        // Find the current task status
        const goal = goals.find(g => g.id === goalId);
        const task = goal.tasks.find((t: { id: number; }) => t.id === taskId);
        const newCompletedStatus = !task.completed;

        // Update via API
        const updatedGoal = await updateGoalTaskStatus(goalId, taskId, newCompletedStatus);
        
        // Update local state with the response from backend
        setGoals(goals.map(g => g.id === goalId ? {
            ...updatedGoal,
            // Ensure the response is properly formatted
            createdDate: updatedGoal.created_at ? updatedGoal.created_at.split('T')[0] : g.createdDate,
            dueDate: updatedGoal.due_date || updatedGoal.dueDate
        } : g));
        
    } catch (error) {
        console.error('Failed to update task status:', error);
        setError('Failed to update task status. Please try again.');
    }
};

function setGoals(_arg0: any[]) {
  throw new Error('Function not implemented.');
}
function setError(_arg0: string) {
  throw new Error('Function not implemented.');
}

