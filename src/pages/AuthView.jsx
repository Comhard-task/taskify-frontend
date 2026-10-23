import React, { useState } from 'react';

export default function AuthView({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('alex.morgan@acme.corp');
  const [password, setPassword] = useState('••••••••••••');
  const [domainSso, setDomainSso] = useState(false);
  const [ssoDomain, setSsoDomain] = useState('acme.corp');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setFeedbackMsg('Authenticating credentials with Acme Enterprise IdP...');
    setTimeout(() => {
      setFeedbackMsg('');
      if (onLoginSuccess) onLoginSuccess();
    }, 800);
  };

  const handleSsoClick = (provider) => {
    setFeedbackMsg(`Redirecting to ${provider} OAuth2 provider...`);
    setTimeout(() => {
      setFeedbackMsg('');
      if (onLoginSuccess) onLoginSuccess();
    }, 600);
  };

  return (
    <div className="w-full flex items-center justify-center py-4 sm:py-8">
      <div className="w-full max-w-5xl bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/40 overflow-hidden flex flex-col lg:flex-row">
        {/* Left Panel: Auth Form */}
        <div className="w-full lg:w-7/12 p-6 sm:p-10 md:p-12 flex flex-col justify-between">
          <div>
            {/* Brand Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary font-bold shadow-xs">
                <span className="material-symbols-outlined text-2xl">schema</span>
              </div>
              <div>
                <span className="font-headline-sm text-lg font-bold text-on-surface">FlowTask</span>
                <span className="text-xs text-primary font-bold block uppercase tracking-wider">Enterprise Suite</span>
              </div>
            </div>

            {/* Title & subtitle */}
            <div className="mb-6">
              <h1 className="font-headline-xl text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
                {isSignUp ? 'Create your squad workspace' : 'Welcome back to FlowTask'}
              </h1>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5">
                {isSignUp
                  ? 'Start managing engineering pipelines with instant real-time telemetry.'
                  : 'Enter your credentials to access your active engineering clusters.'}
              </p>
            </div>

            {/* SSO Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => handleSsoClick('Google Workspace')}
                className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-outline-variant/60 hover:bg-surface-container-low text-xs font-bold text-on-surface transition-all shadow-2xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google Workspace</span>
              </button>

              <button
                type="button"
                onClick={() => handleSsoClick('GitHub Enterprise')}
                className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-outline-variant/60 hover:bg-surface-container-low text-xs font-bold text-on-surface transition-all shadow-2xs"
              >
                <span className="material-symbols-outlined text-base">domain</span>
                <span>SAML 2.0 / Okta</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center my-6">
              <div className="border-t border-outline-variant/40 w-full" />
              <span className="bg-surface-container-lowest px-3 text-[11px] font-bold text-outline uppercase tracking-wider">
                Or with work email
              </span>
            </div>

            {/* Standard Login / Sign up Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {domainSso ? (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                    Enterprise Domain
                  </label>
                  <div className="flex rounded-lg overflow-hidden border border-outline-variant/50 focus-within:border-primary">
                    <input
                      type="text"
                      required
                      value={ssoDomain}
                      onChange={(e) => setSsoDomain(e.target.value)}
                      placeholder="acme.corp"
                      className="flex-1 px-3 py-2 bg-surface-container-low text-xs font-mono text-on-surface focus:outline-none"
                    />
                    <span className="px-3 py-2 bg-surface-container text-xs text-outline font-mono">
                      .flowtask.io
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                      Work Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex.morgan@acme.corp"
                      className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/50 focus:border-primary focus:bg-surface-container-lowest focus:outline-none text-xs text-on-surface font-medium transition-all"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                        Password
                      </label>
                      <button type="button" className="text-[11px] text-primary hover:underline font-semibold">
                        Forgot password?
                      </button>
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/50 focus:border-primary focus:bg-surface-container-lowest focus:outline-none text-xs text-on-surface transition-all"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary-container cursor-pointer"
                  />
                  <span className="text-on-surface-variant font-medium">Keep cluster authenticated</span>
                </label>

                <button
                  type="button"
                  onClick={() => setDomainSso(!domainSso)}
                  className="text-primary hover:underline font-semibold text-xs"
                >
                  {domainSso ? 'Standard Login' : 'Single Sign-On (SSO)'}
                </button>
              </div>

              {feedbackMsg && (
                <div className="p-2.5 rounded-lg bg-primary-fixed/30 border border-primary/30 text-xs text-primary font-semibold flex items-center gap-2 animate-in fade-in">
                  <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                  <span>{feedbackMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-98 cursor-pointer mt-2"
              >
                {isSignUp ? 'Launch New Workspace' : 'Sign In to Cluster'}
              </button>
            </form>
          </div>

          {/* Toggle between Login and Signup */}
          <div className="mt-8 pt-4 border-t border-outline-variant/30 text-center text-xs text-on-surface-variant">
            {isSignUp ? (
              <span>
                Already have an engineering account?{' '}
                <button
                  onClick={() => setIsSignUp(false)}
                  className="text-primary font-bold hover:underline"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                New engineering squad?{' '}
                <button
                  onClick={() => setIsSignUp(true)}
                  className="text-primary font-bold hover:underline"
                >
                  Create Organization Workspace
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Right Panel: Enterprise Trust & Feature Spotlight */}
        <div className="w-full lg:w-5/12 bg-surface-container-low p-6 sm:p-10 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-outline-variant/30">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-6">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span>SOC2 Type II Certified</span>
            </div>

            <h3 className="text-xl font-bold text-on-surface mb-3 leading-snug">
              "FlowTask cut our cross-cluster sprint deployment cycles by 40%."
            </h3>

            <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
              Empowering 400+ engineering teams with high-throughput task pipelines, automated failover triggers, and zero-latency executive telemetry.
            </p>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-2xs">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwLPXwc8Tl8vYIzy88ApdQwB2K6p1AExLEHZ7mOftAxbq9xXT0FEWqr41GnMyl0hhLXbZU2yHfh_dOfmnWd7myr_Aq2j825uN4L5T1hdaoTTxDYijMW3BFTPbiF0qecndaysVtjq2aYJNAZdL6x6QVFejenzoLyBItVytzRPI096mr3Mui37xlA-1eUBqxDZhOXmb-g5WbDyf3r-kz9bbKSHH1UH97qOsMe03UgV1br658dWi7pgRu"
                alt="Sarah Chen"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
              />
              <div>
                <p className="font-bold text-xs text-on-surface">Sarah Chen</p>
                <p className="text-[11px] text-on-surface-variant">VP of Engineering at CloudScale Inc.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-outline-variant/30 text-[11px] text-outline flex items-center justify-between">
            <span>99.99% Guaranteed SLA</span>
            <span>GDPR & ISO-27001 Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}
