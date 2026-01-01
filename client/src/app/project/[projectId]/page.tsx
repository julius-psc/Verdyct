'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AnalystView from '../../components/analyst/AnalystView';
import Navbar from '../../components/landing/Navbar';

export default function PublicProjectPage() {
    const params = useParams();
    const [analystData, setAnalystData] = useState<any>(null);
    const [allAgentsData, setAllAgentsData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjectData = async () => {
            if (!params.projectId) return;

            try {
                // Use the public GET endpoint
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                const response = await fetch(`${apiUrl}/api/projects/${params.projectId}`);

                if (!response.ok) {
                    if (response.status === 404) throw new Error('Project not found');
                    throw new Error('Failed to fetch project data');
                }

                const project = await response.json();

                if (project.report_json) {
                    let reportData = project.report_json;
                    if (typeof reportData === 'string') {
                        try {
                            reportData = JSON.parse(reportData);
                        } catch (e) {
                            console.error("Failed to parse report_json string:", e);
                        }
                    }

                    if (reportData.agents) {
                        setAllAgentsData({
                            ...reportData.agents,
                            project_id: project.id // Ensure ID is passed for any internal logic
                        });
                        if (reportData.agents.analyst) {
                            setAnalystData(reportData.agents.analyst);
                        }
                    }
                }
            } catch (error: any) {
                console.error("Error fetching project data:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProjectData();
    }, [params.projectId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1B1818] text-white flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-neutral-500 animate-pulse">Loading analysis...</div>
                </div>
            </div>
        );
    }

    if (error || !analystData) {
        return (
            <div className="min-h-screen bg-[#1B1818] text-white flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <div className="text-xl font-semibold text-red-500">
                        {error || "Unable to load analysis data."}
                    </div>
                    <a href="/leaderboard" className="text-sm text-neutral-400 hover:text-white transition-colors">
                        ← Back to Leaderboard
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1B1818] text-white flex flex-col">
            <Navbar />
            <main className="flex-1 overflow-auto pt-20">
                <AnalystView
                    data={analystData}
                    fullReport={allAgentsData}
                    isReadOnly={true}
                />
            </main>
        </div>
    );
}
