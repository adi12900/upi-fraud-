import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { TransactionSimulator } from './components/TransactionSimulator';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'simulator':
        return <TransactionSimulator onNavigate={setCurrentPage} />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="w-full h-screen bg-[#F5F7FA] text-[#111827] overflow-hidden">
      {renderPage()}
    </div>
  );
}
