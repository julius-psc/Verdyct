'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import LoadingModal from '../components/temporary/LoadingModal';
import EnhancePivot from '../components/temporary/EnhancePivot';
import { createClient } from '@/utils/supabase/client';

export default function AnalyzingPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const supabase = createClient();

    const [analysisData, setAnalysisData] = useState<any>(null);
    const [flowState, setFlowState] = useState<'analyzing' | 'decision' | 'completed'>('analyzing');
    const [idea, setIdea] = useState<string | null>(null);
    const [showCreditError, setShowCreditError] = useState(false);

    const hasStartedRef = useRef(false);

    useEffect(() => {
        const init = async () => {
            // Prevent double-execution in Strict Mode or rapid re-mounts
            if (hasStartedRef.current) return;

            // Check session first
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                // If no session, redirect to login
                const currentIdea = searchParams.get('idea') || localStorage.getItem('pending_idea');
                if (currentIdea) {
                    localStorage.setItem('pending_idea', currentIdea);
                }
                router.push('/login?next=/analyzing');
                return;
            }

            // Session exists, proceed with idea retrieval
            const ideaParam = searchParams.get('idea');
            const typeParam = searchParams.get('type') || 'small';

            if (ideaParam) {
                hasStartedRef.current = true; // Mark as started
                setIdea(ideaParam);
                startAnalysis(ideaParam, session.access_token, typeParam);
            } else {
                const storedIdea = localStorage.getItem('pending_idea');
                const storedType = localStorage.getItem('pending_type') || 'small';
                if (storedIdea) {
                    hasStartedRef.current = true; // Mark as started
                    setIdea(storedIdea);
                    localStorage.removeItem('pending_idea');
                    localStorage.removeItem('pending_type');
                    startAnalysis(storedIdea, session.access_token, storedType);
                } else {
                    router.push('/');
                }
            }
        };

        init();
    }, [searchParams]);

    const startAnalysis = async (promptToUse: string, token: string, analysisType: string = 'small') => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/generate-report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ idea: promptToUse, analysis_type: analysisType }),
            });

            if (response.status === 401) {
                await supabase.auth.signOut();
                localStorage.setItem('pending_idea', promptToUse);
                router.push('/login?next=/analyzing');
                return;
            }

            if (!response.ok) {
                throw new Error('Analysis failed');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) throw new Error('No reader available');

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            console.log("Stream event:", data);

                            if (data.type === 'agent_complete') {
                                window.dispatchEvent(new CustomEvent('agent-complete', { detail: data.agent }));
                            } else if (data.type === 'complete') {
                                setAnalysisData(data.data);
                            } else if (data.type === 'error') {
                                console.error("Stream error:", data.message);
                                if (data.message.includes('Insufficient credits')) {
                                    setShowCreditError(true);
                                } else {
                                    alert(data.message);
                                    router.push('/');
                                }
                            }
                        } catch (e) {
                            console.error("Error parsing stream data:", e);
                        }
                    }
                }
            }

        } catch (error) {
            console.error("Error analyzing idea:", error);
            alert("Something went wrong. Please try again.");
            router.push('/');
        }
    };

    const handleAnalystComplete = () => {
        if (analysisData) {
            if (analysisData.status === 'approved') {
                router.push(`/${analysisData.project_id}/analyst`);
            } else {
                setFlowState('decision');
            }
        }
    };

    const handleDecisionAction = async (prompt: string) => {
        setAnalysisData(null);
        setFlowState('analyzing');
        setIdea(prompt);

        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            startAnalysis(prompt, session.access_token);
        } else {
            router.push('/login?next=/analyzing');
        }
    };

    const handleRetry = () => {
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            {flowState === 'analyzing' && !showCreditError && (
                <LoadingModal
                    onComplete={handleAnalystComplete}
                    isLoading={!analysisData}
                    status={analysisData?.status}
                />
            )}

            {showCreditError && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
                    <div className="max-w-md w-full bg-[#1B1818] border border-white/10 rounded-2xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
                        {/* Background Glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-red-500/10 blur-[100px] pointer-events-none" />

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 ring-1 ring-red-500/20">
                                <span className="text-3xl">⚠️</span>
                            </div>

                            <h1 className="text-2xl font-bold text-white mb-2">Out of Credits</h1>
                            <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                                Oops! You don't have enough credits for a <strong>Full Analysis</strong>.
                                <br />
                                You need <strong>1 credit</strong> to unlock all agents.
                            </p>

                            <div className="flex flex-col gap-3 w-full">
                                <button
                                    onClick={() => router.push('/')} // Ideally go to settings/billing
                                    className="w-full py-3 bg-white hover:bg-neutral-200 text-black font-semibold rounded-lg transition-colors"
                                >
                                    Get More Credits
                                </button>

                                <button
                                    onClick={() => router.push('/')}
                                    className="w-full py-3 bg-transparent hover:bg-white/5 text-neutral-400 font-medium rounded-lg border border-white/10 transition-colors"
                                >
                                    Return Home
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {flowState === 'decision' && analysisData && (
                <EnhancePivot
                    score={analysisData.pcs_score}
                    onEnhance={handleDecisionAction}
                    onPivot={handleDecisionAction}
                    onRetry={handleRetry}
                    onProceed={() => { }}
                    rescuePlan={analysisData.rescue_plan}
                />
            )}
        </div>
    );
}
