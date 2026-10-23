import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateTaskSLA, getSingleTaskSLA } from '../utils/slaCalculator';

const STAGES = [
  {
    id: 'backlog',
    label: 'Backlog',
    color: '#ff6584',
    bgHeader: 'bg-[#ff6584]',
    textColor: 'text-white',
    badgeBg: 'bg-white/25 text-white',
    borderColor: 'border-[#ff6584]/30',
    colBg: 'bg-[#fff5f6]'
  },
  {
    id: 'doing',
    label: 'Doing',
    color: '#fbbf24',
    bgHeader: 'bg-[#fbbf24]',
    textColor: 'text-[#121b28]',
    badgeBg: 'bg-[#121b28]/15 text-[#121b28]',
    borderColor: 'border-[#fbbf24]/40',
    colBg: 'bg-[#fefdf5]'
  },
  {
    id: 'review',
    label: 'Review',
    color: '#34d399',
    bgHeader: 'bg-[#34d399]',
    textColor: 'text-[#121b28]',
    badgeBg: 'bg-[#121b28]/15 text-[#121b28]',
    borderColor: 'border-[#34d399]/40',
    colBg: 'bg-[#f4fbf7]'
  },
  {
    id: 'done',
    label: 'Done',
    color: '#38bdf8',
    bgHeader: 'bg-[#38bdf8]',
    textColor: 'text-[#121b28]',
    badgeBg: 'bg-[#121b28]/15 text-[#121b28]',
    borderColor: 'border-[#38bdf8]/40',
    colBg: 'bg-[#f0f9ff]'
  }
];

export default function TaskManagerPage({
  tasks = [],
  onToggleTask,
  onUpdateTaskStage,
  onAddTask,
  onDeleteTask
}) {
  // Views: 'kanban' | 'list' | 'section'
  const [currentView, setCurrentView] = useState('kanban');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sectionGroupBy, setSectionGroupBy] = useState('stage'); // 'stage' | 'category'

  // Add intention form state
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Deep Focus');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newStage, setNewStage] = useState('backlog');
  const [newDueDate, setNewDueDate] = useState('Today');
  const [newMinutes, setNewMinutes] = useState(30);
  const [newNotes, setNewNotes] = useState('');

  const categories = [
    'Mindfulness & Health',
    'Deep Focus',
    'Learning & Growth',
    'Life & Admin'
  ];

  // Dynamic SLA calculations
  const slaOverall = calculateTaskSLA(tasks);

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      priority: newPriority,
      stage: newStage,
      dueDate: newDueDate.trim() || 'Today',
      estimatedMinutes: Number(newMinutes) || 30,
      notes: newNotes.trim() || 'Personal intention.'
    });

    setNewTitle('');
    setNewNotes('');
    setIsAddFormOpen(false);
  };

  // Filter tasks based on search & category
  const filteredTasks = tasks.filter((task) => {
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

  // Helper to determine stage
  const getTaskStage = (task) => {
    if (task.stage) return task.stage;
    return task.completed ? 'done' : 'doing';
  };

  // Stage transition helper
  const moveTaskNext = (task) => {
    const stageOrder = ['backlog', 'doing', 'review', 'done'];
    const current = getTaskStage(task);
    const currentIndex = stageOrder.indexOf(current);
    if (currentIndex < stageOrder.length - 1) {
      onUpdateTaskStage(task.id, stageOrder[currentIndex + 1]);
    }
  };

  const moveTaskPrev = (task) => {
    const stageOrder = ['backlog', 'doing', 'review', 'done'];
    const current = getTaskStage(task);
    const currentIndex = stageOrder.indexOf(current);
    if (currentIndex > 0) {
      onUpdateTaskStage(task.id, stageOrder[currentIndex - 1]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="w-full flex flex-col gap-8"
    >
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#ece2d4]">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b08752] mb-2">
            <span className="w-5 h-px bg-[#c4965d]" />
            <span>INTENTIONAL TASK WORKFLOW</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-[#121b28]">
            Kanban & Intentions
          </h1>
          <p className="text-[#645c52] text-sm sm:text-base mt-2 font-normal max-w-xl">
            Visualize your personal flow through Backlog, Doing, Review, and Done. Track turnarounds and SLA performance with gentle clarity.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
          <button
            onClick={() => setIsAddFormOpen(!isAddFormOpen)}
            className="px-5 py-2.5 rounded-full bg-[#121b2d] hover:bg-[#1f2d48] text-white text-xs font-semibold tracking-wider transition-all shadow-xs active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">
              {isAddFormOpen ? 'close' : 'add'}
            </span>
            <span>{isAddFormOpen ? 'Close Form' : '+ New Intention'}</span>
          </button>
        </div>
      </div>

      {/* SLA Overall Summary Banner */}
      <div className="bg-[#fdfbf7] p-5 sm:p-6 rounded-2xl border border-[#ede3d5] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#f7f2ea] border border-[#ded5c6] flex items-center justify-center text-[#c4965d] shrink-0">
            <span className="material-symbols-outlined text-2xl">avg_pace</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-[#8e8578] font-bold">
                COMPLETED TASKS SLA TELEMETRY
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-semibold">
                Live Turnaround
              </span>
            </div>
            <div className="font-editorial text-2xl sm:text-3xl text-[#121b28] mt-0.5 flex items-baseline gap-2">
              <span>{slaOverall.formattedAvgSLA}</span>
              <span className="text-xs font-sans text-[#71695f] font-normal">
                average start-to-finish duration ({slaOverall.totalCompletedWithSLA} done)
              </span>
            </div>
          </div>
        </div>

        {/* Pods */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t lg:border-t-0 lg:border-l border-[#ece2d4] pt-4 lg:pt-0 lg:pl-6">
          <div className="bg-[#fcfaf6] px-4 py-2.5 rounded-xl border border-[#ede3d5]">
            <span className="text-[10px] uppercase tracking-wider text-[#8e8578] font-semibold block">
              SLA Compliance
            </span>
            <span className="font-editorial text-lg font-bold text-emerald-700">
              {slaOverall.slaComplianceRate}%
            </span>
            <span className="text-[10px] text-[#71695f] block">Within target time</span>
          </div>

          <div className="bg-[#fcfaf6] px-4 py-2.5 rounded-xl border border-[#ede3d5]">
            <span className="text-[10px] uppercase tracking-wider text-[#8e8578] font-semibold block">
              Fastest Task
            </span>
            <span className="font-editorial text-lg font-bold text-[#c4965d]">
              {slaOverall.fastestTask ? `${slaOverall.fastestTask.durationMin} min` : 'N/A'}
            </span>
            <span className="text-[10px] text-[#71695f] block truncate">
              {slaOverall.fastestTask ? slaOverall.fastestTask.title : 'No record'}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-[#fcfaf6] px-4 py-2.5 rounded-xl border border-[#ede3d5]">
            <span className="text-[10px] uppercase tracking-wider text-[#8e8578] font-semibold block">
              Done Stage SLA
            </span>
            <span className="font-editorial text-lg font-bold text-[#121b28]">
              {slaOverall.totalCompletedWithSLA} tasks
            </span>
            <span className="text-[10px] text-[#71695f] block">Avg: {slaOverall.formattedAvgSLA}</span>
          </div>
        </div>
      </div>

      {/* Add Intention Collapsible Form */}
      <AnimatePresence>
        {isAddFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleCreateTask}
              className="bg-[#fdfbf7] p-6 sm:p-8 rounded-2xl border border-[#ede3d5] shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#ece2d4]">
                <h3 className="font-editorial text-xl font-normal text-[#121b28]">
                  Create New Personal Intention
                </h3>
                <span className="text-[11px] uppercase tracking-wider text-[#b08752] font-semibold">
                  Kanban Item
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#635b51] mb-1">
                  Intention Summary <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 45-minute meditation and breathwork..."
                  className="w-full px-4 py-2.5 bg-[#f7f3ec] rounded-xl border border-[#ded5c6] focus:border-[#121b2d] focus:bg-[#fcfaf6] focus:outline-none text-xs text-[#121b28] font-medium transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#635b51] mb-1">
                    Initial Stage
                  </label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f7f3ec] rounded-xl border border-[#ded5c6] focus:border-[#121b2d] text-xs font-medium text-[#121b28]"
                  >
                    <option value="backlog">📋 Backlog</option>
                    <option value="doing">⚡ Doing</option>
                    <option value="review">🔍 Review</option>
                    <option value="done">✅ Done</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#635b51] mb-1">
                    Life Dimension
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f7f3ec] rounded-xl border border-[#ded5c6] focus:border-[#121b2d] text-xs font-medium text-[#121b28]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#635b51] mb-1">
                    Gentle Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f7f3ec] rounded-xl border border-[#ded5c6] focus:border-[#121b2d] text-xs font-medium text-[#121b28]"
                  >
                    <option value="High">⚡ High (Core Focus)</option>
                    <option value="Medium">🔹 Medium (Steady Flow)</option>
                    <option value="Gentle">🌿 Gentle (No Pressure)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#635b51] mb-1">
                    Estimated Time (Min)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="360"
                    value={newMinutes}
                    onChange={(e) => setNewMinutes(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f7f3ec] rounded-xl border border-[#ded5c6] focus:border-[#121b2d] text-xs font-medium text-[#121b28]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#635b51] mb-1">
                  Personal Reflections or Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Any feelings, intentions, or gentle thoughts..."
                  className="w-full px-4 py-2 bg-[#f7f3ec] rounded-xl border border-[#ded5c6] focus:border-[#121b2d] text-xs text-[#121b28] resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddFormOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-medium text-[#645c52] hover:bg-[#f7f2ea]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#121b2d] hover:bg-[#1f2d48] text-white text-xs font-semibold tracking-wider transition-all shadow-xs active:scale-95 cursor-pointer"
                >
                  Add Intention
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Bar: View Switcher, Search, and Category Pills */}
      <div className="bg-[#fdfbf7] p-5 rounded-2xl border border-[#ede3d5] shadow-xs flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* View Selector (Kanban | List | Section) */}
          <div className="flex items-center p-1 bg-[#f7f3ec] rounded-xl border border-[#ded5c6] self-start">
            {[
              { id: 'kanban', label: 'Kanban Board', icon: 'view_kanban' },
              { id: 'list', label: 'List View', icon: 'format_list_bulleted' },
              { id: 'section', label: 'Section View', icon: 'splitscreen' }
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setCurrentView(v.id)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  currentView === v.id
                    ? 'bg-[#121b2d] text-white shadow-xs'
                    : 'text-[#635b51] hover:text-[#121b28]'
                }`}
              >
                <span className="material-symbols-outlined text-base">{v.icon}</span>
                <span>{v.label}</span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 w-full max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#8e8578] text-base pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search intentions..."
              className="w-full pl-9 pr-4 py-2 bg-[#f7f3ec] rounded-xl text-xs text-[#121b28] border border-[#ded5c6] focus:border-[#121b2d] focus:bg-[#fcfaf6] focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Category Dimension Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-[#ece2d4]/70">
          <span className="text-[10px] uppercase tracking-wider text-[#8e8578] font-bold shrink-0">
            Dimension:
          </span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#c4965d] text-white shadow-2xs'
                : 'text-[#635b51] hover:text-[#121b28]'
            }`}
          >
            All Dimensions
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === c
                  ? 'bg-[#c4965d] text-white shadow-2xs'
                  : 'bg-[#f7f3ec] text-[#635b51] hover:bg-[#ede4d4]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: KANBAN BOARD */}
      {currentView === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
          {STAGES.map((stage) => {
            const stageTasks = filteredTasks.filter((t) => getTaskStage(t) === stage.id);
            const isDoneStage = stage.id === 'done';

            // Calculate stage SLA if Done stage
            const stageSLA = isDoneStage ? calculateTaskSLA(stageTasks) : null;

            return (
              <div
                key={stage.id}
                className={`rounded-2xl border ${stage.borderColor} ${stage.colBg} overflow-hidden shadow-xs flex flex-col min-h-[500px]`}
              >
                {/* Column Header formatted exactly like the reference image */}
                <div className={`${stage.bgHeader} ${stage.textColor} px-4 py-3 flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <h3 className="font-editorial text-lg font-bold tracking-wide">
                      {stage.label}
                    </h3>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${stage.badgeBg}`}>
                      {stageTasks.length}
                    </span>
                  </div>

                  {isDoneStage && stageSLA && stageSLA.totalCompletedWithSLA > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#121b28] text-white">
                      Avg: {stageSLA.formattedAvgSLA}
                    </span>
                  )}
                </div>

                {/* Column Task Cards */}
                <div className="p-3.5 space-y-3 flex-1 overflow-y-auto">
                  {stageTasks.length === 0 ? (
                    <div className="h-32 border-2 border-dashed border-[#ded5c6]/60 rounded-xl flex items-center justify-center text-xs text-[#8e8578] font-serif italic text-center p-4">
                      No intentions in {stage.label}
                    </div>
                  ) : (
                    stageTasks.map((task) => {
                      const taskSLA = isDoneStage ? getSingleTaskSLA(task) : null;

                      return (
                        <motion.div
                          key={task.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="bg-[#ffffff] p-4 rounded-xl border border-[#ede3d5] shadow-xs hover:border-[#c4965d] hover:shadow-md transition-all flex flex-col justify-between gap-3 group"
                        >
                          <div>
                            {/* Card Top: Category & Priority */}
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#f7f3ec] text-[#635b51] font-semibold border border-[#ded5c6]/60 truncate">
                                {task.category}
                              </span>
                              <span
                                className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                                  task.priority === 'High'
                                    ? 'bg-red-50 text-red-700 border border-red-200'
                                    : task.priority === 'Medium'
                                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                }`}
                              >
                                {task.priority}
                              </span>
                            </div>

                            {/* Task Title */}
                            <h4
                              className={`text-xs font-semibold text-[#121b28] leading-snug ${
                                task.completed ? 'line-through text-[#8e8578]' : ''
                              }`}
                            >
                              {task.title}
                            </h4>

                            {/* Notes */}
                            {task.notes && (
                              <p className="text-[11px] text-[#71695f] mt-1.5 line-clamp-2 leading-relaxed">
                                {task.notes}
                              </p>
                            )}

                            {/* Done Stage: Detailed SLA calculation block */}
                            {isDoneStage && taskSLA && (
                              <div className="mt-3 p-2.5 rounded-lg bg-[#f0fdf4] border border-emerald-200 text-emerald-900 text-[11px] space-y-1">
                                <div className="flex items-center justify-between font-bold">
                                  <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm text-emerald-700">bolt</span>
                                    <span>SLA: {taskSLA.formattedDuration}</span>
                                  </span>
                                  <span className="text-[10px] text-emerald-700 uppercase tracking-wider">
                                    {taskSLA.isCompliant ? '✓ On Target' : '⚠️ Over Target'}
                                  </span>
                                </div>
                                <div className="text-[10px] text-emerald-800 flex items-center justify-between">
                                  <span>{taskSLA.formattedStart} → {taskSLA.formattedEnd}</span>
                                  <span className="text-emerald-600">Goal: ≤ {taskSLA.targetMin}m</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Card Footer: Timing & Stage Shifter Buttons */}
                          <div className="pt-2.5 border-t border-[#f2eae0] flex items-center justify-between gap-2 text-[10px] text-[#8e8578]">
                            <span className="flex items-center gap-1 font-medium">
                              <span className="material-symbols-outlined text-xs">timer</span>
                              <span>{task.estimatedMinutes}m</span>
                            </span>

                            {/* Move Stage Buttons */}
                            <div className="flex items-center gap-1">
                              {stage.id !== 'backlog' && (
                                <button
                                  type="button"
                                  onClick={() => moveTaskPrev(task)}
                                  className="w-6 h-6 rounded-md bg-[#f7f3ec] hover:bg-[#ede4d4] text-[#121b28] flex items-center justify-center transition-all cursor-pointer"
                                  title="Move to previous stage"
                                >
                                  <span className="material-symbols-outlined text-xs">arrow_back</span>
                                </button>
                              )}
                              {stage.id !== 'done' && (
                                <button
                                  type="button"
                                  onClick={() => moveTaskNext(task)}
                                  className="w-6 h-6 rounded-md bg-[#121b2d] hover:bg-[#1f2d48] text-white flex items-center justify-center transition-all cursor-pointer"
                                  title="Move to next stage"
                                >
                                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => onDeleteTask(task.id)}
                                className="w-6 h-6 rounded-md hover:bg-red-50 text-[#8e8578] hover:text-red-700 flex items-center justify-center transition-all cursor-pointer"
                                title="Delete intention"
                              >
                                <span className="material-symbols-outlined text-xs">delete</span>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: LIST VIEW */}
      {currentView === 'list' && (
        <div className="bg-[#fdfbf7] rounded-2xl border border-[#ede3d5] shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-[#ece2d4] bg-[#fcfaf6] flex items-center justify-between">
            <h3 className="font-editorial text-xl font-normal text-[#121b28]">
              Personal Intentions Directory ({filteredTasks.length})
            </h3>
            <span className="text-xs text-[#71695f]">
              Avg SLA: <strong className="text-[#121b28]">{slaOverall.formattedAvgSLA}</strong> across {slaOverall.totalCompletedWithSLA} done
            </span>
          </div>

          <div className="divide-y divide-[#ece2d4]">
            {filteredTasks.length === 0 ? (
              <div className="py-16 text-center text-[#8e8578] text-xs">
                No intentions found matching your query.
              </div>
            ) : (
              filteredTasks.map((task) => {
                const stage = getTaskStage(task);
                const taskSLA = stage === 'done' ? getSingleTaskSLA(task) : null;

                return (
                  <div
                    key={task.id}
                    className={`p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                      task.completed ? 'bg-[#f7f2ea]/40' : 'hover:bg-[#fcfaf6]'
                    }`}
                  >
                    <div className="flex items-start gap-4 flex-1">
                      {/* Checkbox */}
                      <button
                        type="button"
                        onClick={() => onToggleTask(task.id)}
                        className={`w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                          task.completed
                            ? 'bg-[#c4965d] border-[#c4965d] text-white'
                            : 'border-[#ded5c6] hover:border-[#c4965d] bg-[#fcfaf6]'
                        }`}
                      >
                        {task.completed && (
                          <span className="material-symbols-outlined text-xs font-bold">check</span>
                        )}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-sm sm:text-base font-medium ${
                            task.completed ? 'line-through text-[#8e8578]' : 'text-[#121b28]'
                          }`}>
                            {task.title}
                          </span>

                          {/* Stage Pill */}
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              stage === 'backlog'
                                ? 'bg-rose-100 text-rose-800'
                                : stage === 'doing'
                                ? 'bg-amber-100 text-amber-900'
                                : stage === 'review'
                                ? 'bg-emerald-100 text-emerald-900'
                                : 'bg-sky-100 text-sky-900'
                            }`}
                          >
                            {stage}
                          </span>

                          {/* Calculated SLA Badge */}
                          {taskSLA && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-semibold flex items-center gap-1">
                              <span className="material-symbols-outlined text-xs text-emerald-600">timelapse</span>
                              <span>SLA: {taskSLA.formattedDuration}</span>
                              <span className="text-[9px] text-emerald-600">({taskSLA.formattedStart} - {taskSLA.formattedEnd})</span>
                            </span>
                          )}
                        </div>

                        {task.notes && (
                          <p className="text-xs text-[#71695f] mt-1 line-clamp-1">
                            {task.notes}
                          </p>
                        )}

                        <div className="flex items-center gap-2 mt-2 flex-wrap text-[11px] text-[#8e8578]">
                          <span className="px-2 py-0.5 rounded-md bg-[#f7f3ec] text-[#635b51] font-medium border border-[#ded5c6]">
                            {task.category}
                          </span>
                          <span>• {task.priority} Priority</span>
                          <span>• {task.estimatedMinutes} min</span>
                          <span>• Due {task.dueDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stage Dropdown & Delete */}
                    <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                      <select
                        value={stage}
                        onChange={(e) => onUpdateTaskStage(task.id, e.target.value)}
                        className="px-2.5 py-1.5 bg-[#f7f3ec] rounded-lg border border-[#ded5c6] text-xs font-medium text-[#121b28] focus:border-[#121b2d]"
                      >
                        <option value="backlog">📋 Backlog</option>
                        <option value="doing">⚡ Doing</option>
                        <option value="review">🔍 Review</option>
                        <option value="done">✅ Done</option>
                      </select>

                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1.5 rounded-lg text-[#8e8578] hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete task"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: SECTION VIEW */}
      {currentView === 'section' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-[#fdfbf7] p-4 rounded-xl border border-[#ede3d5]">
            <span className="text-xs text-[#635b51] font-medium">Group intentions by:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSectionGroupBy('stage')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  sectionGroupBy === 'stage'
                    ? 'bg-[#121b2d] text-white'
                    : 'bg-[#f7f3ec] text-[#635b51] hover:bg-[#ede4d4]'
                }`}
              >
                Workflow Stages (Backlog → Done)
              </button>
              <button
                onClick={() => setSectionGroupBy('category')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  sectionGroupBy === 'category'
                    ? 'bg-[#121b2d] text-white'
                    : 'bg-[#f7f3ec] text-[#635b51] hover:bg-[#ede4d4]'
                }`}
              >
                Life Dimensions
              </button>
            </div>
          </div>

          {sectionGroupBy === 'stage' ? (
            STAGES.map((stage) => {
              const stageTasks = filteredTasks.filter((t) => getTaskStage(t) === stage.id);
              const isDoneStage = stage.id === 'done';
              const stageSLA = isDoneStage ? calculateTaskSLA(stageTasks) : null;

              return (
                <div key={stage.id} className="bg-[#fdfbf7] rounded-2xl border border-[#ede3d5] shadow-xs overflow-hidden">
                  <div className={`px-6 py-4 flex items-center justify-between border-b ${stage.borderColor} ${stage.colBg}`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-3.5 h-3.5 rounded-full ${stage.bgHeader}`} />
                      <h3 className="font-editorial text-xl font-bold text-[#121b28]">
                        {stage.label} Section
                      </h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/70 font-bold border border-[#ded5c6]">
                        {stageTasks.length} intentions
                      </span>
                    </div>

                    {isDoneStage && stageSLA && (
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                        ⚡ Done SLA: {stageSLA.formattedAvgSLA} avg
                      </span>
                    )}
                  </div>

                  <div className="p-4 sm:p-6 space-y-3">
                    {stageTasks.length === 0 ? (
                      <div className="text-xs text-[#8e8578] italic py-4">No tasks in this stage.</div>
                    ) : (
                      stageTasks.map((task) => {
                        const taskSLA = isDoneStage ? getSingleTaskSLA(task) : null;
                        return (
                          <div
                            key={task.id}
                            className="p-4 rounded-xl bg-[#ffffff] border border-[#ede3d5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#c4965d] transition-all"
                          >
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-[#121b28]">{task.title}</h4>
                              {task.notes && <p className="text-xs text-[#71695f] mt-0.5">{task.notes}</p>}
                              <div className="flex items-center gap-2 mt-2 flex-wrap text-[10px] text-[#8e8578]">
                                <span className="bg-[#f7f3ec] px-2 py-0.5 rounded font-semibold text-[#635b51]">{task.category}</span>
                                <span>{task.priority} Priority</span>
                                <span>Est: {task.estimatedMinutes}m</span>
                              </div>
                            </div>

                            {taskSLA && (
                              <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs shrink-0">
                                <span className="font-bold">⚡ SLA: {taskSLA.formattedDuration}</span>
                                <span className="block text-[10px] text-emerald-700">{taskSLA.formattedStart} - {taskSLA.formattedEnd}</span>
                              </div>
                            )}

                            <div className="flex items-center gap-1.5 shrink-0">
                              <select
                                value={stage.id}
                                onChange={(e) => onUpdateTaskStage(task.id, e.target.value)}
                                className="px-2 py-1 bg-[#f7f3ec] rounded-md border border-[#ded5c6] text-xs font-medium text-[#121b28]"
                              >
                                <option value="backlog">Backlog</option>
                                <option value="doing">Doing</option>
                                <option value="review">Review</option>
                                <option value="done">Done</option>
                              </select>
                              <button
                                onClick={() => onDeleteTask(task.id)}
                                className="p-1 rounded-md text-[#8e8578] hover:text-red-700 hover:bg-red-50"
                              >
                                <span className="material-symbols-outlined text-base">delete</span>
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            categories.map((cat) => {
              const catTasks = filteredTasks.filter((t) => t.category === cat);
              return (
                <div key={cat} className="bg-[#fdfbf7] rounded-2xl border border-[#ede3d5] shadow-xs overflow-hidden">
                  <div className="px-6 py-4 bg-[#fcfaf6] border-b border-[#ece2d4] flex items-center justify-between">
                    <h3 className="font-editorial text-xl font-normal text-[#121b28]">
                      {cat} ({catTasks.length})
                    </h3>
                  </div>

                  <div className="p-4 sm:p-6 space-y-3">
                    {catTasks.length === 0 ? (
                      <div className="text-xs text-[#8e8578] italic py-4">No tasks in this dimension.</div>
                    ) : (
                      catTasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-4 rounded-xl bg-white border border-[#ede3d5] flex items-center justify-between gap-3"
                        >
                          <div>
                            <h4 className="text-sm font-semibold text-[#121b28]">{task.title}</h4>
                            <span className="text-[10px] text-[#8e8578]">Stage: {getTaskStage(task)} • {task.priority} Priority</span>
                          </div>
                          <select
                            value={getTaskStage(task)}
                            onChange={(e) => onUpdateTaskStage(task.id, e.target.value)}
                            className="px-2 py-1 bg-[#f7f3ec] rounded-md border border-[#ded5c6] text-xs font-medium text-[#121b28]"
                          >
                            <option value="backlog">Backlog</option>
                            <option value="doing">Doing</option>
                            <option value="review">Review</option>
                            <option value="done">Done</option>
                          </select>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </motion.div>
  );
}
