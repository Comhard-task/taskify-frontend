import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WeeklyLineChart({ weeklyStats, onSelectDay, selectedDay = 'Thu' }) {
  const [metricMode, setMetricMode] = useState('completed'); // 'completed' | 'focusMinutes'
  const [hoveredDay, setHoveredDay] = useState(null);

  const activeDayKey = hoveredDay || selectedDay;
  const activeStat = weeklyStats.find((s) => s.day === activeDayKey) || weeklyStats[3];

  // Dimensions for SVG
  const width = 640;
  const height = 220;
  const paddingX = 45;
  const paddingY = 35;

  const dataValues = weeklyStats.map((s) => (metricMode === 'completed' ? s.completed : s.focusMinutes));
  const maxVal = metricMode === 'completed' ? 12 : 300;
  const minVal = 0;

  // Compute (x, y) coordinates for each day
  const points = weeklyStats.map((stat, idx) => {
    const val = metricMode === 'completed' ? stat.completed : stat.focusMinutes;
    const x = paddingX + (idx / (weeklyStats.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((val - minVal) / (maxVal - minVal)) * (height - paddingY * 2);
    return { x, y, val, stat };
  });

  // Generate smooth SVG curve path (Catmull-Rom or Bezier cubic curve)
  const generateCurvedPath = (pts) => {
    if (pts.length < 2) return '';
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const linePath = generateCurvedPath(points);
  // Area fill path closing to the bottom
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className="w-full flex flex-col justify-between">
      {/* Chart Top Header & Metric Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#b08752] block mb-1">
            WEEKLY PROGRESS TELEMETRY
          </span>
          <h3 className="font-editorial text-2xl font-normal text-[#121b28]">
            Task Momentum Line Chart
          </h3>
          <p className="text-xs text-[#71695f] mt-0.5">
            Smooth spline trend showing daily flow and focus consistency across the week.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-[#f7f3ec] rounded-full border border-[#ded5c6]">
          <button
            type="button"
            onClick={() => setMetricMode('completed')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              metricMode === 'completed'
                ? 'bg-[#121b2d] text-white shadow-xs'
                : 'text-[#635b51] hover:text-[#121b28]'
            }`}
          >
            Intentions Finished
          </button>
          <button
            type="button"
            onClick={() => setMetricMode('focusMinutes')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              metricMode === 'focusMinutes'
                ? 'bg-[#121b2d] text-white shadow-xs'
                : 'text-[#635b51] hover:text-[#121b28]'
            }`}
          >
            Focus Minutes
          </button>
        </div>
      </div>

      {/* SVG Line Chart Canvas */}
      <div className="relative w-full overflow-hidden pt-2 pb-1">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            {/* Golden gradient fill under line */}
            <linearGradient id="warmLineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c4965d" stopOpacity="0.32" />
              <stop offset="60%" stopColor="#c4965d" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#c4965d" stopOpacity="0.00" />
            </linearGradient>

            {/* Subtle horizontal grid lines */}
            <pattern id="gridY" width="100" height="40" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="100" y2="0" stroke="#ede4d6" strokeWidth="1" strokeDasharray="3 3" />
            </pattern>
          </defs>

          {/* Horizontal grid guide lines */}
          {[0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = height - paddingY - ratio * (height - paddingY * 2);
            return (
              <g key={i}>
                <line
                  x1={paddingX - 10}
                  y1={y}
                  x2={width - paddingX + 10}
                  y2={y}
                  stroke="#ece3d5"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 18}
                  y={y + 3}
                  textAnchor="end"
                  fill="#9c9285"
                  fontSize="10"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                >
                  {Math.round(minVal + ratio * (maxVal - minVal))}
                </text>
              </g>
            );
          })}

          {/* Baseline axis */}
          <line
            x1={paddingX - 10}
            y1={height - paddingY}
            x2={width - paddingX + 10}
            y2={height - paddingY}
            stroke="#ded5c6"
            strokeWidth="1.5"
          />

          {/* Area under curve */}
          <motion.path
            d={areaPath}
            fill="url(#warmLineGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />

          {/* Smooth Line Curve */}
          <motion.path
            d={linePath}
            fill="none"
            stroke="#c4965d"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />

          {/* Interactive Data Nodes */}
          {points.map((pt) => {
            const isSelected = activeDayKey === pt.stat.day;
            return (
              <g
                key={pt.stat.day}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredDay(pt.stat.day)}
                onMouseLeave={() => setHoveredDay(null)}
                onClick={() => onSelectDay && onSelectDay(pt.stat.day)}
              >
                {/* Vertical cursor guide when hovered/active */}
                {isSelected && (
                  <line
                    x1={pt.x}
                    y1={paddingY - 10}
                    x2={pt.x}
                    y2={height - paddingY}
                    stroke="#121b2d"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                    opacity="0.5"
                  />
                )}

                {/* Outer Ring */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isSelected ? 8 : 5}
                  fill="#fcfaf6"
                  stroke={isSelected ? '#121b2d' : '#c4965d'}
                  strokeWidth={isSelected ? '3' : '2.5'}
                  className="transition-all duration-200"
                />

                {/* Inner Dot on active */}
                {isSelected && (
                  <circle cx={pt.x} cy={pt.y} r="3" fill="#121b2d" />
                )}

                {/* X-axis Day Label */}
                <text
                  x={pt.x}
                  y={height - paddingY + 22}
                  textAnchor="middle"
                  fill={isSelected ? '#121b28' : '#8e8578'}
                  fontSize={isSelected ? '12' : '11'}
                  fontWeight={isSelected ? '700' : '500'}
                  fontFamily="Plus Jakarta Sans, sans-serif"
                  className="transition-colors"
                >
                  {pt.stat.day}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Day Telemetry Box */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeDayKey}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="mt-4 p-4 rounded-xl bg-[#f7f3ec] border border-[#ded5c6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#121b2d] text-white flex items-center justify-center font-editorial font-bold text-sm">
              {activeStat.day}
            </div>
            <div>
              <span className="font-editorial text-base font-semibold text-[#121b28] block">
                {activeStat.day === 'Thu' ? 'Today (Thursday)' : `${activeStat.day} Flow Telemetry`}
              </span>
              <span className="text-[#645c52]">
                <strong className="text-[#121b28] font-semibold">{activeStat.completed} intentions finished</strong> • {activeStat.pending} postponed
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[#c4965d] font-bold">
              <span className="material-symbols-outlined text-base">timer</span>
              <span>{activeStat.focusMinutes} focus minutes</span>
            </div>
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#fdfbf7] border border-[#d8cdbd] text-[#635b51] font-semibold">
              {Math.round((activeStat.completed / (activeStat.completed + activeStat.pending)) * 100)}% Consistency
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
