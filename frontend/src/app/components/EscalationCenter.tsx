import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

interface EscalationCenterProps { onNavigate: (page: string) => void }

export function EscalationCenter({ onNavigate }: EscalationCenterProps) {
  return (
    <div className="flex h-full w-full overflow-hidden">
      <Sidebar currentPage="escalation" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto bg-[#F5F7FA] p-6">
          <div className="max-w-[1200px] mx-auto">
            <h1 className="text-xl font-semibold mb-2">Escalation Center</h1>
            <p className="text-sm text-[#6B7280]">No dedicated escalation endpoint. Escalations are derived from flagged transactions on the Dashboard.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
