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
    Lock
} from 'lucide-react';
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
}

interface FinancierViewProps {
    data?: FinancierData;
}

export default function FinancierView({ data }: FinancierViewProps) {
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
                        <h3 className="text-xl font-bold text-white">Full Analysis Required</h3>
                        <p className="text-neutral-400">
                            Unlock the Financier Agent to see detailed financial projections, pricing models, and profit engine.
                        </p>
                        <div className="pt-2">
                            <span className="inline-block px-4 py-2 bg-white text-black rounded-full text-sm font-semibold">
                                Upgrade to Full (1 Credit)
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1 text-white">The Financier</h1>
                    <p className="text-sm text-neutral-400">Financial Modeling & Pricing Strategy</p>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">

                {/* 1. Profit Engine (2x2) - Interactive Calculator */}
                <div className="lg:col-span-2 lg:row-span-2">
                    <Widget title="The Profit Engine" action={<Calculator className="w-4 h-4 text-emerald-500" />}>
                        <div className="flex flex-col h-full gap-6">
                            {/* Top Section: Main Health Indicator */}
                            <div className="flex items-center justify-between px-2 pb-4 border-b border-white/5">
                                <div className="space-y-1">
                                    <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Business Health</div>
                                    <div className="flex items-baseline gap-3">
                                        <span className={`text-5xl font-bold tracking-tighter ${ltvCacRatio >= 3 ? 'text-emerald-500' : ltvCacRatio >= 2 ? 'text-yellow-500' : 'text-red-500'}`}>
                                            {ltvCacRatio.toFixed(1)}x
                                        </span>
                                        <span className="text-sm text-neutral-500 font-medium">LTV:CAC Ratio</span>
                                    </div>
                                </div>
                                <div className="text-right space-y-1">
                                    <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Time to Profit</div>
                                    <div className="text-3xl font-bold text-white">{monthsToProfitability} <span className="text-sm font-normal text-neutral-500">months</span></div>
                                </div>
                            </div>

                            {/* Middle Section: Sliders */}
                            <div className="space-y-5 flex-1">
                                {/* Monthly Price */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white font-medium">Monthly Price</span>
                                        <span className="text-emerald-400 font-mono">€{monthlyPrice}</span>
                                    </div>
                                    <input
                                        type="range" min="9" max="99" step="1"
                                        value={monthlyPrice} onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                                        className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                    />
                                </div>

                                {/* Ad Spend */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white font-medium">Monthly Ad Spend</span>
                                        <span className="text-emerald-400 font-mono">€{adSpend}</span>
                                    </div>
                                    <input
                                        type="range" min="100" max="5000" step="100"
                                        value={adSpend} onChange={(e) => setAdSpend(Number(e.target.value))}
                                        className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                    />
                                </div>

                                {/* Conversion Rate */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white font-medium">Conversion Rate</span>
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
                                    <strong className="text-white">Verdyct:</strong> {financier_footer.verdyct_summary}
                                </p>
                            </div>
                        </div>
                    </Widget>
                </div>

                {/* 2. Revenue Projection (2x1) - Top Right */}
                <div className="lg:col-span-2">
                    <Widget title="5-Year Revenue Projection (Simulated)">
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
                    <Widget title="Unit Economics Breakdown">
                        <div className="grid grid-cols-2 gap-4 h-full">
                            <div className="flex flex-col justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                                <div className="flex items-center gap-2 text-xs text-neutral-400">
                                    <Users className="w-3.5 h-3.5" />
                                    <span>CAC</span>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">€{cac.toFixed(0)}</div>
                                    <div className="text-[10px] text-neutral-500 mt-1">Cost per Acquisition</div>
                                </div>
                            </div>
                            <div className="flex flex-col justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                                <div className="flex items-center gap-2 text-xs text-neutral-400">
                                    <Wallet className="w-3.5 h-3.5" />
                                    <span>LTV</span>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">€{ltv.toFixed(0)}</div>
                                    <div className="text-[10px] text-emerald-500 mt-1 flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3" /> 24mo Lifespan
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Widget>
                </div>

                {/* 4. Pricing Strategy (4x1) - Bottom Row */}
                <div className="lg:col-span-4">
                    <Widget title="Pricing Strategy" action={<DollarSign className="w-4 h-4 text-neutral-500" />}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                            {/* Tier 1 - Starter */}
                            <div className="p-4 rounded-lg border border-neutral-800 bg-neutral-900/30 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-neutral-400">{starterTier ? starterTier.name : 'Starter'}</span>
                                            {starterTier?.verified_url && (
                                                <a href={starterTier.verified_url} target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-emerald-400">
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-2xl font-bold text-white mb-3">{starterTier ? starterTier.price : 'Free'}</div>
                                    <ul className="space-y-2">
                                        {starterTier ? starterTier.features.map((feature, i) => (
                                            <li key={i} className="text-xs text-neutral-400 flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" />{feature}</li>
                                        )) : (
                                            <li className="text-xs text-neutral-400 flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" />Basic Features</li>
                                        )}
                                    </ul>
                                </div>
                                <button className="w-full mt-4 py-1.5 rounded border border-neutral-700 text-xs font-medium text-neutral-300 hover:bg-neutral-800 transition-colors">Current Plan</button>
                            </div>

                            {/* Tier 2 - Recommended */}
                            <div className="p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5 relative flex flex-col justify-between">
                                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">RECOMMENDED</div>
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
                                <button className="w-full mt-4 py-1.5 rounded bg-emerald-500 text-xs font-bold text-black hover:bg-emerald-400 transition-colors">Upgrade to Pro</button>
                            </div>

                            {/* Tier 3 - Enterprise */}
                            <div className="p-4 rounded-lg border border-neutral-800 bg-neutral-900/30 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-neutral-400">{enterpriseTier ? enterpriseTier.name : 'Enterprise'}</span>
                                            {enterpriseTier?.verified_url && (
                                                <a href={enterpriseTier.verified_url} target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-emerald-400">
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-2xl font-bold text-white mb-3">{enterpriseTier ? enterpriseTier.price : 'Custom'}</div>
                                    <ul className="space-y-2">
                                        {enterpriseTier ? enterpriseTier.features.map((feature, i) => (
                                            <li key={i} className="text-xs text-neutral-400 flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" />{feature}</li>
                                        )) : (
                                            <li className="text-xs text-neutral-400 flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" />Advanced Features</li>
                                        )}
                                    </ul>
                                </div>
                                <button className="w-full mt-4 py-1.5 rounded border border-neutral-700 text-xs font-medium text-neutral-300 hover:bg-neutral-800 transition-colors">Contact Sales</button>
                            </div>
                        </div>
                    </Widget>
                </div>

            </div>
        </div>
    );
}
