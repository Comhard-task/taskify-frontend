# Taskify — Frontend Integration Guide 🌿

This guide provides end-to-end instructions, code snippets, and React hooks to integrate your **Taskify Frontend** with the **Taskify Backend API** (`http://localhost:5000/api/v1`).

---

## 1. Environment Setup

In your frontend root (`d:/Comhard/frontend`), create or update the `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

> **Note:** Whenever you update `.env` in Vite, restart the frontend dev server (`npm run dev`) so the variables take effect.

---

## 2. API Service Layer (`src/services/api.js`)

Save or update `src/services/api.js` with the unified client below:

```javascript
/**
 * Taskify Frontend API Client
 * Configured to connect to the backend API at http://localhost:5000/api/v1
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// Helper to get auth header with JWT token
const getAuthHeaders = () => {
  const token = localStorage.getItem('taskify_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// Generic fetch wrapper with standard envelope unpacking & error handling
async function request(endpoint, options = {}) {
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

    const errorMsg = json?.error?.message || json?.message || `Request failed with status ${response.status}`;
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

// 2. Tasks APIs (Filters, Search & Pagination)
export const tasksAPI = {
  getTasks: ({
    page = 1,
    limit = 10,
    search = '',
    status = 'all',
    category = 'all',
    priority = 'all',
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

  getDimensions: () => request('/analytics/dimensions')
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
```

---

## 3. Authentication Integration (`AuthContext.jsx`)

Create a centralized `AuthContext.jsx` in `src/context/AuthContext.jsx` to manage authentication state across your application:

```jsx
// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('taskify_token'));
  const [loading, setLoading] = useState(true);

  // Auto-fetch profile on mount if token exists
  useEffect(() => {
    const initAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authAPI.getMe();
        setUser(response.data);
      } catch (err) {
        console.warn('Session expired:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for 401 unauthorized events from api.js
    const handleUnauthorized = () => logout();
    window.addEventListener('taskify:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('taskify:unauthorized', handleUnauthorized);
  }, [token]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { token: jwtToken, user: userData } = res.data;
    localStorage.setItem('taskify_token', jwtToken);
    setToken(jwtToken);
    setUser(userData);
    return userData;
  };

  const signup = async (name, email, password) => {
    const res = await authAPI.signup({ name, email, password });
    const { token: jwtToken, user: userData } = res.data;
    localStorage.setItem('taskify_token', jwtToken);
    setToken(jwtToken);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('taskify_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

---

## 4. Tasks View Integration (`PipelinesView.jsx`)

Here is how to wire task listing, filtering, search, pagination, creation, and instant toggle status into your view:

```jsx
import React, { useState, useEffect, useCallback } from 'react';
import { tasksAPI } from '../services/api';

export default function PipelinesView() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Pagination States
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all'); // 'all' | 'active' | 'completed'
  const [category, setCategory] = useState('all');
  const [priority, setPriority] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Metadata returned from API
  const [pagination, setPagination] = useState({ totalTasks: 0, totalPages: 1 });
  const [summary, setSummary] = useState({ totalActive: 0, totalCompleted: 0, highPriorityCount: 0 });

  // Fetch tasks callback
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await tasksAPI.getTasks({
        page,
        limit,
        search,
        status,
        category,
        priority,
        sortBy,
        sortOrder
      });

      setTasks(res.data.tasks);
      setPagination(res.data.pagination);
      setSummary(res.data.summary);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, status, category, priority, sortBy, sortOrder]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // 1. Toggle Task Completion (Optimistic UI Update)
  const handleToggle = async (taskId) => {
    // Optimistic toggle in local state
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, completed: !t.completed } : t))
    );

    try {
      await tasksAPI.toggleTask(taskId);
      // Re-fetch summary stats to update active/completed badges
      fetchTasks();
    } catch (err) {
      alert(`Could not toggle task: ${err.message}`);
      fetchTasks(); // Revert on failure
    }
  };

  // 2. Create Task Handler
  const handleCreateTask = async (taskData) => {
    try {
      await tasksAPI.createTask(taskData);
      setPage(1); // Return to first page
      fetchTasks();
    } catch (err) {
      alert(`Failed to create task: ${err.message}`);
    }
  };

  // 3. Delete Task Handler
  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to remove this intention?')) return;
    try {
      await tasksAPI.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      alert(`Failed to delete task: ${err.message}`);
    }
  };

  return (
    <div className="taskify-container">
      {/* Summary Indicators */}
      <div className="stats-bar">
        <span>Active: {summary.totalActive}</span>
        <span>Completed: {summary.totalCompleted}</span>
        <span>High Priority: {summary.highPriorityCount}</span>
      </div>

      {/* Search & Filters */}
      <div className="filters-row">
        <input
          type="text"
          placeholder="Search intentions..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="all">All Status</option>
          <option value="active">Active Only</option>
          <option value="completed">Completed Only</option>
        </select>

        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
          <option value="all">All Dimensions</option>
          <option value="Mindfulness & Health">Mindfulness & Health</option>
          <option value="Deep Focus">Deep Focus</option>
          <option value="Learning & Growth">Learning & Growth</option>
          <option value="Life & Admin">Life & Admin</option>
        </select>

        <select value={priority} onChange={(e) => { setPriority(e.target.value); setPage(1); }}>
          <option value="all">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Gentle">Gentle</option>
        </select>
      </div>

      {/* Task List */}
      {loading ? (
        <p>Loading mindful tasks...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <div key={task._id} className={`task-card ${task.completed ? 'is-completed' : ''}`}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggle(task._id)}
              />
              <div className="task-content">
                <h4 style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                  {task.title}
                </h4>
                <p>{task.notes}</p>
                <div className="task-badges">
                  <span className="badge category">{task.category}</span>
                  <span className={`badge priority-${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                  <span className="badge duration">{task.estimatedMinutes} min</span>
                  <span className="badge due">{task.dueDate}</span>
                </div>
              </div>
              <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="pagination">
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Previous
        </button>
        <span>
          Page {page} of {pagination.totalPages || 1}
        </span>
        <button
          disabled={page >= pagination.totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

---

## 5. Analytics & Line Chart Integration (`AnalyticsView.jsx`)

Here is how to fetch and render the Weekly Line Chart data (Monday to Sunday) and Life Dimension Alignment:

```jsx
import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';

export default function AnalyticsView() {
  const [weeklyData, setWeeklyData] = useState(null);
  const [dimensions, setDimensions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [weeklyRes, dimRes] = await Promise.all([
          analyticsAPI.getWeeklyStats(),
          analyticsAPI.getDimensions()
        ]);

        setWeeklyData(weeklyRes.data);
        setDimensions(dimRes.data.dimensions);
      } catch (err) {
        console.error('Analytics load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) return <p>Loading focus telemetry...</p>;

  return (
    <div className="analytics-container">
      {/* Weekly Focus Overview Card */}
      <div className="weekly-summary-cards">
        <div className="card">
          <h3>Completed This Week</h3>
          <p className="metric">{weeklyData?.totalCompletedThisWeek || 0} tasks</p>
        </div>
        <div className="card">
          <h3>Focus Time</h3>
          <p className="metric">{weeklyData?.totalFocusMinutesThisWeek || 0} mins</p>
        </div>
        <div className="card">
          <h3>Consistency Rate</h3>
          <p className="metric">{weeklyData?.weeklyConsistencyRate || 0}%</p>
        </div>
      </div>

      {/* Line Chart Data Format (Mon - Sun) */}
      <div className="weekly-chart-box">
        <h3>Weekly Cadence (Mon – Sun)</h3>
        <table className="telemetry-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Date</th>
              <th>Completed</th>
              <th>Pending</th>
              <th>Focus Time</th>
            </tr>
          </thead>
          <tbody>
            {weeklyData?.weeklyStats.map((item) => (
              <tr key={item.day}>
                <td><strong>{item.day}</strong></td>
                <td>{item.date}</td>
                <td>{item.completed}</td>
                <td>{item.pending}</td>
                <td>{item.focusMinutes} min</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Life Dimension Alignment Progress Bars */}
      <div className="dimensions-box">
        <h3>Life Dimension Alignment</h3>
        {dimensions.map((dim) => (
          <div key={dim.name} className="dimension-row">
            <div className="dim-header">
              <span>{dim.name} ({dim.tasksCount} intentions)</span>
              <span>{dim.percentage}%</span>
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${dim.percentage}%`,
                  backgroundColor: dim.color
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 6. Personal Mindful Settings (`SettingsModal.jsx`)

Here is how to fetch and update user preferences:

```jsx
import React, { useState, useEffect } from 'react';
import { settingsAPI } from '../services/api';

export default function SettingsModal({ onClose }) {
  const [settings, setSettings] = useState({
    dailyGoal: 5,
    dailyFocusMinutes: 180,
    gentleReminders: true,
    digitalDetoxReminder: true
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    settingsAPI.getSettings().then((res) => {
      if (res.data) setSettings(res.data);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      const res = await settingsAPI.updateSettings(settings);
      setSettings(res.data);
      setSuccess(true);
      setTimeout(() => onClose?.(), 1200);
    } catch (err) {
      alert(`Error updating settings: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Mindful Settings</h2>
        {success && <p className="success-msg">Settings saved successfully!</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Daily Task Target:
            <input
              type="number"
              min="1"
              max="20"
              value={settings.dailyGoal}
              onChange={(e) => setSettings({ ...settings, dailyGoal: Number(e.target.value) })}
            />
          </label>

          <label>
            Daily Focus Target (Minutes):
            <input
              type="number"
              min="15"
              max="600"
              step="15"
              value={settings.dailyFocusMinutes}
              onChange={(e) => setSettings({ ...settings, dailyFocusMinutes: Number(e.target.value) })}
            />
          </label>

          <label>
            <input
              type="checkbox"
              checked={settings.gentleReminders}
              onChange={(e) => setSettings({ ...settings, gentleReminders: e.target.checked })}
            />
            Enable Gentle Reminders
          </label>

          <label>
            <input
              type="checkbox"
              checked={settings.digitalDetoxReminder}
              onChange={(e) => setSettings({ ...settings, digitalDetoxReminder: e.target.checked })}
            />
            Evening Digital Detox Prompt
          </label>

          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

---

## 7. Pre-Seeded Demo Login Credentials

For testing immediately without creating a new user:

- **Email:** `eleanor@newlight.space`
- **Password:** `SecurePassword123!`

---

## 8. Summary of API Status Codes & Responses

All endpoints return the standard envelope:

```json
// Success
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}

// Error (400, 401, 404, 500)
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title cannot be empty",
    "details": [{ "field": "title", "issue": "Title cannot be empty" }]
  }
}
```
