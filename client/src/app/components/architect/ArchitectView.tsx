'use client';

import {
    UploadCloud,
    ExternalLink,
    Figma,
    Palette,
    Lock,
    Layers,
    Code2,
    Database,
    Cpu,
    Globe,
    Play,
    MousePointerClick,
    Copy,
    ShieldCheck,
    BrainCircuit,
    Network
} from 'lucide-react';
import { useState } from 'react';
import Widget from '../dashboard/Widget';

export default function ArchitectView() {
    const [isDataMoatActive, setIsDataMoatActive] = useState(false);

    return (
        <div className="max-w-[1600px] mx-auto p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1 text-white">The Architect</h1>
                    <p className="text-sm text-neutral-400">Generating assets for: AI eLearning Captioning Tool</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white transition-colors">
                    <UploadCloud className="w-4 h-4" />
                    Export Assets
                </button>
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
                                        <div className="bg-neutral-900 rounded px-3 py-0.5 text-[10px] text-neutral-500 font-mono">
                                            verdyct.lovable.app/dashboard
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
                                    https://verdyct.lovable.app/dashboard
                                </div>
                                <button className="p-2 hover:bg-white/5 rounded-md text-neutral-400 hover:text-white transition-colors" title="Copy Link">
                                    <Copy className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => window.open('https://verdyct.lovable.app/dashboard', '_blank')}
                                    className="p-2 hover:bg-white/5 rounded-md text-emerald-500 hover:text-emerald-400 transition-colors" title="Open"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </Widget>
                </div>

                {/* 2. Tech Stack (1x2) */}
                <div className="lg:col-span-1 lg:row-span-2">
                    <Widget title="Tech Stack" action={<Code2 className="w-4 h-4 text-neutral-500" />}>
                        <div className="flex flex-col h-full gap-6">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Frontend</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 p-2 rounded bg-neutral-900 border border-neutral-800">
                                            <div className="w-8 h-8 rounded bg-white text-black flex items-center justify-center font-bold text-xs">N</div>
                                            <div>
                                                <div className="text-sm text-white font-medium">Next.js 14</div>
                                                <div className="text-[10px] text-neutral-500">App Router</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-2 rounded bg-neutral-900 border border-neutral-800">
                                            <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xs">TS</div>
                                            <div>
                                                <div className="text-sm text-white font-medium">TypeScript</div>
                                                <div className="text-[10px] text-neutral-500">Strict Mode</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-2 rounded bg-neutral-900 border border-neutral-800">
                                            <div className="w-8 h-8 rounded bg-cyan-500 text-white flex items-center justify-center font-bold text-xs">Tw</div>
                                            <div>
                                                <div className="text-sm text-white font-medium">Tailwind</div>
                                                <div className="text-[10px] text-neutral-500">v3.4</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Backend & AI</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-neutral-300">
                                            <Database className="w-4 h-4 text-neutral-500" />
                                            PostgreSQL + Prisma
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-neutral-300">
                                            <Cpu className="w-4 h-4 text-neutral-500" />
                                            OpenAI Whisper
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-neutral-300">
                                            <Globe className="w-4 h-4 text-neutral-500" />
                                            Vercel Edge
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Widget>
                </div>

                {/* 3. Brand Kit (1x2) */}
                <div className="lg:col-span-1 lg:row-span-2">
                    <Widget title="Brand Identity" action={<Palette className="w-4 h-4 text-neutral-500" />}>
                        <div className="flex flex-col h-full gap-6">
                            {/* Logo Preview */}
                            <div className="p-6 bg-neutral-900 rounded-lg border border-neutral-800 flex flex-col items-center justify-center gap-2">
                                <div className="text-2xl font-bold text-white tracking-tight">CaptionAI</div>
                                <div className="text-[10px] text-neutral-500 uppercase tracking-widest">AI-Powered Learning</div>
                            </div>

                            {/* Colors */}
                            <div>
                                <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Palette</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <div className="h-10 rounded bg-[#2563EB] border border-white/5"></div>
                                        <div className="text-[10px] text-neutral-500 font-mono">#2563EB</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="h-10 rounded bg-[#10B981] border border-white/5"></div>
                                        <div className="text-[10px] text-neutral-500 font-mono">#10B981</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="h-10 rounded bg-[#F59E0B] border border-white/5"></div>
                                        <div className="text-[10px] text-neutral-500 font-mono">#F59E0B</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="h-10 rounded bg-[#0F172A] border border-white/5"></div>
                                        <div className="text-[10px] text-neutral-500 font-mono">#0F172A</div>
                                    </div>
                                </div>
                            </div>

                            {/* Typography */}
                            <div>
                                <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Typography</h4>
                                <div className="space-y-2 bg-neutral-900 p-3 rounded border border-neutral-800">
                                    <div className="text-xl font-bold text-white">Inter Bold</div>
                                    <div className="text-sm text-neutral-300">Inter Regular</div>
                                    <div className="text-xs text-neutral-500 font-mono">JetBrains Mono</div>
                                </div>
                            </div>
                        </div>
                    </Widget>
                </div>

                {/* 4. User Flow (2x1) - Placeholder */}
                <div className="lg:col-span-2">
                    <Widget title="User Journey" action={<Figma className="w-4 h-4 text-neutral-500" />}>
                        <div className="flex flex-col h-full items-center justify-center p-6 bg-neutral-900/30 rounded-lg border border-dashed border-neutral-800">
                            <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                                <Figma className="w-8 h-8 text-neutral-600" />
                            </div>
                            <h3 className="text-lg font-medium text-white mb-2">Figma Integration Coming Soon</h3>
                            <p className="text-sm text-neutral-500 text-center max-w-sm">
                                We are working on a direct integration to visualize your AI-generated user flows directly within the dashboard.
                            </p>
                        </div>
                    </Widget>
                </div>

                {/* 5. Data Moat (2x1) - Revamped */}
                <div className="lg:col-span-2">
                    <Widget title="Data Moat Configuration" action={<ShieldCheck className="w-4 h-4 text-purple-500" />}>
                        <div className="flex flex-col h-full gap-6">
                            <div className={`relative overflow-hidden rounded-xl border transition-all duration-500 ${isDataMoatActive ? 'bg-purple-900/20 border-purple-500/30' : 'bg-neutral-900 border-neutral-800'}`}>
                                {/* Background Effect */}
                                {isDataMoatActive && (
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(168,85,247,0.2),transparent_70%)]" />
                                )}

                                <div className="relative p-6 flex items-center justify-between z-10">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-lg transition-colors ${isDataMoatActive ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' : 'bg-neutral-800 text-neutral-500'}`}>
                                            <Lock className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-semibold text-white">Proprietary Data Collection</h3>
                                            <p className="text-xs text-neutral-400 mt-1">Capture user interactions to train custom AI models.</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setIsDataMoatActive(!isDataMoatActive)}
                                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-neutral-950 ${isDataMoatActive ? 'bg-purple-600' : 'bg-neutral-700'}`}
                                    >
                                        <span className={`${isDataMoatActive ? 'translate-x-6' : 'translate-x-1'} inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm`} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className={`flex flex-col items-center text-center p-4 rounded-xl border transition-all duration-300 ${isDataMoatActive ? 'bg-neutral-900/80 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.05)]' : 'bg-neutral-900/30 border-neutral-800 opacity-50'}`}>
                                    <MousePointerClick className={`w-5 h-5 mb-3 ${isDataMoatActive ? 'text-purple-400' : 'text-neutral-600'}`} />
                                    <span className="text-xs font-medium text-white">Behavior Tracking</span>
                                </div>
                                <div className={`flex flex-col items-center text-center p-4 rounded-xl border transition-all duration-300 ${isDataMoatActive ? 'bg-neutral-900/80 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.05)]' : 'bg-neutral-900/30 border-neutral-800 opacity-50'}`}>
                                    <Database className={`w-5 h-5 mb-3 ${isDataMoatActive ? 'text-purple-400' : 'text-neutral-600'}`} />
                                    <span className="text-xs font-medium text-white">Custom Dataset</span>
                                </div>
                                <div className={`flex flex-col items-center text-center p-4 rounded-xl border transition-all duration-300 ${isDataMoatActive ? 'bg-neutral-900/80 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.05)]' : 'bg-neutral-900/30 border-neutral-800 opacity-50'}`}>
                                    <BrainCircuit className={`w-5 h-5 mb-3 ${isDataMoatActive ? 'text-purple-400' : 'text-neutral-600'}`} />
                                    <span className="text-xs font-medium text-white">Model Training</span>
                                </div>
                            </div>
                        </div>
                    </Widget>
                </div>

            </div>
        </div>
    );
}
