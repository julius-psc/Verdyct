'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Bot, User, Send, ChevronRight, CheckCircle2, Lock, Sparkles, MessageSquare, ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';
import ReactMarkdown from 'react-markdown';

// Types matches backend models
interface RoadmapStep {
    id: number;
    title: string;
    description: string;
    status: 'locked' | 'current' | 'completed';
    is_preview: boolean;
}

interface ChatMessage {
    role: 'user' | 'ai';
    content: string;
    type?: 'text' | 'insight';
}

interface Roadmap {
    id: string;
    project_id: string;
    status: 'onboarding' | 'active' | 'completed';
    steps: RoadmapStep[];
}

export default function RoadmapPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params.projectId as string;
    const scrollRef = useRef<HTMLDivElement>(null);

    const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedStepId, setSelectedStepId] = useState<number | null>(null);
    const [isThinking, setIsThinking] = useState(false);

    // Initial Fetch
    useEffect(() => {
        fetchRoadmap();
    }, [projectId]);

    // Fetch Chat when Step Selected
    useEffect(() => {
        if (selectedStepId !== null) {
            fetchChatHistory(selectedStepId.toString());
        } else if (roadmap?.status === 'onboarding') {
            fetchChatHistory("onboarding");
        }
    }, [selectedStepId, roadmap?.status]);

    // Auto-scroll chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isThinking]);


    const fetchRoadmap = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/projects/${projectId}/roadmap`);
            const data = await res.json();
            setRoadmap(data);

            // Set initial selected step if active
            if (data.status === 'active' && data.steps?.length > 0) {
                // Find current step
                const current = data.steps.find((s: any) => s.status === 'current');
                if (current) setSelectedStepId(current.id);
                else setSelectedStepId(data.steps[data.steps.length - 1].id);
            }
        } catch (err) {
            console.error("Failed to fetch roadmap", err);
        }
    };

    const fetchChatHistory = async (stepId: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/projects/${projectId}/roadmap/chat/${stepId}`);
            const data = await res.json();
            setMessages(data);
        } catch (err) {
            console.error("Failed to fetch chat", err);
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsThinking(true);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s timeout

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/projects/${projectId}/coach/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg,
                    current_step_id: selectedStepId || undefined // null/undefined for onboarding
                }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!res.ok) throw new Error('Failed to send message');

            const data = await res.json();

            setMessages(prev => [...prev, { role: 'ai', content: data.message }]);

            // Handle State Changes
            if (data.updated_status && roadmap && data.updated_status !== roadmap.status) {
                setRoadmap(prev => prev ? { ...prev, status: data.updated_status } : null);
                // Reload roadmap to get fresh state?
                fetchRoadmap();
            }

            if (data.new_step) {
                // Refresh roadmap to show new step
                fetchRoadmap();
            }

        } catch (err) {
            console.error("Failed to send message", err);
            // Show error in chat
            setMessages(prev => [...prev, {
                role: 'ai',
                content: "⚠️ **Error:** Failed to reach the AI Coach. Please try again."
            }]);
            // Restore input so user doesn't lose it? (Optional, but user already sent it visually)
            // Actually, better to just let them re-type or just see the error.
        } finally {
            setIsThinking(false);
        }
    };

    if (!roadmap) return <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">Loading Roadmap...</div>;

    const isTimelineMode = roadmap.status !== 'onboarding';

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">
            {/* Header */}
            <div className="h-16 border-b border-white/5 flex items-center px-6 justify-between bg-neutral-900/50 backdrop-blur z-50">
                <div className="flex items-center gap-4">
                    <Link href={`/project/${projectId}`} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-neutral-400" />
                    </Link>
                    <div>
                        <h1 className="text-sm font-bold flex items-center gap-2">
                            Verdyct AI Coach
                            {isTimelineMode && <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/20">Active</span>}
                        </h1>
                    </div>
                </div>
            </div>

            <main className="flex-1 flex overflow-hidden">
                {/* Timeline Sidebar (Only in Active Mode) */}
                {isTimelineMode && (
                    <div className="w-80 border-r border-white/5 bg-[#0A0A0A] hidden md:flex flex-col">
                        <div className="p-6 border-b border-white/5">
                            <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4">Execution Plan</h2>
                            <div className="space-y-6 relative">
                                {/* Line */}
                                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-neutral-800" />

                                {roadmap.steps.map((step) => {
                                    const isSelected = selectedStepId === step.id;
                                    const isCurrent = step.status === 'current';
                                    const isLocked = step.status === 'locked';
                                    const isCompleted = step.status === 'completed';

                                    return (
                                        <div
                                            key={step.id}
                                            onClick={() => !isLocked && setSelectedStepId(step.id)}
                                            className={`relative z-10 flex gap-4 cursor-pointer group ${isLocked ? 'opacity-50 pointer-events-none' : ''}`}
                                        >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${isCompleted ? 'bg-red-500 border-red-500 text-white' :
                                                isCurrent ? 'bg-red-500/20 border-red-500 text-red-500' :
                                                    'bg-neutral-900 border-neutral-700 text-neutral-500'
                                                }`}>
                                                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> :
                                                    isLocked ? <Lock className="w-3 h-3" /> :
                                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                                            </div>
                                            <div className="pt-1">
                                                <h3 className={`text-sm font-medium transition-colors ${isSelected ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-200'}`}>
                                                    {step.title}
                                                </h3>
                                                <p className="text-[10px] text-neutral-600 line-clamp-1">{step.description}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Chat Area */}
                <div className="flex-1 flex flex-col relative bg-gradient-to-br from-neutral-900/50 to-black">

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6" ref={scrollRef}>
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-neutral-500 gap-4">
                                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                                    <Bot className="w-8 h-8 text-red-500" />
                                </div>
                                <p>Initialize the conversation below...</p>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div key={i} className={`flex gap-4 max-w-3xl mx-auto ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-gradient-to-br from-red-600 to-red-800' : 'bg-neutral-800'
                                    }`}>
                                    {msg.role === 'ai' ? <Bot className="w-5 h-5 text-white" /> : <User className="w-4 h-4 text-neutral-400" />}
                                </div>

                                <div className={`flex flex-col gap-1 max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-lg border ${msg.role === 'ai'
                                        ? 'bg-[#111] border-white/10 text-neutral-200 rounded-tl-sm'
                                        : 'bg-red-800/80 border-red-700/50 text-white rounded-tr-sm backdrop-blur-sm'
                                        }`}>
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isThinking && (
                            <div className="flex gap-4 max-w-3xl mx-auto">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shrink-0 opacity-50">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div className="px-5 py-4 rounded-2xl bg-[#111] border border-white/5 text-neutral-400 text-xs flex items-center gap-1">
                                    Thinking <span className="animate-bounce">.</span><span className="animate-bounce delay-75">.</span><span className="animate-bounce delay-150">.</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-6 border-t border-white/5 bg-neutral-900/50 backdrop-blur-md">
                        <div className="max-w-3xl mx-auto relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="Type your message..."
                                className="w-full bg-[#050505] border border-white/10 rounded-xl px-5 py-4 pr-14 text-sm text-white focus:outline-none focus:border-red-500/50 transition-all placeholder:text-neutral-600 shadow-inner"
                                disabled={loading || isThinking}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!input.trim() || loading || isThinking}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-lg bg-red-600 text-white hover:bg-red-500 transition-colors disabled:opacity-50 disabled:bg-transparent disabled:text-neutral-600"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-center text-[10px] text-neutral-600 mt-3">
                            Verdyct AI Coach • {isTimelineMode ? `Step: ${roadmap.steps.find(s => s.id === selectedStepId)?.title || 'Execution'}` : 'Onboarding Phase'}
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
