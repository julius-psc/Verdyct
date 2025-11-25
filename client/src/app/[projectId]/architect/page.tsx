import Sidebar from '../../components/dashboard/Sidebar';
import ArchitectView from '../../components/architect/ArchitectView';

export default function ArchitectPage() {
    return (
        <div className="min-h-screen bg-[#1B1818] text-white flex relative overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-auto">
                <ArchitectView />
            </main>
        </div>
    );
}
