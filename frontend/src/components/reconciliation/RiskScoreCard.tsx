"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RISK_COLORS } from "@/lib/constants";
import type { RiskLevel } from "@/lib/types";

interface RiskScoreCardProps {
  score: number;
  level: RiskLevel;
}

export default function RiskScoreCard({ score, level }: RiskScoreCardProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const colors = RISK_COLORS[level];
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 200);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
      className={`flex flex-col items-center rounded-xl border p-6 ${colors.bg} ${colors.border}`}
    >
      <p className="mb-3 text-sm font-medium text-muted-foreground">
        Risk Score
      </p>
      <div className="relative h-32 w-32">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted/30"
          />
          <motion.circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={colors.hex}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`text-3xl font-bold ${colors.text}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Math.round(animatedScore)}
          </motion.span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            / 100
          </span>
        </div>
      </div>
      <div
        className={`mt-3 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider ${colors.bg} ${colors.text}`}
      >
        {level}
      </div>
    </motion.div>
  );
}
