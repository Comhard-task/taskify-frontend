import React, { useState } from 'react';
import { INITIAL_TEAM } from '../data/initialData';

export default function NewTaskModal({ isOpen, onClose, onAddTask, initialStage = 'In Progress' }) {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [stage, setStage] = useState(initialStage);
  const [priority, setPriority] = useState('High');
  const [points, setPoints] = useState(5);
  const [assigneeId, setAssigneeId] = useState(INITIAL_TEAM[0].id);
  const [cluster, setCluster] = useState('Platform Infra');
  const [tags, setTags] = useState('Core, Edge');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedMember = INITIAL_TEAM.find((m) => m.id === assigneeId) || INITIAL_TEAM[0];
    const generatedId = `TASK-${Math.floor(100 + Math.random() * 900)}`;

    const newTask = {
      id: generatedId,
      title: title.trim(),
      summary: summary.trim() || 'No description provided.',
      stage: stage,
      isBlocked: priority === 'Urgent' && Math.random() > 0.6,
      priority: priority,
      assignee: selectedMember.name,
      assigneeAvatar: selectedMember.avatar,
      dueDate: 'Nov 12',
      cluster: cluster,
      points: Number(points),
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      commentsCount: 0,
      subtasks: [
        { text: 'Initial design and technical scoping', completed: false },
        { text: 'Execution and unit test validation', completed: false }
      ],
      completed: stage === 'Completed',
      createdAt: 'Today'
    };

    onAddTask(newTask);
    onClose();
    setTitle('');
    setSummary('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/40 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
        <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-lg">add_task</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-base font-bold text-on-surface">Create New Pipeline Task</h2>
              <p className="text-xs text-on-surface-variant">Route a high-priority work unit directly to squad pipelines</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
              Task Title <span className="text-error">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Multi-cluster failover resilience audit..."
              className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/50 focus:border-primary focus:bg-surface-container-lowest focus:outline-none text-sm text-on-surface font-medium transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
              Summary & Objectives
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief technical objective or requirements for the engineering squad..."
              className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/50 focus:border-primary focus:bg-surface-container-lowest focus:outline-none text-sm text-on-surface transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                Target Stage
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/50 focus:border-primary focus:outline-none text-sm text-on-surface font-medium"
              >
                <option value="Backlog">Backlog</option>
                <option value="In Progress">In Progress</option>
                <option value="In Review">In Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/50 focus:border-primary focus:outline-none text-sm text-on-surface font-medium"
              >
                <option value="Urgent">🚨 Urgent</option>
                <option value="High">⚡ High</option>
                <option value="Medium">🔹 Medium</option>
                <option value="Low">☕ Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                Assign Squad Member
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/50 focus:border-primary focus:outline-none text-sm text-on-surface font-medium"
              >
                {INITIAL_TEAM.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} ({member.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                Story Points
              </label>
              <select
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/50 focus:border-primary focus:outline-none text-sm text-on-surface font-medium"
              >
                <option value="1">1 pt (Trivial)</option>
                <option value="2">2 pts (Minor)</option>
                <option value="3">3 pts (Standard)</option>
                <option value="5">5 pts (Complex)</option>
                <option value="8">8 pts (Major)</option>
                <option value="13">13 pts (Epic block)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                Cluster
              </label>
              <input
                type="text"
                value={cluster}
                onChange={(e) => setCluster(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/50 focus:border-primary focus:outline-none text-sm text-on-surface"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Auth, Cloud, DB"
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/50 focus:border-primary focus:outline-none text-sm text-on-surface"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
