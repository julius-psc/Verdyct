'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, Loader2 } from 'lucide-react';
import { sendTimelineMessage } from '@/lib/api';

interface Message {
    role: string;
    content: string;
}

interface TimelineWizardProps {
    projectId: string;
    initialMessages: Message[];
    onComplete: () => void;
    token: string;
}

export default function TimelineWizard({ projectId, initialMessages, onComplete, token }: TimelineWizardProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || sending) return;

        const userMsg = input;
        setInput('');
        setSending(true);

        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);

        try {
            const res = await sendTimelineMessage(projectId, userMsg, undefined, token);
            setMessages(prev => [...prev, { role: 'assistant', content: res.message }]);

            if (res.action === 'finalize_onboarding') {
                setTimeout(onComplete, 2000);
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-[#1B1818] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 bg-white/5">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Bot className="w-5 h-5 text-emerald-500" />
                    Verdyct Timeline Architect
                </h2>
                <p className="text-sm text-neutral-400">
                    Let's define your roadmap. I'll ask you a few questions to get started.
                </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`
                            max-w-[80%] rounded-2xl px-4 py-3 text-sm
                            ${msg.role === 'user'
                                ? 'bg-emerald-600 text-white rounded-br-none'
                                : 'bg-neutral-800 text-neutral-200 rounded-bl-none border border-white/5'}
                        `}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {sending && (
                    <div className="flex justify-start">
                        <div className="bg-neutral-800 rounded-2xl px-4 py-3 rounded-bl-none border border-white/5">
                            <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-white/10 bg-white/5">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your answer..."
                        className="flex-1 bg-neutral-900 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                        disabled={sending}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || sending}
                        className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
