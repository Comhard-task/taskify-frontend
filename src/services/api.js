/**
 * Taskify Frontend API Client
 * Configured to connect to the backend API at http://localhost:5000/api/v1
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// Helper to get auth header with JWT token
export const getAuthHeaders = () => {
  const token = localStorage.getItem('taskify_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// Generic fetch wrapper with standard envelope unpacking & error handling
export async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {})
    }
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    // If token expired, clear localStorage
    if (response.status === 401 && localStorage.getItem('taskify_token')) {
      localStorage.removeItem('taskify_token');
      window.dispatchEvent(new Event('taskify:unauthorized'));
    }

    const errorMsg =
      json?.error?.message ||
      json?.message ||
      `Request failed with status ${response.status}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.details = json?.error?.details || [];
    throw err;
  }

  // Returns standard data payload: { success: true, message: "...", data: { ... } }
  return json;
}

// 1. Authentication APIs
export const authAPI = {
  signup: (userData) =>
    request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),

  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),

  getMe: () => request('/auth/me')
};

// 2. Tasks APIs (Filters, Search, Stages & Pagination)
export const tasksAPI = {
  getTasks: ({
    page = 1,
    limit = 50,
    search = '',
    status = 'all',
    category = 'all',
    priority = 'all',
    stage = 'all',
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = {}) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      status,
      category,
      priority,
      sortBy,
      sortOrder
    });

    if (stage && stage !== 'all') {
      params.append('stage', stage);
    }

    if (search && search.trim()) {
      params.append('search', search.trim());
    }

    return request(`/tasks?${params.toString()}`);
  },

  createTask: (taskData) =>
    request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData)
    }),

  toggleTask: (id) =>
    request(`/tasks/${id}/toggle`, {
      method: 'PATCH'
    }),

  updateTask: (id, taskData) =>
    request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData)
    }),

  updateTaskStage: (id, stage) =>
    request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ stage })
    }),

  deleteTask: (id) =>
    request(`/tasks/${id}`, {
      method: 'DELETE'
    })
};

// 3. Analytics & Telemetry APIs
export const analyticsAPI = {
  getWeeklyStats: (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const query = params.toString() ? `?${params.toString()}` : '';
    return request(`/analytics/weekly${query}`);
  },

  getDimensions: () => request('/analytics/dimensions'),

  getSLA: () => request('/analytics/sla')
};

// 4. Personal Settings APIs
export const settingsAPI = {
  getSettings: () => request('/settings'),
  updateSettings: (settingsData) =>
    request('/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData)
    })
};
