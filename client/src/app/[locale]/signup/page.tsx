'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Link } from '@/i18n/routing';
import { IconBrandGoogle, IconLoader2, IconBrandGithub } from '@tabler/icons-react'

export default function SignupPage() {
    const supabase = createClient()
    const router = useRouter()
    const searchParams = useSearchParams()
    const next = searchParams.get('next') || '/dashboard'
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback?next=${next}`,
            },
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            // Check if session is established (auto-confirm enabled) or if email confirmation is needed
            // For now, let's assume we might need to show a message or redirect
            alert('Check your email for the confirmation link!')
            const decodedNext = decodeURIComponent(next);
            router.push(`/login?next=${encodeURIComponent(decodedNext)}`)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-black to-black" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-primary-red/20 blur-[120px] rounded-full opacity-20 pointer-events-none" />

            <div className="relative z-10 w-full max-w-md p-6">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Create an account</h1>
                    <p className="text-neutral-400">Start building your next big idea with Verdyct</p>
                </div>

                <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-red/50 focus:border-transparent transition-all"
                                placeholder="name@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-red/50 focus:border-transparent transition-all"
                                placeholder="Create a password"
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black font-medium py-2.5 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <IconLoader2 className="w-4 h-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-neutral-900/50 text-neutral-500">Or continue with</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                supabase.auth.signInWithOAuth({
                                    provider: 'google',
                                    options: {
                                        redirectTo: `${location.origin}/auth/callback?next=${next}`,
                                    },
                                })
                            }}
                            className="mt-4 w-full bg-white/5 border border-white/10 text-white font-medium py-2.5 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                        >
                            <IconBrandGoogle className="w-5 h-5" />
                            Google
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                supabase.auth.signInWithOAuth({
                                    provider: 'github',
                                    options: {
                                        redirectTo: `${location.origin}/auth/callback?next=${next}`,
                                    },
                                })
                            }}
                            className="mt-3 w-full bg-white/5 border border-white/10 text-white font-medium py-2.5 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                        >
                            <IconBrandGithub className="w-5 h-5" />
                            Github
                        </button>
                    </div>
                </div>

                <p className="mt-6 text-center text-sm text-neutral-500">
                    Already have an account?{' '}
                    <Link href={`/login?next=${next}`} className="text-white hover:underline font-medium">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    )
}
