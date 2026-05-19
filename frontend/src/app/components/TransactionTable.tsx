import { useState, useEffect } from 'react';
import React from 'react';
import { MapPin, Smartphone } from 'lucide-react';

interface Transaction {
  transaction_id: string;
  timestamp: string;
  payer_id: string;
  payee_id: string;
  amount: number;
  location: string;
  device_id: string;
  risk_score: number;
  risk_level: string;
  fraud_status: boolean;
}

const severityConfig = {
  SAFE: { color: '#16A34A', bg: '#DCFCE7', label: 'SAFE' },
  MONITOR: { color: '#D97706', bg: '#FEF3C7', label: 'MONITOR' },
  SUSPICIOUS: { color: '#EA580C', bg: '#FFEDD5', label: 'SUSPICIOUS' },
  HIGH_RISK: { color: '#DC2626', bg: '#FEE2E2', label: 'HIGH RISK' },
};

export function TransactionTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchTx() {
      try {
        const res = await fetch('http://localhost:8000/transactions');
        const data = await res.json();
        if (!mounted) return;
        // newest first
        setTransactions((data || []).slice().reverse());
      } catch (e) {
        // ignore for now
      }
    }

    fetchTx();
    const interval = setInterval(fetchTx, 5000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-[#111827] mb-0.5">Live Transaction Feed</h2>
          <p className="text-sm text-[#6B7280]">Real-time monitoring of all UPI transactions</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#DBEAFE] border border-[#2563EB]/20">
          <div className="size-2 rounded-full bg-[#2563EB]" />
          <span className="text-xs font-medium text-[#2563EB]">LIVE</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Payer ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Payee
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Location
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Device
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Risk
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Severity
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
              {transactions.map((tx, index) => {
                const severityKey = tx.risk_score >= 70 ? 'HIGH_RISK' : tx.risk_score >= 50 ? 'SUSPICIOUS' : tx.risk_score >= 30 ? 'MONITOR' : 'SAFE';
                const config = severityConfig[severityKey as keyof typeof severityConfig];
                return (
                  <tr
                    key={tx.transaction_id}
                    onClick={() => setSelectedTransaction(tx.transaction_id)}
                    className={`cursor-pointer hover:bg-[#F9FAFB] transition-colors ${
                      selectedTransaction === tx.transaction_id ? 'bg-[#DBEAFE]/30' : ''
                    }`}
                  >
                    <td className="px-4 py-3 text-sm font-mono text-[#6B7280]">
                      {tx.timestamp}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-[#111827]">{tx.payer_id}</td>
                    <td className="px-4 py-3 text-sm font-mono text-[#6B7280]">{tx.payee_id}</td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-[#111827]">
                      ₹{tx.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-[#6B7280]" />
                        <span className="text-[#6B7280]">{tx.location}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Smartphone className="size-3.5 text-[#6B7280]" />
                        <span className="font-mono text-[#6B7280]">{tx.device_id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center">
                        <div
                          className="px-2 py-1 rounded text-xs font-semibold"
                          style={{ backgroundColor: config.bg, color: config.color }}
                        >
                          {tx.risk_score}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center">
                        <div
                          className="px-2.5 py-1 rounded-md text-xs font-medium"
                          style={{
                            backgroundColor: config.bg,
                            color: config.color,
                          }}
                        >
                          {config.label}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
          
          </tbody>
        </table>
      </div>
    </div>
  );
}
