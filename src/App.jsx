import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import AppSidebar from './components/AppSidebar';
import PersonalDashboardPage from './pages/PersonalDashboardPage';
import TaskManagerPage from './pages/TaskManagerPage';
import PersonalSettingsPage from './pages/PersonalSettingsPage';
import AuthModal from './components/AuthModal';
import { INITIAL_PERSONAL_TASKS, INITIAL_WEEKLY_STATS } from './data/personalData';
import { authAPI, tasksAPI, analyticsAPI } from './services/api';

// Helper to normalize task items from either API or local state
const normalizeTask = (t) => ({
  id: t._id || t.id,
  _id: t._id || t.id,
  title: t.title,
  category: t.category,
  priority: t.priority,
  stage: t.stage || (t.completed ? 'done' : 'doing'),
  completed: Boolean(t.completed),
  dueDate: t.dueDate || 'Today',
  estimatedMinutes: Number(t.estimatedMinutes) || 30,
  startTime: t.startTime || null,
  endTime: t.endTime || null,
  notes: t.notes || ''
});

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'app'
  const [appSection, setAppSection] = useState('dashboard'); // 'dashboard' | 'tasks' | 'settings'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    name: 'Eleanor Vance',
    email: 'eleanor@newlight.space'
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [tasks, setTasks] = useState(INITIAL_PERSONAL_TASKS.map(normalizeTask));
  const [weeklyStats, setWeeklyStats] = useState(INITIAL_WEEKLY_STATS);

  // Load live tasks from backend
  const loadTasksFromAPI = useCallback(async () => {
    try {
      const res = await tasksAPI.getTasks({ limit: 100 });
      if (res && res.data && res.data.tasks && res.data.tasks.length > 0) {
        setTasks(res.data.tasks.map(normalizeTask));
      }
    } catch (err) {
      console.warn('Tasks API fallback to local state:', err.message);
    }
  }, []);

  // Load analytics from backend
  const loadAnalyticsFromAPI = useCallback(async () => {
    try {
      const res = await analyticsAPI.getWeeklyStats();
      if (res && res.data && res.data.weeklyStats) {
        setWeeklyStats(res.data.weeklyStats);
      }
    } catch (err) {
      console.warn('Analytics API fallback to local state:', err.message);
    }
  }, []);

  // Auto-authenticate on mount if token is stored in localStorage
  useEffect(() => {
    const token = localStorage.getItem('taskify_token');
    if (!token) return;

    authAPI
      .getMe()
      .then((res) => {
        if (res && res.data) {
          setUser(res.data);
          setIsLoggedIn(true);
          setCurrentView('app');
          loadTasksFromAPI();
          loadAnalyticsFromAPI();
        }
      })
      .catch((err) => {
        console.warn('Token verification error:', err.message);
      });

    const handleUnauthorized = () => {
      setIsLoggedIn(false);
      setCurrentView('landing');
    };
    window.addEventListener('taskify:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('taskify:unauthorized', handleUnauthorized);
  }, [loadTasksFromAPI, loadAnalyticsFromAPI]);

  // Auth triggers
  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setCurrentView('app');
    setAppSection('dashboard');
    loadTasksFromAPI();
    loadAnalyticsFromAPI();
  };

  const handleLogout = () => {
    localStorage.removeItem('taskify_token');
    setIsLoggedIn(false);
    setCurrentView('landing');
  };

  // Task actions with SLA timestamp tracking & stage transitions
  const handleToggleTask = async (taskId) => {
    const now = new Date();
    let updatedTask = null;

    // Optimistic local update
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId || t._id === taskId) {
          const nextCompleted = !t.completed;
          const nextStage = nextCompleted ? 'done' : 'doing';
          const startTime = t.startTime || new Date(now.getTime() - (t.estimatedMinutes || 30) * 60 * 1000).toISOString();
          updatedTask = {
            ...t,
            completed: nextCompleted,
            stage: nextStage,
            startTime,
            endTime: nextCompleted ? now.toISOString() : null
          };
          return updatedTask;
        }
        return t;
      })
    );

    // Dynamically update today's count in weeklyStats
    setWeeklyStats((prev) =>
      prev.map((stat) => {
        if (stat.day === 'Thu') {
          return {
            ...stat,
            completed: stat.completed + 1
          };
        }
        return stat;
      })
    );

    // Sync with backend API
    try {
      await tasksAPI.toggleTask(taskId);
    } catch (err) {
      console.warn('Backend toggleTask sync failed, using optimistic state:', err.message);
    }
  };

  const handleUpdateTaskStage = async (taskId, newStage) => {
    const now = new Date();
    const isDone = newStage === 'done';
    let targetTask = null;

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId || t._id === taskId) {
          const startTime =
            t.startTime ||
            (isDone
              ? new Date(now.getTime() - (t.estimatedMinutes || 30) * 60 * 1000).toISOString()
              : newStage === 'doing'
              ? now.toISOString()
              : null);

          targetTask = {
            ...t,
            stage: newStage,
            completed: isDone,
            startTime,
            endTime: isDone ? now.toISOString() : null
          };
          return targetTask;
        }
        return t;
      })
    );

    // Sync with backend API
    try {
      await tasksAPI.updateTask(taskId, {
        stage: newStage,
        completed: isDone,
        ...(targetTask ? { startTime: targetTask.startTime, endTime: targetTask.endTime } : {})
      });
    } catch (err) {
      console.warn('Backend updateTaskStage sync failed, using optimistic state:', err.message);
    }
  };

  const handleAddTask = async (newTask) => {
    const stage = newTask.stage || 'backlog';
    const isDone = stage === 'done';
    const now = new Date();
    const tempId = `task-${Date.now()}`;

    const taskWithTimestamps = normalizeTask({
      ...newTask,
      id: tempId,
      _id: tempId,
      stage,
      completed: isDone,
      startTime: isDone
        ? new Date(now.getTime() - (newTask.estimatedMinutes || 30) * 60 * 1000).toISOString()
        : stage === 'doing'
        ? now.toISOString()
        : null,
      endTime: isDone ? now.toISOString() : null
    });

    // Optimistic local state update
    setTasks((prev) => [taskWithTimestamps, ...prev]);

    // Sync with backend API
    try {
      const res = await tasksAPI.createTask(newTask);
      if (res && res.data && res.data._id) {
        setTasks((prev) =>
          prev.map((t) => (t.id === tempId ? normalizeTask(res.data) : t))
        );
      }
    } catch (err) {
      console.warn('Backend createTask sync failed, saved locally:', err.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId && t._id !== taskId));

    // Sync with backend API
    try {
      await tasksAPI.deleteTask(taskId);
    } catch (err) {
      console.warn('Backend deleteTask sync failed, deleted locally:', err.message);
    }
  };

  const activeTasksCount = tasks.filter((t) => !t.completed).length;

  return (
    <>
      {currentView === 'landing' ? (
        <LandingPage
          onOpenAuth={handleOpenAuth}
          onGoToDashboard={() => setCurrentView('app')}
          isLoggedIn={isLoggedIn}
        />
      ) : (
        <div className="min-h-screen bg-[#fcfaf6] text-[#121b28] flex flex-col font-sans selection:bg-[#f2e6d6]">
          {/* Left-side Navbar with vertical dividing line */}
          <AppSidebar
            currentSection={appSection}
            onSelectSection={(sec) => setAppSection(sec)}
            onGoToLanding={() => setCurrentView('landing')}
            onLogout={handleLogout}
            user={user}
            activeTasksCount={activeTasksCount}
            isMobileOpen={isMobileOpen}
            onCloseMobile={() => setIsMobileOpen(false)}
          />

          {/* Main App Canvas */}
          <div className="lg:pl-64 flex flex-col min-h-screen transition-all">
            {/* Mobile Top Header */}
            <div className="lg:hidden h-16 px-6 bg-[#fcfaf6]/95 border-b border-[#ece2d4] flex items-center justify-between sticky top-0 z-30">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMobileOpen(true)}
                  className="p-2 rounded-lg text-[#121b28] hover:bg-[#f7f2ea]"
                  aria-label="Open Navigation Menu"
                >
                  <span className="material-symbols-outlined text-xl">menu</span>
                </button>
                <span className="font-editorial text-lg font-semibold text-[#121b28]">Taskify</span>
              </div>
              <span className="text-[11px] font-semibold text-[#c4965d] bg-[#f7f2ea] px-3 py-1 rounded-full border border-[#ded5c6]">
                {activeTasksCount} Intentions
              </span>
            </div>

            {/* Distinct App Sections */}
            <main className="w-full flex-1 px-6 sm:px-10 py-8 max-w-6xl mx-auto">
              <AnimatePresence mode="wait">
                {appSection === 'dashboard' && (
                  <PersonalDashboardPage
                    key="dashboard"
                    user={user}
                    tasks={tasks}
                    weeklyStats={weeklyStats}
                    onToggleTask={handleToggleTask}
                    onNavigateToTasks={() => setAppSection('tasks')}
                  />
                )}

                {appSection === 'tasks' && (
                  <TaskManagerPage
                    key="tasks"
                    tasks={tasks}
                    onToggleTask={handleToggleTask}
                    onUpdateTaskStage={handleUpdateTaskStage}
                    onAddTask={handleAddTask}
                    onDeleteTask={handleDeleteTask}
                  />
                )}

                {appSection === 'settings' && (
                  <PersonalSettingsPage
                    key="settings"
                    user={user}
                  />
                )}
              </AnimatePresence>
            </main>

            {/* Subtle Footer */}
            <footer className="py-6 px-6 sm:px-10 border-t border-[#ece2d4] text-[11px] text-[#8e8578] text-center">
              Taskify Sanctuary — Distinct Daily Telemetry & Intentional Personal Task Management.
            </footer>
          </div>
        </div>
      )}

      {/* Auth Modal for Sign Up & Log In */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}
