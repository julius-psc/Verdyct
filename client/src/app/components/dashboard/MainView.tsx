'use client';

import { useEffect, useState } from 'react';
import { MetricWidget, METRICS } from './KeyMetricsSection';
import { RequiredActionsWidget, AgentStatusWidget } from './ActionStatusSection';
import SignalRadar from './SignalRadar';
import AlgorithmHealth from './AlgorithmHealth';
import { fetchProjects, Project } from '../../../lib/api';

interface MetricItem {
  title: string;
  value: string | number;
  trend?: number;
  subtitle?: string;
  details?: { label: string; value: number; color: string }[];
  extra?: string;
}

export default function MainView() {
  const [metrics, setMetrics] = useState<MetricItem[]>(METRICS as MetricItem[]);

  useEffect(() => {
    async function loadData() {
      const data = await fetchProjects();

      if (data.length === 0) return;

      // Calculate metrics
      const activeVentures = data.length;
      const avgPcs = data.length > 0
        ? Math.round(data.reduce((acc, p) => acc + p.pos_score, 0) / data.length)
        : 0;

      // Update metrics state
      const newMetrics = [...metrics];

      // Update Active Ventures
      newMetrics[0] = {
        ...newMetrics[0],
        value: activeVentures,
        subtitle: `${data.filter(p => p.status === 'draft').length} Awaiting Analysis`
      };

      // Update Avg PCS Score
      const topProject = data.reduce((prev, current) => (prev.pos_score > current.pos_score) ? prev : current, data[0]);
      newMetrics[2] = {
        ...newMetrics[2],
        value: `${avgPcs}%`,
        extra: topProject ? `Top: ${topProject.name.substring(0, 15)}... (${topProject.pos_score}%)` : "No projects"
      };

      setMetrics(newMetrics);
    }

    loadData();
  }, []);

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
            <MetricWidget {...metrics[0]} />
          </div>
          <div className="lg:col-span-1">
            <MetricWidget {...metrics[1]} />
          </div>

          <div className="lg:col-span-1">
            <MetricWidget {...metrics[2]} />
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
