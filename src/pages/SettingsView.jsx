import React, { useState } from 'react';
import { INITIAL_TEAM } from '../data/initialData';

export default function SettingsView() {
  const [workspaceName, setWorkspaceName] = useState('Acme Core Platform');
  const [sprintDuration, setSprintDuration] = useState('2 weeks');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="w-full flex flex-col gap-space-lg max-w-4xl">
      <div>
        <h1 className="font-headline-lg text-2xl font-extrabold text-on-surface tracking-tight">
          Workspace & Pipeline Settings
        </h1>
        <p className="text-xs text-on-surface-variant mt-1">
          Configure cluster orchestration parameters, MCP Stitch synchronization, and squad credentials.
        </p>
      </div>

      {savedNotice && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-secondary text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>Workspace configuration saved and broadcasted to active squads.</span>
        </div>
      )}

      {/* Card 1: Stitch MCP Integration Status */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/40 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">integration_instructions</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-on-surface">Stitch MCP Server Connection</h2>
              <p className="text-xs text-on-surface-variant">Connected to Google Cloud Stitch UI Engine</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live & Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-surface-container-low/70 border border-outline-variant/30">
            <span className="text-outline uppercase tracking-wider text-[10px] font-bold block mb-1">Server URL</span>
            <span className="font-mono text-on-surface font-semibold">https://stitch.googleapis.com/mcp</span>
          </div>

          <div className="p-3 rounded-lg bg-surface-container-low/70 border border-outline-variant/30">
            <span className="text-outline uppercase tracking-wider text-[10px] font-bold block mb-1">Stitch Project ID</span>
            <span className="font-mono text-primary font-bold">projects/5006316305466219472</span>
          </div>

          <div className="p-3 rounded-lg bg-surface-container-low/70 border border-outline-variant/30">
            <span className="text-outline uppercase tracking-wider text-[10px] font-bold block mb-1">Configured Header</span>
            <span className="font-mono text-on-surface font-semibold">X-Goog-Api-Key: AQ.Ab8RN6Lo...P3ig</span>
          </div>

          <div className="p-3 rounded-lg bg-surface-container-low/70 border border-outline-variant/30">
            <span className="text-outline uppercase tracking-wider text-[10px] font-bold block mb-1">Design System Sync</span>
            <span className="text-secondary font-bold">FlowTask (Plus Jakarta Sans, Modern Light SaaS)</span>
          </div>
        </div>
      </div>

      {/* Card 2: General Workspace Settings Form */}
      <form onSubmit={handleSave} className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/40 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-on-surface pb-2 border-b border-outline-variant/30">
          General Cluster Options
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
              Workspace Identifier
            </label>
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-xs font-medium text-on-surface border border-outline-variant/50 focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
              Cadence / Sprint Duration
            </label>
            <select
              value={sprintDuration}
              onChange={(e) => setSprintDuration(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-xs font-medium text-on-surface border border-outline-variant/50 focus:border-primary outline-none"
            >
              <option value="1 week">1 week (Fast flow)</option>
              <option value="2 weeks">2 weeks (Standard cadence)</option>
              <option value="3 weeks">3 weeks (Continuous release)</option>
            </select>
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary-container"
            />
            <span className="text-on-surface font-semibold">Enable live Slack & Webhook broadcast on urgent block flags</span>
          </label>
        </div>

        <div className="pt-3 border-t border-outline-variant/30 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-xs transition-all active:scale-95"
          >
            Save Preferences
          </button>
        </div>
      </form>

      {/* Card 3: Squad Members & Permissions */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/40 shadow-xs">
        <h2 className="text-sm font-bold text-on-surface pb-3 border-b border-outline-variant/30 mb-3">
          Squad Roster & Access Roles
        </h2>

        <div className="divide-y divide-outline-variant/20">
          {INITIAL_TEAM.map((member) => (
            <div key={member.id} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full object-cover" />
                <div>
                  <p className="font-bold text-on-surface">{member.name}</p>
                  <p className="text-[11px] text-on-surface-variant">{member.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-semibold text-[11px]">
                  {member.role}
                </span>
                <span className="material-symbols-outlined text-outline text-base">more_vert</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
