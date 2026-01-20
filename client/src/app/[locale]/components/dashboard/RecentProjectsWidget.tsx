'use client';

import { Link } from '@/i18n/routing';
import { ArrowRight, Clock, Play } from 'lucide-react';
import Widget from './Widget';
import { Project } from '@/lib/api';

interface RecentProjectsWidgetProps {
    projects: Project[];
    subscriptionTier?: string;
}

export default function RecentProjectsWidget({ projects, subscriptionTier = "free" }: RecentProjectsWidgetProps) {
    // Sort by date (newest first) and take top 3
    const recentProjects = [...projects]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 3);

    if (recentProjects.length === 0) {
        return (
            <Widget title="Recent Projects">
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                    <Clock className="w-8 h-8 text-neutral-600 mb-2" />
                    <p className="text-sm text-neutral-400">No projects yet</p>
                    <Link
                        href="/"
                        className="mt-4 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                        Start New Analysis
                    </Link>
                </div>
            </Widget>
        );
    }

    return (
        <Widget title="Recent Projects">
            <div className="space-y-3">
                {recentProjects.map((project) => (
                    <Link
                        key={project.id}
                        href={`/${project.id}/analyst`}
                        className="block group border border-white/5 bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-medium text-white mb-1 group-hover:text-emerald-400 transition-colors">
                                    {project.name}
                                </h4>
                                <div className="flex items-center gap-3 text-xs">
                                    <span className="text-neutral-500">
                                        {new Date(project.created_at).toLocaleDateString()}
                                    </span>
                                    <span className={`px-1.5 py-0.5 rounded border ${project.status === 'approved'
                                        ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                                        : 'border-red-500/30 text-red-400 bg-red-500/10'
                                        }`}>
                                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-0.5">POS Score</div>
                                    <div className={`text-sm font-mono font-medium ${project.pos_score >= 60 ? 'text-emerald-400' : 'text-red-400'
                                        }`}>
                                        {project.pos_score}%
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-center">
                <Link
                    href="/dashboard/projects" // Assuming a projects list page might exist or just redirect to sidebar use
                    className="text-xs text-neutral-500 hover:text-white transition-colors flex items-center justify-center gap-1"
                >
                    View all projects
                    <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
        </Widget>
    );
}
