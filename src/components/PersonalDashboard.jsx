import React, { useState } from 'react';

export default function PersonalDashboard({
  user,
  tasks,
  weeklyStats,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onLogout,
  onGoToLanding
}) {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDay, setSelectedDay] = useState('Thu');

  // Inline Quick Add state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Deep Focus');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newMinutes, setNewMinutes] = useState(30);

  const categories = [
    'Mindfulness & Health',
    'Deep Focus',
    'Learning & Growth',
    'Life & Admin'
  ];

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      priority: newPriority,
      completed: false,
      dueDate: 'Today',
      estimatedMinutes: Number(newMinutes) || 30,
      notes: 'Personal daily intention.'
    });
    setNewTitle('');
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (activeTab === 'in_progress' && task.completed) return false;
    if (activeTab === 'completed' && !task.completed) return false;
    if (activeTab === 'high_priority' && task.priority !== 'High') return false;

    if (selectedCategory !== 'all' && task.category !== selectedCategory) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(q) ||
        task.category.toLowerCase().includes(q) ||
        (task.notes && task.notes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const inProgressTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Selected Day data for bar chart tooltip
  const activeDayStat = weeklyStats.find((s) => s.day === selectedDay) || weeklyStats[3];

  return (
    <div className="min-h-screen bg-[#fcfaf6] text-[#121b28] flex flex-col font-sans selection:bg-[#f2e6d6]">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#fcfaf6]/95 backdrop-blur-md border-b border-[#ece2d4]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
          {/* Logo & Workspace Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-[#c4965d]/50 flex items-center justify-center bg-[#f7f2ea]">
              <span className="material-symbols-outlined text-[#c4965d] text-lg">light_mode</span>
            </div>
            <div>
              <span className="font-editorial text-base font-semibold text-[#121b28] uppercase tracking-wider block">
                Taskify
              </span>
              <span className="text-[10px] text-[#8e8578] uppercase tracking-widest font-medium">
                Personal Space
              </span>
            </div>
          </div>

          {/* Right Header Navigation & Actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={onGoToLanding}
              className="hidden md:flex items-center gap-1.5 text-xs text-[#635b51] hover:text-[#121b28] font-medium transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">home</span>
              <span>View Landing Page</span>
            </button>

            <div className="h-6 w-px bg-[#ece2d4] hidden md:block" />

            {/* User Profile Pill */}
            <div className="flex items-center gap-2.5 bg-[#f7f3ec] py-1.5 px-3 rounded-full border border-[#ded5c6]">
              <div className="w-6 h-6 rounded-full bg-[#121b2d] text-white flex items-center justify-center text-xs font-serif font-bold">
                {user?.name ? user.name.charAt(0) : 'E'}
              </div>
              <span className="text-xs font-semibold text-[#121b28] hidden sm:inline">
                {user?.name || 'Eleanor Vance'}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="text-xs text-[#8e8578] hover:text-[#c4965d] transition-colors flex items-center gap-1 cursor-pointer"
              title="Sign Out to Landing Page"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 sm:px-10 py-10 w-full flex flex-col gap-10 flex-1">
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#ece2d4]">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b08752] mb-2">
              <span className="w-4 h-px bg-[#c4965d]" />
              <span>YOUR DAILY CLARITY</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-[#121b28]">
              Good morning, {user?.name?.split(' ')[0] || 'Eleanor'}.
            </h1>
            <p className="text-[#645c52] text-sm sm:text-base mt-2 font-normal max-w-xl">
              You have <strong className="text-[#121b28] font-semibold">{inProgressTasks} mindful intentions</strong> left for today. Move at your own pace and celebrate small moments of progress.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-4 py-2 rounded-full bg-[#f7f3ec] border border-[#d8cdbd] text-xs font-medium text-[#121b28] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#c4965d] animate-pulse" />
              <span>Weekly Alignment: {completionRate}%</span>
            </span>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-[#fcfaf6] p-6 rounded-2xl border border-[#ede3d5] shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#8e8578] font-semibold block mb-2">
                Total Intentions
              </span>
              <div className="font-editorial text-3xl sm:text-4xl font-normal text-[#121b28]">
                {totalTasks}
              </div>
            </div>
            <div className="text-xs text-[#665e53] mt-4 pt-3 border-t border-[#ece2d4] flex items-center justify-between">
              <span>Personal goals</span>
              <span className="text-[#c4965d] font-semibold">Active</span>
            </div>
          </div>

          <div className="bg-[#fcfaf6] p-6 rounded-2xl border border-[#ede3d5] shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#8e8578] font-semibold block mb-2">
                Completed Today
              </span>
              <div className="font-editorial text-3xl sm:text-4xl font-normal text-[#121b28]">
                {completedTasks}
              </div>
            </div>
            <div className="text-xs text-[#665e53] mt-4 pt-3 border-t border-[#ece2d4] flex items-center justify-between">
              <span>{completionRate}% Completed</span>
              <span className="text-emerald-700 font-semibold">Healthy Flow</span>
            </div>
          </div>

          <div className="bg-[#fcfaf6] p-6 rounded-2xl border border-[#ede3d5] shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#8e8578] font-semibold block mb-2">
                In Progress
              </span>
              <div className="font-editorial text-3xl sm:text-4xl font-normal text-[#121b28]">
                {inProgressTasks}
              </div>
            </div>
            <div className="text-xs text-[#665e53] mt-4 pt-3 border-t border-[#ece2d4] flex items-center justify-between">
              <span>Next up</span>
              <span className="text-[#c4965d] font-semibold">Focus Zone</span>
            </div>
          </div>

          <div className="bg-[#fcfaf6] p-6 rounded-2xl border border-[#ede3d5] shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#8e8578] font-semibold block mb-2">
                Total Focus Time
              </span>
              <div className="font-editorial text-3xl sm:text-4xl font-normal text-[#121b28]">
                {tasks.reduce((sum, t) => sum + (t.completed ? t.estimatedMinutes : 0), 0)} <span className="text-lg text-[#8e8578]">min</span>
              </div>
            </div>
            <div className="text-xs text-[#665e53] mt-4 pt-3 border-t border-[#ece2d4] flex items-center justify-between">
              <span>Mindful attention</span>
              <span className="text-[#c4965d] font-semibold">Calm flow</span>
            </div>
          </div>
        </div>

        {/* Analytics Section: Weekly Bar Graph & Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Weekly Bar Graph */}
          <div className="lg:col-span-8 bg-[#fdfbf7] p-6 sm:p-8 rounded-2xl border border-[#ede3d5] shadow-xs flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#b08752] block mb-1">
                  WEEKLY PROGRESS TELEMETRY
                </span>
                <h3 className="font-editorial text-2xl font-normal text-[#121b28]">
                  Task Completion Bar Graph
                </h3>
                <p className="text-xs text-[#71695f] mt-1">
                  Click any day to view daily focus minutes and completion breakdown.
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-xs font-medium text-[#645c52]">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[#c4965d]" />
                  <span>Completed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[#e8ded0]" />
                  <span>Pending</span>
                </div>
              </div>
            </div>

            {/* Bar Chart Container */}
            <div className="h-56 flex items-end justify-between gap-2 sm:gap-6 pt-6 pb-2 px-2 border-b border-[#ece2d4]">
              {weeklyStats.map((stat) => {
                const isSelected = selectedDay === stat.day;
                const maxVal = 12; // chart ceiling
                const compHeight = Math.min(100, Math.round((stat.completed / maxVal) * 100));
                const pendHeight = Math.min(100, Math.round((stat.pending / maxVal) * 100));

                return (
                  <div
                    key={stat.day}
                    onClick={() => setSelectedDay(stat.day)}
                    className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
                  >
                    {/* Tooltip on hover/active */}
                    <span className={`text-[11px] font-semibold transition-opacity ${
                      isSelected ? 'opacity-100 text-[#121b28]' : 'opacity-0 group-hover:opacity-100 text-[#8e8578]'
                    }`}>
                      {stat.completed}
                    </span>

                    {/* Stacked or Double Bar */}
                    <div className="w-full max-w-[38px] flex items-end gap-1 h-44 rounded-t-lg p-1 bg-[#f7f2ea]/60 transition-all">
                      {/* Completed Bar */}
                      <div
                        className={`w-1/2 rounded-t-sm transition-all duration-300 ${
                          isSelected ? 'bg-[#121b2d]' : 'bg-[#c4965d] group-hover:bg-[#b08752]'
                        }`}
                        style={{ height: `${compHeight}%` }}
                        title={`${stat.completed} completed`}
                      />

                      {/* Pending Bar */}
                      <div
                        className="w-1/2 bg-[#ded5c6] rounded-t-sm transition-all duration-300 group-hover:bg-[#d0c5b3]"
                        style={{ height: `${pendHeight}%` }}
                        title={`${stat.pending} pending`}
                      />
                    </div>

                    {/* Day Label */}
                    <span className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                      isSelected ? 'text-[#121b28] border-b-2 border-[#121b28]' : 'text-[#8e8578] group-hover:text-[#121b28]'
                    }`}>
                      {stat.day}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Selected Day Info Callout */}
            <div className="mt-5 p-4 rounded-xl bg-[#f7f3ec] border border-[#ded5c6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-editorial text-lg font-semibold text-[#121b28]">
                  {activeDayStat.day} Focus Summary:
                </span>
                <span className="text-[#645c52]">
                  <strong className="text-[#121b28]">{activeDayStat.completed} intentions finished</strong> • {activeDayStat.pending} postponed
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#c4965d] font-semibold">
                <span className="material-symbols-outlined text-base">timer</span>
                <span>{activeDayStat.focusMinutes} focus minutes logged</span>
              </div>
            </div>
          </div>

          {/* Right: Category Distribution & Mindful Quote */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-[#fdfbf7] p-6 sm:p-7 rounded-2xl border border-[#ede3d5] shadow-xs">
              <h3 className="font-editorial text-xl font-normal text-[#121b28] mb-1">
                Life Alignment
              </h3>
              <p className="text-xs text-[#71695f] mb-6">Distribution across your daily life dimensions</p>

              <div className="space-y-4">
                {[
                  { name: 'Mindfulness & Health', pct: 85, color: 'bg-[#c4965d]' },
                  { name: 'Deep Focus Work', pct: 70, color: 'bg-[#121b2d]' },
                  { name: 'Learning & Growth', pct: 50, color: 'bg-[#b08752]' },
                  { name: 'Life & Admin', pct: 60, color: 'bg-[#8e8578]' }
                ].map((cat) => (
                  <div key={cat.name}>
                    <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                      <span className="text-[#121b28]">{cat.name}</span>
                      <span className="text-[#8e8578] font-semibold">{cat.pct}%</span>
                    </div>
                    <div className="w-full bg-[#f0e7d8] h-2 rounded-full overflow-hidden">
                      <div
                        className={`${cat.color} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${cat.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mindful Daily Reminder Card */}
            <div className="bg-[#f7f2ea] p-6 rounded-2xl border border-[#ded5c6]">
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#b08752] block mb-2">
                DAILY INTENTION —
              </span>
              <p className="font-editorial text-lg text-[#121b28] italic font-normal leading-snug">
                "Progress is not measured by the speed of your stride, but by the quiet certainty of your focus."
              </p>
            </div>
          </div>
        </div>

        {/* Personal Tasks Section */}
        <div className="bg-[#fdfbf7] p-6 sm:p-8 rounded-2xl border border-[#ede3d5] shadow-xs flex flex-col gap-6">
          {/* Header & Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#ece2d4]">
            <div>
              <h2 className="font-editorial text-2xl font-normal text-[#121b28]">
                Personal Daily Intentions
              </h2>
              <p className="text-xs text-[#71695f] mt-0.5">
                Check off items as you complete them to update your weekly telemetry.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {[
                { id: 'all', label: 'All Tasks' },
                { id: 'in_progress', label: 'In Progress' },
                { id: 'completed', label: 'Completed' },
                { id: 'high_priority', label: 'High Priority' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#121b2d] text-white shadow-xs'
                      : 'bg-[#f7f3ec] text-[#635b51] hover:bg-[#ede4d4]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search & Category Selector Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#8e8578] text-base pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your personal intentions..."
                className="w-full pl-9 pr-4 py-2 bg-[#f7f3ec] rounded-xl text-xs text-[#121b28] border border-[#ded5c6] focus:border-[#121b2d] focus:bg-[#fcfaf6] focus:outline-none transition-all"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2 bg-[#f7f3ec] rounded-xl text-xs font-medium text-[#121b28] border border-[#ded5c6] focus:border-[#121b2d] outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Add Form */}
          <form onSubmit={handleQuickAdd} className="bg-[#f7f3ec] p-4 rounded-xl border border-[#ded5c6] flex flex-col md:flex-row gap-3 items-center">
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What intention would you like to focus on next?"
              className="flex-1 w-full px-3.5 py-2 bg-[#fdfbf7] rounded-lg text-xs text-[#121b28] border border-[#d8cdbd] focus:border-[#121b2d] focus:outline-none"
            />

            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="px-2.5 py-2 bg-[#fdfbf7] rounded-lg text-xs text-[#121b28] border border-[#d8cdbd] focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="px-2.5 py-2 bg-[#fdfbf7] rounded-lg text-xs text-[#121b28] border border-[#d8cdbd] focus:outline-none"
              >
                <option value="High">⚡ High</option>
                <option value="Medium">🔹 Medium</option>
                <option value="Gentle">🌿 Gentle</option>
              </select>

              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#121b2d] hover:bg-[#1f2d48] text-white text-xs font-semibold whitespace-nowrap shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                + Add Task
              </button>
            </div>
          </form>

          {/* Tasks List */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 text-[#8e8578] text-xs">
                <span className="material-symbols-outlined text-3xl mb-1 text-[#b5a996] block">check_circle</span>
                <span>No intentions found in this view. Enjoy your peace of mind!</span>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    task.completed
                      ? 'bg-[#f7f2ea]/50 border-[#ece2d4]'
                      : 'bg-[#fcfaf6] border-[#ede3d5] hover:border-[#c4965d]/50 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start gap-3.5 flex-1">
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={() => onToggleTask(task.id)}
                      className={`w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center transition-all cursor-pointer ${
                        task.completed
                          ? 'bg-[#c4965d] border-[#c4965d] text-white'
                          : 'border-[#ded5c6] hover:border-[#c4965d] bg-[#fcfaf6]'
                      }`}
                    >
                      {task.completed && (
                        <span className="material-symbols-outlined text-xs">check</span>
                      )}
                    </button>

                    <div className="flex-1">
                      <div className={`text-sm font-medium transition-all ${
                        task.completed ? 'line-through text-[#8e8578]' : 'text-[#121b28]'
                      }`}>
                        {task.title}
                      </div>

                      {task.notes && (
                        <p className="text-xs text-[#71695f] mt-0.5 leading-relaxed">
                          {task.notes}
                        </p>
                      )}

                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f7f3ec] text-[#635b51] border border-[#ded5c6]">
                          {task.category}
                        </span>

                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          task.priority === 'High'
                            ? 'bg-[#fef2f2] text-[#991b1b] border border-red-200'
                            : task.priority === 'Medium'
                            ? 'bg-[#fefce8] text-[#854d0e] border border-amber-200'
                            : 'bg-[#f0fdf4] text-[#166534] border border-emerald-200'
                        }`}>
                          {task.priority} Priority
                        </span>

                        <span className="text-[11px] text-[#8e8578] flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">timer</span>
                          <span>{task.estimatedMinutes} min</span>
                        </span>

                        <span className="text-[11px] text-[#8e8578]">
                          • Due {task.dueDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Delete button */}
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 rounded-lg text-[#8e8578] hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Remove intention"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-6 sm:px-10 border-t border-[#ece2d4] bg-[#fcfaf6] text-xs text-[#8e8578] text-center">
        Taskify Personal Space — Mindful Intentions, Zero Clutter.
      </footer>
    </div>
  );
}
