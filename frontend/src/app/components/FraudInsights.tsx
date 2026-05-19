import React, { useEffect, useState } from 'react';
import { Smartphone, User, Clock, MapPin, TrendingUp, AlertTriangle } from 'lucide-react';

interface Insight {
  id: string;
  title: string;
  value: string;
  detail: string;
}

const severityConfig = {
  critical: { color: '#DC2626', bg: '#FEE2E2', border: '#DC2626' },
  high: { color: '#EA580C', bg: '#FFEDD5', border: '#EA580C' },
  warning: { color: '#D97706', bg: '#FEF3C7', border: '#D97706' },
};

export function FraudInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    let mounted = true;
    async function fetchInsights() {
      try {
        const res = await fetch('http://localhost:8000/insights');
        const data = await res.json();
        if (!mounted) return;
        setInsights(data.insights || []);
      } catch (e) {
        // ignore
      }
    }

    fetchInsights();
    const iv = setInterval(fetchInsights, 5000);
    return () => {
      mounted = false;
      clearInterval(iv);
    };
  }, []);

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-[#111827] mb-1">Fraud Intelligence Insights</h2>
        <p className="text-sm text-[#6B7280]">AI-assisted behavioral anomaly detection</p>
      </div>

      <div className="grid grid-cols-6 gap-4">
        {insights.map((insight, index) => {
          const Icon = index === 0 ? Smartphone : index === 1 ? User : index === 2 ? Clock : index === 3 ? MapPin : index === 4 ? TrendingUp : AlertTriangle;
          const config = severityConfig['high'];

          return (
            <div key={insight.id} className="bg-white rounded-lg p-4 border cursor-pointer" style={{ borderColor: '#E5E7EB' }}>
              <div className="p-2 rounded-lg inline-flex mb-3" style={{ backgroundColor: config.bg }}>
                <Icon className="size-4" style={{ color: config.color }} />
              </div>

              <div>
                <p className="text-xs text-[#6B7280] mb-1">{insight.title}</p>
                <p className="text-lg font-semibold mb-1" style={{ color: config.color }}>{insight.value}</p>
                <p className="text-xs text-[#9CA3AF]">{insight.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
