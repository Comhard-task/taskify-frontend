import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion } from 'framer-motion';

export default function LandingPage({ onOpenAuth, onGoToDashboard, isLoggedIn }) {
  return (
    <div className="min-h-screen bg-[#fcfaf6] text-[#121b28] flex flex-col font-sans selection:bg-[#f2e6d6]">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#fcfaf6]/90 backdrop-blur-md border-b border-[#ece3d5]/60 transition-all">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-full border border-[#c4965d]/50 flex items-center justify-center bg-[#f7f2ea] shadow-2xs">
              <span className="material-symbols-outlined text-[#c4965d] text-xl">light_mode</span>
            </div>
            <div className="flex flex-col">
              <span className="font-editorial text-lg tracking-[0.18em] font-semibold text-[#121b28] uppercase">
                Taskify
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#8e8578] -mt-1 font-medium">
                Personal Focus
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-[#463f35]">
            <a href="#home" className="hover:text-[#c4965d] transition-colors">Home</a>
            <a href="#about" className="hover:text-[#c4965d] transition-colors">About</a>
            <a href="#approach" className="hover:text-[#c4965d] transition-colors">Our Approach</a>
            <a href="#familiar" className="hover:text-[#c4965d] transition-colors">Mindset</a>
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={onGoToDashboard}
                className="px-6 py-2.5 rounded-full bg-[#121b2d] hover:bg-[#1f2d48] text-white text-xs font-medium tracking-wider shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Open Dashboard</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </motion.button>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth('login')}
                  className="hidden sm:inline-block text-xs font-semibold text-[#463f35] hover:text-[#c4965d] transition-colors px-3 py-2 cursor-pointer"
                >
                  Log In
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onOpenAuth('signup')}
                  className="px-6 py-2.5 rounded-full bg-[#121b2d] hover:bg-[#1f2d48] text-white text-xs font-medium tracking-wider shadow-sm transition-all cursor-pointer"
                >
                  Sign Up Free
                </motion.button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-12 sm:pt-20 pb-20 px-6 sm:px-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col items-start pr-0 lg:pr-6"
          >
            {/* Sub-label */}
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b08752] mb-6">
              <span className="w-6 h-px bg-[#c4965d]" />
              <span>MINDFUL PERSONAL CLARITY · WITHOUT THE SCRIPT</span>
            </div>

            {/* Main Heading */}
            <h1 className="font-editorial text-5xl sm:text-6xl md:text-7xl font-normal text-[#121b28] leading-[1.08] tracking-tight mb-8">
              See things in <br />
              <span className="text-[#c4965d] italic font-normal">a new light.</span>
            </h1>

            {/* Description */}
            <p className="text-[#5f574d] text-base sm:text-lg leading-relaxed max-w-xl font-normal mb-10">
              Personal task tracking for individuals seeking clarity, healing, and meaningful progress — without the polished corporate noise or complicated team clutter.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-16">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => (isLoggedIn ? onGoToDashboard() : onOpenAuth('signup'))}
                className="px-8 py-3.5 rounded-full bg-[#121b2d] hover:bg-[#1f2d48] text-white text-sm font-medium tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Take the First Step</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </motion.button>

              <button
                onClick={() => {
                  const el = document.getElementById('familiar');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-3.5 rounded-full border border-[#d8cdbd] hover:border-[#121b2d] hover:bg-[#f6f0e6] text-[#121b28] text-sm font-medium transition-all flex items-center justify-center cursor-pointer"
              >
                Our Approach
              </button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-6 sm:gap-10 pt-8 border-t border-[#ece2d4] w-full max-w-lg">
              <div>
                <div className="font-editorial text-2xl sm:text-3xl font-semibold text-[#121b28]">100%</div>
                <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#8e8578] font-medium mt-1">
                  Personal & Private
                </div>
              </div>
              <div>
                <div className="font-editorial text-2xl sm:text-3xl font-semibold text-[#121b28]">0</div>
                <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#8e8578] font-medium mt-1">
                  Team Distractions
                </div>
              </div>
              <div>
                <div className="font-editorial text-2xl sm:text-3xl font-semibold text-[#c4965d] italic">FL</div>
                <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#8e8578] font-medium mt-1">
                  Flow & Balance
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Hero Lottie Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 relative flex justify-center lg:justify-end w-full"
          >
            <div className="relative w-full max-w-lg lg:max-w-none rounded-2xl overflow-hidden shadow-2xl border-4 border-[#fffdfa] bg-[#f7f2ea]/90 flex items-center justify-center h-[460px] sm:h-[520px]">
              <div className="w-full h-full flex items-center justify-center scale-120 sm:scale-135 transition-transform">
                <DotLottieReact
                  src="/Clipboard.lottie"
                  loop
                  autoplay
                  className="w-full h-full"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Does This Sound Familiar? Section (Matches user reference image) */}
      <section id="familiar" className="py-20 sm:py-28 px-6 sm:px-10 bg-[#f7f2ea]/70 border-y border-[#ece3d5]/70">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5"
            >
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b08752] mb-4">
                <span className="w-6 h-px bg-[#c4965d]" />
                <span>DOES THIS SOUND FAMILIAR?</span>
              </div>

              <h2 className="font-editorial text-4xl sm:text-5xl font-normal text-[#121b28] leading-[1.15] tracking-tight mb-6">
                You keep finding yourself in the{' '}
                <span className="text-[#c4965d] italic">same</span>{' '}
                <span className="text-[#c4965d] italic">place.</span>
              </h2>

              <p className="text-[#645c52] text-sm sm:text-base leading-relaxed mb-6 font-normal">
                You've tried complex corporate productivity suites, filled with assignee tickets, sprint estimations, and notification noise. But when it comes to your personal life, goals, and mental clarity, those tools only create more anxiety.
              </p>

              <p className="text-[#645c52] text-sm sm:text-base leading-relaxed font-normal">
                Taskify strips away the team bloat. It gives you an unhurried, private sanctuary to plan your daily intentions, track healthy habits, and watch your weekly momentum unfold with gentle visual line charts.
              </p>

              <div className="mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => (isLoggedIn ? onGoToDashboard() : onOpenAuth('signup'))}
                  className="px-6 py-3 rounded-full bg-[#121b2d] hover:bg-[#1f2d48] text-white text-xs font-medium tracking-wider shadow-sm transition-all cursor-pointer"
                >
                  Experience Personal Clarity →
                </motion.button>
              </div>
            </motion.div>

            {/* Right Column: Numbered Cards with Framer Motion staggered entrance */}
            <div className="lg:col-span-7 flex flex-col gap-3.5">
              {[
                { num: '01', prefix: 'The same', highlight: 'thoughts.', desc: 'Mental clutter that stays unwritten and repeats endlessly.' },
                { num: '02', prefix: 'The same', highlight: 'reactions.', desc: 'Feeling overwhelmed whenever your personal task list grows too long.' },
                { num: '03', prefix: 'The same', highlight: 'patterns in your daily routine.', desc: 'Sacrificing self-care and deep focus for urgent trivialities.' },
                { num: '04', prefix: 'The same', highlight: 'weight you can’t quite name.', desc: 'Knowing you want to achieve more, but needing a calmer foundation.' },
              ].map((item, idx) => (
                <motion.div
                  key={item.num}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  whileHover={{ x: 4, borderColor: '#c4965d' }}
                  className="bg-[#fcfaf6] p-6 rounded-xl border border-[#ede3d5] shadow-xs transition-all flex items-start gap-5 group"
                >
                  <span className="font-editorial text-lg text-[#b08752] font-semibold shrink-0 mt-0.5">
                    {item.num}
                  </span>
                  <div>
                    <h3 className="font-editorial text-xl font-normal text-[#121b28]">
                      {item.prefix}{' '}
                      <span className="text-[#c4965d] italic font-normal">{item.highlight}</span>
                    </h3>
                    <p className="text-xs text-[#71695f] mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section id="approach" className="py-20 px-6 sm:px-10 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-[11px] uppercase tracking-[0.22em] font-semibold text-[#b08752] block mb-3">
            A MINDFUL FRAMEWORK
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl font-normal text-[#121b28]">
            Crafted strictly for <span className="text-[#c4965d] italic">personal peace.</span>
          </h2>
          <p className="text-[#645c52] text-sm mt-4 leading-relaxed">
            Distinct dashboard analytics and thoughtful task management with zero corporate bureaucracy.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: 'person',
              title: 'No Assignees, No Teams',
              desc: 'This is your private space. You never have to tag coworkers, assign tickets, or justify estimations. You track only what nurtures your life and goals.'
            },
            {
              icon: 'show_chart',
              title: 'Smooth Line Chart Analytics',
              desc: 'See your daily flow from Monday to Sunday. Celebrate every completed intention with gentle spline line charts that measure consistency rather than stress.'
            },
            {
              icon: 'spa',
              title: 'Gentle Milestones',
              desc: 'Categorize your day into Deep Focus, Health, Learning, and Life Admin. Check off tasks at your own pace and celebrate everyday presence.'
            }
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-[#f7f2ea]/80 p-8 rounded-2xl border border-[#ece2d4] flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-full bg-[#fdfbf7] border border-[#d8cdbd] flex items-center justify-center text-[#c4965d] mb-6 shadow-2xs">
                  <span className="material-symbols-outlined text-2xl">{feature.icon}</span>
                </div>
                <h3 className="font-editorial text-2xl font-normal text-[#121b28] mb-3">
                  {feature.title}
                </h3>
                <p className="text-xs text-[#665e53] leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 px-6 sm:px-10 border-t border-[#ece2d4] bg-[#fcfaf6] text-xs text-[#8e8578]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-editorial text-base tracking-wider font-semibold text-[#121b28]">TASKIFY</span>
            <span>—</span>
            <span>Mindful Personal Task Tracking</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#home" className="hover:text-[#121b28] transition-colors">Privacy</a>
            <a href="#about" className="hover:text-[#121b28] transition-colors">Terms</a>
            <button onClick={() => onOpenAuth('login')} className="hover:text-[#121b28] transition-colors cursor-pointer">
              Dashboard Login
            </button>
          </div>

          <div>© {new Date().getFullYear()} Taskify. Designed for calm personal focus.</div>
        </div>
      </footer>
    </div>
  );
}
