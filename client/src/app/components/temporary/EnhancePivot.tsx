'use client';

import { motion } from 'motion/react';
import { ArrowRight, RefreshCcw, Sparkles, Rocket, AlertTriangle, XCircle } from 'lucide-react';

interface RescueOption {
    title: string;
    description: string;
    ai_suggested_prompt: string;
}

interface RescuePlan {
    improve: RescueOption;
    pivot: RescueOption;
}

interface EnhancePivotProps {
    onEnhance: (prompt: string) => void;
    onPivot: (prompt: string) => void;
    onRetry: () => void;
    onProceed: () => void; // For high scores
    score?: number;
    rescuePlan?: RescuePlan;
}

export default function EnhancePivot({
    onEnhance,
    onPivot,
    onRetry,
    onProceed,
    score = 58, // Default to the "Pivot/Enhance" range for demo
    rescuePlan
}: EnhancePivotProps) {

    // Determine state based on score
    const isKill = score < 50;
    const isPivot = score >= 50 && score < 70;
    const isBuild = score >= 70 && score < 90;
    const isUnicorn = score >= 90;

    const getScoreColor = (s: number) => {
        if (s < 50) return 'text-red-500';
        if (s < 70) return 'text-yellow-500';
        if (s < 90) return 'text-green-500';
        return 'text-purple-500';
    };

    const getScoreLabel = (s: number) => {
        if (s < 50) return 'Kill';
        if (s < 70) return 'Pivot';
        if (s < 90) return 'Build';
        return 'Unicorn';
    };

    const getRationale = (s: number) => {
        if (s < 50) return "Fatal flaws detected (Zero TAM, saturated market, no clear problem).";
        if (s < 70) return "Good core, but weak execution/market. Ask user to refine prompt before building.";
        if (s < 90) return "Solid fundamentals. Worth the API cost to generate MVP specs.";
        return "Exceptional opportunity. High urgency.";
    };

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="w-full max-w-6xl bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">

                {/* Left Panel: Score & Analysis */}
                <div className="w-full md:w-1/3 p-6 border-b md:border-b-0 md:border-r border-neutral-800 bg-neutral-900/50 flex flex-col">
                    <div className="mb-8">
                        <h3 className="text-neutral-400 text-sm font-medium uppercase tracking-wider mb-2">Verdyct Score</h3>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-6xl font-bold ${getScoreColor(score)}`}>{score}</span>
                            <span className="text-neutral-500 text-xl">/ 100</span>
                        </div>
                        <p className={`mt-2 text-lg font-bold ${getScoreColor(score)}`}>
                            {getScoreLabel(score)}
                        </p>
                        <p className="mt-1 text-sm text-neutral-400">
                            {getRationale(score)}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                Analysis & Risks
                            </h4>
                            <ul className="space-y-2 text-sm text-neutral-400">
                                {isKill ? (
                                    <>
                                        <li className="flex gap-2">
                                            <span className="text-red-500">•</span>
                                            <span>Total Addressable Market (TAM) appears negligible.</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-red-500">•</span>
                                            <span>Legal/Regulatory barriers are insurmountable for an MVP.</span>
                                        </li>
                                    </>
                                ) : isPivot ? (
                                    <>
                                        <li className="flex gap-2">
                                            <span className="text-yellow-500">•</span>
                                            <span>Market Saturation: High. 15+ direct competitors identified.</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-yellow-500">•</span>
                                            <span>Differentiation: Low. Core features overlap 90% with market leaders.</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-yellow-500">•</span>
                                            <span>Acquisition Cost: Estimated CAC &gt; $50, unsustainable for this model.</span>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li className="flex gap-2">
                                            <span className="text-green-500">•</span>
                                            <span>Strong founder-market fit potential.</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-green-500">•</span>
                                            <span>Clear path to initial revenue.</span>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Actions */}
                <div className="w-full md:w-2/3 p-6 bg-black/20 flex flex-col overflow-y-auto">
                    <h2 className="text-2xl font-bold text-white mb-6">Recommended Actions</h2>

                    {isKill ? (
                        <div className="flex flex-col items-center justify-center flex-1 text-center">
                            <h3 className="text-2xl text-white font-light tracking-tight mb-2">Hard Stop</h3>
                            <p className="text-neutral-400 max-w-md mb-8 font-light">
                                The analysis suggests this idea has fundamental flaws. We recommend exploring other opportunities.
                            </p>
                            <button
                                onClick={onRetry}
                                className="px-6 py-3 bg-white text-black rounded-full text-sm font-medium hover:bg-neutral-200 transition-colors flex items-center gap-2"
                            >
                                <RefreshCcw className="w-4 h-4" />
                                Try Another Idea
                            </button>
                        </div>
                    ) : (isBuild || isUnicorn) ? (
                        <div className="flex flex-col items-center justify-center flex-1 text-center">
                            <div className="mb-6 relative">
                                <div className="absolute inset-0 bg-primary-red/20 blur-2xl rounded-full" />
                                <h3 className="text-4xl md:text-5xl text-white font-bold tracking-tighter relative z-10">
                                    {isUnicorn ? 'Unicorn Potential' : 'Ready to Build'}
                                </h3>
                            </div>

                            <p className="text-neutral-400 max-w-md mb-10 text-lg font-light leading-relaxed">
                                {isUnicorn
                                    ? "Exceptional metrics detected. Immediate execution is strongly recommended."
                                    : "Fundamentals are solid. You are cleared to generate the MVP architecture."}
                            </p>

                            <button
                                onClick={onProceed}
                                className={`px-10 py-4 text-white rounded-full font-medium text-lg transition-all transform hover:scale-105 shadow-2xl flex items-center gap-3 ${isUnicorn ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-900/20' : 'bg-primary-red hover:bg-red-700 shadow-red-900/20'
                                    }`}
                            >
                                Start Architect Agent
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        /* Pivot / Enhance Options (Score 50-69) */
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                            {/* Option 1: Enhance */}
                            <div className="group relative p-5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-primary-red/50 transition-all duration-300 flex flex-col">
                                <div className="absolute top-4 right-4 px-2 py-1 rounded text-xs font-medium bg-neutral-800 text-neutral-300">
                                    Option 1
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1 mt-1">Enhance</h3>
                                <p className="text-neutral-400 text-sm mb-4">
                                    {rescuePlan?.improve.description || "Keep the core idea but refine the feature set to target a specific vertical."}
                                </p>

                                <div className="space-y-2 flex-grow">
                                    <button
                                        onClick={() => onEnhance(rescuePlan?.improve.ai_suggested_prompt || "")}
                                        className="w-full text-left text-xs text-neutral-300 bg-neutral-800/50 hover:bg-neutral-800 p-2.5 rounded-lg transition-colors"
                                    >
                                        {rescuePlan?.improve.ai_suggested_prompt || "Refine idea..."}
                                    </button>
                                </div>
                            </div>

                            {/* Option 2: Pivot (Recommended) */}
                            <div className="group relative p-5 rounded-2xl bg-neutral-900 border border-primary-red shadow-[0_0_20px_rgba(220,38,38,0.1)] transition-all duration-300 flex flex-col">
                                <div className="absolute top-4 right-4 px-2 py-1 rounded text-xs font-medium bg-primary-red text-white">
                                    Recommended
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1 mt-1">Pivot</h3>
                                <p className="text-neutral-400 text-sm mb-4">
                                    {rescuePlan?.pivot.description || "Shift direction to a related problem space with higher demand."}
                                </p>

                                <div className="space-y-2 mb-5 flex-grow">
                                    <div className="text-sm text-neutral-300 bg-neutral-800/50 p-3 rounded-lg">
                                        {rescuePlan?.pivot.ai_suggested_prompt || "Pivot idea..."}
                                    </div>
                                </div>

                                <button
                                    onClick={() => onPivot(rescuePlan?.pivot.ai_suggested_prompt || "")}
                                    className="w-full py-2.5 rounded-xl bg-primary-red text-white font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    Pivot to This Idea
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div >
    );
}