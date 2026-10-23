import React, { useState } from 'react';
import { motion } from 'framer-motion';
import WeeklyLineChart from '../components/WeeklyLineChart';

export default function PersonalDashboardPage({
  user,
  tasks,
  weeklyStats,
  onToggleTask,
  onNavigateToTasks
}) {
  const [selectedDay, setSelectedDay] = useState('Thu');

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const inProgressTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const totalFocusMinutes = tasks.reduce((sum, t) => sum + (t.completed ? t.estimatedMinutes : 0), 0);

  // Top pending intentions for today
  const pendingSnapshot = tasks.filter((t) => !t.completed).slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="w-full flex flex-col gap-10"
    >
      {/* Welcome Greeting Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#ece2d4]">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b08752] mb-2">
            <span className="w-5 h-px bg-[#c4965d]" />
            <span>DAILY FLOW & TELEMETRY</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-[#121b28]">
            Good morning, {user?.name?.split(' ')[0] || 'Eleanor'}.
          </h1>
          <p className="text-[#645c52] text-sm sm:text-base mt-2 font-normal max-w-xl">
            You have <strong className="text-[#121b28] font-semibold">{inProgressTasks} mindful intentions</strong> awaiting your presence today. Here is your weekly momentum in a new light.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToTasks}
            className="px-5 py-2.5 rounded-full bg-[#121b2d] hover:bg-[#1f2d48] text-white text-xs font-semibold tracking-wider transition-all shadow-xs active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">checklist</span>
            <span>Manage Tasks ({inProgressTasks})</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            label: 'Total Intentions',
            val: totalTasks,
            sub: 'Personal goals',
            status: 'Active',
            statusColor: 'text-[#c4965d]'
          },
          {
            label: 'Completed Today',
            val: completedTasks,
            sub: `${completionRate}% Done`,
            status: 'Healthy Flow',
            statusColor: 'text-emerald-700'
          },
          {
            label: 'In Progress',
            val: inProgressTasks,
            sub: 'Next up',
            status: 'Focus Zone',
            statusColor: 'text-[#c4965d]'
          },
          {
            label: 'Total Focus Time',
            val: `${totalFocusMinutes} min`,
            sub: 'Mindful presence',
            status: 'Calm rhythm',
            statusColor: 'text-[#c4965d]'
          }
        ].map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            className="bg-[#fcfaf6] p-6 rounded-2xl border border-[#ede3d5] shadow-xs hover:border-[#c4965d]/50 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#8e8578] font-semibold block mb-2">
                {card.label}
              </span>
              <div className="font-editorial text-3xl sm:text-4xl font-normal text-[#121b28]">
                {card.val}
              </div>
            </div>
            <div className="text-xs text-[#665e53] mt-4 pt-3 border-t border-[#ece2d4] flex items-center justify-between">
              <span>{card.sub}</span>
              <span className={`font-semibold ${card.statusColor}`}>{card.status}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Line Chart & Life Alignment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Weekly Line Chart */}
        <div className="lg:col-span-8 bg-[#fdfbf7] p-6 sm:p-8 rounded-2xl border border-[#ede3d5] shadow-xs">
          <WeeklyLineChart
            weeklyStats={weeklyStats}
            selectedDay={selectedDay}
            onSelectDay={(day) => setSelectedDay(day)}
          />
        </div>

        {/* Right Side: Life Dimensions & Daily Affirmation */}
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
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`${cat.color} h-full rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Thought Card */}
          <div className="bg-[#f7f2ea] p-6 rounded-2xl border border-[#ded5c6]">
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#b08752] block mb-2">
              DAILY ANCHOR —
            </span>
            <p className="font-editorial text-lg text-[#121b28] italic font-normal leading-snug">
              "Progress is not measured by the speed of your stride, but by the quiet certainty of your focus."
            </p>
          </div>
        </div>
      </div>

      {/* Today's Focus Snapshot */}
      <div className="bg-[#fdfbf7] p-6 sm:p-8 rounded-2xl border border-[#ede3d5] shadow-xs flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#ece2d4]">
          <div>
            <h2 className="font-editorial text-2xl font-normal text-[#121b28]">
              Today's Key Intentions
            </h2>
            <p className="text-xs text-[#71695f] mt-0.5">
              Top intentions scheduled for your attention today.
            </p>
          </div>

          <button
            onClick={onNavigateToTasks}
            className="text-xs font-semibold text-[#c4965d] hover:text-[#121b28] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Open Dedicated Task Manager</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        <div className="space-y-3">
          {pendingSnapshot.length === 0 ? (
            <div className="text-center py-8 text-[#8e8578] text-xs">
              <span className="material-symbols-outlined text-3xl mb-1 text-emerald-600 block">check_circle</span>
              <span>All intentions for today are accomplished. Rest well!</span>
            </div>
          ) : (
            pendingSnapshot.map((task) => (
              <motion.div
                key={task.id}
                whileHover={{ y: -1 }}
                className="p-4 rounded-xl border border-[#ede3d5] bg-[#fcfaf6] flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <button
                    type="button"
                    onClick={() => onToggleTask(task.id)}
                    className="w-5 h-5 rounded-full border border-[#ded5c6] hover:border-[#c4965d] bg-[#fcfaf6] flex items-center justify-center transition-all cursor-pointer"
                  >
                    {task.completed && (
                      <span className="material-symbols-outlined text-xs text-[#c4965d]">check</span>
                    )}
                  </button>

                  <div>
                    <div className="text-sm font-medium text-[#121b28]">{task.title}</div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-[#8e8578]">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f7f3ec] text-[#635b51] border border-[#ded5c6]">
                        {task.category}
                      </span>
                      <span>•</span>
                      <span>{task.estimatedMinutes} min</span>
                      <span>•</span>
                      <span>Due {task.dueDate}</span>
                    </div>
                  </div>
                </div>

                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  task.priority === 'High'
                    ? 'bg-[#fef2f2] text-[#991b1b] border border-red-200'
                    : 'bg-[#fefce8] text-[#854d0e] border border-amber-200'
                }`}>
                  {task.priority}
                </span>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
