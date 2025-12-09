'use client';

import Sidebar from '../components/dashboard/Sidebar';

export default function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#1B1818] text-white flex relative overflow-hidden">
            <Sidebar />
            {children}
        </div>
    );
}
