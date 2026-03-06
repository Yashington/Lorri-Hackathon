"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain } from "lucide-react";

const steps = [
  "Analyzing Lorry Receipt...",
  "Extracting fields from POD...",
  "Processing Invoice data...",
  "Running 3-way reconciliation...",
  "Calculating risk scores...",
  "Generating audit report...",
];

export default function ProcessingAnimation() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-8 py-16">
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative"
      >
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
          <Brain className="h-12 w-12 text-primary" />
        </div>
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/30"
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/20"
          animate={{ scale: [1, 2], opacity: [0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
        />
      </motion.div>

      <div className="text-center">
        <h3 className="mb-4 text-lg font-semibold">
          AI Processing Documents
        </h3>
        <AnimatePresence mode="wait">
          <motion.p
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-muted-foreground"
          >
            {steps[currentStep]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="flex gap-2">
        {steps.map((_, i) => (
          <motion.div
            key={i}
            className={`h-2 w-2 rounded-full ${
              i <= currentStep ? "bg-primary" : "bg-muted"
            }`}
            animate={i === currentStep ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.5 }}
          />
        ))}
      </div>
    </div>
  );
}
