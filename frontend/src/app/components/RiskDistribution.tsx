import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export function RiskDistribution() {
  const [data, setData] = useState<Array<{ name: string; value: number; color: string }>>([]);

  useEffect(() => {
    let mounted = true;
    async function fetchDist() {
      try {
        const res = await fetch('http://localhost:8000/risk-distribution');
        const json = await res.json();
        if (!mounted) return;
        setData(json.distribution || []);
      } catch (e) {
        // ignore
      }
    }

    fetchDist();
    const iv = setInterval(fetchDist, 5000);
    return () => {
      mounted = false;
      clearInterval(iv);
    };
  }, []);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
      <div className="px-4 py-3 border-b border-[#E5E7EB]">
        <h3 className="text-sm font-semibold text-[#111827] mb-0.5">Risk Distribution</h3>
        <p className="text-xs text-[#6B7280]">Transaction risk breakdown</p>
      </div>

      <div className="p-4">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
                animationBegin={0}
                animationDuration={600}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2 mt-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-[#111827]">{item.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#6B7280]">{total > 0 ? ((item.value / total) * 100).toFixed(1) : '0.0'}%</span>
                <span className="text-sm font-semibold text-[#111827]">{item.value.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
