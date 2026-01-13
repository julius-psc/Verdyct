'use client';

import { useEffect, useState } from 'react';
import { MetricWidget } from './KeyMetricsSection';
import RecentProjectsWidget from './RecentProjectsWidget';
import SignalRadar from './SignalRadar';

import { fetchProjects, Project } from '@/lib/api';
import { createClient } from '@/utils/supabase/client';

interface MetricItem {
  title: string;
  value: string | number;
  trend?: number;
  subtitle?: string;
  details?: { label: string; value: number; color: string }[];
  extra?: string;
}

interface SignalPoint {
  label: string;
  value: number;
  baseline: number;
}

export default function MainView() {
  const [metrics, setMetrics] = useState<MetricItem[]>([
    {
      title: "Active Ventures",
      value: 0,
      subtitle: "Loading..."
    },
    {
      title: "Global MSI",
      value: "-",
      subtitle: "Portfolio Moat Maturity"
    },
    {
      title: "Avg POS Score",
      value: "-",
      subtitle: "Average Validation Score"
    }
  ]);

  const [signals, setSignals] = useState<SignalPoint[]>([
    { label: 'Market', value: 0, baseline: 60 },
    { label: 'Competitive', value: 0, baseline: 60 },
    { label: 'Financial', value: 0, baseline: 60 },
    { label: 'Technical', value: 0, baseline: 60 },
  ]);

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const data = await fetchProjects(token);
      setProjects(data);
      setLoading(false);

      if (data.length === 0) return;

      // Calculate metrics
      const activeVentures = data.length;
      const avgPos = data.length > 0
        ? Math.round(data.reduce((acc, p) => acc + p.pos_score, 0) / data.length)
        : 0;

      // Calculate agent scores from report_json
      let totalAnalyst = 0, totalSpy = 0, totalFinancier = 0, totalArchitect = 0;
      let countAnalyst = 0, countSpy = 0, countFinancier = 0, countArchitect = 0;

      data.forEach(project => {
        if (project.report_json?.agents) {
          const agents = project.report_json.agents;

          if (agents.analyst?.score) {
            totalAnalyst += agents.analyst.score;
            countAnalyst++;
          }
          if (agents.spy?.score) {
            totalSpy += agents.spy.score;
            countSpy++;
          }
          if (agents.financier?.score) {
            totalFinancier += agents.financier.score;
            countFinancier++;
          }
          if (agents.architect?.score) {
            totalArchitect += agents.architect.score;
            countArchitect++;
          }
        }
      });

      const avgAnalyst = countAnalyst > 0 ? totalAnalyst / countAnalyst : 0;
      const avgSpy = countSpy > 0 ? totalSpy / countSpy : 0;
      const avgFinancier = countFinancier > 0 ? totalFinancier / countFinancier : 0;
      const avgArchitect = countArchitect > 0 ? totalArchitect / countArchitect : 0;

      // Global MSI = average of all agent scores
      const globalMSI = (avgAnalyst + avgSpy + avgFinancier + avgArchitect) / 4;

      // Update signals for radar
      setSignals([
        { label: 'Market', value: avgAnalyst, baseline: 60 },
        { label: 'Competitive', value: avgSpy, baseline: 60 },
        { label: 'Financial', value: avgFinancier, baseline: 60 },
        { label: 'Technical', value: avgArchitect, baseline: 60 },
      ]);

      // Update metrics state
      const newMetrics = [...metrics];

      // Update Active Ventures
      newMetrics[0] = {
        ...newMetrics[0],
        value: activeVentures,
        subtitle: `${data.filter(p => p.status === 'draft').length} Awaiting Analysis`
      };

      // Update Global MSI
      newMetrics[1] = {
        ...newMetrics[1],
        value: globalMSI > 0 ? globalMSI.toFixed(1) : "-",
        subtitle: "Portfolio Moat Maturity"
      };

      // Update Avg POS Score
      const topProject = data.reduce((prev, current) => (prev.pos_score > current.pos_score) ? prev : current, data[0]);
      newMetrics[2] = {
        ...newMetrics[2],
        value: `${avgPos}%`,
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
            <SignalRadar signals={signals} />
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


          {/* Recent Projects - Spanning full width at bottom */}
          <div className="lg:col-span-4">
            <RecentProjectsWidget projects={projects} />
          </div>




        </div>
      </div>
    </main>
  );
}
