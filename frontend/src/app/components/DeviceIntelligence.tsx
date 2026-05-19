import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

interface DeviceIntelligenceProps { onNavigate: (page: string) => void }

export function DeviceIntelligence({ onNavigate }: DeviceIntelligenceProps) {
  return (
    <div className="flex h-full w-full overflow-hidden">
      <Sidebar currentPage="device-intelligence" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto bg-[#F5F7FA] p-6">
          <div className="max-w-[1200px] mx-auto">
            <h1 className="text-xl font-semibold mb-2">Device Intelligence</h1>
            <p className="text-sm text-[#6B7280]">No device-specific API available. View Dashboard for aggregated data.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
