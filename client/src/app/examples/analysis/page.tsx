'use client';

import { mockFullReport } from '@/data/mockVerdyct';
import AnalystView from '@/app/components/analyst/AnalystView';
import SpyView from '@/app/components/spy/SpyView';
import FinancierView from '@/app/components/financier/FinancierView';
import ArchitectView from '@/app/components/architect/ArchitectView';
import Link from 'next/link';
import { ArrowLeft, Sparkles, AlertTriangle } from 'lucide-react';

export default function AnalysisExamplePage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">

            {/* Disclaimer Banner */}
            <div className="bg-gradient-to-r from-emerald-900/50 to-neutral-900 border-b border-emerald-500/20 px-4 py-2 flex items-center justify-center gap-2 text-xs md:text-sm text-emerald-100 relative z-50">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="font-medium">This is a DEMO Analysis of a "Unicorn" Idea.</span>
                <span className="hidden md:inline text-emerald-400/70 ml-2"> | </span>
                <span className="hidden md:inline opacity-70">See what Verdyct can reveal about YOUR idea.</span>
            </div>

            {/* Nav Back */}
            <div className="max-w-[1600px] mx-auto px-8 pt-8 pb-4">
                <Link href="/" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Pricing
                </Link>
            </div>

            {/* Views Stacked */}
            <div className="space-y-0.5"> {/* Minimal gap for 'continuous' feel */}

                {/* 1. Analyst */}
                <section className="relative">
                    <AnalystView data={mockFullReport.analyst} fullReport={mockFullReport} isReadOnly={true} />
                </section>

                {/* 2. Spy */}
                <section className="relative">
                    <SpyView data={mockFullReport.spy} />
                </section>

                {/* 3. Financier */}
                <section className="relative">
                    <FinancierView data={mockFullReport.financier} />
                </section>

                {/* 4. Architect */}
                <section className="relative">
                    <ArchitectView data={mockFullReport.architect as any} projectId="demo" />
                    {/* Note: ArchitectView might fetch stats, which will fail for 'demo'. 
                        Ideally we'd mock that too, but purely UI-wise it handles null stats gracefully. */}
                </section>

            </div>

            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2">
                <Link href="/#pricing" className="group relative flex items-center gap-3 px-8 py-4 bg-emerald-500 text-black rounded-full font-bold shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_50px_rgba(16,185,129,0.6)] hover:scale-105 transition-all duration-300">
                    <span>Build YOUR Idea Now</span>
                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </Link>
                <p className="text-[9px] text-neutral-500 bg-black/80 backdrop-blur px-3 py-1 rounded-full border border-white/5">
                    *Example demo. Product features may vary.
                </p>
            </div>
        </div>
    );
}
