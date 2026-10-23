import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AppSidebar({
  currentSection,
  onSelectSection,
  onGoToLanding,
  onLogout,
  user,
  activeTasksCount,
  isMobileOpen,
  onCloseMobile
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'monitoring', desc: 'Analytics & Line Chart' },
    { id: 'tasks', label: 'Task Management', icon: 'checklist', desc: 'All Personal Intentions', badge: activeTasksCount },
    { id: 'settings', label: 'Settings', icon: 'tune', desc: 'Focus Targets & Daily Flow' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCloseMobile}
            className="fixed inset-0 bg-[#121b2d]/50 backdrop-blur-xs z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#fcfaf6] border-r border-[#e8dfd1] z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col">
          {/* Logo & Brand Header */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-[#ece2d4]">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectSection('dashboard')}>
              <div className="w-10 h-10 rounded-full border border-[#c4965d]/50 flex items-center justify-center bg-[#f7f2ea] shadow-2xs">
                <span className="material-symbols-outlined text-[#c4965d] text-xl">light_mode</span>
              </div>
              <div className="flex flex-col">
                <span className="font-editorial text-lg tracking-[0.16em] font-semibold text-[#121b28] uppercase">
                  Taskify
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#8e8578] -mt-0.5 font-medium">
                  Personal Space
                </span>
              </div>
            </div>

            {/* Mobile close */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-[#8e8578] hover:text-[#121b28] rounded-lg hover:bg-[#f6f0e6]"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Section: Main Workspaces */}
          <div className="px-4 pt-6">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#b08752]">
              SANCTUARY NAVIGATION
            </div>

            <nav className="flex flex-col gap-1.5">
              {navItems.map((item) => {
                const isActive = currentSection === item.id;
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onSelectSection(item.id);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#121b2d] text-white shadow-sm'
                        : 'text-[#50483e] hover:bg-[#f7f2ea] hover:text-[#121b28]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined text-xl ${isActive ? 'text-[#c4965d]' : 'text-[#8e8578]'}`}>
                        {item.icon}
                      </span>
                      <div>
                        <div className="text-xs font-semibold leading-none">{item.label}</div>
                        <div className={`text-[10px] mt-1 ${isActive ? 'text-[#c8c2b7]' : 'text-[#8e8578]'}`}>
                          {item.desc}
                        </div>
                      </div>
                    </div>

                    {item.badge !== undefined && (
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-[#ede4d6] text-[#121b28]'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </nav>
          </div>

          {/* Calm Focus Widget */}
          <div className="mx-4 mt-8 p-4 rounded-xl bg-[#f7f3ec] border border-[#ded5c6]">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-[10px] uppercase tracking-wider text-[#8e8578]">Daily Flow</span>
              <span className="text-[#c4965d] font-bold">84%</span>
            </div>
            <div className="w-full bg-[#ede4d6] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#c4965d] h-full rounded-full" style={{ width: '84%' }} />
            </div>
            <p className="text-[11px] text-[#71695f] mt-2 italic font-serif">
              "One mindful step at a time."
            </p>
          </div>
        </div>

        {/* Footer with User & Landing Navigation */}
        <div className="p-4 border-t border-[#ece2d4] bg-[#fdfbf7] flex flex-col gap-2">
          {/* Link back to landing page */}
          <button
            onClick={onGoToLanding}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#645c52] hover:text-[#121b28] hover:bg-[#f7f2ea] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg text-[#8e8578]">arrow_back</span>
            <span>View Landing Page</span>
          </button>

          {/* User profile & Sign Out */}
          <div className="pt-2 border-t border-[#ece2d4]/70 flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#121b2d] text-white flex items-center justify-center text-xs font-serif font-bold">
                {user?.name ? user.name.charAt(0) : 'E'}
              </div>
              <div className="truncate max-w-[100px]">
                <div className="text-xs font-bold text-[#121b28] truncate">{user?.name || 'Eleanor'}</div>
                <div className="text-[10px] text-[#8e8578] truncate">Personal Sanctuary</div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 text-[#8e8578] hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Sign Out"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
