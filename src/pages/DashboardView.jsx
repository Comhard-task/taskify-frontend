import React, { useState } from 'react';

export default function DashboardView({
  tasks,
  activities,
  onOpenTaskDetail,
  onToggleTaskComplete,
  onQuickAddTask
}) {
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [quickTitle, setQuickTitle] = useState('');
  const [quickPriority, setQuickPriority] = useState('High');
  const [quickStage, setQuickStage] = useState('In Progress');
  const [quickAssignee, setQuickAssignee] = useState('David K.');
  const [activeCycle, setActiveCycle] = useState('Sprint 44');

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    onQuickAddTask({
      title: quickTitle,
      priority: quickPriority,
      stage: quickStage,
      assignee: quickAssignee
    });
    setQuickTitle('');
  };

  // Filter tasks for table
  const highPriorityTasks = tasks.filter((t) => {
    if (priorityFilter === 'urgent') return t.priority === 'Urgent';
    if (priorityFilter === 'high') return t.priority === 'High';
    return t.priority === 'Urgent' || t.priority === 'High';
  });

  const totalActive = tasks.filter((t) => t.stage !== 'Completed').length;
  const inProgressCount = tasks.filter((t) => t.stage === 'In Progress').length;
  const blockedCount = tasks.filter((t) => t.isBlocked || t.stage === 'In Review').length;
  const completedCount = tasks.filter((t) => t.stage === 'Completed').length;

  return (
    <div className="w-full flex flex-col gap-space-xl">
      {/* Executive Welcome & Pulse Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-lg">
        <div>
          <div className="flex items-center gap-space-xs font-label-sm text-xs uppercase tracking-wider text-primary font-semibold mb-1">
            <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse" />
            Executive Real-Time Pulse
          </div>
          <h1 className="font-headline-xl text-3xl sm:text-4xl text-on-surface font-extrabold tracking-tight">
            Good morning, Sarah 👋
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            Your engineering clusters have cleared{' '}
            <span className="font-semibold text-on-surface">{completedCount} critical items</span> this sprint.{' '}
            <span className="text-error font-semibold">{blockedCount} tasks</span> require executive review or sign-off.
          </p>
        </div>

        {/* View Switcher Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-surface-container-low rounded-lg p-1 flex items-center shadow-xs border border-outline-variant/30">
            {['Sprint 44', 'Q3 Roadmap', 'All Clusters'].map((cycle) => (
              <button
                key={cycle}
                onClick={() => setActiveCycle(cycle)}
                type="button"
                className={`px-3 py-1.5 rounded-lg font-label-md text-xs font-bold transition-all cursor-pointer ${
                  activeCycle === cycle
                    ? 'bg-surface-container-lowest text-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {cycle}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        {/* Card 1: Total Active */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs border border-outline-variant/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider font-semibold block">
                Total Active Tasks
              </span>
              <div className="flex items-baseline gap-space-xs mt-2">
                <span className="font-headline-xl text-3xl font-extrabold text-on-surface leading-none">
                  {totalActive}
                </span>
                <span className="inline-flex items-center text-secondary text-xs font-bold">
                  <span className="material-symbols-outlined text-sm">arrow_upward</span>12%
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary-fixed transition-colors">
              <span className="material-symbols-outlined text-xl">layers</span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs flex items-end justify-between">
            <span className="font-label-sm text-xs text-on-surface-variant">vs 43 last cycle</span>
            <svg className="w-24 h-6 text-secondary" fill="none" viewBox="0 0 96 24">
              <path d="M2 18 L18 15 L34 19 L50 11 L66 14 L82 6 L94 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              <path d="M2 18 L18 15 L34 19 L50 11 L66 14 L82 6 L94 4 V 24 H 2 Z" fill="currentColor" fillOpacity="0.08" />
            </svg>
          </div>
        </div>

        {/* Card 2: Pipeline Velocity */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs border border-outline-variant/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider font-semibold block">
                Pipeline Velocity
              </span>
              <div className="flex items-baseline gap-space-xs mt-2">
                <span className="font-headline-xl text-3xl font-extrabold text-on-surface leading-none">
                  84%
                </span>
                <span className="text-on-surface-variant text-xs font-medium">target 80%</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary group-hover:bg-secondary-fixed transition-colors">
              <span className="material-symbols-outlined text-xl">speed</span>
            </div>
          </div>
          <div className="mt-space-md">
            <div className="w-full bg-surface-container-low rounded-full h-2 overflow-hidden flex">
              <div className="bg-secondary h-full rounded-full transition-all duration-500" style={{ width: '84%' }} />
            </div>
            <div className="flex justify-between items-center mt-1.5 text-xs text-on-surface-variant">
              <span>Steady Pace</span>
              <span className="font-bold text-secondary">+6.2 pts</span>
            </div>
          </div>
        </div>

        {/* Card 3: In Progress */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs border border-outline-variant/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider font-semibold block">
                In Progress
              </span>
              <div className="flex items-baseline gap-space-xs mt-2">
                <span className="font-headline-xl text-3xl font-extrabold text-on-surface leading-none">
                  {inProgressCount}
                </span>
                <span className="text-xs text-on-surface-variant font-medium">across 4 squads</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary-container group-hover:bg-primary-fixed transition-colors">
              <span className="material-symbols-outlined text-xl">pending_actions</span>
            </div>
          </div>
          <div className="mt-space-md flex items-center justify-between">
            <div className="flex -space-x-1.5 overflow-hidden">
              <span className="w-6 h-6 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-surface-container-lowest">DK</span>
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-surface-container-lowest">ER</span>
              <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-surface-container-lowest">MV</span>
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-surface-container-high text-on-surface text-[10px] font-bold ring-2 ring-surface-container-lowest">+11</span>
            </div>
            <span className="text-xs text-on-surface-variant font-semibold">Load 91%</span>
          </div>
        </div>

        {/* Card 4: Review & Blocked */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs border border-outline-variant/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider font-semibold block">
                Review & Blocked
              </span>
              <div className="flex items-baseline gap-space-xs mt-2">
                <span className="font-headline-xl text-3xl font-extrabold text-error leading-none">
                  {blockedCount}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-xs font-bold">
                  Immediate
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-error-container flex items-center justify-center text-error group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-xl">warning</span>
            </div>
          </div>
          <div className="mt-space-md flex items-center justify-between text-xs font-semibold">
            <span className="text-error flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping" />
              2 critical merge blocks
            </span>
            <span className="text-primary hover:underline cursor-pointer">Resolve</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left side High Priority & Health, Right side Quick Create & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-xl">
        <div className="lg:col-span-2 flex flex-col gap-space-xl">
          {/* Pipeline Health Overview */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs border border-outline-variant/40">
            <div className="flex items-center justify-between mb-space-md">
              <div>
                <h2 className="font-headline-md text-lg font-bold text-on-surface">Pipeline Health Overview</h2>
                <p className="font-body-sm text-xs text-on-surface-variant">Real-time throughput distribution across active lifecycle stages</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-on-surface-variant bg-surface-container-low px-2.5 py-1 rounded-lg border border-outline-variant/30">
                <span className="material-symbols-outlined text-sm text-secondary">sync</span>
                Live Telemetry
              </div>
            </div>

            {/* Distribution Bar */}
            <div className="w-full bg-surface-container-low h-3 rounded-full overflow-hidden flex gap-1 p-0.5 mb-space-md">
              <div className="h-full bg-outline-variant rounded-full transition-all duration-300" style={{ width: '20%' }} title="Backlog" />
              <div className="h-full bg-primary-container rounded-full transition-all duration-300" style={{ width: '26%' }} title="In Progress" />
              <div className="h-full bg-amber-400 rounded-full transition-all duration-300" style={{ width: '9%' }} title="In Review" />
              <div className="h-full bg-secondary rounded-full transition-all duration-300" style={{ width: '45%' }} title="Completed" />
            </div>

            {/* 4 stage metric boxes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-space-xs">
              <div className="p-3 rounded-lg bg-surface-container-low/70 border border-outline-variant/20 flex flex-col">
                <div className="flex items-center gap-1.5 text-on-surface-variant text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-outline-variant" />
                  Backlog
                </div>
                <span className="text-xl font-bold text-on-surface mt-1">14</span>
                <span className="text-[11px] text-on-surface-variant">20% capacity</span>
              </div>

              <div className="p-3 rounded-lg bg-primary-fixed/30 border border-primary/20 flex flex-col">
                <div className="flex items-center gap-1.5 text-primary text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-primary-container" />
                  In Progress
                </div>
                <span className="text-xl font-bold text-on-surface mt-1">{inProgressCount}</span>
                <span className="text-[11px] text-on-surface-variant">26% capacity</span>
              </div>

              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex flex-col">
                <div className="flex items-center gap-1.5 text-amber-800 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  In Review
                </div>
                <span className="text-xl font-bold text-on-surface mt-1">6</span>
                <span className="text-[11px] text-on-surface-variant">9% capacity</span>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex flex-col">
                <div className="flex items-center gap-1.5 text-secondary text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-secondary" />
                  Completed
                </div>
                <span className="text-xl font-bold text-on-surface mt-1">{completedCount}</span>
                <span className="text-[11px] text-on-surface-variant">45% capacity</span>
              </div>
            </div>
          </div>

          {/* High Priority Tasks Table */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs border border-outline-variant/40" id="high-priority-section">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-headline-md text-lg font-bold text-on-surface">High Priority Tasks</h2>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-xs font-bold text-on-surface-variant">
                    {highPriorityTasks.length} Flagged
                  </span>
                </div>
                <p className="font-body-sm text-xs text-on-surface-variant">Items flagged for executive visibility & sign-off</p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="pl-3 pr-8 py-1.5 bg-surface-container-low rounded-lg text-xs font-bold text-on-surface border border-outline-variant/40 focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="all">All High & Urgent</option>
                  <option value="urgent">Urgent Only</option>
                  <option value="high">High Only</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-on-surface-variant font-label-sm text-xs uppercase tracking-wider bg-surface-container-low/70 rounded-lg">
                    <th className="py-2.5 px-3 rounded-l-lg w-10">Done</th>
                    <th className="py-2.5 px-3">Task Details</th>
                    <th className="py-2.5 px-3">Stage</th>
                    <th className="py-2.5 px-3">Assignee</th>
                    <th className="py-2.5 px-3">Due Date</th>
                    <th className="py-2.5 px-3 rounded-r-lg">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {highPriorityTasks.map((task) => (
                    <tr
                      key={task.id}
                      className="hover:bg-surface-container-low/40 transition-colors group cursor-pointer"
                    >
                      <td className="py-3 px-3 align-middle" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => onToggleTaskComplete(task.id)}
                          className="h-4 w-4 rounded text-primary focus:ring-primary transition-all cursor-pointer accent-primary-container"
                        />
                      </td>
                      <td className="py-3 px-3" onClick={() => onOpenTaskDetail(task)}>
                        <div className={`font-semibold text-sm group-hover:text-primary transition-colors ${
                          task.completed ? 'line-through text-outline' : 'text-on-surface'
                        }`}>
                          {task.title}
                        </div>
                        <div className="text-xs text-on-surface-variant flex items-center gap-2 mt-0.5">
                          <span className="font-mono font-medium text-primary">#{task.id}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">chat_bubble</span> {task.commentsCount} notes
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3" onClick={() => onOpenTaskDetail(task)}>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          task.stage === 'In Review'
                            ? 'bg-amber-100 text-amber-900'
                            : task.stage === 'In Progress'
                            ? 'bg-blue-100 text-blue-900'
                            : task.stage === 'Completed'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          {task.stage}
                        </span>
                      </td>
                      <td className="py-3 px-3" onClick={() => onOpenTaskDetail(task)}>
                        <div className="flex items-center gap-2">
                          <img src={task.assigneeAvatar} alt={task.assignee} className="h-6 w-6 rounded-full object-cover ring-1 ring-surface-container-highest" />
                          <span className="text-xs text-on-surface font-medium hidden sm:inline">{task.assignee}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-xs whitespace-nowrap" onClick={() => onOpenTaskDetail(task)}>
                        <span className={task.dueDate.includes('Today') ? 'text-error font-bold' : 'text-on-surface font-medium'}>
                          {task.dueDate}
                        </span>
                      </td>
                      <td className="py-3 px-3" onClick={() => onOpenTaskDetail(task)}>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          task.priority === 'Urgent'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${task.priority === 'Urgent' ? 'bg-red-600' : 'bg-amber-600'}`} />
                          {task.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Create & Recent Activity */}
        <div className="flex flex-col gap-space-xl">
          {/* Quick Create Task */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs border border-outline-variant/40">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary text-xl">bolt</span>
              <h2 className="font-headline-md text-base font-bold text-on-surface">Quick Create Task</h2>
            </div>
            <p className="text-xs text-on-surface-variant mb-4">
              Instantly route a high-priority work item directly into the active pipeline.
            </p>

            <form onSubmit={handleQuickSubmit} className="flex flex-col gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Task Summary
                </label>
                <input
                  type="text"
                  required
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  placeholder="e.g. Audit Redis memory leak on shard 3..."
                  className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-xs font-medium text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                    Priority
                  </label>
                  <select
                    value={quickPriority}
                    onChange={(e) => setQuickPriority(e.target.value)}
                    className="w-full px-2 py-1.5 bg-surface-container-low rounded-lg text-xs text-on-surface font-medium focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="Urgent">🚨 Urgent</option>
                    <option value="High">⚡ High</option>
                    <option value="Medium">🔹 Medium</option>
                    <option value="Low">☕ Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                    Stage
                  </label>
                  <select
                    value={quickStage}
                    onChange={(e) => setQuickStage(e.target.value)}
                    className="w-full px-2 py-1.5 bg-surface-container-low rounded-lg text-xs text-on-surface font-medium focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="Backlog">Backlog</option>
                    <option value="In Progress">In Progress</option>
                    <option value="In Review">In Review</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Assign Squad Lead
                </label>
                <select
                  value={quickAssignee}
                  onChange={(e) => setQuickAssignee(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-surface-container-low rounded-lg text-xs text-on-surface font-medium focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="David K.">David K. (Security Core)</option>
                  <option value="Elena R.">Elena R. (Platform Infra)</option>
                  <option value="Marcus V.">Marcus V. (Billing & Fin)</option>
                  <option value="Chloe T.">Chloe T. (Edge Platform)</option>
                  <option value="Alex Morgan">Alex Morgan (Architect)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-3 mt-1 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
              >
                <span className="material-symbols-outlined text-sm">send</span>
                <span>Dispatch to Sprint 44</span>
              </button>
            </form>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs border border-outline-variant/40">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-headline-md text-base font-bold text-on-surface">Recent Activity</h2>
              <span className="text-xs text-primary font-semibold hover:underline cursor-pointer">View full audit</span>
            </div>

            <div className="space-y-3">
              {activities.map((item) => (
                <div key={item.id} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-surface-container-low/60 transition-colors">
                  <img src={item.avatar} alt={item.user} className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5" />
                  <div className="text-xs flex-1">
                    <p className="text-on-surface leading-snug">
                      <strong className="font-bold">{item.user}</strong> {item.action}{' '}
                      <span className="font-mono text-primary font-semibold">{item.target}</span>
                    </p>
                    <span className="text-[11px] text-outline mt-1 block">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
