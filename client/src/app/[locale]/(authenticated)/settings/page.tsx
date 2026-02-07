'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import {
    IconBell,
    IconLock,
    IconCreditCard,
    IconUser,
    IconMail,
    IconCalendar,
    IconCheck,
    IconExclamationCircle
} from '@tabler/icons-react';
import { getCheckoutUrl, VARIANTS } from '@/lib/lemon';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('account');
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [displayName, setDisplayName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();
    const supabase = createClient();
    const t = useTranslations('Settings');

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user?.user_metadata?.full_name) {
                setDisplayName(user.user_metadata.full_name);
            }

            if (user) {
                const { data: profile } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                setProfile(profile);
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const handleUpdateProfile = async () => {
        setIsSaving(true);
        setMessage(null);
        try {
            const { error } = await supabase.auth.updateUser({
                data: { full_name: displayName }
            });
            if (error) throw error;
            setMessage({ type: 'success', text: t('messages.profileSuccess') });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: t('messages.passwordMismatch') });
            return;
        }
        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: t('messages.passwordTooShort') });
            return;
        }

        setIsSaving(true);
        setMessage(null);
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });
            if (error) throw error;
            setMessage({ type: 'success', text: t('messages.passwordSuccess') });
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { id: 'account', label: t('tabs.account'), icon: IconUser },
        { id: 'security', label: t('tabs.security'), icon: IconLock },
        { id: 'notifications', label: t('tabs.notifications'), icon: IconBell },
        { id: 'billing', label: t('tabs.billing'), icon: IconCreditCard },
    ];

    if (loading) return null;

    return (
        <main className="flex-1 min-h-full bg-[#1B1818] p-6 lg:p-12 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-2">{t('title')}</h1>
                    <p className="text-neutral-400 text-sm">{t('subtitle')}</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Tabs */}
                    <nav className="w-full lg:w-48 flex-shrink-0 space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id); setMessage(null); }}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 text-left ${activeTab === tab.id
                                    ? 'bg-neutral-800 text-white'
                                    : 'text-neutral-500 hover:text-white hover:bg-neutral-800/30'
                                    }`}
                            >
                                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : 'text-neutral-500'}`} />
                                {tab.label}
                            </button>
                        ))}
                    </nav>

                    {/* Content Area */}
                    <div className="flex-1 min-w-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-8"
                            >
                                {message && (
                                    <div className={`p-4 rounded-lg flex items-center gap-3 text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                        {message.type === 'success' ? <IconCheck className="w-4 h-4" /> : <IconExclamationCircle className="w-4 h-4" />}
                                        {message.text}
                                    </div>
                                )}

                                {activeTab === 'account' && (
                                    <div className="space-y-8">
                                        {/* Avatar Section */}
                                        <div className="flex items-center gap-6 pb-8 border-b border-neutral-800">
                                            <div className="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700 text-neutral-400">
                                                <IconUser className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h3 className="text-white font-medium">{t('account.profilePicture')}</h3>
                                                <p className="text-neutral-500 text-xs mt-1 mb-3">{t('account.autoSaveNote')}</p>
                                                <button disabled className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                                    {t('account.uploadNew')}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Form Fields */}
                                        <div className="space-y-6 max-w-lg">
                                            <div>
                                                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">{t('account.displayName')}</label>
                                                <input
                                                    type="text"
                                                    value={displayName}
                                                    onChange={(e) => setDisplayName(e.target.value)}
                                                    className="w-full bg-neutral-900/50 border border-neutral-800 focus:border-neutral-600 rounded-lg px-4 py-2.5 text-white placeholder:text-neutral-600 focus:outline-none transition-all text-sm"
                                                    placeholder={t('account.enterName')}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">{t('account.email')}</label>
                                                <div className="w-full bg-neutral-900/30 border border-neutral-800/50 rounded-lg px-4 py-2.5 text-neutral-400 text-sm flex items-center gap-2 cursor-not-allowed">
                                                    <IconMail className="w-4 h-4 opacity-50" />
                                                    {user?.email}
                                                </div>
                                                <p className="text-[10px] text-neutral-600 mt-1.5">{t('account.emailNote')}</p>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">{t('account.memberSince')}</label>
                                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-900/50 border border-neutral-800 rounded-md text-neutral-400 text-xs font-mono">
                                                    <IconCalendar className="w-3 h-3 text-neutral-500" />
                                                    {user?.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                                                </div>
                                            </div>

                                            <div className="pt-4">
                                                <button
                                                    onClick={handleUpdateProfile}
                                                    disabled={isSaving}
                                                    className="px-6 py-2.5 bg-white hover:bg-neutral-200 text-black text-sm font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                                                >
                                                    {isSaving ? t('account.saving') : t('account.saveChanges')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'security' && (
                                    <div className="space-y-8 max-w-lg">
                                        <div>
                                            <h3 className="text-white font-medium mb-1">{t('security.changePassword')}</h3>
                                            <p className="text-neutral-500 text-xs">{t('security.secureNote')}</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">{t('security.newPassword')}</label>
                                                <input
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className="w-full bg-neutral-900/50 border border-neutral-800 focus:border-neutral-600 rounded-lg px-4 py-2.5 text-white placeholder:text-neutral-600 focus:outline-none transition-all text-sm"
                                                    placeholder={t('security.enterNewPassword')}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">{t('security.confirmPassword')}</label>
                                                <input
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="w-full bg-neutral-900/50 border border-neutral-800 focus:border-neutral-600 rounded-lg px-4 py-2.5 text-white placeholder:text-neutral-600 focus:outline-none transition-all text-sm"
                                                    placeholder={t('security.confirmNewPassword')}
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-2 flex items-center justify-between">
                                            <button
                                                onClick={handleChangePassword}
                                                disabled={isSaving || !newPassword}
                                                className="px-6 py-2.5 bg-white hover:bg-neutral-200 text-black text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isSaving ? t('security.updating') : t('security.updatePassword')}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'notifications' && (
                                    <div className="bg-neutral-900/30 rounded-xl border border-neutral-800 p-8 text-center max-w-lg">
                                        <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mx-auto mb-4 text-neutral-500">
                                            <IconBell className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-white font-medium mb-1">{t('notifications.title')}</h3>
                                        <p className="text-neutral-500 text-sm">{t('notifications.empty')}</p>
                                    </div>
                                )}


                                {activeTab === 'billing' && (
                                    <div className="space-y-8 max-w-2xl">
                                        <div className="bg-neutral-900/30 rounded-xl border border-neutral-800 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                                                    <IconCreditCard className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-medium">Credits Available</h3>
                                                    <p className="text-neutral-500 text-sm">Use credits to run detailed analyses</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-2xl font-bold text-white">{profile?.credits || 0}</span>
                                                <button
                                                    onClick={() => window.open(getCheckoutUrl(VARIANTS.STARTER_PACK, user.id, window.location.href), '_blank')}
                                                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-medium rounded-lg transition-colors"
                                                >
                                                    Buy 50 Credits ($9)
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-white font-medium">Subscription Plan</h3>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                {/* Free Plan */}
                                                <div className={`p-6 rounded-xl border ${profile?.subscription_tier === 'builder' ? 'border-neutral-800 bg-neutral-900/10 opacity-50' : 'border-green-500/50 bg-green-500/5'}`}>
                                                    <div className="mb-4">
                                                        <h4 className="text-white font-medium mb-1">Free</h4>
                                                        <p className="text-neutral-500 text-sm">For casual explorers</p>
                                                    </div>
                                                    <ul className="space-y-2 mb-6">
                                                        <li className="flex items-center gap-2 text-sm text-neutral-400"><IconCheck className="w-4 h-4 text-green-500" /> 5 Free analyses / day</li>
                                                        <li className="flex items-center gap-2 text-sm text-neutral-400"><IconCheck className="w-4 h-4 text-green-500" /> Basic reports</li>
                                                    </ul>
                                                    {profile?.subscription_tier !== 'builder' && (
                                                        <button disabled className="w-full py-2 bg-neutral-800 text-neutral-400 text-sm font-medium rounded-lg cursor-default">Current Plan</button>
                                                    )}
                                                </div>

                                                {/* Builder Plan */}
                                                <div className={`p-6 rounded-xl border ${profile?.subscription_tier === 'builder' ? 'border-blue-500/50 bg-blue-500/10' : 'border-neutral-700 bg-neutral-900/30'}`}>
                                                    <div className="mb-4 flex justify-between items-start">
                                                        <div>
                                                            <h4 className="text-white font-medium mb-1">Builder</h4>
                                                            <p className="text-neutral-500 text-sm">For serious founders</p>
                                                        </div>
                                                        {profile?.subscription_tier === 'builder' && <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">Active</span>}
                                                    </div>
                                                    <ul className="space-y-2 mb-6">
                                                        <li className="flex items-center gap-2 text-sm text-neutral-300"><IconCheck className="w-4 h-4 text-blue-500" /> Unlimited analyses</li>
                                                        <li className="flex items-center gap-2 text-sm text-neutral-300"><IconCheck className="w-4 h-4 text-blue-500" /> Advanced Reports (Spy, Financier)</li>
                                                        <li className="flex items-center gap-2 text-sm text-neutral-300"><IconCheck className="w-4 h-4 text-blue-500" /> Priority Support</li>
                                                    </ul>

                                                    {profile?.subscription_tier === 'builder' ? (
                                                        <button
                                                            onClick={() => alert("Please manage your subscription via the email you received from Lemon Squeezy.")}
                                                            className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium rounded-lg transition-colors"
                                                        >
                                                            Manage Subscription
                                                        </button>
                                                    ) : (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => window.open(getCheckoutUrl(VARIANTS.BUILDER_MONTHLY, user.id, window.location.href), '_blank')}
                                                                className="flex-1 py-2 bg-white hover:bg-neutral-200 text-black text-sm font-medium rounded-lg transition-colors"
                                                            >
                                                                Monthly ($29)
                                                            </button>
                                                            <button
                                                                onClick={() => window.open(getCheckoutUrl(VARIANTS.BUILDER_YEARLY, user.id, window.location.href), '_blank')}
                                                                className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
                                                            >
                                                                Yearly ($290)
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </main>
    );
}
