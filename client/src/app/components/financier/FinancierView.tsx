'use client';

import {
    UploadCloud,
    TrendingUp,
    DollarSign,
    PieChart,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    Coins,
    CreditCard,
    Scale,
    Calculator,
    Check,
    AlertCircle,
    Users
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Widget from '../dashboard/Widget';

export default function FinancierView() {
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

    // Recalculate metrics when sliders change
    useEffect(() => {
        // CAC = Cost per acquisition
        // Logic: adSpend / ((adSpend / 100) * conversionRate / 10) -> 1000 / conversionRate
        // We'll use a slightly more realistic formula that scales with spend efficiency
        const calculatedCAC = (1000 / conversionRate);

        // LTV = Customer Lifetime Value (Monthly Price * Average Customer Lifespan in months)
        // Assuming average customer stays for ~24 months
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
        // Base monthly customers derived from Ad Spend & Efficiency
        // Multiplier added to simulate organic growth alongside paid
        const baseMonthlyCustomers = Math.max(5, (adSpend * conversionRate) / 20);

        // Growth rate depends on business health (LTV:CAC)
        // A healthy business grows faster due to reinvestment
        const growthFactor = 1.2 + (ratio > 0 ? Math.min(ratio, 5) * 0.25 : 0);

        const projections: number[] = [];
        let currentYearlyCustomers = baseMonthlyCustomers * 12;

        for (let i = 0; i < 5; i++) {
            projections.push(Math.round(currentYearlyCustomers * monthlyPrice));
            currentYearlyCustomers *= growthFactor;
        }
        setRevenueProjections(projections);

    }, [monthlyPrice, adSpend, conversionRate]);

    const maxProjection = Math.max(...revenueProjections, 1);

    return (
        <div className="max-w-[1600px] mx-auto p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1 text-white">The Financier</h1>
                    <p className="text-sm text-neutral-400">Financial modeling for: AI eLearning Captioning Tool</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white transition-colors">
                    <UploadCloud className="w-4 h-4" />
                    Export Model
                </button>
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
                                    <strong className="text-white">Verdyct:</strong> {ltvCacRatio >= 3
                                        ? "Excellent unit economics. You are ready to scale ad spend aggressively."
                                        : "Unit economics need optimization. Focus on increasing conversion rate before scaling."}
                                </p>
                            </div>
                        </div>
                    </Widget>
                </div>

                {/* 2. Revenue Projection (2x1) - Top Right */}
                <div className="lg:col-span-2">
                    <Widget title="5-Year Revenue Projection">
                        <div className="flex flex-col h-full justify-between">
                            <div className="flex items-end justify-between gap-4 h-32 px-2 pt-4">
                                {revenueProjections.map((revenue, i) => (
                                    <div key={i} className="flex-1 flex flex-col justify-end group cursor-pointer h-full">
                                        <div className="w-full relative flex items-end">
                                            <div
                                                className="w-full bg-emerald-500/40 border-t border-x border-emerald-500/50 rounded-t-sm transition-all duration-500 ease-out group-hover:bg-emerald-500/60"
                                                style={{ height: `${Math.max(4, (revenue / maxProjection) * 100)}%` }}
                                            >
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-900 border border-neutral-800 px-2 py-1 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-xl">
                                                    €{revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-[10px] text-neutral-500 text-center mt-2 border-t border-white/5 pt-2 w-full">Yr {i + 1}</div>
                                    </div>
                                ))}
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
                            {/* Tier 1 */}
                            <div className="p-4 rounded-lg border border-neutral-800 bg-neutral-900/30 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-sm font-medium text-neutral-400">Starter</span>
                                    </div>
                                    <div className="text-2xl font-bold text-white mb-3">Free</div>
                                    <ul className="space-y-2">
                                        <li className="text-xs text-neutral-400 flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" />1 Project Analysis</li>
                                        <li className="text-xs text-neutral-400 flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" />Basic Export</li>
                                    </ul>
                                </div>
                                <button className="w-full mt-4 py-1.5 rounded border border-neutral-700 text-xs font-medium text-neutral-300 hover:bg-neutral-800 transition-colors">Current Plan</button>
                            </div>

                            {/* Tier 2 - Recommended */}
                            <div className="p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5 relative flex flex-col justify-between">
                                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">RECOMMENDED</div>
                                <div>
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-sm font-medium text-emerald-400">Pro</span>
                                    </div>
                                    <div className="text-2xl font-bold text-white mb-3">€19<span className="text-sm font-normal text-neutral-500">/mo</span></div>
                                    <ul className="space-y-2">
                                        <li className="text-xs text-neutral-300 flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" />Unlimited Projects</li>
                                        <li className="text-xs text-neutral-300 flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" />All AI Agents</li>
                                        <li className="text-xs text-neutral-300 flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" />Priority Support</li>
                                    </ul>
                                </div>
                                <button className="w-full mt-4 py-1.5 rounded bg-emerald-500 text-xs font-bold text-black hover:bg-emerald-400 transition-colors">Upgrade to Pro</button>
                            </div>

                            {/* Tier 3 */}
                            <div className="p-4 rounded-lg border border-neutral-800 bg-neutral-900/30 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-sm font-medium text-neutral-400">Enterprise</span>
                                    </div>
                                    <div className="text-2xl font-bold text-white mb-3">Custom</div>
                                    <ul className="space-y-2">
                                        <li className="text-xs text-neutral-400 flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" />API Access</li>
                                        <li className="text-xs text-neutral-400 flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" />SSO & Team Mgmt</li>
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
