'use client';

import { MetricWidget, METRICS } from './KeyMetricsSection';
import { RequiredActionsWidget, AgentStatusWidget } from './ActionStatusSection';
import SignalRadar from './SignalRadar';
import AlgorithmHealth from './AlgorithmHealth';

export default function MainView() {
  return (
    <main className="flex-1 overflow-auto">
      <div className="max-w-[1600px] mx-auto p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1 text-white">Dashboard</h1>
          <p className="text-sm text-neutral-400">Portfolio overview and agent activity</p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">

          {/* Main Visual - Signal Radar (2x2) */}
          <div className="lg:col-span-2 lg:row-span-2 min-h-[400px]">
            <SignalRadar />
          </div>

          {/* Key Metrics */}
          <div className="lg:col-span-1">
            <MetricWidget {...METRICS[0]} />
          </div>
          <div className="lg:col-span-1">
            <MetricWidget {...METRICS[1]} />
          </div>

          <div className="lg:col-span-1">
            <MetricWidget {...METRICS[2]} />
          </div>

          {/* Algorithm Health */}
          <div className="lg:col-span-1">
            <AlgorithmHealth />
          </div>

          {/* Bottom Row - Action Items */}
          <div className="lg:col-span-2">
            <RequiredActionsWidget />
          </div>
          <div className="lg:col-span-2">
            <AgentStatusWidget />
          </div>
        </div>
      </div>
    </main>
  );
}
