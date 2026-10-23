import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TaskManagerPage({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask
}) {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Add task form state
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Deep Focus');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newDueDate, setNewDueDate] = useState('Today');
  const [newMinutes, setNewMinutes] = useState(30);
  const [newNotes, setNewNotes] = useState('');

  const categories = [
    'Mindfulness & Health',
    'Deep Focus',
    'Learning & Growth',
    'Life & Admin'
  ];

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      priority: newPriority,
      completed: false,
      dueDate: newDueDate.trim() || 'Today',
      estimatedMinutes: Number(newMinutes) || 30,
      notes: newNotes.trim() || 'Personal intention.'
    });

    setNewTitle('');
    setNewNotes('');
    setIsAddFormOpen(false);
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === 'active' && task.completed) return false;
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

  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

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
            <span>INTENTIONAL TASK MANAGEMENT</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-[#121b28]">
            Personal Intentions
          </h1>
          <p className="text-[#645c52] text-sm sm:text-base mt-2 font-normal max-w-xl">
            A quiet space to organize what matters. No team deadlines or tickets — just your personal rhythm and thoughtful goals.
          </p>
        </div>

        <button
          onClick={() => setIsAddFormOpen(!isAddFormOpen)}
          className="px-6 py-3 rounded-full bg-[#121b2d] hover:bg-[#1f2d48] text-white text-xs font-semibold tracking-wider transition-all shadow-xs active:scale-95 flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-base">
            {isAddFormOpen ? 'close' : 'add'}
          </span>
          <span>{isAddFormOpen ? 'Close Form' : '+ New Intention'}</span>
        </button>
      </div>

      {/* Add Intention Form (Collapsible with Framer Motion) */}
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
                  Mindful Goal
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    Focus Duration (Minutes)
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
                  className="px-6 py-2.5 rounded-full bg-[#121b2d] hover:bg-[#1f2d48] text-white text-xs font-semibold tracking-wider transition-all shadow-xs active:scale-95"
                >
                  Add Intention
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Bar: Filters, Search & Categories */}
      <div className="bg-[#fdfbf7] p-5 rounded-2xl border border-[#ede3d5] shadow-xs flex flex-col gap-4">
        {/* Row 1: Search & Status Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 w-full max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#8e8578] text-base pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your intentions..."
              className="w-full pl-9 pr-4 py-2 bg-[#f7f3ec] rounded-xl text-xs text-[#121b28] border border-[#ded5c6] focus:border-[#121b2d] focus:bg-[#fcfaf6] focus:outline-none transition-all"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {[
              { id: 'all', label: `All (${tasks.length})` },
              { id: 'active', label: `Active (${activeCount})` },
              { id: 'completed', label: `Completed (${completedCount})` },
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

        {/* Row 2: Category Dimension Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-[#ece2d4]/70">
          <span className="text-[10px] uppercase tracking-wider text-[#8e8578] font-bold shrink-0">
            Dimension:
          </span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#c4965d] text-white'
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

      {/* Tasks List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 text-[#8e8578] text-xs bg-[#fdfbf7] rounded-2xl border border-[#ede3d5]"
            >
              <span className="material-symbols-outlined text-4xl mb-2 text-[#b5a996] block">spa</span>
              <p className="font-editorial text-lg text-[#121b28] mb-1">A quiet, clear space.</p>
              <span>No tasks match the active filters. Take a deep breath and enjoy your calm day.</span>
            </motion.div>
          ) : (
            filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  task.completed
                    ? 'bg-[#f7f2ea]/60 border-[#ece2d4]'
                    : 'bg-[#fdfbf7] border-[#ede3d5] hover:border-[#c4965d]/60 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-4 flex-1">
                  {/* Circular Checkbox */}
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.85 }}
                    onClick={() => onToggleTask(task.id)}
                    className={`w-6 h-6 rounded-full border mt-0.5 flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                      task.completed
                        ? 'bg-[#c4965d] border-[#c4965d] text-white shadow-2xs'
                        : 'border-[#ded5c6] hover:border-[#c4965d] bg-[#fcfaf6]'
                    }`}
                  >
                    {task.completed && (
                      <span className="material-symbols-outlined text-sm font-bold">check</span>
                    )}
                  </motion.button>

                  <div className="flex-1">
                    <div className={`text-sm sm:text-base font-medium transition-all ${
                      task.completed ? 'line-through text-[#8e8578]' : 'text-[#121b28]'
                    }`}>
                      {task.title}
                    </div>

                    {task.notes && (
                      <p className="text-xs text-[#71695f] mt-1 leading-relaxed">
                        {task.notes}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#f7f3ec] text-[#635b51] border border-[#ded5c6] font-medium">
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

                      <span className="text-[11px] text-[#8e8578] flex items-center gap-1 font-medium">
                        <span className="material-symbols-outlined text-xs">timer</span>
                        <span>{task.estimatedMinutes} min</span>
                      </span>

                      <span className="text-[11px] text-[#8e8578]">
                        • Due {task.dueDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side Actions */}
                <div className="flex items-center justify-end gap-2 shrink-0">
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-2 rounded-xl text-[#8e8578] hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Remove intention"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
