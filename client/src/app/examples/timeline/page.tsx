'use client';

import { useState } from 'react';
import { mockTimelineData } from '@/data/mockTimeline';
import Link from 'next/link';
import { ArrowLeft, Sparkles, CheckCircle2, Lock, MessageSquare, Bot, User, Play, ChevronRight } from 'lucide-react';

export default function TimelineExamplePage() {
    const [selectedStepId, setSelectedStepId] = useState(mockTimelineData.current_step);
    const selectedStep = mockTimelineData.steps.find(s => s.id === selectedStepId);

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col">

            {/* Disclaimer Banner */}
            <div className="bg-gradient-to-r from-red-900/50 to-neutral-900 border-b border-red-500/20 px-4 py-2 flex items-center justify-center gap-2 text-xs md:text-sm text-red-100 relative z-50">
                <Sparkles className="w-4 h-4 text-red-400" />
                <span className="font-medium">The "Builder" Plan includes a dedicated AI Co-Founder.</span>
                <span className="hidden md:inline text-red-400/70 ml-2"> | </span>
                <span className="hidden md:inline opacity-70">It guides you step-by-step from Idea to Exit.</span>
            </div>

            {/* Header */}
            <header className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-neutral-400 hover:text-white">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            {mockTimelineData.project_name}
                            <span className="text-xs font-normal text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full border border-red-400/20">Active Project</span>
                        </h1>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">

                {/* Left Sidebar: Timeline Stepper */}
                <aside className="w-[400px] border-r border-white/5 bg-neutral-900/30 flex flex-col overflow-y-auto">
                    <div className="p-6">
                        <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-6">Execution Roadmap</h2>

                        <div className="space-y-0 relative">
                            {/* Vertical Line */}
                            <div className="absolute left-[27px] top-4 bottom-4 w-px bg-neutral-800 z-0"></div>

                            {mockTimelineData.steps.map((step, index) => {
                                const isSelected = selectedStepId === step.id;
                                const isCompleted = step.status === 'completed';
                                const isLocked = step.status === 'locked';

                                return (
                                    <div
                                        key={step.id}
                                        onClick={() => setSelectedStepId(step.id)}
                                        className={`relative z-10 flex gap-4 p-4 rounded-xl transition-all cursor-pointer border ${isSelected
                                            ? 'bg-neutral-800 border-red-500/30 shadow-lg'
                                            : 'hover:bg-neutral-800/50 border-transparent'
                                            }`}
                                    >
                                        {/* Icon */}
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${isCompleted ? 'bg-red-500 border-red-500 text-white' :
                                            isSelected ? 'bg-red-500/20 border-red-500 text-red-500' :
                                                'bg-neutral-900 border-neutral-700 text-neutral-500'
                                            }`}>
                                            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> :
                                                isLocked ? <Lock className="w-4 h-4" /> :
                                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />}
                                        </div>

                                        {/* Content */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <h3 className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-neutral-300'}`}>{step.title}</h3>
                                                {step.status === 'current' && <span className="text-[10px] bg-red-500 text-white font-bold px-1.5 rounded">NOW</span>}
                                            </div>
                                            <p className="text-xs text-neutral-500 leading-snug">{step.description}</p>
                                            <span className="text-[10px] text-neutral-600 mt-2 block">{step.date}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </aside>

                {/* Main Area: Chat Interface */}
                <main className="flex-1 flex flex-col bg-[#050505] relative">
                    {/* Background Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

                    {/* Chat Header (Context) */}
                    <div className="px-8 py-4 border-b border-white/5 bg-neutral-900/50 backdrop-blur z-10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500/10 rounded-lg">
                                <MessageSquare className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">Coaching Session: {selectedStep?.title}</h3>
                                <p className="text-xs text-neutral-400">Verdyct AI Co-Founder • Private Context</p>
                            </div>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-6 relative z-10">
                        {selectedStep?.chatHistory.map((msg, i) => (
                            <div key={i} className={`flex gap-4 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>

                                {/* Avatar */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'ai' ? 'bg-gradient-to-br from-red-600 to-red-800' : 'bg-neutral-800'
                                    }`}>
                                    {msg.role === 'ai' ? <Bot className="w-6 h-6 text-white" /> : <User className="w-5 h-5 text-neutral-400" />}
                                </div>

                                {/* Bubble */}
                                <div className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">{msg.role === 'ai' ? 'Verdyct AI' : 'You'}</span>

                                    <div className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-md border ${msg.role === 'ai'
                                            ? 'bg-neutral-900 border-white/10 text-neutral-200 rounded-tl-sm'
                                            : 'bg-red-800/80 border-red-700/50 text-white rounded-tr-sm backdrop-blur-sm'
                                        }`}>
                                        {msg.content}

                                        {/* Special Message Types */}
                                        {msg.type === 'insight' && (
                                            <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2 text-red-400 font-medium">
                                                <Sparkles className="w-4 h-4" />
                                                High-Value Insight
                                            </div>
                                        )}
                                        {msg.type === 'list' && (
                                            <div className="mt-2 text-xs text-neutral-400">
                                                * This list was auto-added to your implementation plan.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator for "Current" step */}
                        {selectedStep?.status === 'current' && (
                            <div className="flex gap-4 max-w-3xl animate-pulse">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-800 opacity-50 flex items-center justify-center shrink-0">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <div className="px-5 py-4 rounded-2xl bg-neutral-900/50 border border-white/5 text-neutral-400 text-xs flex items-center gap-1">
                                    Thinking <span className="animate-bounce">.</span><span className="animate-bounce delay-75">.</span><span className="animate-bounce delay-150">.</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area (Fake/Disabled) */}
                    <div className="p-6 border-t border-white/5 bg-neutral-900/30 backdrop-blur z-10">
                        <div className="max-w-4xl mx-auto relative">
                            <input
                                type="text"
                                placeholder={selectedStep?.status === 'current' ? "Ask advice on pricing..." : "Session archived."}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 pr-12 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <button
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                                onClick={() => {
                                    alert("In the real app, this sends a message to your AI Co-Founder!");
                                }}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-center text-[10px] text-neutral-600 mt-3 mb-2">
                            Verdyct AI uses real-time market data to coach your startup journey.
                        </p>
                        <p className="text-center text-[9px] text-neutral-700 max-w-lg mx-auto leading-relaxed">
                            *This is a static example. The actual product may evolve, and some fields shown here might be different or not available in the live version depending on your plan and data availability.
                        </p>
                    </div>

                </main>
            </div>
        </div>
    );
}
