'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Sidebar from '../../components/dashboard/Sidebar';
import FinancierView from '../../components/financier/FinancierView';

export default function FinancierPage() {
    const params = useParams();
    const [financierData, setFinancierData] = useState<any>(null);
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

                if (project.report_json && project.report_json.agents && project.report_json.agents.financier) {
                    setFinancierData(project.report_json.agents.financier);
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
        <div className="min-h-screen bg-[#1B1818] text-white flex relative overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-auto">
                {loading ? (
                    <div className="flex items-center justify-center h-full text-neutral-500">
                        Loading financial analysis...
                    </div>
                ) : (
                    <FinancierView data={financierData} />
                )}
            </main>
        </div>
    );
}
