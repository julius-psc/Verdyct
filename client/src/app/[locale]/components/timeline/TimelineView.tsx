'use client';

import { useState } from 'react';
import { CheckCircle, Lock, MessageSquare, ChevronRight, Play } from 'lucide-react';
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
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Project Timeline</h1>
                <p className="text-neutral-400">Your step-by-step guide to shipping.</p>
            </div>

            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-neutral-800" />

                <div className="space-y-6">
                    {steps.map((step) => {
                        const isLocked = step.status === 'locked';
                        const isCompleted = step.status === 'completed';
                        const isActive = step.status === 'active';

                        return (
                            <div
                                key={step.id}
                                className={`relative pl-16 transition-all duration-300 ${!isLocked ? 'cursor-pointer group' : 'opacity-60'}`}
                                onClick={() => !isLocked && onStepClick(step)}
                            >
                                {/* Status Icon */}
                                <div className={`
                                    absolute left-3 -translate-x-1/2 top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 bg-[#0A0A0A]
                                    ${isCompleted ? 'border-emerald-500 text-emerald-500' :
                                        isActive ? 'border-blue-500 text-blue-500 animate-pulse' :
                                            'border-neutral-700 text-neutral-700'}
                                `}>
                                    {isCompleted ? <CheckCircle className="w-3 h-3" /> :
                                        isActive ? <Play className="w-3 h-3 fill-current" /> :
                                            <Lock className="w-3 h-3" />}
                                </div>

                                {/* Card */}
                                <div className={`
                                    bg-[#1B1818] border rounded-xl p-5 transition-all
                                    ${isActive ? 'border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'border-white/5 hover:border-white/10'}
                                `}>
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-xs font-mono px-2 py-0.5 rounded border 
                                                    ${isActive ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                        isCompleted ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                            'bg-neutral-800 text-neutral-500 border-white/5'}
                                                `}>
                                                    STEP {step.order_index}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                                                {step.title}
                                            </h3>
                                            <p className="text-sm text-neutral-400 line-clamp-2">
                                                {step.description}
                                            </p>
                                        </div>

                                        {!isLocked && (
                                            <ChevronRight className="w-5 h-5 text-neutral-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-transform" />
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
