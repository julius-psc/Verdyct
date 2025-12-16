'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Eye, Hammer, TrendingUp, Gavel, LucideIcon, CheckCircle, AlertCircle } from 'lucide-react';
import LabyrinthLoader from './LabyrinthLoader';

// --- CONSTANTS ---
const EXPECTED_DURATION_MS = 3000; // Time to reach ~90%
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
  isBackendComplete: boolean; // True if the agent is actually done in backend
  onVisualComplete: () => void; // Called when animation hits 100%
  isError?: boolean;
}

function ActiveAgentView({ icon: Icon, title, description, isBackendComplete, onVisualComplete, isError }: ActiveAgentProps) {
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, [title]); // Reset start time when agent changes

  useEffect(() => {
    if (isError) {
      setProgress(100);
      return;
    }

    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current;

      let target = 0;

      if (isBackendComplete) {
        // If complete, we accelerate to 100%
        target = 100;
      } else {
        // If not complete, we approach 90% asymptotically
        const p = Math.min((elapsed / EXPECTED_DURATION_MS) * 90, 90);
        target = p;
      }

      // Smooth interpolation towards target
      setProgress(prev => {
        const diff = target - prev;
        // If backend is complete, move fast. If not, normal speed.
        const speed = isBackendComplete ? 2.5 : 0.5; // speed factor
        const next = prev + diff * (speed * 0.1);

        // If we represent 100%, trigger complete
        if (next >= 99.5) {
          return 100;
        }
        return next;
      });
    };

    const interval = setInterval(updateProgress, 16); // ~60fps

    return () => clearInterval(interval);
  }, [isBackendComplete, isError]);

  // Trigger callback when we hit 100
  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        onVisualComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, onVisualComplete]);

  return (
    <motion.div
      className={`relative w-full max-w-5xl overflow-hidden bg-[#121212] rounded-3xl border ${isError ? 'border-red-500' : 'border-primary-red/30'} shadow-2xl`}
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -30 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      layout
    >
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[300px]">
        {/* Left Column: Info & Status */}
        <div className="md:col-span-4 p-8 bg-neutral-900/50 border-r border-white/5 flex flex-col justify-between backdrop-blur-sm">
          <div>
            <div className="flex items-center gap-4 mb-6">
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
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <span className={`text-xs font-bold uppercase tracking-widest ${isError ? 'text-red-500' : 'text-primary-red'}`}>
                  {isError ? 'Error Detected' : 'Active Agent'}
                </span>
              </div>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed">
              {description}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-neutral-500 text-xs uppercase font-medium">Status</span>
              <span className={`text-sm font-medium ${isError ? 'text-red-400' : 'text-white'}`}>
                {isError ? 'INTERVENTION' : (isBackendComplete ? 'FINALIZING...' : 'PROCESSING...')}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Labyrinth Loader */}
        <div className="md:col-span-8 relative bg-black/40 flex items-center justify-center p-8">
          {/* Background Glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 blur-[80px] opacity-20"
            style={{ backgroundColor: isError ? '#ef4444' : 'var(--color-primary-red)' }}
            aria-hidden="true"
          />

          <div className="w-full relative z-10">
            <LabyrinthLoader
              progress={progress}
              isComplete={progress >= 100}
              isError={isError}
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
  isLoading?: boolean;
  status?: string; // 'approved' | 'rejected'
}

export default function LoadingModal({ onComplete, isLoading = false, status }: LoadingModalProps) {
  const [step, setStep] = useState(0);
  const [completedAgents, setCompletedAgents] = useState<Set<string>>(new Set());

  // Agents order: Analyst (0), Spy (1), Architect (2), Financier (3)
  const agentOrder = ['analyst', 'spy', 'architect', 'financier'];

  const agents = [
    {
      id: 'analyst',
      icon: PieChart,
      title: 'The Analyst',
      description: 'Processing market data and identifying key trends to build a foundational understanding.',
    },
    {
      id: 'spy',
      icon: Eye,
      title: 'The Spy',
      description: 'Scanning the competitive landscape for vulnerabilities and opportunities to exploit.',
    },
    {
      id: 'architect',
      icon: Hammer,
      title: 'The Architect',
      description: 'Generating a functional MVP blueprint and deploying a testable landing page.',
    },
    {
      id: 'financier',
      icon: TrendingUp,
      title: 'The Financier',
      description: 'Analyzing financial projections and revenue models to ensure sustainable growth.',
    },
    {
      // Dummy step for "Verdyct" final screen (step 4)
      id: 'verdyct',
      icon: Gavel,
      title: 'The Verdyct',
      description: 'Consolidating all findings from the agents. Your comprehensive report is now ready.',
    },
  ];

  // Listen for agent-complete events
  useEffect(() => {
    const handleAgentComplete = (e: CustomEvent) => {
      const agentName = e.detail;
      console.log("Agent complete event received:", agentName);
      setCompletedAgents(prev => {
        const newSet = new Set(prev);
        newSet.add(agentName);
        return newSet;
      });
    };

    window.addEventListener('agent-complete' as any, handleAgentComplete);
    return () => {
      window.removeEventListener('agent-complete' as any, handleAgentComplete);
    };
  }, []);

  // Handle final completion (or rejection)
  useEffect(() => {
    if (status === 'rejected' && !isLoading) {
      const timer = setTimeout(() => onComplete && onComplete(), 1000);
      return () => clearTimeout(timer);
    }
  }, [status, isLoading, onComplete]);


  // Helper to determine if the *current* step's agent is done in backend
  const currentAgentId = step < 4 ? agents[step].id : 'verdyct';
  const isCurrentBackendComplete = !isLoading || (step < 4 && completedAgents.has(currentAgentId));

  const handleVisualComplete = () => {
    if (step < agents.length - 1) {
      setStep(s => s + 1);
    } else {
      if (onComplete) onComplete();
    }
  };

  const getAgentStatus = (index: number): 'RUNNING' | 'QUEUED' | 'COMPLETE' => {
    if (step === index) return 'RUNNING';
    if (step > index) return 'COMPLETE';
    return 'QUEUED';
  };

  const currentAgent = agents[Math.min(step, agents.length - 1)];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black/80 backdrop-blur-md p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative z-10 flex flex-col items-center justify-center max-w-5xl mx-auto w-full min-h-screen md:min-h-0 py-10">
        <div className="w-full">
          <AnimatePresence mode="wait">
            {step < 4 ? (
              <ActiveAgentView
                key={step}
                icon={currentAgent.icon}
                title={currentAgent.title}
                description={currentAgent.description}
                isBackendComplete={isCurrentBackendComplete}
                onVisualComplete={handleVisualComplete}
                isError={status === 'rejected' && step === 0 && !isLoading}
              />
            ) : (
              <motion.div
                key="final"
                className="relative w-full max-w-2xl mx-auto overflow-hidden bg-neutral-900 rounded-2xl p-8 border border-primary-red/30 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                onAnimationComplete={() => {
                  setTimeout(() => {
                    if (onComplete) onComplete();
                  }, FINAL_SCREEN_DURATION_MS);
                }}
              >
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 blur-[60px] opacity-50"
                  style={{ backgroundColor: 'var(--color-primary-red)', opacity: 0.2 }}
                  aria-hidden="true"
                />
                <div className="relative z-10 flex flex-col items-center">
                  <motion.div
                    className="inline-flex p-4 rounded-full bg-primary-red/10 mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                  >
                    <CheckCircle className="w-12 h-12 text-primary-red" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Verdyct Complete
                  </h2>
                  <p className="text-neutral-300 text-lg">
                    Your full report is ready. Redirecting...
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className="mt-6 flex flex-wrap justify-center gap-3 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <AnimatePresence>
              {agents.slice(0, 4).map((agent, index) => {
                const status = getAgentStatus(index);
                if (status !== 'COMPLETE') return null;
                return (
                  <div key={index} className="w-full sm:w-auto sm:min-w-[200px]">
                    <CompactAgentCard
                      icon={agent.icon}
                      title={agent.title}
                      status={status}
                      onClick={() => { }}
                    />
                  </div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}