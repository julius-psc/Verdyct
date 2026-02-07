'use client';

import { UploadCloud, TrendingUp, User, Briefcase, MapPin, Search, ShieldCheck, ExternalLink, FileText, Target, Zap, Activity, Lock, ArrowRight } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Widget from '../dashboard/Widget';
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
    market_overview: string; // The Hook / Thesis added in backend

    seo_opportunity: {
        title: string;
        subtitle: string;
        high_opportunity_keywords: {
            keyword: string;  // was 'term'
            opportunity_level: string;  // was 'volume_estimate'
            // Phase 2 enhancements
            search_volume?: string;
            difficulty?: string;  // was 'difficulty_level'
            top_ranker_1?: string;
            top_ranker_2?: string;
            top_ranker_3?: string;
        }[];
        // Phase 2 enhancements
        content_gap_insight?: string;
        organic_traffic_potential?: string;
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
            // Enhanced Demographics
            experience_level?: string;
            decision_making_power?: string;
            tech_savviness?: string;
            organization_type?: string;
        };
        pain_points: {
            title: string;
            details: string;
            // Quantified Impact
            time_wasted_per_week?: string;
            financial_impact?: string;
            emotional_impact?: string;
            urgency_level?: string;
            verified_quote?: string;
            verified_url?: string;
        }[];
        jobs_to_be_done: {
            functional_job?: string;
            emotional_job?: string;
            social_job?: string;
            priority?: string;
        }[] | string[]; // Support both old and new formats
        where_to_find: {
            platform?: string;
            specific_location?: string;
            activity_level?: string;
            content_type?: string;
            verified_url?: string;
        }[] | string[]; // Support both old and new formats
        behavioral_insights?: {
            buying_triggers?: string[];
            content_preferences?: string[];
            objections?: string[];
            decision_timeline?: string;
        };
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
    // Premium Features - Phase 1
    competitors_preview?: {
        name: string;
        market_position: string;
        pricing_tier: string;
        key_strength: string;
        verified_url: string;
    }[];
    unit_economics_preview?: {
        estimated_cac_range: string;
        estimated_ltv_range: string;
        ltv_cac_ratio: string;
        health_assessment: string;
        confidence_level: string;
        key_assumption: string;
    };
    market_segments?: {
        segment_name: string;
        market_size: string;
        percentage_of_total: string;
        growth_rate: string;
        attractiveness: string;
        rationale: string;
    }[];
    gtm_action_plan?: {
        recommended_channels: {
            channel_name: string;
            roi_potential: string;
            estimated_cac: string;
            time_to_results: string;
            initial_budget: string;
            why_this_channel: string;
        }[];
        week_1_2_actions: string[];
        week_3_4_actions: string[];
        month_2_actions: string[];
        month_3_actions: string[];
        budget_minimum: string;
        budget_recommended: string;
        budget_aggressive: string;
        success_metrics: string[];
    };
    // Premium Features - Phase 2
    risk_validation?: {
        critical_assumptions: {
            assumption: string;
            validation_method: string;
            priority: string;
        }[];
        derisking_milestones: {
            stage: string;
            milestone: string;
        }[];
        red_flags: {
            condition: string;
            action: string;
        }[];
    };
    // Premium Features - Phase 3
    jtbd_deep_dive?: {
        functional_job: {
            job: string;
            success_metrics: string[];
            current_alternatives: string[];
            switching_cost: string;
        };
        emotional_job: {
            job: string;
            messaging_angle: string;
        };
        social_job: {
            job: string;
            word_of_mouth_trigger: string;
        };
    };
    marketing_playbook?: {
        buying_triggers: {
            trigger: string;
            campaign_idea: string;
        }[];
        content_strategy: {
            preference: string;
            strategy: string;
        }[];
        objection_handling: {
            objection: string;
            response: string;
        }[];
    };
}


interface AnalystViewProps {
    data?: AnalystData;
    fullReport?: any;
    isReadOnly?: boolean;
    isPublic?: boolean;
    analysisType?: 'small' | 'full'; // Track if it's free (small) or paid (full)
}

export default function AnalystView({ data, fullReport, isReadOnly = false, isPublic: initialIsPublic = false, analysisType = 'small' }: AnalystViewProps) {

    const [isExporting, setIsExporting] = useState(false);
    const [isPublic, setIsPublic] = useState(initialIsPublic);
    const t = useTranslations('Analyst');
    const locale = useLocale();
    const reportRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

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
            console.error("PDF Export failed:", error);
            alert(t('alertError'));
        } finally {
            setIsExporting(false);
        }
    };

    if (!data) {
        return (
            <div className="flex items-center justify-center h-full text-neutral-500">
                {t('loading')}
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
                    <h1 className="text-3xl font-bold tracking-tight mb-1 text-white">{t('title')}</h1>
                    <p className="text-sm text-neutral-400">{t('subtitle', { name: analysis_for })}</p>
                </div>
                <div className="flex gap-3">

                    {!isReadOnly && (
                        <button
                            onClick={generateFullReport}
                            disabled={!fullReport || isExporting}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50"
                        >
                            {isExporting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FileText className="w-4 h-4" />}
                            {isExporting ? t('exporting') : t('export')}
                        </button>
                    )}
                </div>
            </div>

            {/* Bento Grid Layout - Main View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">

                {/* Main Visual - Market Score (2x2) */}
                <div className="lg:col-span-2 lg:row-span-2">
                    <Widget title="THE VERDICT" showGrid={true}>
                        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between h-full px-2 gap-6 xl:gap-0">
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                    <span className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tighter">{score_card.level}</span>
                                    <span className={`text-lg lg:text-xl font-medium ${pcs_score >= 60 ? 'text-emerald-500' : 'text-red-500'}`}>{pcs_score}/100</span>
                                </div>

                                {/* The Hook / Thesis */}
                                {data.market_overview && (
                                    <div className="mt-4 mb-2 p-3 bg-white/5 border-l-2 border-white/20 text-sm text-neutral-300 italic">
                                        "{data.market_overview}"
                                    </div>
                                )}

                                {/* The Verdict */}
                                <p className="text-sm text-neutral-400 mt-2 max-w-md leading-relaxed">
                                    <strong className="text-white uppercase tracking-wider text-xs bg-red-900/40 text-red-200 px-1 py-0.5 rounded mr-2">RUTHLESS TAKE</strong>
                                    {analyst_footer.verdyct_summary}
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

                {/* Consumer DNA (2x2) - ENHANCED */}
                <div className="lg:col-span-2 lg:row-span-2">
                    <Widget title={t('consumerDna')} action={<User className="w-4 h-4 text-neutral-500" />}>
                        <div className="flex flex-col h-full gap-4 overflow-y-auto max-h-[500px]">
                            {/* Header */}
                            <div className="flex items-center gap-4 shrink-0">
                                <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center border border-white/5">
                                    <User className="w-8 h-8 text-neutral-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold text-white truncate">{ideal_customer_persona.persona_name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                                        <Briefcase className="w-3.5 h-3.5 shrink-0" />
                                        <span className="truncate">{ideal_customer_persona.persona_role}</span>
                                    </div>
                                    {ideal_customer_persona.details.experience_level && ideal_customer_persona.details.experience_level !== 'Not specified' && (
                                        <div className="flex items-center gap-2 text-xs text-emerald-400 mt-1">
                                            <Zap className="w-3 h-3" />
                                            <span>{ideal_customer_persona.details.experience_level}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Enhanced Demographics - Grid */}
                            {(ideal_customer_persona.details.decision_making_power || ideal_customer_persona.details.tech_savviness || ideal_customer_persona.details.organization_type) && (
                                <div className="grid grid-cols-2 gap-2 shrink-0">
                                    {ideal_customer_persona.details.decision_making_power && ideal_customer_persona.details.decision_making_power !== 'Not specified' && (
                                        <div className="text-xs">
                                            <span className="text-neutral-500">Power: </span>
                                            <span className="text-white font-medium">{ideal_customer_persona.details.decision_making_power}</span>
                                        </div>
                                    )}
                                    {ideal_customer_persona.details.tech_savviness && ideal_customer_persona.details.tech_savviness !== 'Not specified' && ideal_customer_persona.details.tech_savviness !== 'Mainstream' && (
                                        <div className="text-xs">
                                            <span className="text-neutral-500">Tech: </span>
                                            <span className="text-white font-medium">{ideal_customer_persona.details.tech_savviness}</span>
                                        </div>
                                    )}
                                    {ideal_customer_persona.details.organization_type && ideal_customer_persona.details.organization_type !== 'Not specified' && (
                                        <div className="text-xs col-span-2">
                                            <span className="text-neutral-500">Org: </span>
                                            <span className="text-white font-medium">{ideal_customer_persona.details.organization_type}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Quote */}
                            <div className="p-3 rounded-lg bg-white/5 border border-white/5 italic text-sm text-neutral-300 shrink-0">
                                "{ideal_customer_persona.persona_quote}"
                            </div>

                            {/* Pain Points - Enhanced with quantified impact */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{t('painPoints')}</h4>
                                <div className="space-y-3">
                                    {ideal_customer_persona.pain_points.map((point, i) => (
                                        <div key={i} className="relative pl-4 border-l-2 border-red-500/30">
                                            <div className="flex items-start justify-between gap-2">
                                                <span className="text-sm text-white font-medium">{point.title}</span>
                                                {point.urgency_level && point.urgency_level !== 'Medium' && (
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${point.urgency_level === 'Critical' ? 'bg-red-500/20 text-red-300' : 'bg-orange-500/20 text-orange-300'
                                                        }`}>
                                                        {point.urgency_level}
                                                    </span>
                                                )}
                                            </div>
                                            {(point.time_wasted_per_week || point.financial_impact) && (
                                                <div className="flex gap-3 mt-1 text-xs text-neutral-400">
                                                    {point.time_wasted_per_week && point.time_wasted_per_week !== 'Not quantified' && (
                                                        <span>⏱️ {point.time_wasted_per_week}</span>
                                                    )}
                                                    {point.financial_impact && point.financial_impact !== 'Not quantified' && (
                                                        <span>💰 {point.financial_impact}</span>
                                                    )}
                                                </div>
                                            )}
                                            {point.verified_quote && point.verified_quote.length > 0 && (
                                                <div className="mt-2 text-xs italic text-neutral-500 border-l-2 border-neutral-700 pl-2">
                                                    "{point.verified_quote.slice(0, 100)}{point.verified_quote.length > 100 ? '...' : ''}"
                                                    {point.verified_url && (
                                                        <a href={point.verified_url} target="_blank" rel="noopener noreferrer" className="ml-1 text-emerald-400 hover:underline">
                                                            <ExternalLink className="inline w-3 h-3" />
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Widget>
                </div>

                {/* Search Landscape (2x2) */}
                <div className="lg:col-span-2 lg:row-span-2">
                    <Widget title={t('searchLandscape')} action={<Search className="w-4 h-4 text-neutral-500" />}>
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
                                    <span className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase">{t('searchVolume')}</span>
                                </div>
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none">
                                    <span className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase">{t('difficulty')}</span>
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

                                        const y = 100 - getVal(kw.opportunity_level); // Invert Y (0 is top)
                                        const x = getDiff(kw.difficulty || kw.opportunity_level);

                                        return (
                                            <div
                                                key={i}
                                                className="absolute w-3 h-3 rounded-full bg-emerald-400 border border-white shadow-[0_0_10px_rgba(52,211,153,0.5)] transform -translate-x-1/2 -translate-y-1/2 hover:scale-150 transition-transform cursor-help pointer-events-auto group"
                                                style={{ top: `${y}%`, left: `${x}%` }}
                                            >
                                                {/* Tooltip */}
                                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-2 bg-black/95 border border-emerald-500/40 rounded-lg text-xs text-white min-w-max opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none shadow-xl">
                                                    <div className="font-bold text-emerald-400 mb-1">{kw.keyword}</div>
                                                    <div className="text-[10px] text-gray-300 space-y-0.5">
                                                        {kw.search_volume && <div>📊 {kw.search_volume}</div>}
                                                        {kw.difficulty && <div>⚡ Difficulty: {kw.difficulty}</div>}
                                                        {kw.top_ranker_1 && (
                                                            <div className="text-yellow-300 mt-1">
                                                                🏆 Top: {kw.top_ranker_1}
                                                                {kw.top_ranker_2 && `, ${kw.top_ranker_2}`}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </Widget>
                </div>

                {/* === PHASE 2 PREMIUM FEATURES === */}

                {/* SEO Content Insights (1x1) */}
                {(seo_opportunity.content_gap_insight || seo_opportunity.organic_traffic_potential) && (
                    <div className="lg:col-span-1">
                        <Widget title="🎯 SEO Growth Opportunity" action={<TrendingUp className="w-4 h-4 text-emerald-500" />}>
                            <div className="space-y-4">
                                {seo_opportunity.content_gap_insight && (
                                    <div>
                                        <div className="text-sm font-semibold text-emerald-400 mb-2">Content Gap</div>
                                        <p className="text-sm text-gray-300 leading-relaxed">
                                            {seo_opportunity.content_gap_insight}
                                        </p>
                                    </div>
                                )}
                                {seo_opportunity.organic_traffic_potential && (
                                    <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20">
                                        <div className="text-xs text-gray-400 mb-1">Traffic Potential</div>
                                        <div className="text-lg font-bold text-white">
                                            {seo_opportunity.organic_traffic_potential}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Widget>
                    </div>
                )}

                {/* Risk Validation Checklist (2x1) */}
                {data.risk_validation && (
                    <div className="lg:col-span-2">
                        <Widget title="⚠️ Risk Validation Checklist" action={<ShieldCheck className="w-4 h-4 text-yellow-500" />}>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                {/* Critical Assumptions */}
                                {data.risk_validation.critical_assumptions && data.risk_validation.critical_assumptions.length > 0 && (
                                    <div className="space-y-2">
                                        <div className="text-sm font-semibold text-yellow-400 flex items-center gap-2">
                                            <span className="text-lg">🔍</span>
                                            Critical Assumptions
                                        </div>
                                        {data.risk_validation.critical_assumptions.slice(0, 3).map((assumption, i) => (
                                            <div key={i} className="p-2 rounded bg-white/5 border border-white/10 text-xs">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${assumption.priority === 'Critical' ? 'bg-red-500/20 text-red-400' :
                                                        assumption.priority === 'High' ? 'bg-orange-500/20 text-orange-400' :
                                                            'bg-blue-500/20 text-blue-400'
                                                        }`}>{assumption.priority}</span>
                                                </div>
                                                <div className="text-white font-medium mb-1">{assumption.assumption}</div>
                                                <div className="text-gray-400 text-[10px]">
                                                    ✓ {assumption.validation_method}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* De-risking Milestones */}
                                {data.risk_validation.derisking_milestones && data.risk_validation.derisking_milestones.length > 0 && (
                                    <div className="space-y-2">
                                        <div className="text-sm font-semibold text-blue-400 flex items-center gap-2">
                                            <span className="text-lg">🎯</span>
                                            De-risking Path
                                        </div>
                                        {data.risk_validation.derisking_milestones.map((milestone, i) => (
                                            <div key={i} className="p-2 rounded bg-blue-500/5 border border-blue-500/20 text-xs">
                                                <div className="text-blue-300 font-semibold mb-0.5">{milestone.stage}</div>
                                                <div className="text-gray-300">{milestone.milestone}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Red Flags */}
                                {data.risk_validation.red_flags && data.risk_validation.red_flags.length > 0 && (
                                    <div className="space-y-2">
                                        <div className="text-sm font-semibold text-red-400 flex items-center gap-2">
                                            <span className="text-lg">🚩</span>
                                            Watch For
                                        </div>
                                        {data.risk_validation.red_flags.map((flag, i) => (
                                            <div key={i} className="p-2 rounded bg-red-500/5 border border-red-500/20 text-xs">
                                                <div className="text-red-300 font-semibold mb-0.5">{flag.condition}</div>
                                                <div className="text-gray-400 flex items-start gap-1">
                                                    <span className="text-yellow-400 mt-0.5">→</span>
                                                    <span>{flag.action}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Widget>
                    </div>
                )}

                {/* === PREMIUM FEATURES PHASE 1 === */}

                {/* Competitors Preview (2x1) - Te aser for Spy */}
                {data.competitors_preview && data.competitors_preview.length > 0 && (
                    <div className="lg:col-span-2">
                        <Widget title="🔍 Competitive Landscape Preview" action={<Target className="w-4 h-4 text-neutral-500" />}>
                            <div className="space-y-3">
                                {data.competitors_preview.slice(0, 3).map((comp, i) => (
                                    <div key={i} className="flex items-start justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-white text-sm truncate">{comp.name}</h4>
                                                <span className="text-xs px-2 py-0.5 rounded bg-neutral-700 text-neutral-300 whitespace-nowrap">
                                                    {comp.pricing_tier}
                                                </span>
                                            </div>
                                            <p className="text-xs text-neutral-400 mt-1">{comp.market_position}</p>
                                            <p className="text-xs text-emerald-400 mt-1">💪 {comp.key_strength}</p>
                                        </div>
                                    </div>
                                ))}
                                {!fullReport?.spy ? (
                                    <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 rounded-lg text-sm font-semibold text-white transition-all shadow-lg shadow-yellow-900/20">
                                        <Lock className="w-4 h-4" />
                                        Unlock Full Competitor Analysis (Spy Agent)
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => router.push(`/${locale}/${fullReport?.project_id}/spy`)}
                                        className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 rounded-lg text-sm font-semibold text-white transition-all shadow-lg"
                                    >
                                        View Full Competitor Analysis
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </Widget>
                    </div>
                )}

                {/* Unit Economics Preview (2x1) - Teaser for Financier */}
                {data.unit_economics_preview && (
                    <div className="lg:col-span-2">
                        <Widget title="💰 Unit Economics Preview" action={<Activity className="w-4 h-4 text-neutral-500" />}>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-lg bg-gradient-to-br from-red-900/20 to-red-800/10 border border-red-500/20">
                                        <div className="text-xs text-neutral-400 mb-1">Customer Acquisition Cost</div>
                                        <div className="text-2xl font-bold text-white">{data.unit_economics_preview.estimated_cac_range}</div>
                                    </div>
                                    <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 border border-emerald-500/20">
                                        <div className="text-xs text-neutral-400 mb-1">Lifetime Value</div>
                                        <div className="text-2xl font-bold text-white">{data.unit_economics_preview.estimated_ltv_range}</div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
                                    <div>
                                        <div className="text-sm font-medium text-white">LTV:CAC Ratio</div>
                                        <div className="text-xs text-neutral-400 mt-1">{data.unit_economics_preview.health_assessment}</div>
                                    </div>
                                    <div className="text-3xl font-bold text-emerald-400">{data.unit_economics_preview.ltv_cac_ratio}</div>
                                </div>
                                <div className="text-xs text-neutral-500 italic">
                                    {data.unit_economics_preview.key_assumption}
                                </div>
                                {!fullReport?.financier ? (
                                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 rounded-lg text-sm font-semibold text-white transition-all shadow-lg shadow-yellow-900/20">
                                        <Lock className="w-4 h-4" />
                                        Unlock Full Financial Model (Financier Agent)
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => router.push(`/${locale}/${fullReport?.project_id}/financier`)}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 rounded-lg text-sm font-semibold text-white transition-all shadow-lg"
                                    >
                                        View Full Financial Model
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </Widget>
                    </div>
                )}

                {/* Market Segments (2x1) */}
                {data.market_segments && data.market_segments.length > 0 && (
                    <div className="lg:col-span-2">
                        <Widget title="📊 Market Opportunity Breakdown" action={<Target className="w-4 h-4 text-neutral-500" />}>
                            <div className="space-y-3">
                                {data.market_segments.map((segment, i) => (
                                    <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/5">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-white text-sm">{segment.segment_name}</h4>
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded ${segment.attractiveness === 'High' ? 'bg-emerald-500/20 text-emerald-300' :
                                                    segment.attractiveness === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                                        'bg-neutral-500/20 text-neutral-300'
                                                    }`}>
                                                    {segment.attractiveness}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-bold text-white">{segment.market_size}</div>
                                                <div className="text-xs text-neutral-400">{segment.percentage_of_total}</div>
                                            </div>
                                        </div>
                                        <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden mb-2">
                                            <div
                                                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                                                style={{ width: segment.percentage_of_total || '0%' }}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-neutral-500">{segment.rationale}</span>
                                            <span className="text-emerald-400">{segment.growth_rate}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Widget>
                    </div>
                )}

                {/* GTM Action Plan (4x1) - Full width */}
                {data.gtm_action_plan && (
                    <div className="lg:col-span-4">
                        <Widget title="🚀 90-Day Go-to-Market Action Plan" action={<Zap className="w-4 h-4 text-neutral-500" />}>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Left: Channels */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Recommended Channels</h4>
                                    {data.gtm_action_plan.recommended_channels.slice(0, 3).map((channel, i) => (
                                        <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/5">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h5 className="font-semibold text-white text-sm">{channel.channel_name}</h5>
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${channel.roi_potential === 'High' ? 'bg-emerald-500/20 text-emerald-300' :
                                                            channel.roi_potential === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                                                'bg-neutral-500/20 text-neutral-300'
                                                            }`}>
                                                            {channel.roi_potential} ROI
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-neutral-400 mt-1">{channel.why_this_channel}</p>
                                                    <div className="flex gap-3 mt-2 text-xs text-neutral-500">
                                                        <span>💰 {channel.estimated_cac}</span>
                                                        <span>⏱️ {channel.time_to_results}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Budget Tiers */}
                                    <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 mt-4">
                                        <h5 className="text-xs font-medium text-neutral-400 mb-2">Budget Options</h5>
                                        <div className="space-y-1 text-xs">
                                            <div className="flex justify-between">
                                                <span className="text-neutral-500">Minimum:</span>
                                                <span className="text-white font-medium">{data.gtm_action_plan.budget_minimum}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-neutral-500">Recommended:</span>
                                                <span className="text-emerald-400 font-medium">{data.gtm_action_plan.budget_recommended}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-neutral-500">Aggressive:</span>
                                                <span className="text-yellow-400 font-medium">{data.gtm_action_plan.budget_aggressive}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Timeline */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">90-Day Timeline</h4>

                                    {/* Week 1-2 */}
                                    <div className="relative pl-6 border-l-2 border-emerald-500">
                                        <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-neutral-900"></div>
                                        <h5 className="text-sm font-semibold text-white mb-1">Week 1-2: Foundation</h5>
                                        <ul className="space-y-1 text-xs text-neutral-400">
                                            {data.gtm_action_plan.week_1_2_actions.map((action, i) => (
                                                <li key={i}>• {action}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Week 3-4 */}
                                    <div className="relative pl-6 border-l-2 border-yellow-500">
                                        <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-yellow-500 border-2 border-neutral-900"></div>
                                        <h5 className="text-sm font-semibold text-white mb-1">Week 3-4: Content</h5>
                                        <ul className="space-y-1 text-xs text-neutral-400">
                                            {data.gtm_action_plan.week_3_4_actions.map((action, i) => (
                                                <li key={i}>• {action}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Month 2 */}
                                    <div className="relative pl-6 border-l-2 border-blue-500">
                                        <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-blue-500 border-2 border-neutral-900"></div>
                                        <h5 className="text-sm font-semibold text-white mb-1">Month 2: Launch</h5>
                                        <ul className="space-y-1 text-xs text-neutral-400">
                                            {data.gtm_action_plan.month_2_actions.map((action, i) => (
                                                <li key={i}>• {action}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Month 3 */}
                                    <div className="relative pl-6 border-l-2 border-purple-500">
                                        <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-purple-500 border-2 border-neutral-900"></div>
                                        <h5 className="text-sm font-semibold text-white mb-1">Month 3: Optimize</h5>
                                        <ul className="space-y-1 text-xs text-neutral-400">
                                            {data.gtm_action_plan.month_3_actions.map((action, i) => (
                                                <li key={i}>• {action}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Success Metrics */}
                                    <div className="p-3 rounded-lg bg-emerald-900/20 border border-emerald-500/20 mt-4">
                                        <h5 className="text-xs font-medium text-emerald-300 mb-2">Success Metrics</h5>
                                        <ul className="space-y-1 text-xs text-neutral-300">
                                            {data.gtm_action_plan.success_metrics.map((metric, i) => (
                                                <li key={i}>✓ {metric}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </Widget>
                    </div>
                )}

                {/* === PHASE 3 PREMIUM FEATURES === */}

                {/* JTBD Deep Dive (2x1) */}
                {data.jtbd_deep_dive && (
                    <div className="lg:col-span-2">
                        <Widget title="🎯 Jobs-to-be-Done Deep Dive" action={<Target className="w-4 h-4 text-purple-500" />}>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                {/* Functional Job */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">📋</span>
                                        <h4 className="text-sm font-semibold text-blue-400">Functional Job</h4>
                                    </div>
                                    <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                                        <div className="text-white font-medium text-sm mb-2">
                                            {data.jtbd_deep_dive.functional_job.job}
                                        </div>

                                        {data.jtbd_deep_dive.functional_job.success_metrics.length > 0 && (
                                            <div className="mt-3">
                                                <div className="text-xs font-semibold text-blue-300 mb-1">Success Metrics</div>
                                                <ul className="space-y-1">
                                                    {data.jtbd_deep_dive.functional_job.success_metrics.slice(0, 3).map((metric, i) => (
                                                        <li key={i} className="text-xs text-gray-300 flex items-start gap-1">
                                                            <span className="text-emerald-400 mt-0.5">✓</span>
                                                            <span>{metric}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {data.jtbd_deep_dive.functional_job.current_alternatives.length > 0 && (
                                            <div className="mt-3">
                                                <div className="text-xs font-semibold text-blue-300 mb-1">Current Alternatives</div>
                                                <div className="text-xs text-gray-400">
                                                    {data.jtbd_deep_dive.functional_job.current_alternatives.join(', ')}
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-3 pt-2 border-t border-blue-500/20">
                                            <div className="text-xs text-blue-300">
                                                Switching Cost: <span className="text-white font-medium">
                                                    {data.jtbd_deep_dive.functional_job.switching_cost}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Emotional Job */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">❤️</span>
                                        <h4 className="text-sm font-semibold text-pink-400">Emotional Job</h4>
                                    </div>
                                    <div className="p-3 rounded-lg bg-pink-500/5 border border-pink-500/20">
                                        <div className="text-white font-medium text-sm mb-3">
                                            {data.jtbd_deep_dive.emotional_job.job}
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-pink-500/20">
                                            <div className="text-xs font-semibold text-pink-300 mb-1">Messaging Angle</div>
                                            <div className="text-xs text-gray-300 italic leading-relaxed">
                                                "{data.jtbd_deep_dive.emotional_job.messaging_angle}"
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Social Job */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">👥</span>
                                        <h4 className="text-sm font-semibold text-purple-400">Social Job</h4>
                                    </div>
                                    <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                                        <div className="text-white font-medium text-sm mb-3">
                                            {data.jtbd_deep_dive.social_job.job}
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-purple-500/20">
                                            <div className="text-xs font-semibold text-purple-300 mb-1">Word-of-Mouth Trigger</div>
                                            <div className="text-xs text-gray-300 leading-relaxed">
                                                {data.jtbd_deep_dive.social_job.word_of_mouth_trigger}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Widget>
                    </div>
                )}

                {/* Marketing Playbook (4x1) */}
                {data.marketing_playbook && (
                    <div className="lg:col-span-4">
                        <Widget title="📚 Marketing Playbook" action={<Zap className="w-4 h-4 text-orange-500" />}>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Buying Triggers */}
                                {data.marketing_playbook.buying_triggers && data.marketing_playbook.buying_triggers.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">🎯</span>
                                            <h4 className="text-sm font-semibold text-emerald-400">Buying Triggers → Campaigns</h4>
                                        </div>
                                        {data.marketing_playbook.buying_triggers.slice(0, 4).map((trigger, i) => (
                                            <div key={i} className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                                                <div className="text-emerald-300 font-semibold text-xs mb-1">
                                                    {trigger.trigger}
                                                </div>
                                                <div className="text-gray-300 text-xs flex items-start gap-1">
                                                    <span className="text-orange-400 mt-0.5">→</span>
                                                    <span>{trigger.campaign_idea}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Content Strategy */}
                                {data.marketing_playbook.content_strategy && data.marketing_playbook.content_strategy.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">📝</span>
                                            <h4 className="text-sm font-semibold text-blue-400">Content Strategy</h4>
                                        </div>
                                        {data.marketing_playbook.content_strategy.slice(0, 4).map((content, i) => (
                                            <div key={i} className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                                                <div className="text-blue-300 font-semibold text-xs mb-1">
                                                    {content.preference}
                                                </div>
                                                <div className="text-gray-300 text-xs leading-relaxed">
                                                    {content.strategy}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Objection Handling */}
                                {data.marketing_playbook.objection_handling && data.marketing_playbook.objection_handling.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">❓</span>
                                            <h4 className="text-sm font-semibold text-yellow-400">Objection Handling</h4>
                                        </div>
                                        {data.marketing_playbook.objection_handling.slice(0, 4).map((objection, i) => (
                                            <div key={i} className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                                                <div className="text-yellow-300 font-semibold text-xs mb-1">
                                                    "{objection.objection}"
                                                </div>
                                                <div className="text-gray-300 text-xs flex items-start gap-1">
                                                    <span className="text-emerald-400 mt-0.5">✓</span>
                                                    <span>{objection.response}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Widget>
                    </div>
                )}
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
                            <h2 className="text-[10px] font-bold text-neutral-500 tracking-[0.2em] uppercase">{t('confidentialReport')}</h2>
                            <p className="text-[10px] text-neutral-600 mt-1">{new Date().toLocaleDateString()}</p>
                        </div>
                    </header>

                    {/* 2. Report Title & Verdict */}
                    <section className="mb-12 relative z-10">
                        <h3 className="font-bold text-xs uppercase tracking-wider mb-2 text-[#C12424]">{t('targetAnalysis')}</h3>
                        <h1 className="text-5xl font-extrabold tracking-tight text-white mb-8 uppercase" style={{ lineHeight: 0.9 }}>
                            {analysis_for}
                        </h1>

                        <div className="grid grid-cols-12 gap-8 items-start">
                            {/* Score */}
                            <div className="col-span-4 border-r border-neutral-800 pr-8">
                                <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide mb-1">{t('verdyctScore')}</div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-7xl font-bold tracking-tighter text-[#C12424]">{pcs_score}</span>
                                    <span className="text-lg font-medium text-neutral-600">/100</span>
                                </div>
                                <div className="mt-3 inline-block px-3 py-1 bg-[#C12424]/10 text-[#C12424] text-xs font-bold tracking-wide uppercase rounded border border-[#C12424]/20">
                                    {score_card.level} {t('potential')}
                                </div>
                            </div>


                            {/* Executive Summary */}
                            <div className="col-span-8 pl-4">
                                <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide mb-2">{t('executiveSummary')}</div>
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
                                            {year && <p className="text-xs text-neutral-500 font-medium mt-1">{t('by')} {year}</p>}
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
                                <h3 className="text-lg font-bold text-white">{t('idealCustomerProfile')}</h3>
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
                                    <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">{t('majorPainPoints')}</p>
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
                                <h3 className="text-lg font-bold text-white">{t('competitiveLandscape')}</h3>
                            </div>

                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr>
                                        <th className="py-2 text-[10px] font-bold text-neutral-600 uppercase tracking-wider border-b border-neutral-800">{t('competitor')}</th>
                                        <th className="py-2 text-[10px] font-bold text-neutral-600 uppercase tracking-wider border-b border-neutral-800 text-right">{t('position')}</th>
                                        <th className="py-2 text-[10px] font-bold text-neutral-600 uppercase tracking-wider border-b border-neutral-800 text-right">{t('source')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(fullReport?.spy?.market_quadrant?.competitors || []).slice(0, 5).map((comp: any, i: number) => (
                                        <tr key={i} className="group">
                                            <td className="py-3 text-sm font-semibold text-gray-200 border-b border-neutral-900 group-last:border-0">{comp.name}</td>
                                            <td className="py-3 text-xs text-neutral-400 border-b border-neutral-900 text-right group-last:border-0">{comp.quadrant_label || "N/A"}</td>
                                            <td className="py-3 border-b border-neutral-900 text-right group-last:border-0">
                                                <span className="inline-block text-[10px] font-medium text-[#C12424] uppercase tracking-wider">
                                                    {comp.verified_url ? t('verified') : t('analyzed')}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {(!fullReport?.spy?.market_quadrant?.competitors || fullReport.spy.market_quadrant.competitors.length === 0) && (
                                <p className="text-sm text-neutral-600 italic mt-4">{t('noCompetitors')}</p>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="mt-12 pt-6 border-t border-neutral-900 flex justify-between items-end relative z-10">
                        <div>
                            <p className="text-[10px] text-neutral-600 font-medium tracking-wide">{t('generatedBy')}</p>
                        </div>
                        {/* Removed Bottom Right Branding as requested */}
                    </footer>
                </div>
            </div>


        </div>
    );
}
