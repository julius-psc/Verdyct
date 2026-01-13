'use client';

import Sidebar from '../components/dashboard/Sidebar';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { IconLoader2 } from '@tabler/icons-react';

export default function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login?next=/dashboard');
            } else {
                setIsLoading(false);
            }
        };
        checkUser();
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#1B1818] flex items-center justify-center text-white">
                <IconLoader2 className="w-8 h-8 animate-spin text-neutral-400" />
            </div>
        );
    }

    return (
        <div className="h-screen w-screen bg-[#1B1818] text-white flex overflow-hidden">
            <Sidebar />
            <div className="flex-1 h-full overflow-y-auto w-full relative">
                {children}
            </div>
        </div>
    );
}
