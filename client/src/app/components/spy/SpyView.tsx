'use client';

import { UploadCloud, Search, TrendingUp, AlertCircle, CheckCircle2, XCircle, ArrowRight, DollarSign, Users, Zap } from 'lucide-react';
import Widget from '../dashboard/Widget';

interface Competitor {
  name: string;
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  marketShare: number;
  price: string;
  weakness: string;
  sentiment: number; // 0-100
}

const competitors: Competitor[] = [
  { name: 'Descript', tier: 'Tier 1', marketShare: 45, price: '$30/mo', weakness: 'Complex UI', sentiment: 65 },
  { name: 'Riverside', tier: 'Tier 1', marketShare: 25, price: '$24/mo', weakness: 'Video Focus', sentiment: 72 },
  { name: 'Podcastle', tier: 'Tier 2', marketShare: 15, price: '$14/mo', weakness: 'Audio Only', sentiment: 58 },
  { name: 'Kaltura', tier: 'Tier 3', marketShare: 10, price: 'Custom', weakness: 'Legacy Tech', sentiment: 45 },
];

const insights = [
  { text: "Users are frustrated with Descript's frequent UI changes.", source: "G2 Crowd", type: "negative" },
  { text: "Enterprise clients are looking for API-first alternatives to Kaltura.", source: "Sales Intel", type: "opportunity" },
  { text: "Riverside's pricing is considered too high for audio-only creators.", source: "Reddit", type: "negative" },
];

export default function SpyView() {
  return (
    <div className="max-w-[1600px] mx-auto p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1 text-white">The Spy</h1>
          <p className="text-sm text-neutral-400">Competitive Intelligence: AI eLearning Captioning</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white transition-colors">
          <UploadCloud className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">

        {/* 1. Opportunity Score (2x1) - Top Left */}
        <div className="lg:col-span-2">
          <Widget title="Competitive Opportunity" showGrid={true}>
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between h-full px-2 gap-6 xl:gap-0">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tighter">High</span>
                  <span className="text-lg lg:text-xl text-emerald-500 font-medium">8.5/10</span>
                </div>
                <p className="text-sm text-neutral-400 mt-3 max-w-md leading-relaxed">
                  Market is saturated with complex, expensive tools.
                  <span className="text-white"> Strong demand</span> exists for a simplified, API-first solution.
                </p>
              </div>
              <div className="self-center xl:self-auto h-24 w-24 shrink-0 rounded-full border-4 border-emerald-500/20 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent rotate-45"></div>
                <TrendingUp className="w-8 h-8 text-emerald-500" />
              </div>
            </div>
          </Widget>
        </div>

        {/* 2. Market Metrics (1x1) */}
        <div className="lg:col-span-1">
          <Widget title="Avg. Competitor Price">
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="text-3xl font-semibold text-white">$42<span className="text-lg text-neutral-500">/mo</span></div>
                <div className="flex items-center gap-1 text-sm text-neutral-400 mt-1">
                  <span>For Pro Plans</span>
                </div>
              </div>
              <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-white w-[60%] h-full"></div>
              </div>
            </div>
          </Widget>
        </div>

        {/* 3. Market Metrics (1x1) */}
        <div className="lg:col-span-1">
          <Widget title="Feature Saturation">
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="text-3xl font-semibold text-white">High</div>
                <div className="flex items-center gap-1 text-sm text-orange-400 mt-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>Hard to differentiate</span>
                </div>
              </div>
              <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-orange-500 w-[85%] h-full"></div>
              </div>
            </div>
          </Widget>
        </div>

        {/* 4. Competitor Analysis (2x2) - Main Content */}
        <div className="lg:col-span-2 lg:row-span-2">
          <Widget title="Market Leaders Analysis" action={<Search className="w-4 h-4 text-neutral-500" />}>
            <div className="flex flex-col h-full gap-4">
              <div className="flex items-center justify-between text-xs text-neutral-500 px-2 pb-2 border-b border-white/5">
                <span className="w-[30%]">Competitor</span>
                <span className="w-[20%] text-right">Share</span>
                <span className="w-[20%] text-right">Sentiment</span>
                <span className="w-[30%] text-right">Primary Weakness</span>
              </div>

              <div className="space-y-2">
                {competitors.map((comp, i) => (
                  <div key={i} className="group flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                    <div className="w-[30%]">
                      <div className="font-medium text-white">{comp.name}</div>
                      <div className="text-xs text-neutral-500">{comp.tier}</div>
                    </div>

                    <div className="w-[20%] text-right">
                      <span className="text-sm text-neutral-300">{comp.marketShare}%</span>
                    </div>

                    <div className="w-[20%] flex justify-end">
                      <div className={`px-2 py-0.5 rounded text-xs font-medium ${comp.sentiment > 70 ? 'bg-emerald-500/10 text-emerald-400' :
                        comp.sentiment > 50 ? 'bg-yellow-500/10 text-yellow-400' :
                          'bg-red-500/10 text-red-400'
                        }`}>
                        {comp.sentiment}%
                      </div>
                    </div>

                    <div className="w-[30%] text-right">
                      <span className="text-xs text-neutral-400 group-hover:text-white transition-colors">{comp.weakness}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-4 border-t border-white/5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-500">Total Analyzed: 12 Companies</span>
                  <button className="flex items-center gap-1 text-white hover:text-emerald-400 transition-colors">
                    View Full Report <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </Widget>
        </div>

        {/* 5. Feature Gap (1x2) */}
        <div className="lg:col-span-1 lg:row-span-2">
          <Widget title="Feature Gaps">
            <div className="flex flex-col h-full gap-4">
              <p className="text-xs text-neutral-400">Where competitors are missing critical features.</p>

              <div className="space-y-4">
                {[
                  { feature: 'API Access', status: 'missing', importance: 'Critical' },
                  { feature: 'LMS Integration', status: 'missing', importance: 'High' },
                  { feature: 'Auto-Dubbing', status: 'partial', importance: 'Medium' },
                  { feature: 'Team Collab', status: 'present', importance: 'Low' },
                  { feature: 'Custom Fonts', status: 'present', importance: 'Low' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.status === 'missing' ? (
                        <XCircle className="w-4 h-4 text-emerald-500" />
                      ) : item.status === 'partial' ? (
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-neutral-600" />
                      )}
                      <span className={`text-sm ${item.status === 'missing' ? 'text-white' : 'text-neutral-400'}`}>
                        {item.feature}
                      </span>
                    </div>
                    <span className="text-[10px] text-neutral-600 uppercase tracking-wider">{item.importance}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto p-3 rounded bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-xs text-emerald-200">
                  <span className="font-semibold text-emerald-400">Strategy:</span> Focus on API & Integrations to capture the enterprise market.
                </p>
              </div>
            </div>
          </Widget>
        </div>

        {/* 6. Recent Intel (1x2) */}
        <div className="lg:col-span-1 lg:row-span-2">
          <Widget title="Latest Intel">
            <div className="flex flex-col h-full gap-4">
              <div className="space-y-3 overflow-y-auto custom-scrollbar pr-1">
                {insights.map((insight, i) => (
                  <div key={i} className="p-3 rounded bg-neutral-900 border border-neutral-800">
                    <p className="text-xs text-neutral-300 leading-relaxed mb-2">"{insight.text}"</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-neutral-500">{insight.source}</span>
                      <div className={`w-1.5 h-1.5 rounded-full ${insight.type === 'opportunity' ? 'bg-emerald-500' : 'bg-red-500'
                        }`} />
                    </div>
                  </div>
                ))}
                {/* Filler items for visual balance */}
                <div className="p-3 rounded bg-neutral-900 border border-neutral-800 opacity-50">
                  <p className="text-xs text-neutral-300 leading-relaxed mb-2">"Support takes 3 days to respond..."</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-neutral-500">Capterra</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  </div>
                </div>
              </div>
            </div>
          </Widget>
        </div>

      </div>
    </div>
  );
}
