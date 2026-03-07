"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface MatchRateProgressCircleProps {
  matchRate: number; // 0-100
  size?: number;
}

export default function MatchRateProgressCircle({
  matchRate,
  size = 120,
}: MatchRateProgressCircleProps) {
  const [displayRate, setDisplayRate] = useState(0);

  useEffect(() => {
    setDisplayRate(matchRate);
  }, [matchRate]);

  const circumference = 2 * Math.PI * (size / 2 - 8);
  const offset = circumference - (displayRate / 100) * circumference;

  const getColor = () => {
    if (matchRate >= 90) return "#10b981";
    if (matchRate >= 80) return "#eab308";
    if (matchRate >= 70) return "#f97316";
    return "#dc2626";
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="absolute inset-0 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 8}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="4"
            className="dark:stroke-slate-700"
          />

          {/* Progress circle with gradient */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 8}
            fill="none"
            stroke={getColor()}
            strokeWidth="4"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>

        {/* Center text */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {Math.round(displayRate)}%
          </div>
          <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Match Rate
          </div>
        </motion.div>
      </div>

      {/* Status text */}
      <div className="text-center text-xs text-slate-600 dark:text-slate-300">
        {matchRate >= 90 && "Excellent match"}
        {matchRate >= 80 && matchRate < 90 && "Good match"}
        {matchRate >= 70 && matchRate < 80 && "Acceptable match"}
        {matchRate < 70 && "Needs review"}
      </div>
    </div>
  );
}
