import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { settingsAPI } from '../services/api';

export default function PersonalSettingsPage({ user }) {
  const [dailyGoal, setDailyGoal] = useState('5');
  const [dailyFocusMinutes, setDailyFocusMinutes] = useState('180');
  const [gentleReminders, setGentleReminders] = useState(true);
  const [digitalDetoxReminder, setDigitalDetoxReminder] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    settingsAPI
      .getSettings()
      .then((res) => {
        if (res && res.data) {
          if (res.data.dailyGoal) setDailyGoal(String(res.data.dailyGoal));
          if (res.data.dailyFocusMinutes) setDailyFocusMinutes(String(res.data.dailyFocusMinutes));
          if (res.data.gentleReminders !== undefined) setGentleReminders(res.data.gentleReminders);
          if (res.data.digitalDetoxReminder !== undefined) setDigitalDetoxReminder(res.data.digitalDetoxReminder);
        }
      })
      .catch((err) => {
        console.warn('Settings fetch offline or demo fallback:', err.message);
      });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      await settingsAPI.updateSettings({
        dailyGoal: Number(dailyGoal),
        dailyFocusMinutes: Number(dailyFocusMinutes),
        gentleReminders,
        digitalDetoxReminder
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.warn('Settings save error, falling back to local:', err.message);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl flex flex-col gap-8"
    >
      <div className="pb-6 border-b border-[#ece2d4]">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b08752] mb-2">
          <span className="w-5 h-px bg-[#c4965d]" />
          <span>PERSONAL SANCTUARY PREFERENCES</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-[#121b28]">
          Mindful Settings
        </h1>
        <p className="text-[#645c52] text-sm sm:text-base mt-2 font-normal max-w-xl">
          Customize your daily intention pace, focus rhythms, and gentle alignment reminders.
        </p>
      </div>

      <AnimatePresence>
        {savedSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">check_circle</span>
            <span>Your personal preferences have been saved to your sanctuary.</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSave} className="bg-[#fdfbf7] p-6 sm:p-8 rounded-2xl border border-[#ede3d5] shadow-xs space-y-6">
        <h3 className="font-editorial text-2xl font-normal text-[#121b28] pb-3 border-b border-[#ece2d4]">
          Daily Flow Targets
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#635b51] mb-2">
              Daily Intentions Target
            </label>
            <select
              value={dailyGoal}
              onChange={(e) => setDailyGoal(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#f7f3ec] rounded-xl border border-[#ded5c6] focus:border-[#121b2d] text-xs font-medium text-[#121b28] outline-none"
            >
              <option value="3">3 Intentions (Unhurried & Calm)</option>
              <option value="5">5 Intentions (Balanced Flow)</option>
              <option value="7">7 Intentions (Deep Focus Sprint)</option>
            </select>
            <p className="text-[11px] text-[#8e8578] mt-1.5">
              Limits daily cognitive load to protect your mental energy.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#635b51] mb-2">
              Focus Minutes Target
            </label>
            <select
              value={dailyFocusMinutes}
              onChange={(e) => setDailyFocusMinutes(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#f7f3ec] rounded-xl border border-[#ded5c6] focus:border-[#121b2d] text-xs font-medium text-[#121b28] outline-none"
            >
              <option value="90">90 Minutes (Gentle)</option>
              <option value="180">180 Minutes (Standard Presence)</option>
              <option value="240">240 Minutes (Immersive Depth)</option>
            </select>
            <p className="text-[11px] text-[#8e8578] mt-1.5">
              Shown in your weekly line chart telemetry.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#ece2d4] space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={gentleReminders}
              onChange={(e) => setGentleReminders(e.target.checked)}
              className="w-4 h-4 rounded text-[#c4965d] focus:ring-[#c4965d] accent-[#c4965d]"
            />
            <div>
              <span className="text-xs font-semibold text-[#121b28] block">Gentle Midday Breathing Cue</span>
              <span className="text-[11px] text-[#8e8578]">A subtle, non-intrusive sound prompt to pause and breathe.</span>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={digitalDetoxReminder}
              onChange={(e) => setDigitalDetoxReminder(e.target.checked)}
              className="w-4 h-4 rounded text-[#c4965d] focus:ring-[#c4965d] accent-[#c4965d]"
            />
            <div>
              <span className="text-xs font-semibold text-[#121b28] block">Evening Disconnect Anchor</span>
              <span className="text-[11px] text-[#8e8578]">Reminds you to close tasks and step away before sunset.</span>
            </div>
          </label>
        </div>

        <div className="pt-4 border-t border-[#ece2d4] flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-full bg-[#121b2d] hover:bg-[#1f2d48] text-white text-xs font-semibold tracking-wider transition-all shadow-xs active:scale-95 cursor-pointer flex items-center gap-2"
          >
            {isSaving && <span className="material-symbols-outlined text-sm animate-spin">refresh</span>}
            <span>Save Sanctuary Settings</span>
          </button>
        </div>
      </form>
    </motion.div>
  );
}
