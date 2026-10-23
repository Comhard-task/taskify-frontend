import React, { useState } from 'react';

export default function PipelinesView({
  tasks,
  onOpenTaskDetail,
  onOpenNewTaskWithStage,
  onMoveTaskStage
}) {
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterAssignee, setFilterAssignee] = useState('All');

  const columns = [
    { id: 'Backlog', label: 'Backlog', color: 'bg-slate-400', badgeColor: 'bg-slate-100 text-slate-700' },
    { id: 'In Progress', label: 'In Progress', color: 'bg-primary-container', badgeColor: 'bg-blue-100 text-blue-800' },
    { id: 'In Review', label: 'In Review', color: 'bg-amber-500', badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'Completed', label: 'Completed', color: 'bg-secondary', badgeColor: 'bg-emerald-100 text-emerald-800' }
  ];

  const filteredTasks = tasks.filter((t) => {
    if (filterPriority !== 'All' && t.priority !== filterPriority) return false;
    if (filterAssignee !== 'All' && t.assignee !== filterAssignee) return false;
    return true;
  });

  const totalPoints = tasks.reduce((sum, t) => sum + (t.points || 0), 0);
  const completedPoints = tasks
    .filter((t) => t.stage === 'Completed')
    .reduce((sum, t) => sum + (t.points || 0), 0);

  return (
    <div className="w-full flex flex-col gap-space-lg">
      {/* Interactive View State Bar & Controls */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-space-md pb-4 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2 text-outline text-xs uppercase tracking-wider font-semibold mb-0.5">
            <span>Sprint 44</span>
            <span>/</span>
            <span className="text-primary font-bold">Engineering & Product Core</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline-lg text-2xl font-extrabold text-on-surface tracking-tight">
              Core Platform Pipeline
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-xs font-bold text-on-surface-variant">
              Live Board
            </span>
          </div>
        </div>

        {/* Board KPI metrics summary */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap text-xs">
          <div className="px-3 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/40 shadow-2xs flex items-center gap-2">
            <span className="material-symbols-outlined text-outline text-base">format_list_bulleted</span>
            <div>
              <div className="text-[10px] uppercase text-outline font-semibold">Total Scope</div>
              <div className="font-bold text-on-surface">{tasks.length} Tasks</div>
            </div>
          </div>

          <div className="px-3 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/40 shadow-2xs flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-base">pie_chart</span>
            <div>
              <div className="text-[10px] uppercase text-outline font-semibold">Burnup Points</div>
              <div className="font-bold text-primary">{completedPoints} / {totalPoints} pts</div>
            </div>
          </div>

          <div className="px-3 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/40 shadow-2xs flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-base">timer</span>
            <div>
              <div className="text-[10px] uppercase text-outline font-semibold">Avg Cycle</div>
              <div className="font-bold text-secondary">2.4 Days</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-semibold">
            <span className="material-symbols-outlined text-sm">filter_list</span>
            <span>Filter:</span>
          </div>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-2.5 py-1.5 bg-surface-container-lowest rounded-lg border border-outline-variant/40 text-xs font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">🚨 Urgent</option>
            <option value="High">⚡ High</option>
            <option value="Medium">🔹 Medium</option>
            <option value="Low">☕ Low</option>
          </select>

          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="px-2.5 py-1.5 bg-surface-container-lowest rounded-lg border border-outline-variant/40 text-xs font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
          >
            <option value="All">All Assignees</option>
            <option value="David K.">David K.</option>
            <option value="Elena R.">Elena R.</option>
            <option value="Marcus V.">Marcus V.</option>
            <option value="Chloe T.">Chloe T.</option>
            <option value="Alex Morgan">Alex Morgan</option>
          </select>
        </div>

        <div className="text-xs text-on-surface-variant font-medium">
          Showing <strong className="text-on-surface">{filteredTasks.length}</strong> tasks across 4 workflow stages
        </div>
      </div>

      {/* Kanban Board 4 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.stage === col.id);
          const colPoints = colTasks.reduce((s, t) => s + (t.points || 0), 0);

          return (
            <div
              key={col.id}
              className="bg-surface-container-low/70 border border-outline-variant/30 rounded-xl p-3 flex flex-col gap-3 min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20 px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                  <span className="font-bold text-sm text-on-surface">{col.label}</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${col.badgeColor}`}>
                    {colTasks.length}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-outline font-mono font-bold mr-1">
                    {colPoints} pts
                  </span>
                  <button
                    onClick={() => onOpenNewTaskWithStage(col.id)}
                    className="p-1 rounded-md text-outline hover:text-primary hover:bg-surface-container-lowest transition-colors"
                    title={`Add task to ${col.label}`}
                  >
                    <span className="material-symbols-outlined text-base">add</span>
                  </button>
                </div>
              </div>

              {/* Task Cards Container */}
              <div className="flex flex-col gap-2.5 flex-1">
                {colTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-outline-variant/30 rounded-lg text-outline text-xs">
                    <span className="material-symbols-outlined text-2xl mb-1 text-outline/60">inbox</span>
                    <span>No tasks in {col.label}</span>
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const completedSub = task.subtasks.filter((s) => s.completed).length;

                    return (
                      <div
                        key={task.id}
                        onClick={() => onOpenTaskDetail(task)}
                        className="bg-surface-container-lowest border border-outline-variant/40 hover:border-primary/50 hover:shadow-md transition-all rounded-xl p-3.5 flex flex-col gap-2.5 cursor-pointer group relative"
                      >
                        {/* Card Top: Tags & Priority */}
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className="font-mono text-[11px] font-bold text-primary">
                              #{task.id}
                            </span>
                            {task.tags && task.tags.slice(0, 2).map((tg) => (
                              <span key={tg} className="text-[10px] px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">
                                {tg}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-1">
                            {task.isBlocked && (
                              <span className="w-2 h-2 rounded-full bg-error animate-ping" title="Blocked" />
                            )}
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                              task.priority === 'Urgent'
                                ? 'bg-red-100 text-red-700'
                                : task.priority === 'High'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                        </div>

                        {/* Title */}
                        <h4 className="text-xs sm:text-sm font-bold text-on-surface leading-snug group-hover:text-primary transition-colors">
                          {task.title}
                        </h4>

                        {/* Subtasks summary */}
                        {task.subtasks.length > 0 && (
                          <div className="flex items-center gap-2 text-[11px] text-on-surface-variant">
                            <span className="material-symbols-outlined text-xs">checklist</span>
                            <span>{completedSub}/{task.subtasks.length} subtasks</span>
                            <div className="flex-1 bg-surface-container h-1 rounded-full overflow-hidden">
                              <div
                                className="bg-primary h-full rounded-full"
                                style={{ width: `${(completedSub / task.subtasks.length) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Card Footer: Assignee, points, due date, move stage controls */}
                        <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 text-xs">
                          <div className="flex items-center gap-1.5">
                            <img src={task.assigneeAvatar} alt={task.assignee} className="w-5 h-5 rounded-full object-cover ring-1 ring-outline-variant/40" />
                            <span className="text-[11px] font-medium text-on-surface-variant truncate max-w-[80px]">
                              {task.assignee}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-surface-container text-primary">
                              {task.points}p
                            </span>

                            {/* Quick Stage Mover buttons */}
                            {col.id !== 'Backlog' && (
                              <button
                                onClick={() => {
                                  const stages = ['Backlog', 'In Progress', 'In Review', 'Completed'];
                                  const idx = stages.indexOf(col.id);
                                  if (idx > 0) onMoveTaskStage(task.id, stages[idx - 1]);
                                }}
                                className="p-1 rounded text-outline hover:text-on-surface hover:bg-surface-container"
                                title="Move left"
                              >
                                <span className="material-symbols-outlined text-sm">arrow_back</span>
                              </button>
                            )}

                            {col.id !== 'Completed' && (
                              <button
                                onClick={() => {
                                  const stages = ['Backlog', 'In Progress', 'In Review', 'Completed'];
                                  const idx = stages.indexOf(col.id);
                                  if (idx < stages.length - 1) onMoveTaskStage(task.id, stages[idx + 1]);
                                }}
                                className="p-1 rounded text-outline hover:text-primary hover:bg-surface-container"
                                title="Advance stage"
                              >
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
