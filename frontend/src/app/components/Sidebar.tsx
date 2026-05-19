import {
  LayoutDashboard,
  Zap,
  ShieldAlert,
} from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'simulator', label: 'Transaction Simulator', icon: Zap },
];

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-[#E5E7EB] flex flex-col h-full">
      <div className="p-6 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-[#2563EB] flex items-center justify-center">
            <ShieldAlert className="size-6 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-[#111827]">UPI Fraud Intelligence</h1>
            <p className="text-xs text-[#6B7280]">Platform v2.1</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#DBEAFE] text-[#2563EB]'
                  : 'text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827]'
              }`}
            >
              <Icon className="size-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#E5E7EB]">
        <div className="px-4 py-3 rounded-lg bg-[#DCFCE7] border border-[#16A34A]/20">
          <div className="flex items-center gap-2 mb-1">
            <div className="size-2 rounded-full bg-[#16A34A]" />
            <span className="text-xs font-medium text-[#16A34A]">System Active</span>
          </div>
          <p className="text-xs text-[#6B7280]">Backend connected</p>
        </div>
      </div>
    </aside>
  );
}
