'use client';

import { UploadCloud, TrendingUp, User, Briefcase, MapPin, Sparkles, Search, ShieldCheck } from 'lucide-react';
import Widget from '../dashboard/Widget';

export default function AnalystView() {
    return (
        <div className="max-w-[1600px] mx-auto p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1 text-white">The Analyst</h1>
                    <p className="text-sm text-neutral-400">Market analysis for: AI eLearning Captioning Tool</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white transition-colors">
                    <UploadCloud className="w-4 h-4" />
                    Export Report
                </button>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">

                {/* Main Visual - Market Score (2x2) */}
                <div className="lg:col-span-2 lg:row-span-2">
                    <Widget title="Market Viability" showGrid={true}>
                        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between h-full px-2 gap-6 xl:gap-0">
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                    <span className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tighter">Excellent</span>
                                    <span className="text-lg lg:text-xl text-emerald-500 font-medium">87/100</span>
                                </div>
                                <p className="text-sm text-neutral-400 mt-3 max-w-md leading-relaxed">
                                    <strong className="text-white">The Analyst&#39;s Verdyct:</strong> Strong market fundamentals, clear customer need, and exceptional growth potential make this an outstanding opportunity. Proceed with high confidence.
                                </p>
                            </div>
                            <div className="self-center xl:self-auto h-24 w-24 shrink-0 rounded-full border-4 border-emerald-500/20 flex items-center justify-center relative">
                                <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-l-transparent rotate-45"></div>
                                <ShieldCheck className="w-8 h-8 text-emerald-500" />
                            </div>
                        </div>
                    </Widget>
                </div>

                {/* Key Metrics Row 1 */}
                <div className="lg:col-span-1">
                    <Widget title="TAM">
                        <div className="flex flex-col justify-between h-full">
                            <div>
                                <div className="text-3xl font-semibold text-white">$1.2B</div>
                                <div className="flex items-center gap-1 text-sm text-emerald-500 mt-1">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>+5.1%</span>
                                </div>
                            </div>
                            <p className="text-xs text-neutral-500 mt-4">Total Addressable Market</p>
                        </div>
                    </Widget>
                </div>

                <div className="lg:col-span-1">
                    <Widget title="SAM">
                        <div className="flex flex-col justify-between h-full">
                            <div>
                                <div className="text-3xl font-semibold text-white">$450M</div>
                                <div className="flex items-center gap-1 text-sm text-emerald-500 mt-1">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>+7.3%</span>
                                </div>
                            </div>
                            <p className="text-xs text-neutral-500 mt-4">Serviceable Available Market</p>
                        </div>
                    </Widget>
                </div>

                {/* Key Metrics Row 2 */}
                <div className="lg:col-span-1">
                    <Widget title="CAGR">
                        <div className="flex flex-col justify-between h-full">
                            <div>
                                <div className="text-3xl font-semibold text-white">15.2%</div>
                                <div className="flex items-center gap-1 text-sm text-emerald-500 mt-1">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>+1.2%</span>
                                </div>
                            </div>
                            <p className="text-xs text-neutral-500 mt-4">Compound Annual Growth</p>
                        </div>
                    </Widget>
                </div>

                <div className="lg:col-span-1">
                    <Widget title="Opportunity">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-neutral-400">SEO Difficulty</span>
                                <span className="text-emerald-400 font-medium">Low</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-neutral-400">Search Vol</span>
                                <span className="text-white font-medium">High</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-neutral-400">Intent</span>
                                <span className="text-white font-medium">Commercial</span>
                            </div>
                        </div>
                    </Widget>
                </div>

                {/* Consumer DNA (2x2) */}
                <div className="lg:col-span-2 lg:row-span-2">
                    <Widget title="Consumer DNA" action={<User className="w-4 h-4 text-neutral-500" />}>
                        <div className="flex flex-col h-full gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center border border-white/5">
                                    <User className="w-8 h-8 text-neutral-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Ian</h3>
                                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                                        <Briefcase className="w-3.5 h-3.5" />
                                        <span>Instructional Designer</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span>Enterprise L&D</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 rounded-lg bg-white/5 border border-white/5 italic text-sm text-neutral-300">
                                &#34;I spend 5 hours a week manually fixing captions. I just want a tool that works.&#34;
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Pain Points</h4>
                                <div className="space-y-2">
                                    {[
                                        "Manual captioning is slow (5+ hrs/week)",
                                        "Transcription errors hurt credibility",
                                        "Legal anxiety (WCAG compliance)"
                                    ].map((point, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-neutral-300">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                            {point}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Widget>
                </div>

                {/* Search Landscape (2x2) */}
                <div className="lg:col-span-2 lg:row-span-2">
                    <Widget title="Search Landscape" action={<Search className="w-4 h-4 text-neutral-500" />}>
                        <div className="flex flex-col h-full gap-6">
                            {/* Modern Scatter Plot */}
                            <div className="relative flex-1 min-h-[300px] gradient-to-br from-neutral-900/50 to-neutral-900/30 rounded-xl border border-white/10 pt-8 pb-10 px-10">
                                {/* Clean Grid Lines */}
                                <svg className="absolute inset-10 w-[calc(100%-80px)] h-[calc(100%-80px)]" style={{ opacity: 0.15 }}>
                                    <defs>
                                        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                                            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white" />
                                        </pattern>
                                    </defs>
                                    <rect width="100%" height="100%" fill="url(#grid)" />
                                </svg>

                                {/* Axis Labels */}
                                <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 origin-center">
                                    <span className="text-xs font-medium text-neutral-400 tracking-wider">SEARCH VOLUME</span>
                                </div>
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                                    <span className="text-xs font-medium text-neutral-400 tracking-wider">DIFFICULTY</span>
                                </div>

                                {/* Quadrant Labels - Subtle & Non-overlapping */}
                                <div className="absolute top-10 left-12 text-[11px] font-semibold text-emerald-500/40 uppercase tracking-wide">
                                    Sweet Spot
                                </div>
                                <div className="absolute top-10 right-12 text-[11px] font-semibold text-orange-500/40 uppercase tracking-wide">
                                    Competitive
                                </div>
                                <div className="absolute bottom-12 left-12 text-[11px] font-semibold text-blue-500/40 uppercase tracking-wide">
                                    Niche
                                </div>
                                <div className="absolute bottom-12 right-12 text-[11px] font-semibold text-red-500/40 uppercase tracking-wide">
                                    Avoid
                                </div>

                                {/* Data Points - Properly sized & spaced */}
                                {[
                                    { label: "WCAG\nTool", x: "25%", y: "25%", volume: "18k", size: "large", color: "emerald" },
                                    { label: "Corp\nAccess", x: "38%", y: "45%", volume: "12k", size: "medium", color: "emerald" },
                                    { label: "Video\nAPI", x: "72%", y: "32%", volume: "9k", size: "medium", color: "orange" },
                                    { label: "LMS\nPlugin", x: "30%", y: "72%", volume: "7k", size: "small", color: "blue" },
                                ].map((item, i) => {
                                    const sizeClasses = {
                                        large: "w-[72px] h-[72px]",
                                        medium: "w-16 h-16",
                                        small: "w-14 h-14"
                                    };

                                    const colorClasses = {
                                        emerald: {
                                            bg: "bg-emerald-500/20",
                                            border: "border-emerald-500/60",
                                            glow: "shadow-emerald-500/30",
                                            text: "text-emerald-400"
                                        },
                                        orange: {
                                            bg: "bg-orange-500/20",
                                            border: "border-orange-500/60",
                                            glow: "shadow-orange-500/30",
                                            text: "text-orange-400"
                                        },
                                        blue: {
                                            bg: "bg-blue-500/20",
                                            border: "border-blue-500/60",
                                            glow: "shadow-blue-500/30",
                                            text: "text-blue-400"
                                        }
                                    };

                                    const colors = colorClasses[item.color as keyof typeof colorClasses];
                                    const size = sizeClasses[item.size as keyof typeof sizeClasses];

                                    return (
                                        <div
                                            key={i}
                                            className={`absolute ${size} ${colors.bg} ${colors.border} backdrop-blur-sm rounded-full border-2 flex flex-col items-center justify-center gap-0.5 transition-all duration-300 hover:scale-110 hover:shadow-2xl cursor-pointer z-10 group p-2`}
                                            style={{ left: item.x, top: item.y, transform: 'translate(-50%, -50%)' }}
                                        >
                                            <span className={`text-[10px] font-bold ${colors.text} leading-[1.1] text-center whitespace-pre-line`}>
                                                {item.label}
                                            </span>
                                            <span className="text-[9px] text-white/80 font-semibold">
                                                {item.volume}
                                            </span>

                                            {/* Hover Tooltip */}
                                            <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                                                <div className="bg-neutral-950 border border-white/20 rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
                                                    <div className="text-xs text-white font-medium">{item.label.replace('\n', ' ')}</div>
                                                    <div className="text-[10px] text-neutral-400 mt-0.5">Volume: {item.volume}/mo</div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Clean Legend */}
                            <div className="flex items-center justify-between gap-3 px-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/60 border border-emerald-500"></div>
                                    <span className="text-xs text-neutral-400">Opportunity</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-orange-500/60 border border-orange-500"></div>
                                    <span className="text-xs text-neutral-400">Competitive</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500/60 border border-blue-500"></div>
                                    <span className="text-xs text-neutral-400">Niche</span>
                                </div>
                                <div className="h-3 w-px bg-white/10"></div>
                                <div className="text-xs text-neutral-500">
                                    Bubble size = volume
                                </div>
                            </div>
                        </div>
                    </Widget>
                </div>

            </div>
        </div>
    );
}
