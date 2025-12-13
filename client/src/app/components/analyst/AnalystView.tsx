'use client';

import { UploadCloud, TrendingUp, User, Briefcase, MapPin, Sparkles, Search, ShieldCheck, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import Widget from '../dashboard/Widget';
import CardModal from './CardModal';

// Define types based on the backend response
interface AnalystData {
    title: string;
    analysis_for: string;
    score: number;
    pcs_score: number;
    score_card: {
        title: string;
        level: string;
        description: string;
        level_description?: string; // Add optional if needed
    };
    market_metrics: {
        name: string;
        value: string;
        change_percentage: string;
        note: string;
        verified_url?: string;
    }[];
    seo_opportunity: {
        title: string;
        subtitle: string;
        high_opportunity_keywords: {
            term: string;
            volume_estimate: string;
            difficulty_level: string;
        }[];
    };
    ideal_customer_persona: {
        title: string;
        subtitle: string;
        persona_name: string;
        persona_role: string;
        persona_department: string;
        persona_quote: string;
        details: {
            age_range: string;
            income: string;
            education: string;
            team_size: string;
        };
        pain_points: {
            title: string;
            details: string;
        }[];
        jobs_to_be_done: string[];
        where_to_find: string[];
    };
    analyst_footer: {
        verdyct_summary: string;
        scoring_breakdown: {
            name: string;
            score: number;
            max_score: number;
        }[];
        data_confidence_level: string;
        risk_flags: string[];
        recommendation_title: string;
        recommendation_text: string;
    };
}

interface AnalystViewProps {
    data?: AnalystData;
}

export default function AnalystView({ data }: AnalystViewProps) {
    const [showCard, setShowCard] = useState(false);

    if (!data) {
        return (
            <div className="flex items-center justify-center h-full text-neutral-500">
                Loading analysis data...
            </div>
        );
    }

    const {
        analysis_for,
        score,
        pcs_score,
        score_card,
        market_metrics,
        seo_opportunity,
        ideal_customer_persona,
        analyst_footer
    } = data;

    return (
        <div className="max-w-[1600px] mx-auto p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1 text-white">The Analyst</h1>
                    <p className="text-sm text-neutral-400">Market analysis for: {analysis_for}</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowCard(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 rounded-lg text-sm font-semibold text-white transition-all shadow-lg shadow-emerald-500/20"
                    >
                        <Sparkles className="w-4 h-4" />
                        Get Verdyct Card
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white transition-colors">
                        <UploadCloud className="w-4 h-4" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">

                {/* Main Visual - Market Score (2x2) */}
                <div className="lg:col-span-2 lg:row-span-2">
                    <Widget title="Market Viability" showGrid={true}>
                        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between h-full px-2 gap-6 xl:gap-0">
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                    <span className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tighter">{score_card.level}</span>
                                    <span className="text-lg lg:text-xl text-emerald-500 font-medium">{pcs_score}/100</span>
                                </div>
                                <p className="text-sm text-neutral-400 mt-3 max-w-md leading-relaxed">
                                    <strong className="text-white">The Analyst's Verdyct:</strong> {analyst_footer.verdyct_summary}
                                </p>
                            </div>
                            <div className="self-center xl:self-auto h-24 w-24 shrink-0 rounded-full border-4 border-emerald-500/20 flex items-center justify-center relative">
                                <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-l-transparent rotate-45"></div>
                                <ShieldCheck className="w-8 h-8 text-emerald-500" />
                            </div>
                        </div>
                    </Widget>
                </div>

                {/* Key Metrics Rows */}
                {market_metrics.slice(0, 4).map((metric, index) => (
                    <div key={index} className="lg:col-span-1">
                        <Widget title={metric.name}>
                            <div className="flex flex-col justify-between h-full">
                                <div>
                                    <div className="text-3xl font-semibold text-white flex items-center gap-2">
                                        {metric.value}
                                        {metric.verified_url && (
                                            <a
                                                href={metric.verified_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-neutral-500 hover:text-emerald-400 transition-colors"
                                                title="View Source"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-emerald-500 mt-1">
                                        <TrendingUp className="w-4 h-4" />
                                        <span>{metric.change_percentage}</span>
                                    </div>
                                </div>
                                <p className="text-xs text-neutral-500 mt-4">{metric.note}</p>
                            </div>
                        </Widget>
                    </div>
                ))}

                {/* Consumer DNA (2x2) */}
                <div className="lg:col-span-2 lg:row-span-2">
                    <Widget title="Consumer DNA" action={<User className="w-4 h-4 text-neutral-500" />}>
                        <div className="flex flex-col h-full gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center border border-white/5">
                                    <User className="w-8 h-8 text-neutral-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{ideal_customer_persona.persona_name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                                        <Briefcase className="w-3.5 h-3.5" />
                                        <span>{ideal_customer_persona.persona_role}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span>{ideal_customer_persona.details.team_size}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 rounded-lg bg-white/5 border border-white/5 italic text-sm text-neutral-300">
                                "{ideal_customer_persona.persona_quote}"
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Pain Points</h4>
                                <div className="space-y-2">
                                    {ideal_customer_persona.pain_points.map((point, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-neutral-300">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                            {point.title}
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
                                {seo_opportunity.high_opportunity_keywords.map((item, i) => {
                                    // Simple mapping for demo purposes, ideally coordinates come from backend
                                    const positions = [
                                        { x: "25%", y: "25%", color: "emerald" },
                                        { x: "38%", y: "45%", color: "emerald" },
                                        { x: "72%", y: "32%", color: "orange" },
                                        { x: "30%", y: "72%", color: "blue" },
                                    ];
                                    const pos = positions[i % positions.length];

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
                                        },
                                        red: { // Fallback
                                            bg: "bg-red-500/20",
                                            border: "border-red-500/60",
                                            glow: "shadow-red-500/30",
                                            text: "text-red-400"
                                        }
                                    };

                                    const colors = colorClasses[pos.color as keyof typeof colorClasses] || colorClasses.emerald;
                                    // Randomize size for visual variety if needed, or map from volume
                                    const size = sizeClasses.medium;

                                    return (
                                        <div
                                            key={i}
                                            className={`absolute ${size} ${colors.bg} ${colors.border} backdrop-blur-sm rounded-full border-2 flex flex-col items-center justify-center gap-0.5 transition-all duration-300 hover:scale-110 hover:shadow-2xl cursor-pointer z-10 group p-2`}
                                            style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}
                                        >
                                            <span className={`text-[10px] font-bold ${colors.text} leading-[1.1] text-center whitespace-pre-line`}>
                                                {item.term}
                                            </span>
                                            <span className="text-[9px] text-white/80 font-semibold">
                                                {item.volume_estimate}
                                            </span>
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

            <CardModal
                isOpen={showCard}
                onClose={() => setShowCard(false)}
                data={{
                    score: pcs_score,
                    level: score_card.level,
                    projectName: analysis_for,
                    summary: analyst_footer.verdyct_summary
                }}
            />
        </div>
    );
}
