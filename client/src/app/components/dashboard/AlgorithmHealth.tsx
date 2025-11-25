'use client';

import { Activity, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function AlgorithmHealth() {
    return (
        <div className="h-full bg-neutral-900/50 rounded-3xl border border-white/5 backdrop-blur-sm p-6 flex flex-col justify-between relative overflow-hidden">
            {/* Background Grid */}
            {/* Background Grid - Removed */}

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-medium text-emerald-500">System Health</span>
                </div>

                <h3 className="text-xl font-semibold text-white mb-1 truncate">Predictive Engine</h3>
                <p className="text-xs text-neutral-400">Continuous learning active</p>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-4 mt-6">
                <div className="bg-emerald-500/10 rounded-2xl p-4 border border-emerald-500/20">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-xs text-emerald-400 font-medium">Stability Score</span>
                    </div>
                    <div className="text-2xl font-bold text-white">98.5%</div>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                        <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-xs text-neutral-400">Last Recalculation</span>
                    </div>
                    <div className="text-lg font-mono text-white">24h ago</div>
                </div>
            </div>
        </div>
    );
}
