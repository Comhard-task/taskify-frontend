import React, { useState } from 'react';

export default function TaskDetailModal({ task, isOpen, onClose, onUpdateTask, onDeleteTask }) {
  if (!isOpen || !task) return null;

  const [commentText, setCommentText] = useState('');
  const [newSubtaskText, setNewSubtaskText] = useState('');

  const handleStageChange = (newStage) => {
    onUpdateTask({
      ...task,
      stage: newStage,
      completed: newStage === 'Completed'
    });
  };

  const handleToggleSubtask = (index) => {
    const updatedSubtasks = [...task.subtasks];
    updatedSubtasks[index].completed = !updatedSubtasks[index].completed;
    onUpdateTask({
      ...task,
      subtasks: updatedSubtasks
    });
  };

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskText.trim()) return;
    onUpdateTask({
      ...task,
      subtasks: [...task.subtasks, { text: newSubtaskText.trim(), completed: false }]
    });
    setNewSubtaskText('');
  };

  const handleToggleBlocked = () => {
    onUpdateTask({
      ...task,
      isBlocked: !task.isBlocked
    });
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onUpdateTask({
      ...task,
      commentsCount: (task.commentsCount || 0) + 1
    });
    setCommentText('');
  };

  const completedSubtasksCount = task.subtasks.filter((s) => s.completed).length;
  const progressPercent = task.subtasks.length > 0
    ? Math.round((completedSubtasksCount / task.subtasks.length) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/40 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low/40">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-primary-fixed text-primary">
              #{task.id}
            </span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
              task.priority === 'Urgent'
                ? 'bg-error-container text-on-error-container'
                : task.priority === 'High'
                ? 'bg-amber-100 text-amber-900'
                : 'bg-surface-container text-on-surface-variant'
            }`}>
              {task.priority} Priority
            </span>
            {task.isBlocked && (
              <span className="flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping" />
                Blocked
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onDeleteTask(task.id)}
              className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-red-50 transition-colors"
              title="Delete task"
            >
              <span className="material-symbols-outlined text-lg">delete</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div>
            <h1 className="text-xl font-bold text-on-surface tracking-tight mb-2">
              {task.title}
            </h1>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {task.summary}
            </p>
          </div>

          {/* Quick Properties Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-surface-container-low/70 border border-outline-variant/30 text-xs">
            <div>
              <span className="text-outline uppercase tracking-wider text-[10px] font-bold block mb-1">Lifecycle Stage</span>
              <select
                value={task.stage}
                onChange={(e) => handleStageChange(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-2 py-1 font-semibold text-on-surface"
              >
                <option value="Backlog">Backlog</option>
                <option value="In Progress">In Progress</option>
                <option value="In Review">In Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <span className="text-outline uppercase tracking-wider text-[10px] font-bold block mb-1">Assignee</span>
              <div className="flex items-center gap-1.5 mt-1">
                <img src={task.assigneeAvatar} alt={task.assignee} className="w-5 h-5 rounded-full object-cover" />
                <span className="font-semibold text-on-surface truncate">{task.assignee}</span>
              </div>
            </div>

            <div>
              <span className="text-outline uppercase tracking-wider text-[10px] font-bold block mb-1">Story Points</span>
              <span className="inline-block mt-1 font-mono font-bold text-primary">
                {task.points} pts
              </span>
            </div>

            <div>
              <span className="text-outline uppercase tracking-wider text-[10px] font-bold block mb-1">Due Date</span>
              <span className="inline-block mt-1 font-semibold text-on-surface">
                {task.dueDate}
              </span>
            </div>
          </div>

          {/* Subtasks Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">checklist</span>
                <span className="font-bold text-sm text-on-surface">Subtasks & Checkpoints</span>
              </div>
              <span className="text-xs font-semibold text-on-surface-variant">
                {completedSubtasksCount} of {task.subtasks.length} ({progressPercent}%)
              </span>
            </div>

            <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden mb-3">
              <div
                className="bg-primary h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="space-y-1.5">
              {task.subtasks.map((sub, i) => (
                <label
                  key={i}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container-low/70 transition-colors cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={sub.completed}
                    onChange={() => handleToggleSubtask(i)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer accent-primary-container"
                  />
                  <span className={`text-sm ${sub.completed ? 'line-through text-outline' : 'text-on-surface font-medium'}`}>
                    {sub.text}
                  </span>
                </label>
              ))}
            </div>

            <form onSubmit={handleAddSubtask} className="flex gap-2 mt-3">
              <input
                type="text"
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
                placeholder="Add new subtask checkpoint..."
                className="flex-1 px-3 py-1.5 bg-surface-container-low rounded-lg border border-outline-variant/40 text-xs focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-surface-container text-primary font-semibold text-xs hover:bg-primary hover:text-on-primary transition-all"
              >
                Add Subtask
              </button>
            </form>
          </div>

          {/* Action Flags */}
          <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between">
            <button
              onClick={handleToggleBlocked}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                task.isBlocked
                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  : 'bg-red-50 text-error hover:bg-red-100'
              }`}
            >
              <span className="material-symbols-outlined text-base">
                {task.isBlocked ? 'check_circle' : 'block'}
              </span>
              <span>{task.isBlocked ? 'Mark as Unblocked' : 'Flag as Merge Blocked'}</span>
            </button>

            <span className="text-xs text-outline">
              Created {task.createdAt} in {task.cluster}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-outline-variant/30 bg-surface-container-low/30 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-primary text-on-primary font-semibold text-xs shadow-xs hover:bg-primary-container"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
