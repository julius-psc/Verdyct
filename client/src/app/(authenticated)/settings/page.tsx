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
    IconDeviceFloppy,
    IconExclamationCircle,
    IconCheck
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('account');
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [displayName, setDisplayName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user?.user_metadata?.full_name) {
                setDisplayName(user.user_metadata.full_name);
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
            setMessage({ type: 'success', text: 'Profile updated successfully' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: "Passwords don't match" });
            return;
        }
        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: "Password must be at least 6 characters" });
            return;
        }

        setIsSaving(true);
        setMessage(null);
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });
            if (error) throw error;
            setMessage({ type: 'success', text: 'Password updated successfully' });
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { id: 'account', label: 'Account', icon: IconUser },
        { id: 'security', label: 'Security', icon: IconLock },
        { id: 'notifications', label: 'Notifications', icon: IconBell },
        { id: 'billing', label: 'Billing', icon: IconCreditCard },
    ];

    if (loading) return null;

    return (
        <main className="flex-1 min-h-full bg-[#1B1818] p-6 lg:p-12 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Settings</h1>
                    <p className="text-neutral-400 text-sm">Manage your personal information and security preferences.</p>
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
                                                <h3 className="text-white font-medium">Profile Picture</h3>
                                                <p className="text-neutral-500 text-xs mt-1 mb-3">Changes are saved automatically.</p>
                                                <button disabled className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                                    Upload New (Coming Soon)
                                                </button>
                                            </div>
                                        </div>

                                        {/* Form Fields */}
                                        <div className="space-y-6 max-w-lg">
                                            <div>
                                                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">Display Name</label>
                                                <input
                                                    type="text"
                                                    value={displayName}
                                                    onChange={(e) => setDisplayName(e.target.value)}
                                                    className="w-full bg-neutral-900/50 border border-neutral-800 focus:border-neutral-600 rounded-lg px-4 py-2.5 text-white placeholder:text-neutral-600 focus:outline-none transition-all text-sm"
                                                    placeholder="Enter your name"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">Email Address</label>
                                                <div className="w-full bg-neutral-900/30 border border-neutral-800/50 rounded-lg px-4 py-2.5 text-neutral-400 text-sm flex items-center gap-2 cursor-not-allowed">
                                                    <IconMail className="w-4 h-4 opacity-50" />
                                                    {user?.email}
                                                </div>
                                                <p className="text-[10px] text-neutral-600 mt-1.5">Email address cannot be changed securely at this time.</p>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">Member Since</label>
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
                                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'security' && (
                                    <div className="space-y-8 max-w-lg">
                                        <div>
                                            <h3 className="text-white font-medium mb-1">Change Password</h3>
                                            <p className="text-neutral-500 text-xs">Ensure your account is using a long, random password to stay secure.</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">New Password</label>
                                                <input
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className="w-full bg-neutral-900/50 border border-neutral-800 focus:border-neutral-600 rounded-lg px-4 py-2.5 text-white placeholder:text-neutral-600 focus:outline-none transition-all text-sm"
                                                    placeholder="Enter new password"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">Confirm New Password</label>
                                                <input
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="w-full bg-neutral-900/50 border border-neutral-800 focus:border-neutral-600 rounded-lg px-4 py-2.5 text-white placeholder:text-neutral-600 focus:outline-none transition-all text-sm"
                                                    placeholder="Confirm new password"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-2 flex items-center justify-between">
                                            <button
                                                onClick={handleChangePassword}
                                                disabled={isSaving || !newPassword}
                                                className="px-6 py-2.5 bg-white hover:bg-neutral-200 text-black text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isSaving ? 'Updating...' : 'Update Password'}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'notifications' && (
                                    <div className="bg-neutral-900/30 rounded-xl border border-neutral-800 p-8 text-center max-w-lg">
                                        <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mx-auto mb-4 text-neutral-500">
                                            <IconBell className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-white font-medium mb-1">Notifications</h3>
                                        <p className="text-neutral-500 text-sm">You have no pending notifications. We'll verify your contact methods soon.</p>
                                    </div>
                                )}

                                {activeTab === 'billing' && (
                                    <div className="bg-neutral-900/30 rounded-xl border border-neutral-800 p-8 text-center max-w-lg">
                                        <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mx-auto mb-4 text-neutral-500">
                                            <IconCreditCard className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-white font-medium mb-1">Billing & Plans</h3>
                                        <p className="text-neutral-500 text-sm">Your workspace is currently on the <span className="text-white">Free Beta Tier</span>.</p>
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
