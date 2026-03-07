"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface RiskGaugeProps {
  score: number; // 0-100
  label?: string;
}

export default function RiskGauge({ score, label = "Risk Score" }: RiskGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    setDisplayScore(score);
  }, [score]);

  const getRiskColor = () => {
    if (score <= 20) return "from-emerald-400 to-emerald-600";
    if (score <= 45) return "from-yellow-400 to-yellow-600";
    if (score <= 70) return "from-orange-400 to-orange-600";
    return "from-red-400 to-red-600";
  };

  const getRiskLabel = () => {
    if (score <= 20) return "Low Risk";
    if (score <= 45) return "Medium Risk";
    if (score <= 70) return "High Risk";
    return "Critical Risk";
  };

  const angle = (displayScore / 100) * 180 - 90;

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative h-40 w-40">
        {/* Gauge background arc */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 200">
          {/* Low risk arc */}
          <path
            d="M 50 150 A 100 100 0 0 1 80 60"
            fill="none"
            stroke="#10b981"
            strokeWidth="8"
            strokeOpacity="0.2"
          />
          {/* Medium risk arc */}
          <path
            d="M 80 60 A 100 100 0 0 1 130 30"
            fill="none"
            stroke="#eab308"
            strokeWidth="8"
            strokeOpacity="0.2"
          />
          {/* High risk arc */}
          <path
            d="M 130 30 A 100 100 0 0 1 150 50"
            fill="none"
            stroke="#f97316"
            strokeWidth="8"
            strokeOpacity="0.2"
          />
          {/* Critical risk arc */}
          <path
            d="M 150 50 A 100 100 0 0 1 165 150"
            fill="none"
            stroke="#dc2626"
            strokeWidth="8"
            strokeOpacity="0.2"
          />

          {/* Animated needle */}
          <motion.line
            x1="100"
            y1="100"
            x2={100 + 80 * Math.cos((angle * Math.PI) / 180)}
            y2={100 + 80 * Math.sin((angle * Math.PI) / 180)}
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className={`text-slate-900 dark:text-white`}
            animate={{ rotate: angle }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ transformOrigin: "100px 100px" }}
          />

          {/* Center circle */}
          <circle cx="100" cy="100" r="8" fill="currentColor" className="text-slate-900 dark:text-white" />

          {/* Tick marks and labels */}
          <text x="50" y="170" textAnchor="middle" className="text-xs font-medium" fill="currentColor">
            0
          </text>
          <text x="150" y="170" textAnchor="middle" className="text-xs font-medium" fill="currentColor">
            100
          </text>
        </svg>

        {/* Center display */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className={`bg-linear-to-r ${getRiskColor()} bg-clip-text text-3xl font-bold text-transparent`}>
            {Math.round(displayScore)}
          </div>
          <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
            {getRiskLabel()}
          </div>
        </motion.div>
      </div>

      {/* Legend */}
      <div className="grid w-full grid-cols-2 gap-2">
        <div className="flex items-center gap-2 text-xs">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Low: 0-20</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="h-2 w-2 rounded-full bg-yellow-500" />
          <span>Medium: 21-45</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="h-2 w-2 rounded-full bg-orange-500" />
          <span>High: 46-70</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="h-2 w-2 rounded-full bg-red-500" />
          <span>Critical: 71-100</span>
        </div>
      </div>
    </div>
  );
}
