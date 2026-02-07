'use client';

import {
    UploadCloud,
    TrendingUp,
    DollarSign,
    Wallet,
    Calculator,
    Check,
    Users,
    ExternalLink,
    Lock,
    PieChart,
    Flag,
    Calendar
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import Widget from '../dashboard/Widget';

// Backend Model Interfaces
interface PricingTier {
    name: string;
    price: string;
    features: string[];
    recommended: boolean;
    benchmark_competitor: string;
    verified_url: string;
}

interface PricingModel {
    title: string;
    tiers: PricingTier[];
}

interface LeverValue {
    value: number;
    min: number;
    max: number;
    step: number;
}

interface Levers {
    monthly_price: LeverValue;
    ad_spend: LeverValue;
    conversion_rate: LeverValue;
}

interface Metrics {
    ltv_cac_ratio: string;
    status: string;
    estimated_cac: string;
    estimated_ltv: string;
    break_even_users: string;
    projected_runway_months: string;
}

interface ProfitEngine {
    levers: Levers;
    metrics: Metrics;
}

interface RevenueProjection {
    year: string;
    revenue: string;
}

interface RevenueProjections {
    projections: RevenueProjection[];
}

interface CostCategory {
    name: string;
    monthly_amount: number;
    is_variable: boolean;
}

interface FinancialRoadmapPhase {
    phase_name: string;
    duration_months: number;
    required_budget: string;
    milestone_goal: string;
}

interface FinancierData {
    title: string;
    score: number;
    pricing_model: PricingModel;
    profit_engine: ProfitEngine;
    revenue_projection: RevenueProjections;
    financier_footer: {
        verdyct_summary: string;
        recommendation_text: string;
    };
    cost_structure?: CostCategory[];
    financial_roadmap?: FinancialRoadmapPhase[];
}

interface FinancierViewProps {
    data?: FinancierData;
}

export default function FinancierView({ data }: FinancierViewProps) {
    const t = useTranslations('Financier');
    // Interactive sliders state
    const [monthlyPrice, setMonthlyPrice] = useState(19);
    const [adSpend, setAdSpend] = useState(500);
    const [conversionRate, setConversionRate] = useState(2.5);

    // Calculated metrics
    const [ltv, setLtv] = useState(0);
    const [cac, setCac] = useState(0);
    const [ltvCacRatio, setLtvCacRatio] = useState(0);
    const [monthsToProfitability, setMonthsToProfitability] = useState(0);
    const [revenueProjections, setRevenueProjections] = useState<number[]>([]);

    useEffect(() => {
        if (data) {
            // Initialize sliders from backend data if available
            setMonthlyPrice(data.profit_engine.levers.monthly_price.value);
            setAdSpend(data.profit_engine.levers.ad_spend.value);
            setConversionRate(data.profit_engine.levers.conversion_rate.value);
        }
    }, [data]);

    // Recalculate metrics when sliders change
    useEffect(() => {
        // CAC = Cost per acquisition
        const calculatedCAC = (1000 / conversionRate);

        // LTV = Customer Lifetime Value (Monthly Price * Average Customer Lifespan in months)
        const calculatedLTV = monthlyPrice * 24;

        // LTV:CAC Ratio
        const ratio = calculatedCAC > 0 ? calculatedLTV / calculatedCAC : 0;

        // Months to Profitability (simplified calculation)
        const months = ratio > 0 ? Math.max(3, Math.min(24, Math.round(12 / ratio))) : 24;

        setLtv(calculatedLTV);
        setCac(calculatedCAC);
        setLtvCacRatio(ratio);
        setMonthsToProfitability(months);

        // Dynamic Revenue Projection
        const baseMonthlyCustomers = Math.max(5, (adSpend * conversionRate) / 20);
        const growthFactor = 1.2 + (ratio > 0 ? Math.min(ratio, 5) * 0.25 : 0);

        const projections: number[] = [];
        let currentYearlyCustomers = baseMonthlyCustomers * 12;

        for (let i = 0; i < 5; i++) {
            projections.push(Math.round(currentYearlyCustomers * monthlyPrice));
            currentYearlyCustomers *= growthFactor;
        }
        setRevenueProjections(projections);

    }, [monthlyPrice, adSpend, conversionRate]);

    if (!data) {
        return (
            <div className="relative w-full min-h-screen">
                {/* Blurred Content Placeholder */}
                <div className="absolute inset-0 filter blur-xl opacity-50 p-8 space-y-6 pointer-events-none select-none overflow-hidden">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="h-8 w-48 bg-gray-700/50 rounded mb-2"></div>
                            <div className="h-4 w-64 bg-gray-700/50 rounded"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="lg:col-span-2 h-64 bg-gray-800/50 rounded-xl border border-white/5"></div>
                        <div className="lg:col-span-2 h-64 bg-gray-800/50 rounded-xl border border-white/5"></div>
                        <div className="lg:col-span-4 h-64 bg-gray-800/50 rounded-xl border border-white/5"></div>
                    </div>
                </div>

                {/* Lock Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4">
                    <div className="bg-black/80 backdrop-blur-md border border-white/10 p-8 rounded-2xl max-w-md w-full text-center space-y-4 shadow-2xl">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Lock className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white">{t('fullAnalysisRequired')}</h3>
                        <p className="text-neutral-400">
                            {t('unlockMessage')}
                        </p>
                        <div className="pt-2">
                            <span className="inline-block px-4 py-2 bg-white text-black rounded-full text-sm font-semibold">
                                {t('upgrade')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const { pricing_model, financier_footer } = data;
    const maxProjection = Math.max(...revenueProjections, 1);

    // Identify tiers
    const recommendedTier = pricing_model.tiers.find(t => t.recommended) || pricing_model.tiers[0];
    const otherTiers = pricing_model.tiers.filter(t => !t.recommended);
    const starterTier = otherTiers.length > 0 ? otherTiers[0] : null;
    const enterpriseTier = otherTiers.length > 1 ? otherTiers[1] : null;

    return (
        <div className="max-w-[1600px] mx-auto p-8 space-y-6">
            {/* Header */}
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1 text-white">{t('title')}</h1>
                    <p className="text-sm text-neutral-400">{t('subtitle')}</p>
                </div>
            </header>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">

                {/* 1. Profit Engine (2x2) - Interactive Calculator */}
                <div className="lg:col-span-2 lg:row-span-2">
                    <Widget title={t('profitEngine')} action={<Calculator className="w-4 h-4 text-emerald-500" />}>
                        <div className="flex flex-col h-full gap-6">
                            {/* Top Section: Main Health Indicator */}
                            <div className="grid grid-cols-2 gap-4 px-2 pb-4 border-b border-white/5">
                                <div className="space-y-1">
                                    <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('businessHealth')}</div>
                                    <div className="flex items-baseline gap-2">
                                        <span className={`text-4xl font-bold tracking-tighter ${ltvCacRatio >= 3 ? 'text-emerald-500' : ltvCacRatio >= 2 ? 'text-yellow-500' : 'text-red-500'}`}>
                                            {ltvCacRatio.toFixed(1)}x
                                        </span>
                                        <span className="text-xs text-neutral-500 font-medium whitespace-nowrap">LTV:CAC</span>
                                    </div>
                                </div>
                                <div className="text-right space-y-1">
                                    <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('timeToProfit')}</div>
                                    <div className="text-2xl font-bold text-white">{monthsToProfitability} <span className="text-sm font-normal text-neutral-500">{t('months')}</span></div>
                                </div>
                                {/* Row 2: Break Even & Runway - Only if data available from backend */}
                                {data?.profit_engine.metrics.break_even_users && (
                                    <>
                                        <div className="space-y-1">
                                            <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Break Even</div>
                                            <div className="text-lg font-bold text-white flex items-center gap-1">
                                                {data.profit_engine.metrics.break_even_users}
                                                <Users className="w-3 h-3 text-neutral-500" />
                                            </div>
                                        </div>
                                        <div className="text-right space-y-1">
                                            <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Runway</div>
                                            <div className="text-lg font-bold text-white flex items-center justify-end gap-1">
                                                {data.profit_engine.metrics.projected_runway_months}
                                                <Calendar className="w-3 h-3 text-neutral-500" />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Middle Section: Sliders */}
                            <div className="space-y-5 flex-1">
                                {/* Monthly Price */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white font-medium">{t('monthlyPrice')}</span>
                                        <span className="text-emerald-400 font-mono">€{monthlyPrice}</span>
                                    </div>
                                    <input
                                        type="range" min="9" max="99" step="1"
                                        value={monthlyPrice} onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                                        className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                    />
                                </div>

                                {/* Marketing Budget (formerly Ad Spend) */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <div className="flex flex-col">
                                            <span className="text-white font-medium">Marketing Budget</span>
                                            <span className="text-[10px] text-neutral-500">Ads & Tools</span>
                                        </div>
                                        <span className="text-emerald-400 font-mono">€{adSpend}</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="2000" step="50"
                                        value={adSpend} onChange={(e) => setAdSpend(Number(e.target.value))}
                                        className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                    />
                                    <p className="text-[10px] text-neutral-400">
                                        {adSpend === 0 ? "✨ Organic Strategy (SEO, Content, Cold Outreach)" : "🚀 Paid Ads + Organic Growth"}
                                    </p>
                                </div>

                                {/* Conversion Rate */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white font-medium">{t('conversionRate')}</span>
                                        <span className="text-emerald-400 font-mono">{conversionRate}%</span>
                                    </div>
                                    <input
                                        type="range" min="0.5" max="10" step="0.5"
                                        value={conversionRate} onChange={(e) => setConversionRate(Number(e.target.value))}
                                        className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                    />
                                </div>
                            </div>

                            {/* Bottom Section: Insight */}
                            <div className="mt-auto flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                                <div className={`mt-0.5 p-1 rounded-full ${ltvCacRatio >= 3 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                    <TrendingUp className="w-3 h-3" />
                                </div>
                                <p className="text-xs text-neutral-300 leading-relaxed">
                                    <strong className="text-white">{t('verdyctLabel')}</strong> {financier_footer.verdyct_summary}
                                </p>
                            </div>
                        </div>
                    </Widget>
                </div>

                {/* 2. Revenue Projection (2x1) - Top Right */}
                <div className="lg:col-span-2">
                    <Widget title={t('revenueProjection')}>
                        <div className="flex flex-col h-full justify-between">
                            <div className="flex items-end justify-between h-32 gap-2 mt-8 px-2">
                                {revenueProjections.map((amount, i) => {
                                    // Calculate height percentage, ensure at least 4% for visibility if non-zero
                                    const percentage = maxProjection > 0 ? (amount / maxProjection) * 100 : 0;
                                    const barHeight = Math.max(percentage, 4); // Min height 4%

                                    return (
                                        <div key={i} className="flex flex-col items-center gap-2 group w-full relative h-full justify-end">
                                            {/* Bar containing tooltip */}
                                            <div
                                                className="w-full bg-emerald-500/20 border border-emerald-500/30 rounded-t-sm relative group-hover:bg-emerald-500 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-300"
                                                style={{ height: `${barHeight}%` }}
                                            >
                                                {/* Tooltip */}
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-neutral-900 border border-neutral-800 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                                    €{amount.toLocaleString(undefined, { maximumFractionDigits: 0, notation: 'compact' })}
                                                </div>
                                            </div>

                                            {/* X Axis Label */}
                                            <div className="text-[10px] text-neutral-500 font-medium shrink-0">Yr {i + 1}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </Widget>
                </div>

                {/* 3. Unit Economics (2x1) - Middle Right */}
                <div className="lg:col-span-2">
                    <Widget title={t('unitEconomics')}>
                        <div className="grid grid-cols-2 gap-4 h-full">
                            <div className="flex flex-col justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                                <div className="flex items-center gap-2 text-xs text-neutral-400">
                                    <Users className="w-3.5 h-3.5" />
                                    <span>CAC</span>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">€{cac.toFixed(0)}</div>
                                    <div className="text-[10px] text-neutral-500 mt-1">{t('costPerAcquisition')}</div>
                                </div>
                            </div>
                            <div className="flex flex-col justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                                <div className="flex items-center gap-2 =text-xs text-neutral-400">
                                    <Wallet className="w-3.5 h-3.5" />
                                    <span>LTV</span>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">€{ltv.toFixed(0)}</div>
                                    <div className="text-[10px] text-emerald-500 mt-1 flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3" /> {t('lifespan')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Widget>
                </div>

                {/* NEW: Cost Structure (2x2) */}
                {data.cost_structure && (
                    <div className="lg:col-span-2 lg:row-span-2">
                        <Widget title="Cost Structure" action={<PieChart className="w-4 h-4 text-emerald-500" />}>
                            <div className="flex flex-col gap-2 h-full overflow-auto pr-1 custom-scrollbar max-h-[300px]">
                                {data.cost_structure.map((cost, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 rounded bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${cost.is_variable ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
                                            <span className="text-sm text-neutral-200 font-medium">{cost.name}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-mono text-white">€{cost.monthly_amount.toLocaleString()}</div>
                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-neutral-400 inline-block mt-1">
                                                {cost.is_variable ? 'Variable' : 'Fixed'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {/* Total */}
                                <div className="mt-2 pt-2 border-t border-white/10 flex justify-between items-center px-3">
                                    <span className="text-sm text-neutral-400">Total Estimated Monthly</span>
                                    <span className="text-base font-bold text-white">
                                        €{data.cost_structure.reduce((acc, c) => acc + c.monthly_amount, 0).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </Widget>
                    </div>
                )}

                {/* NEW: Financial Roadmap (2x2) */}
                {data.financial_roadmap && (
                    <div className="lg:col-span-2 lg:row-span-2">
                        <Widget title="Funding Strategy" action={<Flag className="w-4 h-4 text-emerald-500" />}>
                            <div className="relative border-l border-emerald-500/20 ml-3 space-y-8 py-4 h-full overflow-auto custom-scrollbar max-h-[300px]">
                                {data.financial_roadmap.map((phase, i) => (
                                    <div key={i} className="relative pl-8">
                                        <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-black"></div>
                                        <div>
                                            <div className="flex justify-between mb-1 items-start">
                                                <h4 className="text-base font-bold text-white">{phase.phase_name}</h4>
                                                <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20 font-mono whitespace-nowrap ml-2">
                                                    {phase.required_budget}
                                                </span>
                                            </div>
                                            <p className="text-xs text-neutral-400 mb-2 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> {phase.duration_months} months duration
                                            </p>
                                            <div className="p-3 bg-white/5 rounded border border-white/5">
                                                <p className="text-sm text-neutral-300 italic leading-relaxed">"{phase.milestone_goal}"</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Widget>
                    </div>
                )}

                {/* 4. Pricing Strategy (4x1) - Bottom Row */}
                <div className="lg:col-span-4">
                    <Widget title={t('pricingStrategy')} action={<DollarSign className="w-4 h-4 text-neutral-500" />}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                            {/* Tier 1 - Starter */}
                            <div className="p-4 rounded-lg border border-neutral-800 bg-neutral-900/30 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-neutral-400">{starterTier ? starterTier.name : t('starter')}</span>
                                            {starterTier?.verified_url && (
                                                <a href={starterTier.verified_url} target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-emerald-400">
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-2xl font-bold text-white mb-3">{starterTier ? starterTier.price : t('free')}</div>
                                    <ul className="space-y-2">
                                        {starterTier ? starterTier.features.map((feature, i) => (
                                            <li key={i} className="text-xs text-neutral-400 flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" />{feature}</li>
                                        )) : (
                                            <li className="text-xs text-neutral-400 flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" />{t('basicFeatures')}</li>
                                        )}
                                    </ul>
                                </div>
                                <button className="w-full mt-4 py-1.5 rounded border border-neutral-700 text-xs font-medium text-neutral-300 hover:bg-neutral-800 transition-colors">{t('currentPlan')}</button>
                            </div>

                            {/* Tier 2 - Recommended */}
                            <div className="p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5 relative flex flex-col justify-between">
                                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">{t('recommended').toUpperCase()}</div>
                                <div>
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-emerald-400">{recommendedTier.name}</span>
                                            {recommendedTier?.verified_url && (
                                                <a href={recommendedTier.verified_url} target="_blank" rel="noopener noreferrer" className="text-emerald-500/50 hover:text-emerald-400">
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-2xl font-bold text-white mb-3">{recommendedTier.price}</div>
                                    <p className="text-xs text-neutral-300 mb-3">{financier_footer.recommendation_text}</p>
                                    <ul className="space-y-2">
                                        {recommendedTier.features.map((feature, i) => (
                                            <li key={i} className="text-xs text-neutral-300 flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" />{feature}</li>
                                        ))}
                                    </ul>
                                </div>
                                <button className="w-full mt-4 py-1.5 rounded bg-emerald-500 text-xs font-bold text-black hover:bg-emerald-400 transition-colors">{t('upgradeToPro')}</button>
                            </div>

                            {/* Tier 3 - Enterprise */}
                            <div className="p-4 rounded-lg border border-neutral-800 bg-neutral-900/30 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-neutral-400">{enterpriseTier ? enterpriseTier.name : t('enterprise')}</span>
                                            {enterpriseTier?.verified_url && (
                                                <a href={enterpriseTier.verified_url} target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-emerald-400">
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-2xl font-bold text-white mb-3">{enterpriseTier ? enterpriseTier.price : t('custom')}</div>
                                    <ul className="space-y-2">
                                        {enterpriseTier ? enterpriseTier.features.map((feature, i) => (
                                            <li key={i} className="text-xs text-neutral-400 flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" />{feature}</li>
                                        )) : (
                                            <li className="text-xs text-neutral-400 flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" />{t('advancedFeatures')}</li>
                                        )}
                                    </ul>
                                </div>
                                <button className="w-full mt-4 py-1.5 rounded border border-neutral-700 text-xs font-medium text-neutral-300 hover:bg-neutral-800 transition-colors">{t('contactSales')}</button>
                            </div>
                        </div>
                    </Widget>
                </div>

            </div>
        </div>
    );
}
