'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ArchitectView from '../../../components/architect/ArchitectView';

export default function ArchitectPage() {
    const params = useParams();
    const [architectData, setArchitectData] = useState<any>(null);
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

                if (project.report_json && project.report_json.agents && project.report_json.agents.architect) {
                    setArchitectData(project.report_json.agents.architect);
                }
            } catch (error) {
                console.error("Error fetching project data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjectData();
    }, [params.projectId]);

    return (
        <main className="flex-1 overflow-auto">
            {loading ? (
                <div className="flex items-center justify-center h-full text-neutral-500">
                    Loading architectural blueprint...
                </div>
            ) : (
                <ArchitectView data={architectData} projectId={params.projectId as string} />
            )}
        </main>
    );
}
