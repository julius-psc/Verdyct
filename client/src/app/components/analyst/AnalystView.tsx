'use client';

import { UploadCloud, TrendingUp, User, Briefcase, MapPin, Search, ShieldCheck, ExternalLink, FileText, Target, Zap, Activity } from 'lucide-react';
import { useState, useRef } from 'react';
import Widget from '../dashboard/Widget';
import CardModal from './CardModal';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';
import { createClient } from '@/utils/supabase/client';

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
    fullReport?: any;
    isReadOnly?: boolean;
    isPublic?: boolean;
}

export default function AnalystView({ data, fullReport, isReadOnly = false, isPublic: initialIsPublic = false }: AnalystViewProps) {
    const [showCard, setShowCard] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [isPublic, setIsPublic] = useState(initialIsPublic);
    const reportRef = useRef<HTMLDivElement>(null);

    const generateFullReport = async () => {
        if (!data || !fullReport || !reportRef.current) return;
        setIsExporting(true);

        try {
            // Wait for fonts and a short render delay
            await document.fonts.ready;
            await new Promise(resolve => setTimeout(resolve, 250));

            const dataUrl = await toPng(reportRef.current, {
                cacheBust: true,
                pixelRatio: 2, // Higher quality
                backgroundColor: '#050505', // Match background
                fontEmbedCSS: '', // DISABLE font embedding to fix "font is undefined" / trim error
            });

            const doc = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4'
            });

            const imgProps = doc.getImageProperties(dataUrl);
            const pdfWidth = doc.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            doc.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
            doc.save(`Verdyct_Report_${data.analysis_for.replace(/\s+/g, '_')}.pdf`);
        } catch (error) {
            console.error("PDF Export failed:", error);
            alert("Failed to export PDF. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };

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
        <div className="max-w-[1600px] mx-auto p-8 space-y-6 relative">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1 text-white">The Analyst</h1>
                    <p className="text-sm text-neutral-400">Market analysis for: {analysis_for}</p>
                </div>
                <div className="flex gap-3">
                    {fullReport?.project_id && !isReadOnly && (
                        <button
                            onClick={async () => {
                                try {
                                    const supabase = createClient();
                                    const { data: { session } } = await supabase.auth.getSession();

                                    if (!session) {
                                        alert("Please log in to manage project.");
                                        return;
                                    }

                                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                                    const endpoint = isPublic ? 'unpublish' : 'publish';
                                    const res = await fetch(`${apiUrl}/api/projects/${fullReport.project_id}/${endpoint}`, {
                                        method: 'POST',
                                        headers: {
                                            'Authorization': `Bearer ${session.access_token}`
                                        }
                                    });
                                    if (res.ok) {
                                        setIsPublic(!isPublic);
                                        const action = isPublic ? "removed from" : "published to";
                                        alert(`Project ${action} Leaderboard! 🚀`);
                                    } else {
                                        alert("Failed to update status. Please try again.");
                                    }
                                } catch (e) {
                                    console.error("Status update failed", e);
                                    alert("Error updating project status.");
                                }
                            }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all shadow-lg ${isPublic
                                ? 'bg-neutral-800 hover:bg-neutral-700 shadow-none border border-white/10'
                                : 'bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 shadow-yellow-900/20'
                                }`}
                        >
                            <TrendingUp className="w-4 h-4" />
                            {isPublic ? 'Remove from Leaderboard' : 'Publish to Leaderboard'}
                        </button>
                    )}
                    {!isReadOnly && (
                        <>
                            <button
                                onClick={() => setShowCard(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 rounded-lg text-sm font-semibold text-white transition-all shadow-lg shadow-red-900/20"
                            >
                                Get Verdyct Card
                            </button>
                            <button
                                onClick={generateFullReport}
                                disabled={!fullReport || isExporting}
                                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50"
                            >
                                {isExporting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FileText className="w-4 h-4" />}
                                {isExporting ? 'Exporting...' : 'Full PDF Report'}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Bento Grid Layout - Main View */}
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
                                <svg className="absolute inset-10 w-[calc(100%-80px)] h-[calc(100%-80px)] opacity-20 pointer-events-none">
                                    <defs>
                                        <pattern id="grid" width="20%" height="20%" patternUnits="userSpaceOnUse">
                                            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white" />
                                        </pattern>
                                    </defs>
                                    <rect width="100%" height="100%" fill="url(#grid)" />
                                </svg>

                                {/* Axis Labels */}
                                <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 origin-center pointer-events-none">
                                    <span className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase">Search Volume</span>
                                </div>
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none">
                                    <span className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase">Difficulty</span>
                                </div>

                                {/* Plot Area */}
                                <div className="absolute inset-10 w-[calc(100%-80px)] h-[calc(100%-80px)]">
                                    {seo_opportunity.high_opportunity_keywords.map((kw, i) => {
                                        const getVal = (str: string) => {
                                            const s = str.toLowerCase();
                                            if (s.includes('very high') || s.includes('high') || s.includes('huge')) return 85;
                                            if (s.includes('medium') || s.includes('moderate')) return 50;
                                            if (s.includes('low') || s.includes('small') || s.includes('easy')) return 15;
                                            return 50; // default
                                        };

                                        const getDiff = (str: string) => {
                                            const s = str.toLowerCase();
                                            if (s.includes('very high') || s.includes('hard') || s.includes('competitive')) return 85;
                                            if (s.includes('medium') || s.includes('moderate')) return 50;
                                            if (s.includes('low') || s.includes('easy')) return 15;
                                            return 50;
                                        };

                                        const y = 100 - getVal(kw.volume_estimate); // Invert Y (0 is top)
                                        const x = getDiff(kw.difficulty_level);

                                        return (
                                            <div
                                                key={i}
                                                className="absolute w-3 h-3 rounded-full bg-emerald-400 border border-white shadow-[0_0_10px_rgba(52,211,153,0.5)] transform -translate-x-1/2 -translate-y-1/2 hover:scale-150 transition-transform cursor-help pointer-events-auto group"
                                                style={{ top: `${y}%`, left: `${x}%` }}
                                            >
                                                {/* Tooltip */}
                                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black border border-neutral-700 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                                                    <div className="font-bold">{kw.term}</div>
                                                    <div className="text-[10px] text-neutral-400">Vol: {kw.volume_estimate} | Diff: {kw.difficulty_level}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </Widget>
                </div>
            </div>

            {/* Hidden Printable Container - Premium Dark Enterprise Design */}
            <div className={`fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-[-10] flex justify-center items-start pt-10 bg-[#050505] ${isExporting ? 'opacity-100 z-50' : 'opacity-0'}`}>
                <div
                    ref={reportRef}
                    className="w-[800px] min-h-[1130px] bg-[#050505] text-white p-16 flex flex-col relative"
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                    {/* Background Ambient Glow */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C12424] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />

                    {/* 1. Header */}
                    <header className="flex items-center justify-between border-b border-neutral-800 pb-6 mb-12 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="h-7 opacity-90">
                                <img
                                    src="/assets/brand/logos/default-logo.svg"
                                    alt="Verdyct.AI"
                                    className="h-full w-auto object-contain"
                                />
                            </div>
                        </div>
                        <div className="text-right">
                            <h2 className="text-[10px] font-bold text-neutral-500 tracking-[0.2em] uppercase">Confidential Report</h2>
                            <p className="text-[10px] text-neutral-600 mt-1">{new Date().toLocaleDateString()}</p>
                        </div>
                    </header>

                    {/* 2. Report Title & Verdict */}
                    <section className="mb-12 relative z-10">
                        <h3 className="font-bold text-xs uppercase tracking-wider mb-2 text-[#C12424]">Target Analysis</h3>
                        <h1 className="text-5xl font-extrabold tracking-tight text-white mb-8 uppercase" style={{ lineHeight: 0.9 }}>
                            {analysis_for}
                        </h1>

                        <div className="grid grid-cols-12 gap-8 items-start">
                            {/* Score */}
                            <div className="col-span-4 border-r border-neutral-800 pr-8">
                                <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide mb-1">Verdyct Score</div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-7xl font-bold tracking-tighter text-[#C12424]">{pcs_score}</span>
                                    <span className="text-lg font-medium text-neutral-600">/100</span>
                                </div>
                                <div className="mt-3 inline-block px-3 py-1 bg-[#C12424]/10 text-[#C12424] text-xs font-bold tracking-wide uppercase rounded border border-[#C12424]/20">
                                    {score_card.level} Potential
                                </div>
                            </div>

                            {/* Executive Summary */}
                            <div className="col-span-8 pl-4">
                                <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide mb-2">Executive Summary</div>
                                <p className="text-sm leading-relaxed text-gray-300 border-l-2 pl-4 border-[#C12424]">
                                    {analyst_footer.verdyct_summary}
                                </p>
                                {/* Key Findings / Tags */}
                                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                                    <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                                        <div className="w-1 h-1 bg-neutral-600 rounded-full" />
                                        LTV:CAC Ratio: <span className="text-neutral-300">{fullReport?.financier?.profit_engine?.metrics.ltv_cac_ratio ? parseFloat(fullReport.financier.profit_engine.metrics.ltv_cac_ratio).toFixed(1) + 'x' : 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                                        <div className="w-1 h-1 bg-neutral-600 rounded-full" />
                                        Risk Factors: <span className="text-neutral-300">{analyst_footer.risk_flags.length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 3. Market Metrics Header */}
                    <div className="h-px w-full bg-neutral-900 mb-8" />

                    <section className="mb-12 relative z-10">
                        <div className="grid grid-cols-4 gap-8">
                            {market_metrics.slice(0, 4).map((m, i) => {
                                const [val, year] = m.value.includes(' by ') ? m.value.split(' by ') : [m.value, ''];
                                return (
                                    <div key={i} className="flex flex-col">
                                        <p className="text-[10px] uppercase font-bold text-neutral-600 mb-1 h-8 leading-tight">{m.name}</p>
                                        <div className="mb-1">
                                            <p className="text-xl font-bold text-white leading-none">{val}</p>
                                            {year && <p className="text-xs text-neutral-500 font-medium mt-1">by {year}</p>}
                                        </div>
                                        <p className="text-xs font-medium text-emerald-500 flex items-center gap-1 mt-auto">
                                            ↑ {m.change_percentage}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* 4. Deep Dive: Persona & Competition */}
                    <div className="grid grid-cols-2 gap-12 flex-1 relative z-10">

                        {/* Customer DNA */}
                        <div>
                            <div className="flex items-center gap-2 mb-6 border-b border-neutral-800 pb-2">
                                <h3 className="text-lg font-bold text-white">Ideal Customer Profile</h3>
                            </div>

                            <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-lg">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-8 w-8 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">
                                        <User className="h-4 w-4 text-neutral-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-base">{ideal_customer_persona.persona_name}</h4>
                                        <p className="text-xs text-neutral-500">{ideal_customer_persona.persona_role}</p>
                                    </div>
                                </div>

                                <blockquote className="text-sm italic text-neutral-400 mb-6 pl-3 border-l-2 border-neutral-700">
                                    "{ideal_customer_persona.persona_quote}"
                                </blockquote>

                                <div className="space-y-3">
                                    <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">MAJOR PAIN POINTS</p>
                                    <ul className="space-y-2">
                                        {ideal_customer_persona.pain_points.slice(0, 3).map((pp, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <span className="text-[#C12424] mt-1.5 text-[10px]">●</span>
                                                <span className="text-xs font-medium text-neutral-300 leading-snug">{pp.title}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Competitive Landscape Table */}
                        <div>
                            <div className="flex items-center gap-2 mb-6 border-b border-neutral-800 pb-2">
                                <h3 className="text-lg font-bold text-white">Competitive Landscape</h3>
                            </div>

                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr>
                                        <th className="py-2 text-[10px] font-bold text-neutral-600 uppercase tracking-wider border-b border-neutral-800">Competitor</th>
                                        <th className="py-2 text-[10px] font-bold text-neutral-600 uppercase tracking-wider border-b border-neutral-800 text-right">Position</th>
                                        <th className="py-2 text-[10px] font-bold text-neutral-600 uppercase tracking-wider border-b border-neutral-800 text-right">Source</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(fullReport?.spy?.market_quadrant?.competitors || []).slice(0, 5).map((comp: any, i: number) => (
                                        <tr key={i} className="group">
                                            <td className="py-3 text-sm font-semibold text-gray-200 border-b border-neutral-900 group-last:border-0">{comp.name}</td>
                                            <td className="py-3 text-xs text-neutral-400 border-b border-neutral-900 text-right group-last:border-0">{comp.quadrant_label || "N/A"}</td>
                                            <td className="py-3 border-b border-neutral-900 text-right group-last:border-0">
                                                <span className="inline-block text-[10px] font-medium text-[#C12424] uppercase tracking-wider">
                                                    {comp.verified_url ? "Verified" : "Analyzed"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {(!fullReport?.spy?.market_quadrant?.competitors || fullReport.spy.market_quadrant.competitors.length === 0) && (
                                <p className="text-sm text-neutral-600 italic mt-4">No direct competitors analyzed.</p>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="mt-12 pt-6 border-t border-neutral-900 flex justify-between items-end relative z-10">
                        <div>
                            <p className="text-[10px] text-neutral-600 font-medium tracking-wide">GENERATED BY VERDYCT AI AGENTS</p>
                        </div>
                        {/* Removed Bottom Right Branding as requested */}
                    </footer>
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
