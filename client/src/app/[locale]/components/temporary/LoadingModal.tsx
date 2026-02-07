import { useRouter } from '@/i18n/routing';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Eye, Hammer, TrendingUp, Gavel, LucideIcon, CheckCircle, AlertCircle } from 'lucide-react';
import LabyrinthLoader from './LabyrinthLoader';
import { useTranslations } from 'next-intl';

// --- CONSTANTS ---
const EXPECTED_DURATION_MS = 8000; // Increased to be slower
const FINAL_SCREEN_DURATION_MS = 2000;

// --- Simulated Log Component ---
function SimulatedLog({ step }: { step: number }) {
  const [logIndex, setLogIndex] = useState(0);

  const logs = {
    0: ["Scanning market data...", "Analyzing competitors...", "Identifying target audience...", "Evaluating market size...", "Checking trends..."], // Analyst
    1: ["Infiltrating competitor sites...", "Checking pricing models...", "Analyzing ad strategies...", "Reviewing customer feedback...", "Detecting weaknesses..."], // Spy
    2: ["Designing MVP features...", "Structuring database...", "Planning API endpoints...", "Drafting UI/UX flows...", "Selecting tech stack..."], // Architect
    3: ["Calculating burn rate...", "Projecting revenue...", "Estimating server costs...", "Analyzing break-even point...", "Optimizing budget..."], // Financier
    4: ["Finalizing report...", "Generating PDF...", "Saving project...", "Cleaning up..."]
  };

  const currentLogs = logs[step as keyof typeof logs] || logs[0];

  useEffect(() => {
    setLogIndex(0);
    const interval = setInterval(() => {
      setLogIndex(prev => (prev + 1) % currentLogs.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [step]);

  return (
    <div className="h-6 overflow-hidden flex justify-center">
      <motion.p
        key={`${step}-${logIndex}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-neutral-400 text-xs font-mono tracking-wide"
      >
        {">"} {currentLogs[logIndex]}
      </motion.p>
    </div>
  );
}

// --- Compact Agent Card ---
interface CompactAgentCardProps {
  icon: LucideIcon;
  title: string;
  status: 'QUEUED' | 'COMPLETE';
  onClick: () => void;
  t: any;
}

function CompactAgentCard({ icon: Icon, title, status, onClick, t }: CompactAgentCardProps) {
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
          {isComplete ? t('complete') : t('queued')}
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
  estimatedTime: string;
  t: any;
  step: number;
  onClose: () => void;
}

function ActiveAgentView({ icon: Icon, title, description, isBackendComplete, onVisualComplete, isError, estimatedTime, t, step, onClose }: ActiveAgentProps) {
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
      {/* Close Button (Cross) Inside Modal */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-20 p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
        title="Run in background"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

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
                  {isError ? t('errorDetected') : t('activeAgent')}
                </span>
              </div>
            </div>
            {/* Dynamic Logs Replacing/Overlaying Description */}
            <div className="min-h-[60px] flex flex-col justify-center">
              <p className="text-neutral-400 text-sm leading-relaxed mb-4 opacity-70 line-clamp-2">
                {description}
              </p>
              <div className="p-3 bg-black/40 rounded-lg border border-white/5">
                <SimulatedLog step={step} />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-neutral-500 text-xs uppercase font-medium">Status</span>
              <span className={`text-sm font-medium ${isError ? 'text-red-400' : 'text-white'}`}>
                {isError ? 'INTERVENTION' : (isBackendComplete ? t('finalizing') : t('processing'))}
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

          <div className="w-full relative z-10 flex flex-col items-center gap-6">
            <LabyrinthLoader
              progress={progress}
              isComplete={progress >= 100}
              isError={isError}
            />

            {/* Estimated Time Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary-red animate-pulse" />
              <span className="text-xs font-mono text-neutral-400">
                EST. TIME: {estimatedTime}
              </span>
            </motion.div>
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
  const t = useTranslations('LoadingModal');
  const [step, setStep] = useState(0);
  const [completedAgents, setCompletedAgents] = useState<Set<string>>(new Set());
  const router = useRouter();

  // Agents order: Analyst (0), Spy (1), Architect (2), Financier (3)
  const agentOrder = ['analyst', 'spy', 'architect', 'financier'];

  const agents = [
    {
      id: 'analyst',
      icon: PieChart,
      title: t('analystTitle'),
      description: t('analystDesc'),
    },
    {
      id: 'spy',
      icon: Eye,
      title: t('spyTitle'),
      description: t('spyDesc'),
    },
    {
      id: 'architect',
      icon: Hammer,
      title: t('architectTitle'),
      description: t('architectDesc'),
    },
    {
      id: 'financier',
      icon: TrendingUp,
      title: t('financierTitle'),
      description: t('financierDesc'),
    },
    {
      // Dummy step for "Verdyct" final screen (step 4)
      id: 'verdyct',
      icon: Gavel,
      title: t('verdyctTitle'),
      description: t('verdyctDesc'),
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

  // Determine if the current step's agent is effectively "done"
  // This logic manages the visual flow based on the backend status
  const isCurrentBackendComplete = (() => {
    if (!status) return !isLoading; // Fallback

    // Step 0: Analyst
    if (step === 0) {
      return ['agents_working', 'finalizing', 'approved', 'rejected'].includes(status);
    }

    // Step 1: Spy (Parallel Agent 1)
    if (step === 1) {
      // If we are finalizing/approved, definitely done.
      if (['finalizing', 'approved'].includes(status)) return true;
      // If agents are working, we simulate completion after a delay to show next agent
      // This is handled by the ActiveAgentView's natural progression + auto-advance?
      // ActiveAgentView stalls at 90% if this is false.
      // So for Spy to finish visually during 'agents_working', we must return TRUE here.
      // But we only want to return true after it has been shown for a bit?
      // Actually, ActiveAgentView accelerates to 100% ONLY if this is true.
      // So we should return true if status is 'agents_working' ONLY if we want to skip to next.
      // Let's rely on the parent component or specific logic?
      // Simpler: If status is 'agents_working', we say Spy & Architect are "done" to let it flow to Financier?
      // But that might look too fast.
      // Let's return FALSE unless 'finalizing', but allow manual timeout override?
      // Better: Let's assume Spy and Architect are quick checks.
      // If status is 'agents_working', we allow them to proceed?
      // No, real parallel status would be better.
      // UX Decision: Stall on each agent for 2-3s then move?
      // The `isBackendComplete` prop drives the progress bar.
      // I'll make steps 1 & 2 return TRUE if status is 'agents_working' to treat them as "in progress but visually complete" so we can see the next one.
      // But `ActiveAgentView` only calls `onVisualComplete` (triggering next step) when it hits 100%.
      // If I return true, it goes to 100% fast.
      return ['agents_working', 'finalizing', 'approved'].includes(status);
    }

    // Step 2: Architect (Parallel Agent 2)
    if (step === 2) {
      // Same logic? But we need to stall somewhere.
      // If I set this to true, we race through Spy -> Architect -> Financier in like 1s each (due to speed-up).
      // That's fine! 3s total for agents.
      // But real analysis takes ~30s.
      // So 'agents_working' will stay true for 30s.
      // If I return true for Spy immediately, it finishes instantly.
      // I need a way to say "Start, run for X seconds, THEN finish".
      // ActiveAgentView handles "run for X seconds (EXPECTED_DURATION_MS)" and stalls at 90%.
      // It ONLY speeds up if isBackendComplete is true.
      // So if I return FALSE, it stalls at 90%.
      // I want Spy to finish (go to 100%) and move to Architect, even if backend is still 'agents_working'.
      // So I need a separate visual timer logic.
      // Hack: Using a ref to track when we stepped into this step?
      // Too complex for this replacement.
      // I will just stall Step 3 (Financier).
      // So Step 1 (Spy) and Step 2 (Architect) return TRUE if status is 'agents_working'?
      // Yes, this creates a specific flow: 
      // Analyst (Done) -> Spy (Zooms to 100%) -> Architect (Zooms to 100%) -> Financier (Stalls at 90%).
      // Result: User sees "Spy... Done! Architect... Done! Financier... Waiting..."
      // This assumes Spy/Arch are fast.
      // It's acceptable for "Evolutive info".
      return ['agents_working', 'finalizing', 'approved'].includes(status);
    }

    // Step 3: Financier (Final Parallel Agent)
    if (step === 3) {
      // This one MUST block until we are actually finalizing
      return ['finalizing', 'approved'].includes(status);
    }

    if (step === 4) { // Verdyct
      return status === 'approved';
    }

    return false;
  })();

  const handleVisualComplete = () => {
    // If Step 1 or 2 (Spy/Arch), we only advance if we have stayed for minimum time?
    // ActiveAgentView duration ensures at least some time passed unless we sped up.
    // Speedup only happens if isBackendComplete is true.
    // If we set isBackendComplete=true for Spy during 'agents_working', it finishes fast.
    // To prevent it being instantaneous, we can increase EXPECTED_DURATION_MS or handle speed factor?
    // Doing nothing is simplest.

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
                estimatedTime={step === 0 ? '~2m' : step === 1 ? '~3m' : step === 2 ? '~4m' : step === 3 ? '~5m' : 'Done'}
                t={t}
                step={step}
                onClose={() => router.push('/dashboard')}
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
                    {t('verdyctComplete')}
                  </h2>
                  <p className="text-neutral-300 text-lg">
                    {t('redirecting')}
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
                      t={t}
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