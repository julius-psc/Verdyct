export interface Project {
    id: string;
    name: string;
    raw_idea: string;
    pos_score: number;
    status: string;
    api_key: string;
    created_at: string;
    url?: string;
    cta_text?: string;
    cta_selector?: string;
    last_verified?: string;
    report_json?: any; // Full report with agent data
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchProjects(token?: string): Promise<Project[]> {
    try {
        const headers: HeadersInit = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/api/projects`, {
            headers
        });
        if (!response.ok) {
            throw new Error('Failed to fetch projects');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
}
