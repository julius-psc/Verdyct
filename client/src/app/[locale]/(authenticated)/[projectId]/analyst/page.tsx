'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AnalystView from '../../../components/analyst/AnalystView';

export default function AnalystPage() {
    const params = useParams();
    const [analystData, setAnalystData] = useState<any>(null);
    const [allAgentsData, setAllAgentsData] = useState<any>(null);
    const [isPublic, setIsPublic] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjectData = async () => {
            if (!params.projectId) return;

            try {
                const response = await fetch(`http://localhost:8000/api/projects/${params.projectId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch project data');
                }
                const project = await response.json();
                setIsPublic(project.is_public ?? false);

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
                        setAllAgentsData(reportData.agents);
                        if (reportData.agents.analyst) {
                            setAnalystData(reportData.agents.analyst);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching project data:", error);
                setLoading(false); // Ensure loading stops on error
            } finally {
                setLoading(false);
            }
        };

        fetchProjectData();
    }, [params.projectId]);

    if (!analystData && !loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-neutral-500 gap-4">
                <p>Unable to load analysis data.</p>
                <div className="text-xs text-neutral-700 bg-neutral-900 p-4 rounded max-w-lg overflow-auto">
                    Debug: Project ID {params.projectId}
                </div>
            </div>
        )
    }

    return (
        <main className="flex-1 overflow-auto">
            {loading ? (
                <div className="flex items-center justify-center h-full text-neutral-500">
                    Loading analysis...
                </div>
            ) : (
                <AnalystView
                    data={analystData}
                    fullReport={{
                        ...allAgentsData,
                        project_id: Array.isArray(params.projectId) ? params.projectId[0] : params.projectId
                    }}
                    isPublic={isPublic}
                />
            )}
        </main>
    );
}
