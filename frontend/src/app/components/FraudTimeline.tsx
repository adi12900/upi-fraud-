import React, { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface TimelineEvent {
  id: string;
  type: 'normal' | 'warning' | 'critical';
  label: string;
  time: string;
  icon?: any;
}

const typeConfig = {
  normal: { color: '#16A34A', bg: '#DCFCE7' },
  warning: { color: '#D97706', bg: '#FEF3C7' },
  critical: { color: '#DC2626', bg: '#FEE2E2' },
};

export function FraudTimeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    let mounted = true;
    async function fetchTimeline() {
      try {
        const res = await fetch('http://localhost:8000/timeline');
        const data = await res.json();
        if (!mounted) return;
        setEvents(data.events || []);
      } catch (e) {
        // ignore
      }
    }

    fetchTimeline();
    const iv = setInterval(fetchTimeline, 5000);
    return () => {
      mounted = false;
      clearInterval(iv);
    };
  }, []);

  return (
    <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
      <div className="px-4 py-3 border-b border-[#E5E7EB]">
        <h3 className="text-sm font-semibold text-[#111827] mb-0.5">Fraud Timeline</h3>
        <p className="text-xs text-[#6B7280]">Event sequence analysis</p>
      </div>

      <div className="p-4">
        <div className="relative">
          {events.map((event, index) => {
            const config = typeConfig[event.type];
            const isLast = index === events.length - 1;

            return (
              <div key={event.id} className="relative flex gap-3 pb-4">
                <div className="flex flex-col items-center">
                  <div className="size-8 rounded-full flex items-center justify-center border-2" style={{ backgroundColor: config.bg, borderColor: config.color }}>
                    <CheckCircle2 className="size-3.5" style={{ color: config.color }} />
                  </div>
                  {!isLast && <div className="w-0.5 h-full mt-1" style={{ backgroundColor: `${config.color}30` }} />}
                </div>

                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-medium text-[#111827]">{event.label || 'Event'}</span>
                    <span className="text-xs text-[#6B7280] font-mono">{event.time || ''}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
