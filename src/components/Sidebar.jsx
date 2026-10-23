import React from 'react';

export default function Sidebar({ currentView, setCurrentView, isMobileOpen, setIsMobileOpen, activeTasksCount }) {
  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'grid_view' },
    { id: 'pipelines', label: 'Task Pipelines', icon: 'view_kanban', badge: activeTasksCount },
    { id: 'explorer', label: 'Task Explorer & Query', icon: 'filter_alt' },
  ];

  const systemNavItems = [
    { id: 'auth', label: 'Auth & Team Access', icon: 'shield_person' },
    { id: 'settings', label: 'Workspace Settings', icon: 'settings' },
  ];

  const handleNavClick = (id) => {
    setCurrentView(id);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-surface-container-lowest border-r border-outline-variant/30 z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col">
          {/* Logo / Brand Header */}
          <div className="h-16 px-space-lg flex items-center justify-between border-b border-outline-variant/30">
            <div className="flex items-center gap-space-sm cursor-pointer" onClick={() => handleNavClick('dashboard')}>
              <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary font-bold shadow-xs">
                <span className="material-symbols-outlined text-lg">schema</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">FlowTask</span>
                <span className="text-[10px] text-primary font-semibold tracking-wider uppercase -mt-0.5">Pipeline Core</span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container"
              type="button"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Workspace Switcher */}
          <div className="px-space-md pt-space-lg pb-space-xs">
            <div className="px-space-sm pb-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-semibold">
              Active Workspace
            </div>
            <div className="w-full flex items-center justify-between px-space-sm py-2 rounded-lg bg-surface-container-low border border-outline-variant/30 hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-space-sm min-w-0">
                <span className="w-6 h-6 rounded-md bg-primary text-on-primary flex items-center justify-center text-xs font-bold shrink-0">
                  A
                </span>
                <div className="truncate text-left">
                  <div className="font-body-md text-sm font-semibold text-on-surface truncate">Acme Core Platform</div>
                  <div className="text-[11px] text-secondary font-medium">Sprint 44 • Active</div>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-base">unfold_more</span>
            </div>
          </div>

          {/* Main Navigation */}
          <div className="px-space-md pt-space-md">
            <div className="px-space-sm pb-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-semibold">
              Main Operations
            </div>
            <nav className="flex flex-col gap-1">
              {mainNavItems.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center justify-between px-space-sm py-2.5 rounded-lg transition-all text-left font-body-md text-sm ${
                      isActive
                        ? 'bg-primary-container text-on-primary font-semibold shadow-xs'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                  >
                    <div className="flex items-center gap-space-sm">
                      <span className={`material-symbols-outlined text-xl ${isActive ? 'text-on-primary' : 'text-on-surface-variant'}`}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-surface-container text-primary'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Metrics Badge */}
          <div className="mx-space-md mt-6 p-3 rounded-lg bg-surface-container-low/80 border border-outline-variant/30">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-on-surface-variant uppercase tracking-wider text-[10px]">Sprint Velocity</span>
              <span className="text-secondary font-bold">84.2%</span>
            </div>
            <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
              <div className="bg-secondary h-full rounded-full" style={{ width: '84.2%' }} />
            </div>
            <div className="text-[11px] text-on-surface-variant mt-2 flex items-center justify-between">
              <span>Target: 80%</span>
              <span className="text-primary font-medium">Sprint 44</span>
            </div>
          </div>
        </div>

        {/* System Navigation & Status */}
        <div className="p-space-md border-t border-outline-variant/30 flex flex-col gap-2">
          <div className="px-space-sm pb-1 text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider font-semibold">
            System & Governance
          </div>
          <nav className="flex flex-col gap-1">
            {systemNavItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-space-sm px-space-sm py-2 rounded-lg text-left font-body-md text-sm transition-all ${
                    isActive
                      ? 'bg-primary-container text-on-primary font-semibold shadow-xs'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  <span className={`material-symbols-outlined text-lg ${isActive ? 'text-on-primary' : 'text-on-surface-variant'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-2 pt-2 border-t border-outline-variant/20 flex items-center justify-between text-[11px] text-on-surface-variant px-space-sm">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Telemetry Connected</span>
            </div>
            <span className="text-outline font-mono">v2.4.0</span>
          </div>
        </div>
      </aside>
    </>
  );
}
