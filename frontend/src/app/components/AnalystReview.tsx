import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

interface AnalystReviewProps { onNavigate: (page: string) => void }

export function AnalystReview({ onNavigate }: AnalystReviewProps) {
  return (
    <div className="flex h-full w-full overflow-hidden">
      <Sidebar currentPage="analyst-review" onNavigate={onNavigate} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto bg-[#F5F7FA] p-6">
          <div className="max-w-[1200px] mx-auto">
            <h1 className="text-xl font-semibold mb-2">Analyst Review</h1>
            <p className="text-sm text-[#6B7280]">No dedicated backend endpoint for cases. Use the Dashboard for live data.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
