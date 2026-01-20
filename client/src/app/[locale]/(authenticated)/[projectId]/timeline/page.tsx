'use client';

import { useEffect, useState, use } from 'react';
import { createClient } from '@/utils/supabase/client';
import { getTimeline, startTimeline, sendTimelineMessage } from '@/lib/api';
import { Loader2 } from 'lucide-react';
import TimelineWizard from '@/app/[locale]/components/timeline/TimelineWizard';
import TimelineView from '@/app/[locale]/components/timeline/TimelineView';
import StepDetail from '@/app/[locale]/components/timeline/StepDetail'; // We need this one too

export default function TimelinePage({ params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = use(params);
    const [loading, setLoading] = useState(true);
    const [timelineData, setTimelineData] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);
    const [selectedStep, setSelectedStep] = useState<any>(null);

    const [error, setError] = useState<string | null>(null);

    const loadTimeline = async () => {
        setLoading(true);
        setError(null);

        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const t = session.access_token;
        setToken(t);

        try {
            // First try to fetch
            let data = await getTimeline(projectId, t);

            if (!data.exists) {
                data = await startTimeline(projectId, t);
            }

            setTimelineData(data);
        } catch (err: any) {
            console.error('Timeline Load Error:', err);
            setError(err.message || 'Failed to load timeline.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTimeline();
    }, [projectId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0A0A0A]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                    <p className="text-neutral-400 text-sm">Loading timeline...</p>
                </div>
            </div>
        );
    }

    if (error || !timelineData) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0A0A0A]">
                <div className="bg-[#1B1818] border border-red-500/20 rounded-xl p-8 max-w-md text-center">
                    <h3 className="text-xl font-bold text-white mb-2">Unable to Load Timeline</h3>
                    <p className="text-neutral-400 mb-6">{error || "An unexpected error occurred."}</p>
                    <button
                        onClick={loadTimeline}
                        className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors border border-white/10"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Determine View
    // API returns { status, timeline, steps, messages } or { status, messages }
    // We ensured 'status' is at top level in both backend endpoints now.
    const { status, messages, steps } = timelineData;

    console.log("Timeline Data:", { status, stepsCount: steps?.length });

    if (status === 'onboarding') {
        return (
            <div className="min-h-screen bg-[#0A0A0A] py-12 px-4">
                <TimelineWizard
                    projectId={projectId}
                    initialMessages={messages || []}
                    onComplete={loadTimeline} // Reload on completion
                    token={token!}
                />
            </div>
        );
    }

    if (selectedStep) {
        return (
            <StepDetail
                step={selectedStep}
                onBack={() => setSelectedStep(null)}
                token={token!}
                projectId={projectId}
            />
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A]">
            <TimelineView
                project={{ id: projectId } as any}
                steps={steps || []}
                onStepClick={setSelectedStep}
            />
        </div>
    );
}
