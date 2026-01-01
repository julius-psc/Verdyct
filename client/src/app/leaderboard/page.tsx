'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IconTrophy, IconFlame, IconEye, IconArrowRight, IconShare } from '@tabler/icons-react';
import Link from 'next/link';
import Navbar from '../components/landing/Navbar';

interface PublicProject {
    id: string;
    name: string;
    raw_idea: string;
    pos_score: number;
    upvotes: number;
    views: number;
    created_at: string;
}

export default function LeaderboardPage() {
    const [projects, setProjects] = useState<PublicProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<'score' | 'votes'>('score');

    useEffect(() => {
        fetchLeaderboard();
    }, [sortBy]);

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const res = await fetch(`${apiUrl}/api/leaderboard?sort_by=${sortBy}`);
            if (res.ok) {
                const data = await res.json();
                setProjects(data);
            }
        } catch (error) {
            console.error("Failed to fetch leaderboard", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (id: string) => {
        const storageKey = `verdyct_voted_${id}`;
        const hasVoted = !!localStorage.getItem(storageKey);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const method = 'POST'; // Both vote and unvote use POST
        const endpoint = hasVoted ? 'unvote' : 'vote';

        try {
            const res = await fetch(`${apiUrl}/api/projects/${id}/${endpoint}`, { method });
            if (res.ok) {
                // Optimistic update
                setProjects(prev => prev.map(p => {
                    if (p.id !== id) return p;
                    return { ...p, upvotes: hasVoted ? p.upvotes - 1 : p.upvotes + 1 };
                }));

                // Toggle local storage
                if (hasVoted) {
                    localStorage.removeItem(storageKey);
                } else {
                    localStorage.setItem(storageKey, 'true');
                }
            }
        } catch (e) {
            console.error("Vote failed", e);
        }
    };

    return (
        <main
            className="min-h-screen bg-[#050505] text-white selection:bg-yellow-500/30"
            style={{
                backgroundImage: `radial-gradient(circle at 50% 0%, rgba(234, 179, 8, 0.15) 0%, rgba(0, 0, 0, 0) 70%)`,
                backgroundAttachment: 'fixed'
            }}
        >
            <Navbar />

            <div className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm font-medium mb-4"
                    >
                        <IconTrophy size={16} />
                        <span>Hall of Fame</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-500"
                    >
                        Top Disruptive Ideas
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-neutral-400 max-w-2xl mx-auto text-lg"
                    >
                        Discover the highest-rated startup concepts analyzed by Verdyct.
                        Vote for the ones you'd back with real money.
                    </motion.p>
                </div>

                {/* Filters */}
                <div className="flex justify-center gap-4 mb-12">
                    <button
                        onClick={() => setSortBy('score')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all border ${sortBy === 'score'
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                            : 'bg-white/5 border-white/10 backdrop-blur-sm text-neutral-400 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        Highest POS Score
                    </button>
                    <button
                        onClick={() => setSortBy('votes')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all border ${sortBy === 'votes'
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                            : 'bg-white/5 border-white/10 backdrop-blur-sm text-neutral-400 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        Most Upvoted
                    </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        // Skeletons
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="h-64 bg-white/5 rounded-2xl animate-pulse border border-white/5" />
                        ))
                    ) : projects.length === 0 ? (
                        <div className="col-span-full text-center py-20 text-neutral-500">
                            No public projects yet. Be the first to publish!
                        </div>
                    ) : (
                        projects.map((project, index) => (
                            <Card key={project.id} project={project} index={index} onVote={() => handleVote(project.id)} />
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}

function Card({ project, index, onVote }: { project: PublicProject, index: number, onVote: () => void }) {
    // Check if voted on mount (client-side only for visual feedback)
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
        const storageKey = `verdyct_voted_${project.id}`;
        setHasVoted(!!localStorage.getItem(storageKey));
    }, [project.id, project.upvotes]); // Re-check when upvotes change (which happens on toggle)

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="group relative bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-900/10 flex flex-col h-full"
        >
            {/* Rank Badge */}
            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-sm font-bold shadow-lg z-10 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                #{index + 1}
            </div>

            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <Link href={`/project/${project.id}?public=true`} className="block font-semibold text-xl line-clamp-1 mb-1 group-hover:text-emerald-400 transition-colors">
                        {project.name.replace("Analysis of ", "")}
                    </Link>
                    <p className="text-xs text-white/50">
                        {new Date(project.created_at).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex flex-col items-end">
                    <div className="text-2xl font-bold text-white tracking-tight">
                        {Math.round(project.pos_score)}
                    </div>
                    <div className="text-[10px] text-white/50 uppercase tracking-widest font-medium">
                        POS
                    </div>
                </div>
            </div>

            <p className="text-sm text-white/60 line-clamp-3 mb-6 flex-grow font-light leading-relaxed">
                {project.raw_idea || "No description available for this project."}
            </p>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-4 text-sm text-white/50">
                    <button
                        onClick={(e) => { e.preventDefault(); onVote(); }}
                        className={`flex items-center gap-1.5 transition-colors group/vote ${hasVoted ? 'text-emerald-500' : 'hover:text-emerald-400'
                            }`}
                        title={hasVoted ? "Remove vote" : "Upvote"}
                    >
                        <IconFlame
                            size={18}
                            className={`transition-all ${hasVoted
                                    ? 'fill-emerald-500 text-emerald-500'
                                    : 'group-hover/vote:text-emerald-500 group-hover/vote:fill-emerald-500/20'
                                }`}
                        />
                        <span>{project.upvotes}</span>
                    </button>
                    <div className="flex items-center gap-1.5">
                        <IconEye size={18} />
                        <span>{project.views}</span>
                    </div>
                </div>

                <Link
                    href={`/project/${project.id}?public=true`}
                    className="flex items-center gap-1 text-sm font-medium text-white hover:underline decoration-emerald-500 underline-offset-4"
                >
                    View Report <IconArrowRight size={16} />
                </Link>
            </div>
        </motion.div>
    );
}
