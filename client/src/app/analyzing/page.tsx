'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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

    useEffect(() => {
        const init = async () => {
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
            if (ideaParam) {
                setIdea(ideaParam);
                startAnalysis(ideaParam, session.access_token);
            } else {
                const storedIdea = localStorage.getItem('pending_idea');
                if (storedIdea) {
                    setIdea(storedIdea);
                    localStorage.removeItem('pending_idea');
                    startAnalysis(storedIdea, session.access_token);
                } else {
                    router.push('/');
                }
            }
        };

        init();
    }, [searchParams]);

    const startAnalysis = async (promptToUse: string, token: string) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/generate-report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ idea: promptToUse }),
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
                                alert(data.message);
                                router.push('/');
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
            {flowState === 'analyzing' && (
                <LoadingModal
                    onComplete={handleAnalystComplete}
                    isLoading={!analysisData}
                    status={analysisData?.status}
                />
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
