import React, { useState } from 'react';

export default function ExplorerView({
  tasks,
  onOpenTaskDetail,
  onDeleteTask,
  onBulkUpdateStage
}) {
  const [queryInput, setQueryInput] = useState('');
  const [activeFilterPreset, setActiveFilterPreset] = useState('all');
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');

  // Filter presets
  const presets = [
    { id: 'all', label: 'All Tasks' },
    { id: 'my_tasks', label: 'My Tasks (Alex)' },
    { id: 'blocked', label: '🚨 Blocked / Review' },
    { id: 'high_points', label: 'High Points (≥5)' },
    { id: 'completed', label: 'Completed' }
  ];

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTaskIds(filteredTasks.map((t) => t.id));
    } else {
      setSelectedTaskIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    if (selectedTaskIds.includes(id)) {
      setSelectedTaskIds(selectedTaskIds.filter((item) => item !== id));
    } else {
      setSelectedTaskIds([...selectedTaskIds, id]);
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    // Preset filter
    if (activeFilterPreset === 'my_tasks' && task.assignee !== 'Alex Morgan') return false;
    if (activeFilterPreset === 'blocked' && !task.isBlocked && task.stage !== 'In Review') return false;
    if (activeFilterPreset === 'high_points' && (task.points || 0) < 5) return false;
    if (activeFilterPreset === 'completed' && task.stage !== 'Completed') return false;

    // Search query
    if (queryInput.trim()) {
      const q = queryInput.toLowerCase();
      const matchText = `${task.id} ${task.title} ${task.summary} ${task.assignee} ${task.stage} ${task.priority} ${task.cluster}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }

    return true;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (typeof aVal === 'string') {
      return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleExportCSV = () => {
    const headers = 'ID,Title,Stage,Priority,Assignee,Points,DueDate\n';
    const rows = sortedTasks
      .map((t) => `"${t.id}","${t.title}","${t.stage}","${t.priority}","${t.assignee}",${t.points},"${t.dueDate}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flowtask_export_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="w-full flex flex-col gap-space-lg">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div>
          <div className="flex items-center gap-1.5 text-on-surface-variant text-xs uppercase tracking-wider mb-1 font-semibold">
            <span>Workspace</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span>Explorer</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-primary font-bold">Query Engine v2.4</span>
          </div>
          <h1 className="font-headline-lg text-2xl font-extrabold text-on-surface tracking-tight">
            Task Explorer & Query Engine
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Structured relational search across all sprint boards, clusters, and backlogs.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/40 hover:bg-surface-container text-on-surface text-xs font-semibold shadow-2xs transition-colors"
          >
            <span className="material-symbols-outlined text-base">download</span>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Query Search Bar */}
      <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/40 shadow-xs flex flex-col sm:flex-row gap-2 items-center">
        <div className="relative flex-1 w-full flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-primary text-lg pointer-events-none">
            terminal
          </span>
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Search query syntax: e.g. 'Security Core', 'David', 'urgent'..."
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low rounded-lg text-xs font-mono text-on-surface border border-outline-variant/30 focus:border-primary focus:bg-surface-container-lowest focus:outline-none transition-all"
          />
          {queryInput && (
            <button
              onClick={() => setQueryInput('')}
              className="absolute right-3 text-outline hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto shrink-0">
          <span className="text-[11px] text-outline font-medium hidden md:inline">
            Filters:
          </span>
          <div className="flex items-center gap-1 overflow-x-auto py-0.5">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setActiveFilterPreset(preset.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeFilterPreset === preset.id
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bulk selection action bar */}
      {selectedTaskIds.length > 0 && (
        <div className="bg-primary-fixed/40 border border-primary/30 p-2.5 rounded-xl flex items-center justify-between text-xs font-semibold text-primary animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>{selectedTaskIds.length} tasks selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onBulkUpdateStage(selectedTaskIds, 'Completed');
                setSelectedTaskIds([]);
              }}
              className="px-2.5 py-1 rounded bg-secondary text-on-secondary hover:bg-secondary/90 transition-colors shadow-2xs"
            >
              Mark Completed
            </button>
            <button
              onClick={() => {
                onBulkUpdateStage(selectedTaskIds, 'In Progress');
                setSelectedTaskIds([]);
              }}
              className="px-2.5 py-1 rounded bg-primary text-on-primary hover:bg-primary-container transition-colors shadow-2xs"
            >
              Move to In Progress
            </button>
            <button
              onClick={() => setSelectedTaskIds([])}
              className="px-2 py-1 text-on-surface-variant hover:underline"
            >
              Deselect
            </button>
          </div>
        </div>
      )}

      {/* Explorer Results Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-surface-container-low/70 text-on-surface-variant uppercase tracking-wider font-bold border-b border-outline-variant/30">
                <th className="py-3 px-3.5 w-10">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedTaskIds.length > 0 && selectedTaskIds.length === filteredTasks.length}
                    className="h-4 w-4 rounded text-primary focus:ring-primary cursor-pointer accent-primary-container"
                  />
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('id')}>
                  <div className="flex items-center gap-1">
                    <span>Task ID</span>
                    {sortField === 'id' && (
                      <span className="material-symbols-outlined text-xs">
                        {sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                      </span>
                    )}
                  </div>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('title')}>
                  <div className="flex items-center gap-1">
                    <span>Task Summary & Cluster</span>
                    {sortField === 'title' && (
                      <span className="material-symbols-outlined text-xs">
                        {sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                      </span>
                    )}
                  </div>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('stage')}>
                  <div className="flex items-center gap-1">
                    <span>Stage</span>
                    {sortField === 'stage' && (
                      <span className="material-symbols-outlined text-xs">
                        {sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                      </span>
                    )}
                  </div>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('priority')}>
                  <div className="flex items-center gap-1">
                    <span>Priority</span>
                    {sortField === 'priority' && (
                      <span className="material-symbols-outlined text-xs">
                        {sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                      </span>
                    )}
                  </div>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('points')}>
                  <div className="flex items-center gap-1">
                    <span>Points</span>
                    {sortField === 'points' && (
                      <span className="material-symbols-outlined text-xs">
                        {sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                      </span>
                    )}
                  </div>
                </th>
                <th className="py-3 px-3">Assignee</th>
                <th className="py-3 px-3">Due Date</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {sortedTasks.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-outline">
                    <span className="material-symbols-outlined text-3xl mb-1 text-outline/60 block">search_off</span>
                    <span>No tasks match the active query query filters.</span>
                  </td>
                </tr>
              ) : (
                sortedTasks.map((task) => {
                  const isSelected = selectedTaskIds.includes(task.id);

                  return (
                    <tr
                      key={task.id}
                      className={`hover:bg-surface-container-low/50 transition-colors group ${
                        isSelected ? 'bg-primary-fixed/20' : ''
                      }`}
                    >
                      <td className="py-3 px-3.5 align-middle">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(task.id)}
                          className="h-4 w-4 rounded text-primary focus:ring-primary cursor-pointer accent-primary-container"
                        />
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-primary whitespace-nowrap">
                        #{task.id}
                      </td>
                      <td className="py-3 px-3 cursor-pointer" onClick={() => onOpenTaskDetail(task)}>
                        <div className="font-semibold text-on-surface group-hover:text-primary transition-colors">
                          {task.title}
                        </div>
                        <div className="text-[11px] text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                          <span className="px-1.5 py-0.2 rounded bg-surface-container text-outline font-medium">
                            {task.cluster}
                          </span>
                          <span>•</span>
                          <span className="truncate max-w-xs">{task.summary}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
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
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          task.priority === 'Urgent'
                            ? 'bg-red-100 text-red-700'
                            : task.priority === 'High'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${task.priority === 'Urgent' ? 'bg-red-600' : 'bg-amber-600'}`} />
                          {task.priority}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-primary">
                        {task.points} pts
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <img src={task.assigneeAvatar} alt={task.assignee} className="w-5 h-5 rounded-full object-cover" />
                          <span className="text-on-surface font-medium whitespace-nowrap">{task.assignee}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-on-surface-variant whitespace-nowrap">
                        {task.dueDate}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onOpenTaskDetail(task)}
                            className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container transition-colors"
                            title="Inspect details"
                          >
                            <span className="material-symbols-outlined text-base">visibility</span>
                          </button>
                          <button
                            onClick={() => onDeleteTask(task.id)}
                            className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-red-50 transition-colors"
                            title="Remove"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="px-4 py-3 bg-surface-container-low/40 border-t border-outline-variant/30 flex items-center justify-between text-xs text-on-surface-variant font-medium">
          <span>Total matching items: <strong className="text-on-surface">{sortedTasks.length}</strong></span>
          <span>Index synchronized via WebSocket</span>
        </div>
      </div>
    </div>
  );
}
