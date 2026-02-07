'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { useEffect, useState, useRef } from 'react';
import LoadingModal from '../components/temporary/LoadingModal';
import EnhancePivot from '../components/temporary/EnhancePivot';
import { createClient } from '@/utils/supabase/client';
import { useLocale } from 'next-intl';

export default function AnalyzingPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const supabase = createClient();
    const locale = useLocale();

    const [analysisData, setAnalysisData] = useState<any>(null);
    const [flowState, setFlowState] = useState<'analyzing' | 'decision' | 'completed'>('analyzing');
    const [idea, setIdea] = useState<string | null>(null);
    const [status, setStatus] = useState<string>('starting');
    const [isLoading, setIsLoading] = useState(false); // Controls modal visibility mostly
    const [projectId, setProjectId] = useState<string | null>(null);

    const hasStartedRef = useRef(false);
    const pollingInterval = useRef<NodeJS.Timeout | null>(null);

    // Initial Load & Auth Check
    useEffect(() => {
        const init = async () => {
            if (hasStartedRef.current) return;

            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                const currentIdea = searchParams.get('idea') || localStorage.getItem('pending_idea');
                if (currentIdea) {
                    localStorage.setItem('pending_idea', currentIdea);
                }
                router.push('/login?next=/analyzing');
                return;
            }

            // Check for existing Project ID from URL or Session
            // Note: URL param 'id' is better to allow sharing/returning
            const urlId = searchParams.get('id');
            const sessionKey = `analysis_id_${searchParams.get('idea') || 'active'}`;
            const existingId = urlId || sessionStorage.getItem(sessionKey);

            if (existingId) {
                // Resume Mode
                hasStartedRef.current = true;
                setProjectId(existingId);
                setIdea(searchParams.get('idea') || "Existing Project");
                setIsLoading(true);
                startPolling(existingId, session.access_token);
                return;
            }

            // New Analysis Mode
            const ideaParam = searchParams.get('idea');
            const typeParam = searchParams.get('type') || 'small';

            if (ideaParam) {
                hasStartedRef.current = true;
                setIdea(ideaParam);
                startAnalysis(ideaParam, session.access_token, typeParam, sessionKey);
            } else {
                // Check pending logic from local storage if redirected from login
                const storedIdea = localStorage.getItem('pending_idea');
                const storedType = localStorage.getItem('pending_type') || 'small';
                if (storedIdea) {
                    hasStartedRef.current = true;
                    setIdea(storedIdea);
                    localStorage.removeItem('pending_idea');
                    localStorage.removeItem('pending_type');
                    startAnalysis(storedIdea, session.access_token, storedType, sessionKey);
                } else {
                    router.push('/');
                }
            }
        };

        init();

        return () => {
            if (pollingInterval.current) clearInterval(pollingInterval.current);
        };
    }, [searchParams]);

    const startAnalysis = async (promptToUse: string, token: string, analysisType: string = 'small', sessionKey: string) => {
        try {
            setIsLoading(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

            const response = await fetch(`${apiUrl}/generate-report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ idea: promptToUse, analysis_type: analysisType, language: locale }),
            });

            if (response.status === 401) {
                await supabase.auth.signOut();
                router.push('/login');
                return;
            }

            if (!response.ok) {
                try {
                    const err = await response.json();
                    console.error("Initiation Error:", err);
                    alert(err.detail || "Failed to start analysis.");
                } catch {
                    alert("Failed to start analysis.");
                }
                router.push('/');
                return;
            }

            // Parse SSE stream
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            if (!reader) {
                alert("Failed to read response stream.");
                router.push('/');
                return;
            }

            while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');

                // Keep the last incomplete line in the buffer
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const jsonStr = line.slice(6); // Remove 'data: ' prefix

                        try {
                            const event = JSON.parse(jsonStr);

                            // Handle different event types
                            if (event.type === 'status') {
                                console.log(`Agent ${event.agent} is ${event.status}`);
                                setStatus(event.status);
                            } else if (event.type === 'agent_complete') {
                                console.log(`Agent ${event.agent} completed`);
                            } else if (event.type === 'log') {
                                console.log(`Log: ${event.message}`);
                            } else if (event.type === 'complete') {
                                // Analysis completed successfully
                                const pid = event.data?.project_id;

                                if (!pid) {
                                    console.error("No project_id in complete event:", event);
                                    alert("Analysis completed but no project ID received.");
                                    router.push('/');
                                    return;
                                }

                                // Persist ID
                                setProjectId(pid);
                                sessionStorage.setItem(sessionKey, pid);
                                localStorage.setItem('verdyct_active_analysis_id', pid);

                                // Update URL
                                const newUrl = new URL(window.location.href);
                                newUrl.searchParams.set('id', pid);
                                window.history.replaceState({}, '', newUrl.toString());

                                // Start Polling
                                startPolling(pid, token);
                                return; // Exit the stream reading loop
                            } else if (event.type === 'error') {
                                // Server error
                                console.error("Server error:", event.message);
                                alert(event.message || "Analysis failed on server. Please try again.");
                                router.push('/');
                                return;
                            }
                        } catch (parseError) {
                            console.error("Failed to parse SSE event:", jsonStr, parseError);
                        }
                    }
                }
            }

        } catch (error) {
            console.error("Error starting analysis:", error);
            alert("Connection error. Please try again.");
            router.push('/');
        }
    };

    const startPolling = (pid: string, token: string) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

        const poll = async () => {
            try {
                const res = await fetch(`${apiUrl}/api/projects/${pid}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.status === 401) {
                    // Token expired logic?
                    return;
                }

                if (!res.ok) {
                    // Project not found or error
                    console.log("Poll error:", res.status);
                    return;
                }

                const project = await res.json();
                setStatus(project.status); // Update status for LoadingModal

                // Check terminal states
                if (['approved', 'rejected', 'failed'].includes(project.status)) {
                    if (pollingInterval.current) clearInterval(pollingInterval.current);

                    if (project.status === 'failed') {
                        alert("Analysis failed on server. Please try again.");
                        router.push('/');
                        return;
                    }

                    // Complete
                    // Wait a moment for UI to catch up?
                    // Actually LoadingModal handles "approved" by calling onComplete
                    // We need to set data first
                    if (project.report_json) {
                        // Map report_json to expected analysisData structure
                        // report_json IS the VerdyctReportResponse which contains 'agents', 'status', 'pcs_score', etc.
                        // But frontend expects `data.data` from previous logic?
                        // Previous logic: `setAnalysisData(data.data)` where data.type === 'complete'.
                        // Let's inspect `VerdyctReportResponse`.
                        // It has `status`, `pcs_score`, `agents`, `rescue_plan`.
                        // The frontend uses `analysisData.status` and `analysisData.pcs_score` etc.
                        // So we can set it directly.

                        // BUT `project.report_json` is the `VerdyctReportResponse`.
                        // So we merge it.
                        setAnalysisData(project.report_json);
                    }

                    setIsLoading(false); // This might hide modal if not careful. 
                    // LoadingModal logic: `isLoading={!analysisData}` passed? 
                    // Previous: `isLoading={!analysisData}`.
                    // If we setAnalysisData, isLoading becomes false in the View?
                    // No. passing `isLoading` state variable? No.
                    // Let's look at `return`.
                }

            } catch (e) {
                console.error("Polling error:", e);
            }
        };

        // Poll immediately then interval
        poll();
        pollingInterval.current = setInterval(poll, 2000);
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
        // Clear old session
        sessionStorage.clear(); // Brute force but safer
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            // New Analysis
            const sessionKey = `analysis_id_${prompt}`;
            startAnalysis(prompt, session.access_token, 'small', sessionKey); // Assuming restart is small or full?
            // Actually, EnhancePivot usually triggers meaningful pivot.
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
                    isLoading={status !== 'approved' && status !== 'rejected'} // Keep loading until terminal
                    status={status}
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
