'use client';

import { UploadCloud, Search, TrendingUp, AlertCircle, CheckCircle2, XCircle, ArrowRight, ExternalLink } from 'lucide-react';
import Widget from '../dashboard/Widget';

// Backend Model Interfaces
interface CompetitorPosition {
  name: string;
  x_value: number;
  y_value: number;
  quadrant_label: string;
  verified_url: string;
}

interface HighlightBox {
  value: string;
  label: string;
}

interface SpyData {
  title: string;
  score: number;
  market_quadrant: {
    competitors: CompetitorPosition[];
    strategic_opening: {
      label: string;
      quadrant_label: string;
    };
  };
  customer_intel: {
    top_complaints: {
      quote: string;
      source: string;
      competitor: string;
      verified_url?: string;
    }[];
    pain_word_cloud: {
      term: string;
      mentions: number;
    }[];
  };
  spy_footer: {
    verdyct_summary: {
      title: string;
      text: string;
    };
    highlight_boxes: HighlightBox[];
  };
}

interface SpyViewProps {
  data?: SpyData;
}

export default function SpyView({ data }: SpyViewProps) {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-500">
        Loading spy analysis...
      </div>
    );
  }

  const { market_quadrant, customer_intel, spy_footer, score } = data;
  const competitors = market_quadrant.competitors;

  // Map highlight boxes to market metrics if available, otherwise fallback
  const marketMaturity = spy_footer.highlight_boxes.find(b => b.label.toLowerCase().includes('maturity'))?.value || 'Growing';
  const competitionLevel = spy_footer.highlight_boxes.find(b => b.label.toLowerCase().includes('competition'))?.value || 'Moderate';

  return (
    <div className="max-w-[1600px] mx-auto p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1 text-white">The Spy</h1>
          <p className="text-sm text-neutral-400">Competitive Intelligence & Strategic Analysis</p>
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
                  <span className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tighter">
                    {score >= 80 ? 'High' : score >= 50 ? 'Medium' : 'Low'}
                  </span>
                  <span className={`text-lg lg:text-xl font-medium ${score >= 70 ? 'text-emerald-500' : score >= 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                    {score}/100
                  </span>
                </div>
                <p className="text-sm text-neutral-400 mt-3 max-w-md leading-relaxed">
                  {spy_footer.verdyct_summary.text}
                </p>
              </div>
              <div className={`self-center xl:self-auto h-24 w-24 shrink-0 rounded-full border-4 flex items-center justify-center relative ${score >= 70 ? 'border-emerald-500/20' : 'border-yellow-500/20'}`}>
                <div className={`absolute inset-0 rounded-full border-4 border-t-transparent rotate-45 ${score >= 70 ? 'border-emerald-500' : 'border-yellow-500'}`}></div>
                <TrendingUp className={`w-8 h-8 ${score >= 70 ? 'text-emerald-500' : 'text-yellow-500'}`} />
              </div>
            </div>
          </Widget>
        </div>

        {/* 2. Market Metrics (1x1) */}
        <div className="lg:col-span-1">
          <Widget title="Market Maturity">
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="text-3xl font-semibold text-white capitalize">{marketMaturity}</div>
                <div className="flex items-center gap-1 text-sm text-neutral-400 mt-1">
                  <span>Current State</span>
                </div>
              </div>
              <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-4 overflow-hidden">
                <div className={`h-full ${marketMaturity.toLowerCase().includes('saturated') ? 'bg-red-500 w-[90%]' : 'bg-emerald-500 w-[40%]'}`}></div>
              </div>
            </div>
          </Widget>
        </div>

        {/* 3. Market Metrics (1x1) */}
        <div className="lg:col-span-1">
          <Widget title="Competition Level">
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="text-3xl font-semibold text-white capitalize">{competitionLevel}</div>
                <div className="flex items-center gap-1 text-sm text-orange-400 mt-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>Intensity</span>
                </div>
              </div>
              <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-4 overflow-hidden">
                <div className={`h-full ${competitionLevel.toLowerCase().includes('high') ? 'bg-orange-500 w-[85%]' : 'bg-blue-500 w-[50%]'}`}></div>
              </div>
            </div>
          </Widget>
        </div>

        {/* 4. Competitor Analysis (2x2) - Main Content */}
        <div className="lg:col-span-2 lg:row-span-2">
          <Widget title="Market Leaders Analysis" action={<Search className="w-4 h-4 text-neutral-500" />}>
            <div className="flex flex-col h-full gap-4">
              <div className="flex items-center justify-between text-xs text-neutral-500 px-2 pb-2 border-b border-white/5">
                <span className="w-[40%]">Competitor</span>
                <span className="w-[30%] text-right">Position</span>
                <span className="w-[30%] text-right">Source</span>
              </div>

              <div className="space-y-2 overflow-y-auto max-h-[300px] custom-scrollbar">
                {competitors.map((comp, i) => (
                  <div key={i} className="group flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                    <div className="w-[40%]">
                      <div className="font-medium text-white truncate" title={comp.name}>{comp.name}</div>
                      <a href={comp.verified_url} target="_blank" rel="noopener noreferrer" className="text-xs text-neutral-500 hover:text-emerald-400 truncate block">
                        {comp.verified_url ? new URL(comp.verified_url).hostname : 'N/A'}
                      </a>
                    </div>

                    <div className="w-[30%] text-right">
                      <span className="text-sm text-neutral-300 truncate">{comp.quadrant_label}</span>
                    </div>

                    <div className="w-[30%] text-right">
                      <span className="text-xs text-emerald-500">Verified</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-4 border-t border-white/5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-500">Total Analyzed: {competitors.length} Companies</span>
                </div>
              </div>
            </div>
          </Widget>
        </div>

        {/* 5. Key Trends (1x2) - Replaced with Pain Words since Trends are not in Spy model */}
        <div className="lg:col-span-1 lg:row-span-2">
          <Widget title="Customer Pain Points">
            <div className="flex flex-col h-full gap-4">
              <p className="text-xs text-neutral-400">Frequent complaints in the market.</p>

              <div className="space-y-4">
                {customer_intel.pain_word_cloud.slice(0, 5).map((pain, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                      <span className="text-sm text-white capitalize">{pain.term}</span>
                    </div>
                    <span className="text-xs text-neutral-500">{pain.mentions} mentions</span>
                  </div>
                ))}
              </div>
            </div>
          </Widget>
        </div>

        {/* 6. Recent Intel (1x2) - Using Top Complaints */}
        <div className="lg:col-span-1 lg:row-span-2">
          <Widget title="Voice of Customer">
            <div className="flex flex-col h-full gap-4">
              <div className="space-y-3 overflow-y-auto custom-scrollbar pr-1">
                {customer_intel.top_complaints.map((complaint, i) => (
                  <div key={i} className="p-3 rounded bg-neutral-900 border border-neutral-800">
                    <p className="text-xs text-neutral-300 leading-relaxed mb-2">"{complaint.quote}"</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-neutral-500 truncate max-w-[100px]">{complaint.competitor}</span>
                      <span className="text-[10px] text-neutral-600 flex items-center gap-1">
                        {complaint.source}
                        {complaint.verified_url && (
                          <a
                            href={complaint.verified_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-500 hover:text-emerald-400 transition-colors"
                            title="View Source"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Widget>
        </div>

      </div>
    </div>
  );
}
