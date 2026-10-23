import React, { useState } from 'react';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onLoginSuccess }) {
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState('Eleanor Vance');
  const [email, setEmail] = useState('eleanor@newlight.space');
  const [password, setPassword] = useState('mindfulfocus');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess({
        name: mode === 'signup' ? name : 'Eleanor Vance',
        email: email
      });
      onClose();
    }, 500);
  };

  const handleQuickDemoLogin = () => {
    onLoginSuccess({
      name: 'Eleanor Vance',
      email: 'eleanor@newlight.space'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#121b2d]/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-[#fcfaf6] rounded-2xl shadow-2xl border border-[#ede3d5] w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-[#ece2d4] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-[#c4965d]/50 flex items-center justify-center bg-[#f7f2ea]">
              <span className="material-symbols-outlined text-[#c4965d] text-lg">light_mode</span>
            </div>
            <div>
              <span className="font-editorial text-base font-semibold text-[#121b28] uppercase tracking-wider block">
                Taskify
              </span>
              <span className="text-[10px] text-[#8e8578] uppercase tracking-widest font-medium">
                Personal Sanctuary
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#8e8578] hover:text-[#121b28] hover:bg-[#f6f0e6] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-[#ece2d4] bg-[#f7f2ea]/60">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-3 text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
              mode === 'login'
                ? 'text-[#121b28] border-b-2 border-[#121b28] bg-[#fcfaf6]'
                : 'text-[#8e8578] hover:text-[#121b28]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-3 text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
              mode === 'signup'
                ? 'text-[#121b28] border-b-2 border-[#121b28] bg-[#fcfaf6]'
                : 'text-[#8e8578] hover:text-[#121b28]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="text-center">
            <h2 className="font-editorial text-2xl font-normal text-[#121b28]">
              {mode === 'login' ? 'Welcome back to clarity.' : 'Begin your mindful journey.'}
            </h2>
            <p className="text-xs text-[#71695f] mt-1.5 leading-relaxed">
              {mode === 'login'
                ? 'Enter your private space to see your day in a new light.'
                : 'A peaceful, personal task space created strictly for your daily alignment.'}
            </p>
          </div>

          {/* Quick Demo Access Button */}
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-2.5 px-4 rounded-full bg-[#f6f0e6] hover:bg-[#ede4d4] border border-[#d8cdbd] text-[#121b28] text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
          >
            <span className="material-symbols-outlined text-[#c4965d] text-base">sparkles</span>
            <span>Instant Demo Login (One-Click)</span>
          </button>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-[#ece2d4] w-full" />
            <span className="bg-[#fcfaf6] px-3 text-[10px] font-semibold text-[#8e8578] uppercase tracking-wider">
              Or with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#635b51] mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full px-3.5 py-2.5 bg-[#f7f3ec] rounded-xl border border-[#ded5c6] focus:border-[#121b2d] focus:bg-[#fcfaf6] focus:outline-none text-xs text-[#121b28] font-medium transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#635b51] mb-1">
                Personal Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="eleanor@newlight.space"
                className="w-full px-3.5 py-2.5 bg-[#f7f3ec] rounded-xl border border-[#ded5c6] focus:border-[#121b2d] focus:bg-[#fcfaf6] focus:outline-none text-xs text-[#121b28] font-medium transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#635b51] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#f7f3ec] rounded-xl border border-[#ded5c6] focus:border-[#121b2d] focus:bg-[#fcfaf6] focus:outline-none text-xs text-[#121b28] font-medium transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 rounded-full bg-[#121b2d] hover:bg-[#1f2d48] text-white text-xs font-semibold tracking-wider shadow-sm transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                  <span>Opening Space...</span>
                </>
              ) : (
                <span>{mode === 'login' ? 'Open My Sanctuary →' : 'Create My Free Account →'}</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
