import React from 'react';
import { ShieldCheck, TrendingUp, AlertTriangle, Zap, Skull } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerdyctCardProps {
    score: number;
    level: string;
    projectName: string;
    summary?: string; // We might ignore this in V2 for the roast
    mini?: boolean;
}

export const getCardTheme = (s: number) => {
    if (s >= 70) return {
        // High Score: Dark Mode + Neon Green/Gold
        bg: "bg-black",
        gradient: "from-emerald-900/50 via-black to-black",
        accent: "text-emerald-400",
        border: "border-emerald-500",
        glow: "shadow-[0_0_50px_-12px_rgba(16,185,129,0.5)]",
        text: "text-emerald-100",
        icon: Zap,
        stamp: "GOLD MINE 🚀",
        stampColor: "text-emerald-300 border-emerald-300", // Brighter for overlay
        stampRotate: "-rotate-12",
        stampBlend: "mix-blend-overlay",
    };
    if (s >= 40) return {
        // Medium Score: Dark Mode + Neon Orange
        bg: "bg-black",
        gradient: "from-orange-900/40 via-black to-black",
        accent: "text-orange-400",
        border: "border-orange-500",
        glow: "shadow-[0_0_50px_-12px_rgba(249,115,22,0.4)]",
        text: "text-orange-100",
        icon: TrendingUp,
        stamp: "MEH 🤷‍♂️",
        stampColor: "text-orange-300 border-orange-300",
        stampRotate: "rotate-6",
        stampBlend: "mix-blend-hard-light",
    };
    return {
        // Low Score: Danger Red
        bg: "bg-black",
        gradient: "from-red-900/60 via-black to-black",
        accent: "text-red-500",
        border: "border-red-600",
        glow: "shadow-[0_0_60px_-12px_rgba(220,38,38,0.6)]",
        text: "text-red-100",
        icon: Skull,
        stamp: "CERTIFIED P.O.S 💩",
        stampColor: "text-red-600 border-red-600", // Keeping it red
        stampRotate: "rotate-12",
        stampBlend: "mix-blend-hard-light", // Hard light works better on dark to interact with the red score
    };
};

export const getCardPunchline = (s: number) => {
    if (s >= 90) return "Bezos is already drafting the acquisition offer. Don't sell cheap.";
    if (s >= 75) return "Even Amazon is sweating right now. Build this before it gets stolen.";
    if (s >= 60) return "Solid bones. Needs some steroids, but you might have something here.";
    if (s >= 40) return "It's like pizza with pineapple. Some people like it, most will hate it.";
    if (s >= 20) return "I've seen better business plans written on a napkin at 3 AM.";
    return "My GPU wasted perfectly good electricity analyzing this disaster.";
};

export const VerdyctCard = React.forwardRef<HTMLDivElement, VerdyctCardProps>(({ score, level, projectName, summary, mini = false }, ref) => {

    // V2 Logic: Themes, Stamps, Punchlines

    const theme = getCardTheme(score);
    const punchline = getCardPunchline(score);
    const Icon = theme.icon;

    return (
        <div
            ref={ref}
            className={cn(
                "w-[400px] h-[640px] relative overflow-hidden flex flex-col items-center justify-between text-white font-sans rounded-[32px]",
                theme.bg,
                mini ? "scale-50 origin-top-left" : ""
            )}
        >
            {/* Background Gradient Mesh - Minimalist */}
            <div className={cn("absolute inset-0 bg-gradient-to-b opacity-80", theme.gradient)} />

            {/* Subtle Vignette instead of Noise */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-10 flex flex-col items-center justify-between w-full h-full p-8 text-center">

                {/* Header */}
                <div className="w-full flex justify-between items-end border-b border-white/10 pb-4">
                    <div className="text-left">
                        <span className="font-black tracking-widest text-xs text-neutral-500 block mb-1">EVALUATION</span>
                        <div className="flex items-center gap-2">
                            <span className="font-bold tracking-tighter text-lg text-white">VERDYCT.AI</span>
                        </div>
                    </div>
                    <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest">{new Date().toLocaleDateString()}</span>
                </div>

                {/* Main Content Center */}
                <div className="flex-1 flex flex-col items-center justify-center w-full relative">

                    {/* Project Name */}
                    <div className="mb-8 w-full flex justify-center">
                        <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none break-words line-clamp-2 px-2 text-center" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                            {projectName}
                        </h1>
                    </div>

                    {/* Score Display */}
                    <div className="relative mb-8">
                        {/* Glow behind score */}
                        <div className={cn("absolute inset-0 rounded-full blur-[40px] opacity-40", theme.accent.replace('text-', 'bg-'))} />

                        <div className="flex flex-col items-center relative z-10">
                            <span className={cn("text-9xl font-black tracking-tighter", theme.accent)} style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                                {score}
                            </span>
                            <div className={cn("px-3 py-1 bg-white/5 border border-white/10 rounded uppercase tracking-widest whitespace-nowrap text-[10px] font-bold mt-2", theme.text)}>
                                POS SCORE
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Punchline */}
                <div className="w-full pt-6 border-t border-white/10">
                    <p className={cn("text-xl font-bold leading-tight text-center italic", theme.text)}>
                        "{punchline}"
                    </p>

                    {/* Level small print */}
                    <p className="text-[10px] text-center text-neutral-600 mt-4 uppercase tracking-widest">
                        Class: {level}
                    </p>
                </div>

            </div>

            {/* Border Glow - Fixed corner clipping */}
            <div className={cn("absolute inset-0 border-[6px] opacity-50 pointer-events-none rounded-[32px]", theme.border)} />
        </div>
    );
});

VerdyctCard.displayName = "VerdyctCard";
