import Sidebar from '../../components/dashboard/Sidebar';
import SpyView from '../../components/spy/SpyView';

export default function SpyPage() {
    return (
        <div className="min-h-screen bg-[#1B1818] text-white flex relative overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-auto">
                <SpyView />
            </main>
        </div>
    );
}
