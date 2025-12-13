'use client';

import { useState } from 'react';
import { IconBell, IconLock, IconCreditCard, IconUser } from '@tabler/icons-react';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('account');

    const tabs = [
        { id: 'account', label: 'Account', icon: IconUser },
        { id: 'security', label: 'Security', icon: IconLock },
        { id: 'notifications', label: 'Notifications', icon: IconBell },
        { id: 'billing', label: 'Billing', icon: IconCreditCard },
    ];

    return (
        <main className="flex-1 overflow-auto bg-[#1B1818]">
            <div className="max-w-5xl mx-auto p-8 space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Settings</h1>
                    <p className="text-sm text-neutral-400">Manage your workspace and preferences</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Tabs */}
                    <div className="w-full md:w-64 flex-shrink-0 space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.id
                                        ? 'bg-neutral-800 text-white'
                                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                                    }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 space-y-6">
                        {activeTab === 'account' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <section className="bg-neutral-900/50 rounded-xl border border-neutral-800 p-6 space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-white mb-1">Display Name</h3>
                                        <p className="text-sm text-neutral-400">How you appear to others</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <input
                                            type="text"
                                            placeholder="Your name"
                                            className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neutral-700 focus:ring-1 focus:ring-neutral-700 transition-all"
                                        />
                                        <button className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-neutral-200 transition-colors">
                                            Save
                                        </button>
                                    </div>
                                </section>

                                <section className="bg-neutral-900/50 rounded-xl border border-neutral-800 p-6 space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-red-400 mb-1">Danger Zone</h3>
                                        <p className="text-sm text-neutral-400">Irreversible actions</p>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border border-red-900/30 rounded-lg bg-red-950/10">
                                        <div>
                                            <h4 className="text-sm font-medium text-white">Delete Account</h4>
                                            <p className="text-xs text-neutral-400 mt-1">Permanently remove your account and all data</p>
                                        </div>
                                        <button className="px-4 py-2 bg-red-500/10 text-red-500 text-sm font-medium rounded-lg hover:bg-red-500/20 transition-colors border border-red-500/20">
                                            Delete
                                        </button>
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="bg-neutral-900/50 rounded-xl border border-neutral-800 p-6 text-center text-neutral-400 py-20">
                                <IconBell className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p>Notification settings coming soon</p>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="bg-neutral-900/50 rounded-xl border border-neutral-800 p-6 text-center text-neutral-400 py-20">
                                <IconLock className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p>Security settings coming soon</p>
                            </div>
                        )}

                        {activeTab === 'billing' && (
                            <div className="bg-neutral-900/50 rounded-xl border border-neutral-800 p-6 text-center text-neutral-400 py-20">
                                <IconCreditCard className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p>Billing management coming soon</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
