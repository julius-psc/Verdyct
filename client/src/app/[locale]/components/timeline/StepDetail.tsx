'use client';

import { useState } from 'react';
import { ArrowLeft, CheckCircle, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import TimelineWizard from './TimelineWizard'; // Reuse chat component? Or simplified version?
// Actually TimelineWizard is specific to onboarding. Let's make a generic Chat component or reuse wizard with different props?
// Wizard has specific "finalize_onboarding" logic.
// I'll make a StepChat component inside this file or reuse/adapt.
// Let's adapt TimelineWizard to be more generic in future refactors, but for now I'll inline a simple chat or create StepHelper.

import { sendTimelineMessage } from '@/lib/api';

interface StepDetailProps {
    step: any;
    onBack: () => void;
    token: string;
    projectId: string;
}

export default function StepDetail({ step, onBack, token, projectId }: StepDetailProps) {
    const [completing, setCompleting] = useState(false);

    // Chat State
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
                // Return to list (reload happens via parent state change / fetch?)
                // Parent needs to know to reload. 
                // Currently onBack just sets selectedStep to null.
                // TimelinePage should probably auto-refresh if valid.
                // We'll trigger a reload in parent by calling onBack() and maybe passing a "refresh" flag?
                // For now, let's just go back, and hope user refreshes or we add a reload callback.
                // Best practice: add onComplete prop. 
                window.location.reload(); // Brute force refresh for now to ensure next step appears
            }
        } catch (e) {
            console.error(e);
        } finally {
            setCompleting(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 flex gap-6 h-[calc(100vh-4rem)]">
            {/* Main Content */}
            <div className={`flex-1 flex flex-col bg-[#1B1818] border border-white/10 rounded-2xl overflow-hidden`}>
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-neutral-400 hover:text-white"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <div className="text-xs font-mono text-blue-400 mb-1">STEP {step.order_index}</div>
                            <h2 className="text-xl font-bold text-white">{step.title}</h2>
                        </div>
                    </div>

                    {step.status === 'active' && (
                        <button
                            onClick={handleComplete}
                            disabled={completing}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                            {completing ? 'Completing...' : 'Mark Complete'}
                            <CheckCircle className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 prose prose-invert max-w-none">
                    <ReactMarkdown>{step.content}</ReactMarkdown>
                </div>
            </div>

            {/* Side Chat (Always visible or togglable?) 
                Prompt says "un chat pour parler avec le chatbot qui pourra l'aider".
                Side panel is good.
            */}
            <div className="w-[400px] flex flex-col bg-[#1B1818] border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-white/10 bg-white/5 font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                    Step Assistant
                </div>
                <StepChat projectId={projectId} stepId={step.id} token={token} onUpdate={(data) => {
                    // Start simple: just reload to get fresh data
                    // Ideally update local state, but since content is in 'step' prop passed from parent...
                    // We need a way to tell parent to refresh.
                    window.location.reload();
                }} />
            </div>
        </div>
    );
}

// Simple internal chat component
import { Send, Loader2, Bot } from 'lucide-react';

function StepChat({ projectId, stepId, token, onUpdate }: {
    projectId: string,
    stepId: string,
    token: string,
    onUpdate?: (data: any) => void
}) {
    const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);

    // Load history? Ideally yes.
    // For now starts empty or we fetch it? API fetches history.
    // We should fetch history on mount.

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
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center text-sm text-neutral-500 py-8">
                        Ask questions about this step. I can help you complete it.
                    </div>
                )}
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-xl text-sm ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-200'}`}>
                            {m.content}
                        </div>
                    </div>
                ))}
                {sending && <Loader2 className="w-4 h-4 animate-spin text-neutral-500 m-4" />}
            </div>
            <div className="p-3 border-t border-white/10 bg-white/5 flex gap-2">
                <input
                    className="flex-1 bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    placeholder="Ask for help..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend} disabled={sending} className="p-2 bg-blue-600 text-white rounded-lg">
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
