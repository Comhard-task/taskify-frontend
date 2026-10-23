import React, { useState } from 'react';

export default function Header({ onOpenNewTask, searchQuery, setSearchQuery, onToggleMobile, notifications, onClearNotifications }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/30 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all">
      {/* Left: Mobile hamburger & Global Search */}
      <div className="flex items-center gap-3 w-full max-w-md">
        <button
          onClick={onToggleMobile}
          type="button"
          className="lg:hidden p-2 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container transition-colors"
          aria-label="Open navigation menu"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>

        <div className="relative w-full flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-outline text-lg pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, pipelines, tags... (⌘K)"
            className="w-full pl-9 pr-14 py-2 bg-surface-container-low rounded-lg border border-outline-variant/50 focus:border-primary focus:bg-surface-container-lowest focus:outline-none font-body-md text-sm text-on-surface placeholder:text-outline transition-all"
          />
          <kbd className="absolute right-2.5 px-1.5 py-0.5 rounded border border-outline-variant/60 bg-surface-container-lowest text-[11px] font-semibold text-on-surface-variant shadow-2xs pointer-events-none hidden sm:inline-block">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Actions, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Create Button */}
        <button
          onClick={onOpenNewTask}
          type="button"
          className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm transition-all shadow-xs active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          <span className="hidden sm:inline">New Task</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            type="button"
            className="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-2xl">notifications</span>
            {notifications && notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-error border-2 border-surface-container-lowest animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-container-lowest border border-outline-variant/40 rounded-xl shadow-xl z-50 p-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-sm font-bold text-on-surface">Pipeline Activity</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-primary-fixed text-primary text-[10px] font-bold">
                    {notifications.length} New
                  </span>
                </div>
                <button
                  onClick={onClearNotifications}
                  className="text-xs text-primary hover:underline font-semibold"
                >
                  Mark read
                </button>
              </div>

              <div className="mt-2 divide-y divide-outline-variant/20 max-h-80 overflow-y-auto">
                {notifications.map((item, index) => (
                  <div key={index} className="py-2.5 flex items-start gap-3 hover:bg-surface-container-low/50 px-2 rounded-lg transition-colors">
                    <img src={item.avatar} alt={item.user} className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5" />
                    <div className="text-xs leading-tight">
                      <p className="text-on-surface">
                        <strong className="font-semibold">{item.user}</strong> {item.action} <span className="font-mono text-primary font-semibold">{item.target}</span>
                      </p>
                      <span className="text-[11px] text-outline mt-1 block">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-outline-variant/40 mx-1 hidden sm:block" />

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            type="button"
            className="flex items-center gap-2 p-1 sm:px-2 py-1 rounded-lg hover:bg-surface-container transition-colors text-left cursor-pointer"
          >
            <div className="relative">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuArvYOHb0Dr0WbkVYIK1inf7aBGxDJkZMQy_rdIIqpugqzdmTxAaLAlFmCsMwfEu05xAQZgfu_6S1RYdoHg2LInkg0JrhLVbJ7H55uw9THUvRSgGd6-lbLbV7BAbh9mWTrorIu54_B5NMOm5kZo-M1iP9EciSsZWg_UtuHIQd35wPGio72kFHk1CZoy66lBZZQeNUdwyAWuo8UIzmtNv9PSrAkMALPGGXBF-TKTPsG_0cXgUdZZNtsi"
                alt="Alex Morgan"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-surface-container-lowest" />
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-xs font-bold text-on-surface leading-none">Alex Morgan</span>
              <span className="text-[11px] text-on-surface-variant leading-none mt-1">Lead Architect</span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-base hidden sm:inline">expand_more</span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-surface-container-lowest border border-outline-variant/40 rounded-xl shadow-xl z-50 p-2 animate-in fade-in">
              <div className="p-2 border-b border-outline-variant/20 mb-1">
                <p className="font-semibold text-sm text-on-surface">Alex Morgan</p>
                <p className="text-xs text-on-surface-variant">alex.morgan@acme.corp</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Cluster Admin
                </span>
              </div>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-on-surface hover:bg-surface-container text-left">
                <span className="material-symbols-outlined text-base">badge</span>
                <span>Security Credentials</span>
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-on-surface hover:bg-surface-container text-left">
                <span className="material-symbols-outlined text-base">vpn_key</span>
                <span>API Keys & Webhooks</span>
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-error hover:bg-red-50 text-left mt-1 border-t border-outline-variant/20 pt-2">
                <span className="material-symbols-outlined text-base">logout</span>
                <span>Sign Out of Cluster</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
