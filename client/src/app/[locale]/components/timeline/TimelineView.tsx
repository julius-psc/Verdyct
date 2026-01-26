'use client';

import { useState } from 'react';
import { CheckCircle, Lock, MessageSquare, ChevronRight, Play, Sparkles } from 'lucide-react';
import { Project } from '@/lib/api';

interface TimelineStep {
    id: string;
    order_index: number;
    title: string;
    description: string;
    status: string;
    content: string;
}

interface TimelineViewProps {
    project: Project;
    steps: TimelineStep[];
    onStepClick: (step: TimelineStep) => void;
}

export default function TimelineView({ project, steps, onStepClick }: TimelineViewProps) {
    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            {/* Premium Header */}
            <div className="mb-12 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C12424]/10 border border-[#C12424]/20 mb-4">
                    <Sparkles className="w-4 h-4 text-[#C12424]" />
                    <span className="text-sm font-medium text-[#C12424]">Your Roadmap</span>
                </div>
                <h1 className="text-4xl font-black text-white mb-3">Project Timeline</h1>
                <p className="text-lg text-neutral-400">Your step-by-step guide to shipping.</p>
            </div>

            <div className="relative">
                {/* Vertical Line with Gradient */}
                <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#C12424]/50 via-neutral-800 to-neutral-900" />

                <div className="space-y-6">
                    {steps.map((step, index) => {
                        const isLocked = step.status === 'locked';
                        const isCompleted = step.status === 'completed';
                        const isActive = step.status === 'active';

                        return (
                            <div
                                key={step.id}
                                className={`relative pl-16 transition-all duration-300 ${!isLocked ? 'cursor-pointer group' : 'opacity-60'}`}
                                onClick={() => !isLocked && onStepClick(step)}
                            >
                                {/* Status Icon with Glow */}
                                <div className={`
                                    absolute left-3 -translate-x-1/2 top-0 w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 
                                    transition-all duration-300
                                    ${isCompleted ? 'border-[#C12424] text-[#C12424] bg-[#C12424]/10 shadow-[0_0_20px_rgba(193,36,36,0.3)]' :
                                        isActive ? 'border-[#C12424] text-[#C12424] bg-[#0A0A0A] shadow-[0_0_25px_rgba(193,36,36,0.5)] animate-pulse' :
                                            'border-neutral-700 text-neutral-700 bg-[#0A0A0A]'}
                                `}>
                                    {isCompleted ? <CheckCircle className="w-5 h-5" /> :
                                        isActive ? <Play className="w-5 h-5 fill-current" /> :
                                            <Lock className="w-5 h-5" />}
                                </div>

                                {/* Premium Glassmorphic Card */}
                                <div className={`
                                    relative overflow-hidden rounded-2xl p-6 transition-all duration-300
                                    border backdrop-blur-sm
                                    ${isActive
                                        ? 'bg-gradient-to-br from-[#C12424]/5 to-[#1B1818]/90 border-[#C12424]/30 shadow-[0_0_30px_rgba(193,36,36,0.15)]'
                                        : 'bg-[#1B1818]/80 border-white/5 hover:border-[#C12424]/20 hover:shadow-[0_0_20px_rgba(193,36,36,0.1)]'}
                                    ${!isLocked && 'hover:scale-[1.01]'}
                                `}>
                                    {/* Glow effect overlay */}
                                    {isActive && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#C12424]/10 via-transparent to-transparent opacity-50" />
                                    )}

                                    <div className="relative z-10 flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            {/* Step Badge */}
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border font-mono
                                                    ${isActive
                                                        ? 'bg-[#C12424]/20 text-[#C12424] border-[#C12424]/30 shadow-lg shadow-[#C12424]/20' :
                                                        isCompleted
                                                            ? 'bg-[#C12424]/10 text-[#C12424]/80 border-[#C12424]/20' :
                                                            'bg-neutral-800/50 text-neutral-500 border-white/5'}
                                                `}>
                                                    STEP {step.order_index}
                                                </span>
                                                {isActive && (
                                                    <span className="flex items-center gap-1 text-xs text-[#C12424] animate-pulse">
                                                        <span className="w-2 h-2 rounded-full bg-[#C12424]" />
                                                        In Progress
                                                    </span>
                                                )}
                                            </div>

                                            {/* Title */}
                                            <h3 className={`text-xl font-bold mb-2 transition-colors
                                                ${isActive ? 'text-white' : 'text-white/90 group-hover:text-[#C12424]'}
                                            `}>
                                                {step.title}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-sm text-neutral-400 line-clamp-2 leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>

                                        {!isLocked && (
                                            <ChevronRight className={`
                                                w-6 h-6 transition-all duration-300 flex-shrink-0
                                                ${isActive ? 'text-[#C12424]' : 'text-neutral-600 group-hover:text-[#C12424]'}
                                                group-hover:translate-x-1
                                            `} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
