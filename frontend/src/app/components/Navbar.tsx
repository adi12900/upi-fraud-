import { useState } from 'react';
import { Bell, User, Activity, Download } from 'lucide-react';

export function Navbar() {
  const [isExporting, setIsExporting] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('http://localhost:8000/export');
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = downloadUrl;
      anchor.download = 'flagged_transactions.csv';
      anchor.click();
      window.URL.revokeObjectURL(downloadUrl);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Activity className="size-5 text-[#2563EB]" />
          <span className="text-sm font-medium text-[#111827]">Live Monitoring</span>
        </div>
        <div className="h-4 w-px bg-[#E5E7EB]" />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#DCFCE7] border border-[#16A34A]/20">
          <div className="size-2 rounded-full bg-[#16A34A]" />
          <span className="text-xs font-medium text-[#16A34A]">LOW THREAT</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="inline-flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-sm font-medium text-[#111827] transition hover:bg-[#F3F4F6] disabled:opacity-60"
        >
          <Download className="size-4" />
          {isExporting ? 'Exporting' : 'CSV Export'}
        </button>

        <div className="text-right">
          <div className="text-xs text-[#6B7280]">{currentDate}</div>
          <div className="text-sm font-medium text-[#111827]">{currentTime}</div>
        </div>

        <div className="h-8 w-px bg-[#E5E7EB]" />

        <button className="relative p-2 rounded-lg hover:bg-[#F9FAFB] transition-colors">
          <Bell className="size-5 text-[#6B7280]" />
          <span className="absolute top-1 right-1 size-2 rounded-full bg-[#DC2626]" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-[#E5E7EB]">
          <div className="text-right">
            <div className="text-sm font-medium text-[#111827]">Security Analyst</div>
            <div className="text-xs text-[#6B7280]">fraud.team@company.com</div>
          </div>
          <div className="size-9 rounded-full bg-[#2563EB] flex items-center justify-center">
            <User className="size-5 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
