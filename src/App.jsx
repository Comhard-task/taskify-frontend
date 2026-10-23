import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import AppSidebar from './components/AppSidebar';
import PersonalDashboardPage from './pages/PersonalDashboardPage';
import TaskManagerPage from './pages/TaskManagerPage';
import PersonalSettingsPage from './pages/PersonalSettingsPage';
import AuthModal from './components/AuthModal';
import { INITIAL_PERSONAL_TASKS, INITIAL_WEEKLY_STATS } from './data/personalData';

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

  const [tasks, setTasks] = useState(INITIAL_PERSONAL_TASKS);
  const [weeklyStats, setWeeklyStats] = useState(INITIAL_WEEKLY_STATS);

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
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('landing');
  };

  // Task actions
  const handleToggleTask = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          return { ...t, completed: nextCompleted };
        }
        return t;
      })
    );

    // Dynamically update today's (Thu) count in weeklyStats
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
  };

  const handleAddTask = (newTask) => {
    setTasks([newTask, ...tasks]);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
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
                  className="p-1.5 rounded-lg text-[#8e8578] hover:text-[#121b28] hover:bg-[#f6f0e6]"
                >
                  <span className="material-symbols-outlined text-2xl">menu</span>
                </button>
                <span className="font-editorial text-base font-semibold uppercase tracking-wider text-[#121b28]">
                  Taskify
                </span>
              </div>

              <div className="w-7 h-7 rounded-full bg-[#121b2d] text-white flex items-center justify-center text-xs font-serif font-bold">
                {user?.name ? user.name.charAt(0) : 'E'}
              </div>
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
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}
