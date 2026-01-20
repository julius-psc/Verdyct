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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export async function fetchProjects(token?: string): Promise<Project[]> {
    try {
        const headers: HeadersInit = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/api/projects?t=${new Date().getTime()}`, {
            headers: {
                ...headers,
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            },
            cache: 'no-store'
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

export async function deleteProject(projectId: string, token?: string): Promise<boolean> {
    try {
        const headers: HeadersInit = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
            method: 'DELETE',
            headers
        });
        return response.ok;
    } catch (error) {
        console.error('Error deleting project:', error);
        return false;
    }
}

export async function updateProject(projectId: string, data: { name?: string }, token?: string): Promise<Project | null> {
    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json'
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error('Error updating project:', error);
        return null;
    }
}

// ========== TIMELINE API ==========

export async function startTimeline(projectId: string, token: string) {
    const response = await fetch(`${API_BASE_URL}/api/timeline/start`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ project_id: projectId })
    });
    if (!response.ok) throw new Error('Failed to start timeline');
    return await response.json();
}

export async function getTimeline(projectId: string, token: string) {
    const response = await fetch(`${API_BASE_URL}/api/timeline/${projectId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return await response.json();
}

export async function sendTimelineMessage(projectId: string, message: string, stepId: string | undefined, token: string) {
    const response = await fetch(`${API_BASE_URL}/api/timeline/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ project_id: projectId, message, step_id: stepId })
    });
    return await response.json();
}
