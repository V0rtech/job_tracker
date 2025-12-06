"use client";

import { useState } from "react";

interface DailyStat {
  date: string; // YYYY-MM-DD
  count: number;
}

interface ApplicationStatsProps {
  todayCount: number;
  totalCount: number;
  dailyStats: DailyStat[];
}

export default function ApplicationStats({
  todayCount,
  totalCount,
  dailyStats,
}: ApplicationStatsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Find the max count to scale the graph
  // Ensure maxCount is at least 4 to prevent flat graphs for low numbers
  const maxCount = Math.max(...dailyStats.map((d) => d.count), 4);
  
  // Calculate points for SVG
  // We use a 1000x200 coordinate system for the SVG
  const width = 1000;
  const height = 200;
  const padding = 20;
  
  const getX = (index: number) => {
    return padding + (index / (dailyStats.length - 1)) * (width - 2 * padding);
  };

  const getY = (value: number) => {
    return height - padding - (value / maxCount) * (height - 2 * padding);
  };

  const points = dailyStats.map((stat, i) => {
    return `${getX(i)},${getY(stat.count)}`;
  }).join(" ");

  // Create area path (add bottom corners)
  const areaPath = `
    M ${getX(0)},${height - padding}
    L ${points}
    L ${getX(dailyStats.length - 1)},${height - padding}
    Z
  `;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Today's Count */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Applied Today
        </h3>
        <div className="mt-4 flex items-end gap-3">
          <span className="text-5xl font-bold text-gray-900 tracking-tight">{todayCount}</span>
          <span className="text-sm font-medium text-gray-500 mb-1">applications</span>
        </div>
      </div>

      {/* Total Count */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Total Applied
        </h3>
        <div className="mt-4 flex items-end gap-3">
          <span className="text-5xl font-bold text-gray-900 tracking-tight">{totalCount}</span>
          <span className="text-sm font-medium text-gray-500 mb-1">applications</span>
        </div>
      </div>

      {/* Activity Graph */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow md:col-span-3 relative overflow-hidden">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-6">
          Activity (Last 14 Days)
        </h3>
        
        <div className="relative h-48 w-full" onMouseLeave={() => setHoveredIndex(null)}>
          {/* Tooltip */}
          {hoveredIndex !== null && (
            <div 
              className="absolute top-0 bg-gray-900 text-white text-xs rounded py-1 px-2 transform -translate-x-1/2 pointer-events-none z-10 shadow-lg"
              style={{ left: `${(getX(hoveredIndex) / width) * 100}%`, top: `${(getY(dailyStats[hoveredIndex].count) / height) * 100}%`, marginTop: '-35px' }}
            >
              <div className="font-semibold text-center">
                {dailyStats[hoveredIndex].count} apps
              </div>
              <div className="text-gray-400 text-[10px] whitespace-nowrap">
                {new Date(dailyStats[hoveredIndex].date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </div>
            </div>
          )}

          <svg 
            viewBox={`0 0 ${width} ${height}`} 
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = height - padding - ratio * (height - 2 * padding);
              return (
                <line
                  key={ratio}
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="#f3f4f6"
                  strokeWidth="1"
                />
              );
            })}

            {/* Area fill */}
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#gradient)" />

            {/* Line */}
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              points={points}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Points (invisible but larger hit area) */}
            {dailyStats.map((stat, i) => (
              <circle
                key={stat.date}
                cx={getX(i)}
                cy={getY(stat.count)}
                r="6"
                fill="transparent"
                className="cursor-pointer hover:fill-blue-500 hover:stroke-white hover:stroke-2 transition-all"
                onMouseEnter={() => setHoveredIndex(i)}
              />
            ))}
            
            {/* Visible Points on Hover or Key points */}
            {dailyStats.map((stat, i) => (
              <circle
                key={`visible-${stat.date}`}
                cx={getX(i)}
                cy={getY(stat.count)}
                r={hoveredIndex === i ? 6 : 3}
                fill={hoveredIndex === i ? "#3b82f6" : "#fff"}
                stroke="#3b82f6"
                strokeWidth={hoveredIndex === i ? 3 : 2}
                className="pointer-events-none transition-all duration-200"
              />
            ))}
          </svg>

          {/* X Axis Labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[10px] text-gray-400">
            {dailyStats.map((stat, i) => (
              <span 
                key={stat.date} 
                className="text-center w-8 truncate"
                style={{ opacity: i % 2 === 0 ? 1 : 0 }} // Show every other label to avoid clutter
              >
                {new Date(stat.date).getDate()}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

