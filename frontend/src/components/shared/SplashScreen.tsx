"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, Scan, Shield } from "lucide-react";

// Pre-computed particle positions to avoid hydration mismatch from Math.random()
const PARTICLES = [
  { w: 4.2, h: 3.8, x: 12, y: 8, r: 130, g: 140, a: 0.3, dur: 4.2, del: 0.2 },
  { w: 3.1, h: 4.5, x: 28, y: 72, r: 160, g: 180, a: 0.25, dur: 5.1, del: 0.8 },
  { w: 5.0, h: 2.8, x: 45, y: 15, r: 120, g: 150, a: 0.35, dur: 3.8, del: 1.4 },
  { w: 2.5, h: 5.2, x: 67, y: 55, r: 180, g: 130, a: 0.28, dur: 4.6, del: 0.5 },
  { w: 3.8, h: 3.2, x: 82, y: 30, r: 140, g: 170, a: 0.32, dur: 5.5, del: 1.1 },
  { w: 4.6, h: 4.0, x: 5, y: 88, r: 110, g: 160, a: 0.22, dur: 3.5, del: 1.8 },
  { w: 2.8, h: 3.5, x: 55, y: 42, r: 170, g: 120, a: 0.4, dur: 4.0, del: 0.3 },
  { w: 5.5, h: 2.2, x: 90, y: 65, r: 150, g: 190, a: 0.27, dur: 5.8, del: 0.9 },
  { w: 3.4, h: 4.8, x: 35, y: 92, r: 190, g: 140, a: 0.33, dur: 4.4, del: 1.6 },
  { w: 4.0, h: 3.0, x: 72, y: 10, r: 125, g: 175, a: 0.38, dur: 3.2, del: 0.7 },
  { w: 2.2, h: 5.8, x: 18, y: 48, r: 165, g: 155, a: 0.24, dur: 5.3, del: 1.3 },
  { w: 5.2, h: 3.6, x: 60, y: 78, r: 145, g: 185, a: 0.36, dur: 4.8, del: 0.1 },
  { w: 3.6, h: 4.2, x: 40, y: 25, r: 175, g: 135, a: 0.29, dur: 3.6, del: 1.9 },
  { w: 4.8, h: 2.6, x: 95, y: 50, r: 135, g: 165, a: 0.42, dur: 5.0, del: 0.6 },
  { w: 2.6, h: 5.4, x: 8, y: 35, r: 155, g: 145, a: 0.26, dur: 4.2, del: 1.5 },
];

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 1800),
      setTimeout(() => onComplete(), 2800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0f0b1e 0%, #1a1145 40%, #0f172a 100%)",
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background particles - deterministic positions */}
      <div className="absolute inset-0 overflow-hidden">
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: p.w,
              height: p.h,
              left: `${p.x}%`,
              top: `${p.y}%`,
              background: `rgba(${p.r}, ${p.g}, 241, ${p.a})`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: p.dur,
              repeat: Infinity,
              delay: p.del,
            }}
          />
        ))}
      </div>

      {/* Radial glow */}
      <motion.div
        className="absolute h-[500px] w-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-2xl"
        >
          <Brain className="h-10 w-10 text-white" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-2 text-4xl font-extrabold tracking-tight text-white"
        >
          Recon<span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">AI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={phase >= 1 ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10 text-sm text-indigo-300/80"
        >
          Agentic Document Intelligence
        </motion.p>

        {/* Loading steps */}
        <div className="flex flex-col gap-3">
          {[
            { icon: Scan, label: "Initializing AI Engine", delay: 0 },
            { icon: Brain, label: "Loading Document Intelligence", delay: 1 },
            { icon: Shield, label: "Starting Risk Analysis", delay: 2 },
          ].map((step) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -20 }}
              animate={phase >= step.delay + 1 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-3"
            >
              <motion.div
                animate={phase >= step.delay + 1 ? { scale: [0.8, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  phase >= step.delay + 1
                    ? "bg-indigo-500/20 text-indigo-400"
                    : "bg-slate-800 text-slate-600"
                }`}
              >
                <step.icon className="h-4 w-4" />
              </motion.div>
              <span
                className={`text-sm font-medium transition-colors ${
                  phase >= step.delay + 1 ? "text-indigo-200" : "text-slate-600"
                }`}
              >
                {step.label}
              </span>
              {phase >= step.delay + 1 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-xs text-emerald-400"
                >
                  ✓
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={phase >= 1 ? { opacity: 1 } : {}}
          className="mt-8 h-1 w-48 overflow-hidden rounded-full bg-indigo-900/50"
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            initial={{ width: "0%" }}
            animate={{ width: `${Math.min(phase * 35, 100)}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
