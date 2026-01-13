'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Link } from '@/i18n/routing';
import { IconArrowLeft, IconLoader2, IconMail, IconCheck } from '@tabler/icons-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/settings`,
            });

            if (error) throw error;
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-black to-black" />

            <div className="relative z-10 w-full max-w-md p-6">
                <Link href="/login" className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-8 text-sm">
                    <IconArrowLeft className="w-4 h-4" />
                    Back to Login
                </Link>

                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
                    <p className="text-neutral-400 text-sm">Enter your email to receive a password reset link.</p>
                </div>

                <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    {success ? (
                        <div className="text-center space-y-4">
                            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto border border-green-500/20">
                                <IconCheck className="w-6 h-6 text-green-500" />
                            </div>
                            <div>
                                <h3 className="text-white font-medium mb-1">Check your inbox</h3>
                                <p className="text-neutral-400 text-sm">
                                    We've sent a password reset link to <span className="text-white">{email}</span>.
                                </p>
                            </div>
                            <button
                                onClick={() => { setSuccess(false); setEmail(''); }}
                                className="text-sm text-neutral-500 hover:text-white underline"
                            >
                                Try another email
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">Email Address</label>
                                <div className="relative">
                                    <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-black/50 border border-neutral-800 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-neutral-700 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 transition-all"
                                        placeholder="name@company.com"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !email}
                                className="w-full bg-white text-black font-medium py-2.5 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                            >
                                {loading ? (
                                    <>
                                        <IconLoader2 className="w-4 h-4 animate-spin" />
                                        Sending Link...
                                    </>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
