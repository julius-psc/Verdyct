'use client';

import {
    UploadCloud,
    ExternalLink,
    Figma,
    Palette,
    Lock,
    Code2,
    Database,
    Cpu,
    Globe,
    Play,
    MousePointerClick,
    Copy,
    ShieldCheck,
    BrainCircuit
} from 'lucide-react';
import { useState } from 'react';
import Widget from '../dashboard/Widget';

// Backend Model Interfaces
interface BuildStat {
    value: string;
    label: string;
}

interface MVPStatus {
    title: string;
    status: string;
    subtitle: string;
    mvp_screenshot_url: string;
    mvp_live_link: string;
    mvp_button_text: string;
    build_stats: BuildStat[];
}

interface FlowStep {
    step: number;
    action: string;
}

interface UserFlow {
    title: string;
    steps: FlowStep[];
    figma_button_text: string;
}

interface TechCategory {
    name: string;
    technologies: string[];
}

interface TechStack {
    title: string;
    categories: TechCategory[];
}

interface TypographyItem {
    use: string;
    font: string;
}

interface BrandKit {
    title: string;
    project_name: string;
    color_palette: string[];
    typography: TypographyItem[];
}

interface DataMoatFeature {
    title: string;
    description: string;
}

interface DataMoat {
    title: string;
    status: string;
    features: DataMoatFeature[];
}

interface ScoringBreakdownItem {
    name: string;
    score: number;
    max_score: number;
}

interface ArchitectData {
    title: string;
    score: number;
    mvp_status: MVPStatus;
    user_flow: UserFlow;
    tech_stack: TechStack;
    brand_kit: BrandKit;
    data_moat: DataMoat;
    architect_footer: {
        verdyct_summary: string;
        scoring_breakdown: ScoringBreakdownItem[];
        recommendation_text: string;
    };
}

interface ArchitectViewProps {
    data?: ArchitectData;
}

export default function ArchitectView({ data }: ArchitectViewProps) {
    const [isDataMoatActive, setIsDataMoatActive] = useState(false);

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
                        <div className="lg:col-span-2 lg:row-span-2 h-96 bg-gray-800/50 rounded-xl border border-white/5"></div>
                        <div className="lg:col-span-2 lg:row-span-2 h-96 bg-gray-800/50 rounded-xl border border-white/5"></div>
                        <div className="lg:col-span-2 h-48 bg-gray-800/50 rounded-xl border border-white/5"></div>
                        <div className="lg:col-span-2 h-48 bg-gray-800/50 rounded-xl border border-white/5"></div>
                    </div>
                </div>

                {/* Lock Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4">
                    <div className="bg-black/80 backdrop-blur-md border border-white/10 p-8 rounded-2xl max-w-md w-full text-center space-y-4 shadow-2xl">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Lock className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Full Analysis Required</h3>
                        <p className="text-neutral-400">
                            Unlock the Architect Agent to see detailed technical blueprint, MVP status, and tech stack.
                        </p>
                        <div className="pt-2">
                            <span className="inline-block px-4 py-2 bg-white text-black rounded-full text-sm font-semibold">
                                Upgrade to Full (1 Credit)
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const { mvp_status, tech_stack, brand_kit, data_moat, architect_footer } = data;

    // Helper to find specific tech categories
    const frontendTech = tech_stack.categories.find(c => c.name.toLowerCase().includes('frontend'))?.technologies[0] || 'React';
    const backendTech = tech_stack.categories.find(c => c.name.toLowerCase().includes('backend'))?.technologies[0] || 'Python';
    const databaseTech = tech_stack.categories.find(c => c.name.toLowerCase().includes('database'))?.technologies[0] || 'PostgreSQL';
    const aiTech = tech_stack.categories.find(c => c.name.toLowerCase().includes('ai'))?.technologies || ['OpenAI'];

    return (
        <div className="max-w-[1600px] mx-auto p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1 text-white">The Architect</h1>
                    <p className="text-sm text-neutral-400">Technical Architecture & MVP Design</p>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">

                {/* 1. MVP Showcase (2x2) */}
                <div className="lg:col-span-2 lg:row-span-2">
                    <Widget title="Live MVP Preview" action={<div className="flex items-center gap-2"><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span><span className="text-xs text-emerald-500 font-medium">Live</span></div>}>
                        <div className="flex flex-col h-full gap-6">
                            {/* Browser Window Mockup */}
                            <div className="relative flex-1 bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden group">
                                {/* Browser Header */}
                                <div className="h-8 bg-neutral-950 border-b border-neutral-800 flex items-center px-3 gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
                                    </div>
                                    <div className="flex-1 flex justify-center">
                                        <div className="bg-neutral-900 rounded px-3 py-0.5 text-[10px] text-neutral-500 font-mono truncate max-w-[200px]">
                                            {mvp_status.mvp_live_link || "https://verdyct.lovable.app/dashboard"}
                                        </div>
                                    </div>
                                </div>

                                {/* Content Placeholder */}
                                <div className="absolute inset-0 top-8 bg-gradient-to-br from-neutral-900 to-neutral-950 flex items-center justify-center">
                                    <div className="text-center space-y-3">
                                        <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/20">
                                            <Play className="w-8 h-8 text-emerald-500 fill-emerald-500/20" />
                                        </div>
                                        <p className="text-sm text-neutral-400">Interactive Preview</p>
                                    </div>
                                </div>
                            </div>

                            {/* Link Row */}
                            <div className="flex items-center gap-3 p-3 rounded bg-neutral-900 border border-neutral-800">
                                <div className="flex-1 truncate text-sm text-neutral-400 font-mono">
                                    {mvp_status.mvp_live_link || "https://verdyct.lovable.app/dashboard"}
                                </div>
                                <button className="p-2 hover:bg-white/5 rounded-md text-neutral-400 hover:text-white transition-colors" title="Copy Link">
                                    <Copy className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => window.open(mvp_status.mvp_live_link || "https://verdyct.lovable.app/dashboard", '_blank')}
                                    className="p-2 hover:bg-white/5 rounded-md text-emerald-500 hover:text-emerald-400 transition-colors" title="Open"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </Widget>
                </div>

                {/* 2. Tech Stack (2x2) - Expanded & Detailed */}
                <div className="lg:col-span-2 lg:row-span-2">
                    <Widget title="Tech Stack" action={<Code2 className="w-4 h-4 text-neutral-500" />}>
                        <div className="flex flex-col h-full gap-6">
                            <div className="grid grid-cols-2 gap-x-6 gap-y-8">
                                <div>
                                    <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Frontend</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                                            <div className="w-10 h-10 rounded bg-[#61DAFB] text-black flex items-center justify-center font-bold text-xs">Re</div>
                                            <div>
                                                <div className="text-sm text-white font-medium">{frontendTech}</div>
                                                <div className="text-[10px] text-neutral-500">Core Framework</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                                            <div className="w-10 h-10 rounded bg-black border border-neutral-700 text-white flex items-center justify-center font-bold text-xs">Next</div>
                                            <div>
                                                <div className="text-sm text-white font-medium">Next.js 14</div>
                                                <div className="text-[10px] text-neutral-500">App Router</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Backend & AI</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                                            <div className="w-10 h-10 rounded bg-[#3776AB] text-white flex items-center justify-center font-bold text-xs">Py</div>
                                            <div>
                                                <div className="text-sm text-white font-medium">{backendTech}</div>
                                                <div className="text-[10px] text-neutral-500">API Server</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                                            <div className="w-10 h-10 rounded bg-[#00A67E] text-white flex items-center justify-center font-bold text-xs">OAI</div>
                                            <div>
                                                <div className="text-sm text-white font-medium">OpenAI GPT-4o</div>
                                                <div className="text-[10px] text-neutral-500">LLM Engine</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Database</h4>
                                    <div className="flex items-center gap-2 text-sm text-neutral-300">
                                        <Database className="w-4 h-4 text-neutral-600" />
                                        {databaseTech} <span className="text-neutral-600">/ Supabase</span>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Deployment</h4>
                                    <div className="flex items-center gap-2 text-sm text-neutral-300">
                                        <UploadCloud className="w-4 h-4 text-neutral-600" />
                                        Vercel <span className="text-neutral-600">+ Railway</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Widget>
                </div>

                {/* 3. User Journey (2x1) - Standardized Coming Soon */}
                <div className="lg:col-span-2">
                    <Widget title="User Journey" action={<Figma className="w-4 h-4 text-neutral-500" />}>
                        <div className="flex flex-col h-full items-center justify-center p-6 bg-neutral-900/40 rounded-lg border border-neutral-800 relative overflow-hidden group">
                            <div className="absolute top-3 right-3 px-2 py-0.5 bg-neutral-800 border border-white/5 rounded text-[10px] text-neutral-400 font-medium">Coming Soon</div>

                            <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                                <Figma className="w-6 h-6 text-neutral-400 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-base font-medium text-white mb-1">Figma Integration</h3>
                            <p className="text-xs text-neutral-500 text-center max-w-xs">
                                Visualise your AI-generated user flows directly within the dashboard.
                            </p>
                        </div>
                    </Widget>
                </div>

                {/* 4. Data Moat (2x1) - Standardized Coming Soon */}
                <div className="lg:col-span-2">
                    <Widget title="Data Moat Configuration" action={<ShieldCheck className="w-4 h-4 text-neutral-500" />}>
                        <div className="flex flex-col h-full items-center justify-center p-6 bg-neutral-900/40 rounded-lg border border-neutral-800 relative overflow-hidden group">
                            <div className="absolute top-3 right-3 px-2 py-0.5 bg-neutral-800 border border-white/5 rounded text-[10px] text-neutral-400 font-medium">Coming Soon</div>

                            <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                                <Lock className="w-6 h-6 text-neutral-400 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-base font-medium text-white mb-1">Data Strategy</h3>
                            <p className="text-xs text-neutral-500 text-center max-w-xs">
                                Advanced configuration for data retention and competitive moat building.
                            </p>
                        </div>
                    </Widget>
                </div>
            </div >
        </div >
    );
}
