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
    BrainCircuit,
    Maximize2,
    Minimize2,
    ChevronDown,
    ChevronUp
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
    const [isPromptExpanded, setIsPromptExpanded] = useState(false);
    const [isPromptFullscreen, setIsPromptFullscreen] = useState(false);

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
        <div className="max-w-[1600px] mx-auto p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1 text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400">The Architect</h1>
                    <p className="text-sm text-neutral-400">Technical Architecture & MVP Design</p>
                </div>
            </div>

            {/* 1. HERO: AI Blueprint - Premium Data Artifact Style */}
            <div className={`w-full transition-all duration-500 ease-in-out ${isPromptFullscreen ? 'fixed inset-0 z-50 p-4 bg-black/95 backdrop-blur-xl' : 'relative group'}`}>

                {/* Glow Effect (Only in normal mode) */}
                {!isPromptFullscreen && (
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                )}

                <div className={`relative bg-neutral-950 border border-white/10 overflow-hidden shadow-2xl flex flex-col ${isPromptFullscreen ? 'h-full w-full rounded-xl border-emerald-500/20' : 'rounded-2xl'}`}>
                    {/* Toolbar */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-neutral-900/50 backdrop-blur-md shrink-0">
                        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setIsPromptExpanded(!isPromptExpanded)}>
                            <div className="p-2.5 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl border border-white/5 shadow-inner">
                                <BrainCircuit className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold text-white tracking-wide">AI ARCHITECT BLUEPRINT</h2>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className={`w-1.5 h-1.5 rounded-full bg-emerald-500 ${isPromptExpanded ? 'animate-pulse' : ''}`}></span>
                                    <p className="text-[10px] text-emerald-500/80 font-mono uppercase tracking-wider">Generated & Optimized</p>
                                </div>
                            </div>

                            {/* Collapse Toggle */}
                            <button
                                className="ml-2 p-1 hover:bg-white/10 rounded-full text-neutral-400 hover:text-white transition-colors"
                            >
                                {isPromptExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Fullscreen Toggle */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsPromptFullscreen(!isPromptFullscreen);
                                    if (!isPromptFullscreen) setIsPromptExpanded(true); // Always expand when going fullscreen
                                }}
                                className="p-2 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white transition-colors mr-2"
                                title={isPromptFullscreen ? "Exit Fullscreen" : "Fullscreen Focus"}
                            >
                                {isPromptFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                            </button>

                            {/* Lovable Redirect Button - Premium Shine */}
                            <a
                                href={mvp_status.mvp_live_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative group/btn flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-neutral-200 rounded-lg text-xs font-bold transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] w-full h-full"></div>
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>OPEN IN LOVABLE</span>
                            </a>

                            <div className="h-6 w-px bg-white/5 mx-1"></div>

                            <button
                                onClick={() => {
                                    const promptParams = mvp_status.mvp_live_link?.split('prompt=')[1];
                                    const promptText = promptParams ? decodeURIComponent(promptParams) : mvp_status.subtitle;
                                    navigator.clipboard.writeText(promptText);
                                }}
                                className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 border border-white/10 hover:border-white/20 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-lg text-xs font-medium transition-all"
                            >
                                <Copy className="w-3.5 h-3.5" />
                                Copy Code
                            </button>
                        </div>
                    </div>

                    {/* Content Area - Collapsible */}
                    <div className={`relative bg-black/40 transition-all duration-500 ease-in-out overflow-hidden ${isPromptExpanded || isPromptFullscreen ? 'opacity-100' : 'opacity-0 max-h-0'}`} style={{ maxHeight: isPromptExpanded || isPromptFullscreen ? (isPromptFullscreen ? '100%' : '500px') : '0px' }}>
                        {/* Grid Background Pattern */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black_70%,transparent_100%)] pointer-events-none"></div>

                        <div className={`p-8 relative ${isPromptFullscreen ? 'h-full overflow-hidden' : ''}`}>
                            <div className={`relative custom-scrollbar font-mono text-[13px] leading-7 text-neutral-300 select-text whitespace-pre-wrap pl-6 border-l border-white/5 ${isPromptFullscreen ? 'h-full overflow-y-auto pb-20' : 'h-80 overflow-y-auto'}`}>
                                {/* Simulated Syntax Highlighting Logic */}
                                {(() => {
                                    try {
                                        const promptParams = mvp_status.mvp_live_link?.split('prompt=')[1];
                                        const rawText = promptParams ? decodeURIComponent(promptParams) : mvp_status.subtitle;

                                        // Simple highlighting for key sections
                                        // We split by newlines and style lines that look like headers or keys
                                        return rawText.split('\n').map((line, i) => {
                                            const isHeader = line === line.toUpperCase() && line.length > 3 && !line.startsWith(' ');
                                            const isKey = line.trim().endsWith(':') || line.includes(': ');
                                            const isList = line.trim().startsWith('-');

                                            if (isHeader) {
                                                return <div key={i} className="text-emerald-400 font-bold mt-4 mb-2 border-b border-emerald-500/20 w-fit pb-1">{line}</div>;
                                            }
                                            if (isKey && !line.startsWith(' ')) {
                                                const [key, ...val] = line.split(':');
                                                return (
                                                    <div key={i}>
                                                        <span className="text-cyan-400 font-semibold">{key}:</span>
                                                        <span className="text-neutral-300">{val.join(':')}</span>
                                                    </div>
                                                );
                                            }
                                            if (isList) {
                                                return <div key={i} className="text-neutral-400 pl-4">{line}</div>;
                                            }

                                            // Fallback for standard text
                                            return <div key={i} className="text-neutral-400">{line || '\u00A0'}</div>;
                                        });

                                    } catch (e) {
                                        return mvp_status.subtitle;
                                    }
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Grid for Remaining Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">

                {/* 2. MVP Showcase (2x2) */}
                <div className="lg:col-span-2 lg:row-span-2">
                    <Widget title="Live MVP Preview" action={<div className="flex items-center gap-2"><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span><span className="text-xs text-emerald-500 font-medium">Live</span></div>}>
                        <div className="flex flex-col h-full gap-6">
                            {/* Browser Window Mockup */}
                            <div
                                className="relative flex-1 bg-neutral-900/50 rounded-lg border border-white/5 overflow-hidden group cursor-not-allowed hover:border-white/10 transition-colors"
                                onClick={() => {
                                    const el = document.getElementById('mvp-preview-badge');
                                    if (el) {
                                        el.classList.remove('opacity-0');
                                        el.classList.add('opacity-100', 'scale-110');
                                        setTimeout(() => {
                                            el.classList.remove('opacity-100', 'scale-110');
                                            el.classList.add('opacity-0');
                                        }, 1500);
                                    }
                                }}
                            >
                                {/* Browser Header */}
                                <div className="h-8 bg-black/40 border-b border-white/5 flex items-center px-3 gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
                                    </div>
                                    <div className="flex-1 flex justify-center">
                                        <div className="bg-white/5 rounded px-3 py-0.5 text-[10px] text-neutral-500 font-mono truncate max-w-[200px]">
                                            locahost:3000
                                        </div>
                                    </div>
                                </div>

                                {/* Content Placeholder */}
                                <div className="absolute inset-0 top-8 bg-gradient-to-br from-neutral-900/50 to-neutral-950 flex items-center justify-center">
                                    <div className="text-center space-y-3 relative">

                                        {/* Coming Soon Badge - Initially Hidden */}
                                        <div id="mvp-preview-badge" className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-white text-black text-xs font-bold rounded-full opacity-0 transition-getAll duration-300 z-20 pointer-events-none whitespace-nowrap shadow-xl">
                                            Coming Soon
                                        </div>

                                        <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
                                            <Play className="w-8 h-8 text-emerald-500 fill-emerald-500/20" />
                                        </div>
                                        <p className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">Interactive Preview</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </Widget>
                </div>

                {/* 3. Tech Stack (2x2) */}
                <div className="lg:col-span-2 lg:row-span-2">
                    <Widget title="Tech Stack" action={<Code2 className="w-4 h-4 text-neutral-500" />}>
                        <div className="flex flex-col h-full gap-6">
                            <div className="grid grid-cols-2 gap-x-6 gap-y-8">
                                <div>
                                    <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Frontend</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-900/50 border border-white/5 group hover:border-emerald-500/20 transition-colors">
                                            <div className="w-10 h-10 rounded bg-[#61DAFB] text-black flex items-center justify-center font-bold text-xs shadow-lg shadow-cyan-500/10">Re</div>
                                            <div>
                                                <div className="text-sm text-white font-medium">{frontendTech}</div>
                                                <div className="text-[10px] text-neutral-500">Core Framework</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-900/50 border border-white/5 group hover:border-white/20 transition-colors">
                                            <div className="w-10 h-10 rounded bg-black border border-neutral-700 text-white flex items-center justify-center font-bold text-xs shadow-lg shadow-white/5">Next</div>
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
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-900/50 border border-white/5 group hover:border-blue-500/20 transition-colors">
                                            <div className="w-10 h-10 rounded bg-[#3776AB] text-white flex items-center justify-center font-bold text-xs shadow-lg shadow-blue-500/10">Py</div>
                                            <div>
                                                <div className="text-sm text-white font-medium">{backendTech}</div>
                                                <div className="text-[10px] text-neutral-500">API Server</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-900/50 border border-white/5 group hover:border-emerald-500/20 transition-colors">
                                            <div className="w-10 h-10 rounded bg-[#00A67E] text-white flex items-center justify-center font-bold text-xs shadow-lg shadow-emerald-500/10">OAI</div>
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

                {/* 4. User Journey (2x1) */}
                <div className="lg:col-span-2">
                    <Widget title="User Journey" action={<Figma className="w-4 h-4 text-neutral-500" />}>
                        <div className="flex flex-col h-full items-center justify-center p-6 bg-neutral-900/40 rounded-lg border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
                            <div className="absolute top-3 right-3 px-2 py-0.5 bg-neutral-900 border border-white/10 rounded text-[10px] text-neutral-400 font-medium">Coming Soon</div>

                            <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <Figma className="w-6 h-6 text-neutral-400 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-base font-medium text-white mb-1">Figma Integration</h3>
                            <p className="text-xs text-neutral-500 text-center max-w-xs">
                                Visualise your AI-generated user flows directly within the dashboard.
                            </p>
                        </div>
                    </Widget>
                </div>

                {/* 5. Data Moat (2x1) */}
                <div className="lg:col-span-2">
                    <Widget title="Data Moat Configuration" action={<ShieldCheck className="w-4 h-4 text-neutral-500" />}>
                        <div className="flex flex-col h-full items-center justify-center p-6 bg-neutral-900/40 rounded-lg border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
                            <div className="absolute top-3 right-3 px-2 py-0.5 bg-neutral-900 border border-white/10 rounded text-[10px] text-neutral-400 font-medium">Coming Soon</div>

                            <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <Lock className="w-6 h-6 text-neutral-400 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-base font-medium text-white mb-1">Data Strategy</h3>
                            <p className="text-xs text-neutral-500 text-center max-w-xs">
                                Advanced configuration for data retention and competitive moat building.
                            </p>
                        </div>
                    </Widget>
                </div>
            </div>
        </div>
    );
}
