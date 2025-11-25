import Sidebar from '../../components/dashboard/Sidebar';
import FinancierView from '../../components/financier/FinancierView';

export default function FinancierPage() {
    return (
        <div className="min-h-screen bg-[#1B1818] text-white flex relative overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-auto">
                <FinancierView />
            </main>
        </div>
    );
}
