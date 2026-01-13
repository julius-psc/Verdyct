'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { IconUser, IconLogout, IconChartBar, IconShieldCheck } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();
    const t = useTranslations('Profile');

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                // Fetch stats (credits/usage)
                const { data } = await supabase
                    .from('users')
                    .select('daily_count, credits')
                    .eq('id', user.id)
                    .single();
                setStats(data || { daily_count: 0, credits: 0 });
            }
            setLoading(false);
        };
        getUser();
    }, [supabase]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    if (loading) {
        return <div className="p-8 text-neutral-400">{t('loading')}</div>;
    }

    if (!user) {
        return <div className="p-8 text-red-500">{t('notAuthenticated')}</div>;
    }

    // Beta limit
    const DAILY_LIMIT = 5;

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <h1 className="text-3xl font-bold text-white mb-2">{t('title')}</h1>
            <p className="text-neutral-400 mb-8">{t('subtitle')}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Account Card */}
                <div className="bg-[#1B1818] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center text-white">
                            <IconUser className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">{t('accountDetails.title')}</h2>
                            <p className="text-sm text-neutral-500">{t('accountDetails.subtitle')}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-neutral-500 uppercase font-semibold">{t('fields.email')}</label>
                            <div className="text-white font-mono bg-neutral-900/50 p-3 rounded border border-white/5 mt-1">
                                {user.email}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-neutral-500 uppercase font-semibold">{t('fields.userId')}</label>
                            <div className="text-neutral-500 font-mono text-xs bg-neutral-900/50 p-3 rounded border border-white/5 mt-1 truncate">
                                {user.id}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSignOut}
                        className="mt-8 w-full py-3 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
                    >
                        <IconLogout className="w-4 h-4" />
                        {t('signOut')}
                    </button>
                </div>

                {/* Usage Card */}
                <div className="space-y-6">
                    {/* Access Level */}
                    <div className="bg-[#1B1818] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <IconShieldCheck className="w-24 h-24 text-green-500" />
                        </div>
                        <h2 className="text-lg font-bold text-white mb-1">{t('plan.title')}</h2>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-4">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            {t('plan.name')}
                        </div>
                        <p className="text-neutral-400 text-sm">
                            {t('plan.description')}
                        </p>
                    </div>

                    {/* Usage Stats */}
                    <div className="bg-[#1B1818] border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <IconChartBar className="w-5 h-5 text-blue-400" />
                            <h2 className="text-lg font-bold text-white">{t('usage.title')}</h2>
                        </div>

                        <div className="mb-2 flex justify-between text-sm">
                            <span className="text-neutral-400">{t('usage.analysesToday')}</span>
                            <span className="text-white font-medium">{stats?.daily_count || 0} / {DAILY_LIMIT}</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${(stats?.daily_count || 0) >= DAILY_LIMIT ? 'bg-red-500' : 'bg-blue-500'
                                    }`}
                                style={{ width: `${Math.min(100, ((stats?.daily_count || 0) / DAILY_LIMIT) * 100)}%` }}
                            />
                        </div>

                        <p className="text-xs text-neutral-500 mt-3">
                            {t('usage.resetNote')}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
