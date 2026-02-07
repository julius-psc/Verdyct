'use client';

import { UploadCloud, Search, TrendingUp, AlertCircle, CheckCircle2, XCircle, ArrowRight, ExternalLink, Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';
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

// Premium Feature Interfaces
interface CompetitorStatus {
  name: string;
  status: string;
}

interface FeatureRow {
  feature_name: string;
  user_product: string;
  competitors: CompetitorStatus[];
  strategic_note?: string;
  verified_url: string;
}

interface FeatureComparisonMatrix {
  title: string;
  subtitle: string;
  feature_rows: FeatureRow[];
  key_differentiator: string;
}

interface PricingTier {
  tier_name: string;
  price: string;
  key_features: string[];
}

interface CompetitorPricing {
  competitor_name: string;
  tiers: PricingTier[];
  verified_url: string;
}

interface PricingComparison {
  title: string;
  subtitle: string;
  recommended_positioning: string;
  competitors_pricing: CompetitorPricing[];
}

interface ReviewSource {
  source: string;
  positive_mentions: number;
  negative_mentions: number;
  neutral_mentions: number;
  top_positive_theme?: string;
  top_negative_theme?: string;
}

interface SentimentBreakdown {
  title: string;
  overall_sentiment_score: number;
  sources: ReviewSource[];
  key_insight: string;
}

interface GapOpportunity {
  opportunity_title: string;
  description: string;
  impact_level: string;
  competitor_coverage: string;
  verified_url: string;
}

interface GapAnalysis {
  title: string;
  subtitle: string;
  opportunities: GapOpportunity[];
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
  // Premium Features (Optional)
  feature_comparison_matrix?: FeatureComparisonMatrix;
  pricing_comparison?: PricingComparison;
  sentiment_breakdown?: SentimentBreakdown;
  gap_opportunities?: GapAnalysis;
}

interface SpyViewProps {
  data?: SpyData;
}

export default function SpyView({ data }: SpyViewProps) {
  const t = useTranslations('Spy');


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
            <div className="lg:col-span-1 h-64 bg-gray-800/50 rounded-xl border border-white/5"></div>
            <div className="lg:col-span-1 h-64 bg-gray-800/50 rounded-xl border border-white/5"></div>
            <div className="lg:col-span-2 lg:row-span-2 h-96 bg-gray-800/50 rounded-xl border border-white/5"></div>
          </div>
        </div>

        {/* Lock Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4">
          <div className="bg-black/80 backdrop-blur-md border border-white/10 p-8 rounded-2xl max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">{t('fullAnalysisRequired')}</h3>
            <p className="text-neutral-400">
              {t('unlockMessage')}
            </p>
            <div className="pt-2">
              <button
                disabled={true}
                className="inline-flex items-center justify-center px-6 py-3 bg-neutral-800 text-neutral-500 rounded-full text-sm font-bold cursor-not-allowed border border-white/5"
              >
                {t('upgrade')} - Coming Soon
              </button>
            </div>
          </div>
        </div>
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
          <h1 className="text-3xl font-bold tracking-tight mb-1 text-white">{t('title')}</h1>
          <p className="text-sm text-neutral-400">{t('subtitle')}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white transition-colors">
          <UploadCloud className="w-4 h-4" />
          {t('export')}
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">

        {/* 1. Opportunity Score (2x1) - Top Left */}
        <div className="lg:col-span-2">
          <Widget title={t('opportunity')} showGrid={true}>
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
          <Widget title={t('marketMaturity')}>
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="text-3xl font-semibold text-white capitalize">{marketMaturity}</div>
                <div className="flex items-center gap-1 text-sm text-neutral-400 mt-1">
                  <span>{t('currentState')}</span>
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
          <Widget title={t('competitionLevel')}>
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="text-3xl font-semibold text-white capitalize">{competitionLevel}</div>
                <div className="flex items-center gap-1 text-sm text-orange-400 mt-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{t('intensity')}</span>
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
          <Widget title={t('leadersAnalysis')} action={<Search className="w-4 h-4 text-neutral-500" />}>
            <div className="flex flex-col h-full gap-4">
              <div className="flex items-center justify-between text-xs text-neutral-500 px-2 pb-2 border-b border-white/5">
                <span className="w-[40%]">{t('competitor')}</span>
                <span className="w-[30%] text-right">{t('position')}</span>
                <span className="w-[30%] text-right">{t('source')}</span>
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
                      <span className="text-xs text-emerald-500">{t('verified')}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-4 border-t border-white/5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-500">{t('totalAnalyzed', { count: competitors.length })}</span>
                </div>
              </div>
            </div>
          </Widget>
        </div>

        {/* 5. Key Trends (1x2) - Replaced with Pain Words since Trends are not in Spy model */}
        <div className="lg:col-span-1 lg:row-span-2">
          <Widget title={t('painPoints')}>
            <div className="flex flex-col h-full gap-4">
              <p className="text-xs text-neutral-400">{t('painPointsSubtitle')}</p>

              <div className="space-y-4">
                {customer_intel.pain_word_cloud.slice(0, 5).map((pain, i) => (
                  <div key={i} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                      <span className="text-sm text-white capitalize truncate" title={pain.term}>{pain.term}</span>
                    </div>
                    <span className="text-xs text-neutral-500 shrink-0 whitespace-nowrap">{pain.mentions} {t('mentions')}</span>
                  </div>
                ))}
              </div>
            </div>
          </Widget>
        </div>

        {/* 6. Recent Intel (1x2) - Using Top Complaints */}
        <div className="lg:col-span-1 lg:row-span-2">
          <Widget title={t('voiceOfCustomer')}>
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
                            title={t('viewSource')}
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

        {/* PREMIUM FEATURES */}

        {/* 7. Feature Comparison Matrix (4x1) */}
        {data.feature_comparison_matrix && (
          <div className="lg:col-span-4">
            <Widget title={data.feature_comparison_matrix.title}>
              <div className="space-y-4">
                <p className="text-sm text-neutral-400">{data.feature_comparison_matrix.subtitle}</p>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-neutral-400 font-medium">{t('feature')}</th>
                        <th className="text-center py-3 px-4 text-emerald-400 font-medium">{t('yourProduct')}</th>
                        {data.feature_comparison_matrix.feature_rows[0]?.competitors.map((comp) => (
                          <th key={comp.name} className="text-center py-3 px-4 text-neutral-400 font-medium">{comp.name}</th>
                        ))}
                        <th className="text-left py-3 px-4 text-neutral-400 font-medium">{t('whyItMatters')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.feature_comparison_matrix.feature_rows.map((row, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-3 px-4 text-white font-medium">{row.feature_name}</td>
                          <td className="py-3 px-4 text-center text-lg">{row.user_product}</td>
                          {row.competitors.map((comp, j) => (
                            <td key={j} className="py-3 px-4 text-center text-lg">{comp.status}</td>
                          ))}
                          <td className="py-3 px-4 text-xs text-neutral-400">{row.strategic_note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
                  <div className="font-semibold text-emerald-400 mb-1">🎯 {t('keyDifferentiator')}</div>
                  <p className="text-sm text-neutral-300">{data.feature_comparison_matrix.key_differentiator}</p>
                </div>
              </div>
            </Widget>
          </div>
        )}

        {/* 8. Pricing Comparison (4x1) */}
        {data.pricing_comparison && (
          <div className="lg:col-span-4">
            <Widget title={data.pricing_comparison.title}>
              <div className="space-y-4">
                <p className="text-sm text-neutral-400">{data.pricing_comparison.subtitle}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.pricing_comparison.competitors_pricing.map((comp, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <h4 className="font-bold text-white mb-3">{comp.competitor_name}</h4>
                      <div className="space-y-3">
                        {comp.tiers.map((tier, j) => (
                          <div key={j} className="pb-3 border-b border-white/5 last:border-0">
                            <div className="flex items-baseline gap-2 mb-2">
                              <span className="text-sm font-medium text-neutral-300">{tier.tier_name}</span>
                              <span className="text-xl font-bold text-emerald-400">{tier.price}</span>
                            </div>
                            <ul className="space-y-1">
                              {tier.key_features.map((feature, k) => (
                                <li key={k} className="text-xs text-neutral-400 flex items-start gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                  <div className="font-semibold text-blue-400 mb-1">💡 {t('recommendedPositioning')}</div>
                  <p className="text-sm text-neutral-300">{data.pricing_comparison.recommended_positioning}</p>
                </div>
              </div>
            </Widget>
          </div>
        )}

        {/* 9. Sentiment Breakdown (2x1) */}
        {data.sentiment_breakdown && (
          <div className="lg:col-span-2">
            <Widget title={data.sentiment_breakdown.title}>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="text-sm text-neutral-400 mb-1">{t('overallSentiment')}</div>
                    <div className="text-3xl font-bold text-white">{data.sentiment_breakdown.overall_sentiment_score}/100</div>
                  </div>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${data.sentiment_breakdown.overall_sentiment_score >= 70 ? 'bg-emerald-500/20 text-emerald-400' : data.sentiment_breakdown.overall_sentiment_score >= 40 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                    {data.sentiment_breakdown.overall_sentiment_score >= 70 ? '😊' : data.sentiment_breakdown.overall_sentiment_score >= 40 ? '😐' : '😞'}
                  </div>
                </div>

                <div className="space-y-3">
                  {data.sentiment_breakdown.sources.map((source, i) => (
                    <div key={i} className="bg-white/5 rounded-lg p-3">
                      <div className="font-medium text-white mb-2">{source.source}</div>
                      <div className="flex gap-2 mb-2">
                        <div className="flex-1 bg-neutral-800 rounded-full h-2 overflow-hidden flex">
                          <div className="bg-emerald-500 h-full" style={{ width: `${(source.positive_mentions / (source.positive_mentions + source.negative_mentions + source.neutral_mentions)) * 100}%` }} />
                          <div className="bg-neutral-500 h-full" style={{ width: `${(source.neutral_mentions / (source.positive_mentions + source.negative_mentions + source.neutral_mentions)) * 100}%` }} />
                          <div className="bg-red-500 h-full" style={{ width: `${(source.negative_mentions / (source.positive_mentions + source.negative_mentions + source.neutral_mentions)) * 100}%` }} />
                        </div>
                      </div>
                      <div className="flex gap-4 text-xs">
                        <span className="text-emerald-400">👍 {source.positive_mentions}</span>
                        <span className="text-neutral-400">😐 {source.neutral_mentions}</span>
                        <span className="text-red-400">👎 {source.negative_mentions}</span>
                      </div>
                      {source.top_negative_theme && (
                        <div className="mt-2 text-xs text-neutral-400">
                          Top complaint: <span className="text-neutral-300">{source.top_negative_theme}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-neutral-900 border border-neutral-800 rounded text-xs text-neutral-300">
                  💡 {data.sentiment_breakdown.key_insight}
                </div>
              </div>
            </Widget>
          </div>
        )}

        {/* 10. Gap Opportunities (2x1) */}
        {data.gap_opportunities && (
          <div className="lg:col-span-2">
            <Widget title={data.gap_opportunities.title}>
              <div className="space-y-4">
                <p className="text-sm text-neutral-400">{data.gap_opportunities.subtitle}</p>

                <div className="space-y-3">
                  {data.gap_opportunities.opportunities.map((opp, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-emerald-500/50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-white">{opp.opportunity_title}</h4>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${opp.impact_level === 'High' ? 'bg-red-500/20 text-red-400' :
                          opp.impact_level === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                          {opp.impact_level}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-300 mb-2">{opp.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-500">{t('coverage')}: <span className="text-neutral-300">{opp.competitor_coverage}</span></span>
                        <a href={opp.verified_url} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                          {t('viewSource')} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Widget>
          </div>
        )}

      </div>
    </div>
  );
}
