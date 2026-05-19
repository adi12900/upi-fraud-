import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

interface ReportsProps { onNavigate: (page: string) => void }

export function Reports({ onNavigate }: ReportsProps) {
  return (
    <div className="flex h-full w-full overflow-hidden">
      <Sidebar currentPage="reports" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto bg-[#F5F7FA] p-6">
          <div className="max-w-[1200px] mx-auto">
            <h1 className="text-xl font-semibold mb-2">Reports</h1>
            <p className="text-sm text-[#6B7280]">Reporting UI removed. Use backend export endpoints or Dashboard filters for data exports.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
