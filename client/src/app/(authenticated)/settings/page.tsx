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
    IconShieldLock,
    IconDeviceFloppy
} from '@tabler/icons-react';
import { motion } from 'motion/react';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('account');
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

    const tabs = [
        { id: 'account', label: 'Account', icon: IconUser },
        { id: 'security', label: 'Security', icon: IconLock },
        { id: 'notifications', label: 'Notifications', icon: IconBell },
        { id: 'billing', label: 'Billing', icon: IconCreditCard },
    ];

    return (
        <main className="flex-1 min-h-full bg-[#1B1818] p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Settings</h1>
                        <p className="text-neutral-400">Manage your profile and workspace preferences</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Tabs */}
                    <div className="w-full lg:w-64 flex-shrink-0">
                        <div className="sticky top-8 space-y-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${activeTab === tab.id
                                            ? 'bg-neutral-800/80 text-white shadow-sm ring-1 ring-white/10'
                                            : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                                        }`}
                                >
                                    <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-neutral-500'}`} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 min-w-0">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            {activeTab === 'account' && (
                                <div className="space-y-6">
                                    {/* Profile Card */}
                                    <section className="bg-neutral-900/50 backdrop-blur-sm rounded-2xl border border-neutral-800/50 overflow-hidden">
                                        <div className="p-6 border-b border-neutral-800/50">
                                            <h3 className="text-lg font-semibold text-white">Profile Information</h3>
                                            <p className="text-sm text-neutral-400 mt-1">Update your personal details</p>
                                        </div>

                                        <div className="p-6 space-y-8">
                                            <div className="flex items-start gap-6">
                                                <div className="relative group">
                                                    <div className="w-20 h-20 rounded-full bg-linear-to-br from-neutral-800 to-neutral-700 flex items-center justify-center border-2 border-neutral-800 overflow-hidden">
                                                        <IconUser className="w-10 h-10 text-neutral-400" />
                                                    </div>
                                                    <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                                        <span className="text-[10px] uppercase font-bold text-white tracking-widest">Edit</span>
                                                    </div>
                                                </div>

                                                <div className="flex-1 space-y-4">
                                                    <div className="grid gap-6 md:grid-cols-2">
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Email Address</label>
                                                            <div className="flex items-center gap-3 px-4 py-3 bg-neutral-950/50 rounded-lg border border-neutral-800/50 text-neutral-300">
                                                                <IconMail className="w-4 h-4 text-neutral-500" />
                                                                {loading ? 'Loading...' : user?.email}
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Member Since</label>
                                                            <div className="flex items-center gap-3 px-4 py-3 bg-neutral-950/50 rounded-lg border border-neutral-800/50 text-neutral-300">
                                                                <IconCalendar className="w-4 h-4 text-neutral-500" />
                                                                {loading ? 'Loading...' : new Date(user?.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4 pt-4 border-t border-neutral-800/50">
                                                <h4 className="text-sm font-medium text-white">Display Name</h4>
                                                <div className="flex gap-4">
                                                    <input
                                                        type="text"
                                                        placeholder="Enter your display name"
                                                        className="flex-1 bg-neutral-950/50 border border-neutral-800 rounded-lg px-4 py-2.5 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 transition-all"
                                                    />
                                                    <button className="px-6 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-neutral-200 transition-colors flex items-center gap-2">
                                                        <IconDeviceFloppy className="w-4 h-4" />
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Danger Zone */}
                                    <section className="bg-red-950/10 backdrop-blur-sm rounded-2xl border border-red-900/20 overflow-hidden">
                                        <div className="p-6">
                                            <h3 className="text-lg font-semibold text-red-500">Danger Zone</h3>
                                            <p className="text-sm text-red-400/60 mt-1">Irreversible actions regarding your account</p>
                                        </div>

                                        <div className="px-6 pb-6">
                                            <div className="flex items-center justify-between p-4 bg-red-950/20 border border-red-900/20 rounded-xl">
                                                <div>
                                                    <h4 className="text-sm font-medium text-red-200">Delete Account</h4>
                                                    <p className="text-xs text-red-400/60 mt-1">Permanently remove your account and all data</p>
                                                </div>
                                                <button className="px-4 py-2 bg-red-500/10 text-red-400 text-sm font-medium rounded-lg hover:bg-red-500/20 hover:text-red-300 transition-colors border border-red-500/20">
                                                    Delete Account
                                                </button>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            )}

                            {activeTab === 'notifications' && (
                                <div className="bg-neutral-900/50 backdrop-blur-sm rounded-2xl border border-neutral-800/50 p-12 text-center">
                                    <div className="w-16 h-16 rounded-full bg-neutral-800/50 flex items-center justify-center mx-auto mb-4 border border-neutral-700/50">
                                        <IconBell className="w-8 h-8 text-neutral-600" />
                                    </div>
                                    <h3 className="text-lg font-medium text-white mb-2">Notifications</h3>
                                    <p className="text-neutral-400 max-w-sm mx-auto">We're working on giving you granular control over what you hear from us.</p>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="bg-neutral-900/50 backdrop-blur-sm rounded-2xl border border-neutral-800/50 p-12 text-center">
                                    <div className="w-16 h-16 rounded-full bg-neutral-800/50 flex items-center justify-center mx-auto mb-4 border border-neutral-700/50">
                                        <IconShieldLock className="w-8 h-8 text-neutral-600" />
                                    </div>
                                    <h3 className="text-lg font-medium text-white mb-2">Security Settings</h3>
                                    <p className="text-neutral-400 max-w-sm mx-auto">2FA and advanced security protocols are coming shortly.</p>
                                </div>
                            )}

                            {activeTab === 'billing' && (
                                <div className="bg-neutral-900/50 backdrop-blur-sm rounded-2xl border border-neutral-800/50 p-12 text-center">
                                    <div className="w-16 h-16 rounded-full bg-neutral-800/50 flex items-center justify-center mx-auto mb-4 border border-neutral-700/50">
                                        <IconCreditCard className="w-8 h-8 text-neutral-600" />
                                    </div>
                                    <h3 className="text-lg font-medium text-white mb-2">Billing & Plans</h3>
                                    <p className="text-neutral-400 max-w-sm mx-auto">Manage your subscription and billing history.</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </main>
    );
}
