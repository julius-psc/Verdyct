import Sidebar from '../components/dashboard/Sidebar';
import MainView from '../components/dashboard/MainView';

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-[#1B1818] text-white flex relative overflow-hidden">
            <Sidebar />
            <MainView />
        </div>
    );
}
