'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import Widget from './Widget';

export interface MetricWidgetProps {
  title: string;
  value: string | number;
  trend?: number;
  subtitle?: string;
}

export const METRICS = [
  {
    title: "Active Ventures",
    value: 12,
    trend: undefined,
    subtitle: "3 Awaiting Agent Analysis",
    details: [
      { label: "Pre-Seed", value: 4, color: "bg-blue-500" },
      { label: "Seed", value: 6, color: "bg-emerald-500" },
      { label: "Series A", value: 2, color: "bg-purple-500" }
    ]
  },
  {
    title: "Global MSI",
    value: "8.7",
    trend: 12.5,
    subtitle: "Portfolio Moat Maturity",
    extra: "Target: 9.0 by Q4"
  },
  {
    title: "Avg PCS Score",
    value: "78%",
    trend: undefined,
    subtitle: "Average Validation Score",
    extra: "Top: Project Gamma (95%)"
  }
];

export function MetricWidget({ title, value, trend, subtitle, details, extra }: any) {
  const isPositive = trend !== undefined && trend >= 0;
  const isPercentage = typeof value === 'string' && value.includes('%');
  const numericValue = isPercentage ? parseInt((value as string).replace('%', '')) : 0;

  return (
    <Widget title={title} showGrid={false}>
      <div className="flex flex-col justify-between h-full">
        <div className="flex items-end justify-between mb-4">
          <div className="space-y-1">
            <div className="flex items-end gap-2">
              <div className="text-3xl font-semibold text-white">{value}</div>
              {trend !== undefined && (
                <div className={`flex items-center gap-1 text-sm mb-1 ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                  {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{Math.abs(trend)}%</span>
                </div>
              )}
            </div>
            {subtitle && <p className="text-xs text-neutral-400">{subtitle}</p>}
          </div>

          {/* Circular Progress for Percentage Metrics */}
          {isPercentage && (
            <div className="relative w-12 h-12 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-neutral-800"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="text-emerald-500"
                  strokeDasharray={`${numericValue}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[8px] font-medium text-neutral-500">
                Score
              </div>
            </div>
          )}
        </div>

        {/* Extra Content / Details */}
        <div className="mt-auto pt-4 border-t border-white/5">
          {details ? (
            <div className="flex gap-2">
              {details.map((d: any, i: number) => (
                <div key={i} className="flex-1">
                  <div className={`h-1 rounded-full mb-1 ${d.color}`} />
                  <div className="text-[10px] text-neutral-500 truncate">{d.label}</div>
                  <div className="text-xs font-medium text-neutral-300">{d.value}</div>
                </div>
              ))}
            </div>
          ) : extra ? (
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500">Insight</span>
              <span className="text-emerald-400 font-medium">{extra}</span>
            </div>
          ) : (
            <div className="h-8" /> // Spacer if no content
          )}
        </div>
      </div>
    </Widget>
  );
}

export default function KeyMetricsSection() {
  return (
    <>
      {METRICS.map((metric) => (
        <MetricWidget key={metric.title} {...metric} />
      ))}
    </>
  );
}
