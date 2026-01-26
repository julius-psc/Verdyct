'use client';

import { useState } from 'react';
import { ArrowLeft, CheckCircle, MessageSquare, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import TimelineWizard from './TimelineWizard';

import { sendTimelineMessage } from '@/lib/api';

interface StepDetailProps {
    step: any;
    onBack: () => void;
    token: string;
    projectId: string;
}

export default function StepDetail({ step, onBack, token, projectId }: StepDetailProps) {
    const [completing, setCompleting] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

    const handleComplete = async () => {
        setCompleting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/timeline/step/complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ step_id: step.id })
            });
            if (response.ok) {
                window.location.reload();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setCompleting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 flex gap-6 h-[calc(100vh-4rem)]">
            {/* Main Content - Premium Glassmorphic Design */}
            <div className={`flex-1 flex flex-col bg-gradient-to-br from-[#1B1818] to-[#0F0F0F] border border-white/10 rounded-3xl overflow-hidden shadow-2xl`}>
                {/* Premium Header with Gradient */}
                <div className="relative p-6 border-b border-white/10 bg-gradient-to-r from-[#C12424]/5 to-transparent backdrop-blur-sm">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#C12424]/10 to-transparent opacity-50" />

                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onBack}
                                className="p-2.5 hover:bg-white/10 rounded-xl transition-all text-neutral-400 hover:text-white hover:scale-105"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold font-mono px-3 py-1 rounded-lg bg-[#C12424]/20 text-[#C12424] border border-[#C12424]/30">
                                        STEP {step.order_index}
                                    </span>
                                    {step.status === 'active' && (
                                        <span className="flex items-center gap-1 text-xs text-[#C12424]">
                                            <span className="w-2 h-2 rounded-full bg-[#C12424] animate-pulse" />
                                            In Progress
                                        </span>
                                    )}
                                </div>
                                <h2 className="text-2xl font-black text-white">{step.title}</h2>
                            </div>
                        </div>

                        {step.status === 'active' && (
                            <button
                                onClick={handleComplete}
                                disabled={completing}
                                className="group relative px-6 py-3 bg-gradient-to-r from-[#C12424] to-[#A01D1D] hover:from-[#D62828] hover:to-[#C12424] text-white rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-[#C12424]/30 hover:shadow-[#C12424]/50 hover:scale-105"
                            >
                                <span className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="relative">{completing ? 'Completing...' : 'Mark Complete'}</span>
                                <CheckCircle className="w-5 h-5 relative" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Content Area with Better Styling */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="prose prose-invert max-w-none 
                        prose-headings:text-white prose-headings:font-bold
                        prose-h1:text-3xl prose-h1:mb-4
                        prose-h2:text-2xl prose-h2:mb-3 prose-h2:text-[#C12424]
                        prose-h3:text-xl prose-h3:mb-2
                        prose-p:text-neutral-300 prose-p:leading-relaxed prose-p:mb-4
                        prose-li:text-neutral-300 prose-li:mb-2
                        prose-strong:text-white prose-strong:font-bold
                        prose-a:text-[#C12424] prose-a:no-underline hover:prose-a:underline
                        prose-code:text-[#C12424] prose-code:bg-[#C12424]/10 prose-code:px-2 prose-code:py-1 prose-code:rounded
                    ">
                        <ReactMarkdown>{step.content}</ReactMarkdown>
                    </div>
                </div>
            </div>

            {/* Premium Step Assistant Panel */}
            <div className="w-[420px] flex flex-col bg-gradient-to-b from-[#1B1818] to-[#0F0F0F] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                {/* Assistant Header */}
                <div className="p-5 border-b border-white/10 bg-gradient-to-r from-[#C12424]/5 to-transparent backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#C12424]/20 border border-[#C12424]/30">
                            <MessageSquare className="w-5 h-5 text-[#C12424]" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white flex items-center gap-2">
                                Step Assistant
                                <Sparkles className="w-4 h-4 text-[#C12424]" />
                            </h3>
                            <p className="text-xs text-neutral-500">AI-powered help for this step</p>
                        </div>
                    </div>
                </div>

                <StepChat projectId={projectId} stepId={step.id} token={token} onUpdate={(data) => {
                    window.location.reload();
                }} />
            </div>
        </div>
    );
}

// Premium Chat Component
import { Send, Loader2, Bot } from 'lucide-react';
import { useEffect } from 'react';
import { getStepHistory } from '@/lib/api';

function StepChat({ projectId, stepId, token, onUpdate }: {
    projectId: string,
    stepId: string,
    token: string,
    onUpdate?: (data: any) => void
}) {
    const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(true);

    // Load chat history on mount
    useEffect(() => {
        const loadHistory = async () => {
            try {
                setLoading(true);
                const data = await getStepHistory(stepId, token);
                if (data.messages) {
                    setMessages(data.messages);
                }
            } catch (e) {
                console.error('Failed to load chat history:', e);
            } finally {
                setLoading(false);
            }
        };

        loadHistory();
    }, [stepId, token]);

    const handleSend = async () => {
        if (!input.trim() || sending) return;
        const msg = input;
        setInput('');
        setSending(true);
        setMessages(p => [...p, { role: 'user', content: msg }]);

        try {
            const res = await sendTimelineMessage(projectId, msg, stepId, token);
            setMessages(p => [...p, { role: 'assistant', content: res.message }]);

            if (res.action === 'update_step' && res.step_update) {
                onUpdate?.(res.step_update);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {loading && (
                    <div className="text-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-[#C12424] mx-auto mb-4" />
                        <p className="text-sm text-neutral-400">Loading chat history...</p>
                    </div>
                )}
                {!loading && messages.length === 0 && (
                    <div className="text-center py-12">
                        <div className="inline-flex p-4 rounded-2xl bg-[#C12424]/10 border border-[#C12424]/20 mb-4">
                            <Bot className="w-8 h-8 text-[#C12424]" />
                        </div>
                        <p className="text-sm text-neutral-400 leading-relaxed">
                            Ask questions about this step.<br />I can help you complete it.
                        </p>
                    </div>
                )}
                {!loading && messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-lg
                            ${m.role === 'user'
                                ? 'bg-gradient-to-r from-[#C12424] to-[#A01D1D] text-white'
                                : 'bg-gradient-to-br from-neutral-800 to-neutral-900 text-neutral-200 border border-white/10'}
                        `}>
                            {m.content}
                        </div>
                    </div>
                ))}
                {sending && (
                    <div className="flex justify-start">
                        <div className="p-4 rounded-2xl bg-neutral-800/50 border border-white/10">
                            <Loader2 className="w-4 h-4 animate-spin text-[#C12424]" />
                        </div>
                    </div>
                )}
            </div>

            {/* Premium Input Area */}
            <div className="p-4 border-t border-white/10 bg-gradient-to-r from-white/5 to-transparent backdrop-blur-sm">
                <div className="flex gap-2">
                    <input
                        className="flex-1 bg-neutral-900/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#C12424]/50 focus:ring-2 focus:ring-[#C12424]/20 transition-all"
                        placeholder="Ask for help..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                    />
                    <button
                        onClick={handleSend}
                        disabled={sending || !input.trim()}
                        className="p-3 bg-gradient-to-r from-[#C12424] to-[#A01D1D] hover:from-[#D62828] hover:to-[#C12424] text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#C12424]/30 hover:shadow-[#C12424]/50 hover:scale-105"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
