import React from 'react';
import { LucideIcon } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface KPICardProps {
  title: string;
  value: string | number;
  trend: number;
  icon: LucideIcon;
  sparklineData: number[];
  color: string;
}

export function KPICard({ title, value, trend, icon: Icon, sparklineData, color }: KPICardProps) {
  const isPositive = trend >= 0;
  const chartData = sparklineData.map((v, i) => ({ value: v, index: i }));

  return (
    <div className="bg-white rounded-lg p-5 border border-[#E5E7EB]">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs text-[#6B7280] mb-1 uppercase tracking-wide">{title}</p>
          <div className="text-2xl font-semibold text-[#111827]">{value}</div>
        </div>
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}15` }}>
          <Icon className="size-5" style={{ color }} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className={`px-2 py-0.5 rounded text-xs font-medium ${isPositive ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-[#FEE2E2] text-[#DC2626]'}`}>
            {isPositive ? '+' : ''}{trend}%
          </div>
          <span className="text-xs text-[#9CA3AF]">vs last hour</span>
        </div>

        <div className="w-20 h-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
