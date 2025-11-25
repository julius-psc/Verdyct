import Sidebar from '../../components/dashboard/Sidebar';
import AnalystView from '../../components/analyst/AnalystView';

export default function AnalystPage() {
    return (
        <div className="min-h-screen bg-[#1B1818] text-white flex relative overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-auto">
                <AnalystView />
            </main>
        </div>
    );
}
