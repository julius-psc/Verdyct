'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LogoutPage() {
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const signOut = async () => {
            await supabase.auth.signOut()
            router.push('/')
            router.refresh()
        }
        signOut()
    }, [router, supabase])

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <p>Logging out...</p>
        </div>
    )
}
