'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from '@/i18n/routing';
import { createClient } from '@/utils/supabase/client';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { CheckCircle, XCircle, ArrowRight, Loader2 } from 'lucide-react';

// Simple Toast Component
function CompletionToast({ status, projectId, onClose, t }: { status: string, projectId: string, onClose: () => void, t: any }) {
    const router = useRouter();
    const isSuccess = status === 'approved';

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl border shadow-2xl backdrop-blur-md w-full max-w-sm cursor-pointer
                ${isSuccess
                    ? 'bg-neutral-900/90 border-green-500/30 shadow-green-500/10'
                    : 'bg-neutral-900/90 border-red-500/30 shadow-red-500/10'
                }`}
            onClick={() => {
                onClose();
                router.push(`/${projectId}/analyst`);
            }}
        >
            <div className="flex items-start gap-4">
                <div className={`p-2 rounded-xl ${isSuccess ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                    {isSuccess ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                </div>
                <div className="flex-1">
                    <h3 className="text-white font-bold text-sm mb-1">
                        {isSuccess ? "Analysis Complete!" : "Analysis Failed"}
                    </h3>
                    <p className="text-neutral-400 text-xs leading-relaxed mb-3">
                        {isSuccess
                            ? "Your report is ready. Click to view the details."
                            : "Something went wrong during the analysis."}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-medium text-white group">
                        <span>View Report</span>
                        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </div>
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                    className="text-neutral-500 hover:text-white transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
        </motion.div>
    );
}

export default function GlobalAnalysisNotifier() {
    const supabase = createClient();
    const [notification, setNotification] = useState<{ status: string, projectId: string } | null>(null);
    const pollingInterval = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize Audio
    useEffect(() => {
        audioRef.current = new Audio('/sounds/notification.mp3'); // Needs a real file or fallback
        // Fallback or verify existence later? 
        // For now we assume a file exists or user provides one. 
        // If 404, it just won't play silently.
    }, []);

    const playNotificationSound = () => {
        if (audioRef.current) {
            audioRef.current.volume = 0.5;
            audioRef.current.play().catch(e => console.log("Audio play failed (autoblock?):", e));
        }
    };

    useEffect(() => {
        const checkStatus = async () => {
            // Check LocalStorage for active ID
            const activeId = localStorage.getItem('verdyct_active_analysis_id');
            if (!activeId) return;

            // Poll API
            try {
                // We need a session to call API? Yes generally.
                // But this component runs in RootLayout, so user is likely auth'd if they started it.
                // If token expired, fetch will fail (401).
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) return;

                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                const res = await fetch(`${apiUrl}/api/projects/${activeId}`, {
                    headers: { 'Authorization': `Bearer ${session.access_token}` }
                });

                if (!res.ok) return;

                const project = await res.json();

                if (['approved', 'rejected'].includes(project.status)) {
                    // It's done!
                    // 1. Show Notification
                    setNotification({ status: project.status, projectId: activeId });

                    // 2. Play Sound
                    playNotificationSound();

                    // 3. Clear Storage so we don't notify loop
                    localStorage.removeItem('verdyct_active_analysis_id');
                }
            } catch (e) {
                console.error("Notifier poll error", e);
            }
        };

        // Poll every 5 seconds (less aggressive than the main page)
        pollingInterval.current = setInterval(checkStatus, 5000);

        return () => {
            if (pollingInterval.current) clearInterval(pollingInterval.current);
        };
    }, []);

    return (
        <AnimatePresence>
            {notification && (
                <CompletionToast
                    status={notification.status}
                    projectId={notification.projectId}
                    onClose={() => setNotification(null)}
                    t={null} // Replace with real hook if needed
                />
            )}
        </AnimatePresence>
    );
}
