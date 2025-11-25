'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Eye, Hammer, TrendingUp, Gavel, LucideIcon, CheckCircle, AlertCircle } from 'lucide-react';

// --- CONSTANTS ---
const STEP_DURATION_MS = 3000; // 3 seconds per agent
const TOTAL_AGENTS = 5;
const FINAL_SCREEN_DURATION_MS = 2000;

// --- Compact Agent Card ---
interface CompactAgentCardProps {
  icon: LucideIcon;
  title: string;
  status: 'QUEUED' | 'COMPLETE';
  onClick: () => void;
}

function CompactAgentCard({ icon: Icon, title, status, onClick }: CompactAgentCardProps) {
  const isComplete = status === 'COMPLETE';

  return (
    <motion.button
      onClick={onClick}
      className="relative w-full overflow-hidden transition-colors bg-neutral-900 rounded-lg p-4 border border-neutral-800 hover:bg-neutral-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isComplete ? 1 : 0.4, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      layout
    >
      <div className="flex items-center gap-4">
        <div
          className={`shrink-0 p-2 rounded-lg ${isComplete ? 'bg-primary-red/10' : 'bg-neutral-800'
            }`}
        >
          <Icon
            className={`w-5 h-5 ${isComplete ? 'text-primary-red' : 'text-neutral-500'
              }`}
          />
        </div>
        <span
          className={`text-sm font-medium ${isComplete ? 'text-neutral-100' : 'text-neutral-500'
            }`}
        >
          {title}
        </span>
        <div className="grow" />
        <div
          className={`text-xs px-2.5 py-1 rounded-full ${isComplete
              ? 'bg-primary-red/10 text-primary-red'
              : 'bg-neutral-800 text-neutral-500'
            }`}
        >
          {isComplete ? 'Complete' : 'Queued'}
        </div>
      </div>
    </motion.button>
  );
}

// --- Expanded Active Agent View ---
interface ActiveAgentProps {
  icon: LucideIcon;
  title: string;
  description: string;
  duration: number;
  isError?: boolean; // New prop for error state
}

function ActiveAgentView({ icon: Icon, title, description, duration, isError }: ActiveAgentProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isError) {
      setProgress(100); // Jump to full if error/interrupted
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
      }
    }, 33);

    return () => clearInterval(interval);
  }, [duration, isError]);

  return (
    <motion.div
      className={`relative w-full overflow-hidden bg-neutral-900 rounded-2xl p-6 lg:p-8 border ${isError ? 'border-red-500' : 'border-primary-red/30'}`}
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -30 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      layout
    >
      {/* Background Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 blur-[60px] opacity-50"
        style={{ backgroundColor: isError ? '#ef4444' : 'var(--color-primary-red)', opacity: 0.2 }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <motion.div
              className={`inline-flex p-3 rounded-xl ${isError ? 'bg-red-500/10' : 'bg-primary-red/10'}`}
              animate={isError ? { scale: 1 } : { scale: [1, 1.05, 1] }}
              transition={isError ? {} : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {isError ? (
                <AlertCircle className="w-8 h-8 text-red-500" />
              ) : (
                <Icon className="w-8 h-8 text-primary-red" />
              )}
            </motion.div>
            <div>
              <motion.h2
                className="text-2xl font-bold text-white"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {isError ? 'Intervention Needed' : title}
              </motion.h2>
              <motion.p
                className={`text-sm font-medium ${isError ? 'text-red-400' : 'text-primary-red/80'}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {isError ? 'Analysis paused' : 'Agent is now active...'}
              </motion.p>
            </div>
          </div>
        </div>

        <motion.p
          className="text-neutral-300 text-base mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {isError ? 'Potential issues detected in the initial analysis. User input required to proceed.' : description}
        </motion.p>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="relative h-3 bg-neutral-800/50 rounded-full overflow-hidden backdrop-blur-sm">
            {!isError && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            )}

            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: isError
                  ? 'linear-gradient(90deg, #ef4444 0%, #b91c1c 100%)'
                  : `linear-gradient(90deg, var(--color-primary-red) 0%, rgba(220, 38, 38, 0.8) 100%)`,
                boxShadow: isError ? '0 0 20px rgba(239, 68, 68, 0.5)' : '0 0 20px rgba(220, 38, 38, 0.5)',
              }}
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- Main Loading Modal Component ---
interface LoadingModalProps {
  onComplete?: () => void;
  stopAfterStep?: number;
  initialStep?: number;
}

export default function LoadingModal({ onComplete, stopAfterStep, initialStep = 0 }: LoadingModalProps) {
  const [step, setStep] = useState(initialStep);
  const [showError, setShowError] = useState(false);

  const agents = [
    {
      icon: PieChart,
      title: 'The Analyst',
      description: 'Processing market data and identifying key trends to build a foundational understanding.',
    },
    {
      icon: Eye,
      title: 'The Spy',
      description: 'Scanning the competitive landscape for vulnerabilities and opportunities to exploit.',
    },
    {
      icon: Hammer,
      title: 'The Architect',
      description: 'Generating a functional MVP blueprint and deploying a testable landing page.',
    },
    {
      icon: TrendingUp,
      title: 'The Financier',
      description: 'Analyzing financial projections and revenue models to ensure sustainable growth.',
    },
    {
      icon: Gavel,
      title: 'The Verdyct',
      description: 'Consolidating all findings from the agents. Your comprehensive report is now ready.',
    },
  ];

  useEffect(() => {
    // If we've reached the total agents, wait and complete
    if (step >= TOTAL_AGENTS) {
      const finalTimer = setTimeout(() => {
        if (onComplete) onComplete();
      }, FINAL_SCREEN_DURATION_MS);
      return () => clearTimeout(finalTimer);
    }

    // Check if we should stop after the current step
    if (stopAfterStep !== undefined && step === stopAfterStep) {
      const stepTimer = setTimeout(() => {
        // Instead of completing immediately, show error state first
        setShowError(true);

        // Wait a bit in the error state before actually completing/closing
        const errorTimer = setTimeout(() => {
          if (onComplete) onComplete();
        }, 2000); // Show error for 2 seconds

        return () => clearTimeout(errorTimer);
      }, STEP_DURATION_MS);
      return () => clearTimeout(stepTimer);
    }

    // Normal progression
    const stepTimer = setTimeout(() => {
      setStep((s) => s + 1);
    }, STEP_DURATION_MS);

    return () => clearTimeout(stepTimer);
  }, [step, onComplete, stopAfterStep]);

  const getAgentStatus = (index: number): 'RUNNING' | 'QUEUED' | 'COMPLETE' => {
    if (step === index) return 'RUNNING';
    if (step > index) return 'COMPLETE';
    return 'QUEUED';
  };

  const currentAgent = agents[Math.min(step, agents.length - 1)];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/80 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative z-10 flex flex-col items-center justify-center p-4 max-w-xl mx-auto w-full">
        <div className="w-full">
          <AnimatePresence mode="wait">
            {step < TOTAL_AGENTS ? (
              <ActiveAgentView
                key={step}
                icon={currentAgent.icon}
                title={currentAgent.title}
                description={currentAgent.description}
                duration={STEP_DURATION_MS}
                isError={showError}
              />
            ) : (
              <motion.div
                className="relative w-full overflow-hidden bg-neutral-900 rounded-2xl p-6 lg:p-8 border border-primary-red/30"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 blur-[60px] opacity-50"
                  style={{ backgroundColor: 'var(--color-primary-red)', opacity: 0.2 }}
                  aria-hidden="true"
                />
                <div className="relative z-10 text-center">
                  <motion.div
                    className="inline-flex p-3 rounded-xl bg-primary-red/10 mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                  >
                    <CheckCircle className="w-8 h-8 text-primary-red" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Verdyct Complete
                  </h2>
                  <p className="text-neutral-300 text-base">
                    Your full report is ready. Redirecting...
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className="mt-4 space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <AnimatePresence>
              {agents.map((agent, index) => {
                const status = getAgentStatus(index);
                if (status !== 'COMPLETE') return null;
                return (
                  <CompactAgentCard
                    key={index}
                    icon={agent.icon}
                    title={agent.title}
                    status={status}
                    onClick={() => { }}
                  />
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}