import React, { useState, useEffect } from 'react';
import { AlertTriangle, Zap, Clock } from 'lucide-react';

interface Alert {
  id: string;
  severity: string;
  category: string;
  message: string;
  timestamp: string;
  escalated: boolean;
}

const severityConfig = {
  CRITICAL: { color: '#DC2626', bg: '#FEE2E2', icon: AlertTriangle },
  HIGH: { color: '#EA580C', bg: '#FFEDD5', icon: Zap },
  MEDIUM: { color: '#D97706', bg: '#FEF3C7', icon: Clock },
  LOW: { color: '#16A34A', bg: '#DCFCE7', icon: AlertTriangle },
};

export function FraudAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    let mounted = true;
    async function fetchAlerts() {
      try {
        const res = await fetch('http://localhost:8000/alerts');
        const data = await res.json();
        if (!mounted) return;
        setAlerts(data.alerts || []);
      } catch (e) {
        // ignore
      }
    }

    fetchAlerts();
    const iv = setInterval(fetchAlerts, 5000);
    return () => {
      mounted = false;
      clearInterval(iv);
    };
  }, []);

  return (
    <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
      <div className="px-4 py-3 border-b border-[#E5E7EB]">
        <h3 className="text-sm font-semibold text-[#111827] mb-0.5">Live Fraud Alerts</h3>
        <p className="text-xs text-[#6B7280]">Real-time fraud detection stream</p>
      </div>

      <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
        {alerts.map((alert) => {
          const config = severityConfig[alert.severity] || severityConfig.LOW;
          const Icon = config.icon;

          return (
            <div
              key={alert.id}
              className="p-3 rounded-lg border cursor-pointer"
              style={{ backgroundColor: config.bg, borderColor: `${config.color}30` }}
            >
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-md" style={{ backgroundColor: `${config.color}20` }}>
                  <Icon className="size-3.5" style={{ color: config.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: config.color }}>
                      {alert.category || 'ALERT'}
                    </span>
                    {alert.escalated && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#FEE2E2] text-[#DC2626] border border-[#DC2626]/20">
                        ESCALATED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#111827] leading-relaxed mb-2">{alert.message || ''}</p>
                  <span className="text-[10px] text-[#6B7280]">{alert.timestamp || ''}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
