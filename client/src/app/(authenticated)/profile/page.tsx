'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { IconUser, IconMail, IconCalendar } from '@tabler/icons-react';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };
        fetchUser();
    }, []);

    if (loading) {
        return <div className="p-8 text-neutral-400">Loading profile...</div>;
    }

    if (!user) {
        return <div className="p-8 text-neutral-400">User not found</div>;
    }

    return (
        <main className="flex-1 overflow-auto bg-[#1B1818]">
            <div className="max-w-4xl mx-auto p-8 space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">My Profile</h1>
                    <p className="text-sm text-neutral-400">Manage your personal information</p>
                </div>

                <div className="bg-neutral-900/50 rounded-xl border border-neutral-800 p-8 space-y-8">
                    <div className="flex items-start gap-6">
                        <div className="w-24 h-24 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">
                            <IconUser className="w-12 h-12 text-neutral-400" />
                        </div>
                        <div className="space-y-4 flex-1">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Email</label>
                                    <div className="flex items-center gap-3 text-white bg-neutral-950/50 p-3 rounded-lg border border-neutral-800">
                                        <IconMail className="w-5 h-5 text-neutral-500" />
                                        <span>{user.email}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">User ID</label>
                                    <div className="font-mono text-sm text-neutral-400 bg-neutral-950/50 p-3 rounded-lg border border-neutral-800 truncate">
                                        {user.id}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Account Created</label>
                                    <div className="flex items-center gap-3 text-white bg-neutral-950/50 p-3 rounded-lg border border-neutral-800">
                                        <IconCalendar className="w-5 h-5 text-neutral-500" />
                                        <span>{new Date(user.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
