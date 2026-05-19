import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { AlertTriangle, CheckCircle2, Loader2, ShieldAlert, Zap } from 'lucide-react';

interface TransactionSimulatorProps { onNavigate: (page: string) => void }

interface RiskResult {
  transaction_id: string;
  risk_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  fraud_status: boolean;
  triggered_rules: string[];
  reasons: string[];
}

export function TransactionSimulator({ onNavigate }: TransactionSimulatorProps) {
  const [formData, setFormData] = useState({
    payer_id: '',
    payee_id: '',
    amount: '',
    location: '',
    device_id: '',
  });
  const [result, setResult] = useState<RiskResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeTransaction = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('http://localhost:8000/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount),
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Transaction analysis failed');
      }

      const data = (await response.json()) as RiskResult;
      setResult(data);
    } catch {
      setError('Unable to reach the backend. Start uvicorn on port 8000 first.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      <Sidebar currentPage="simulator" onNavigate={onNavigate} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-auto bg-[#F5F7FA] p-6">
          <div className="max-w-[1200px] mx-auto space-y-6">
            <div>
              <h1 className="text-xl font-semibold mb-2">Transaction Simulator</h1>
              <p className="text-sm text-[#6B7280]">Use this page to test the backend fraud rules with a single UPI transaction.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-2 text-sm font-medium text-[#111827]">
                  <Zap className="size-4 text-[#2563EB]" />
                  Test Transaction
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-[#6B7280]">payer_id</label>
                    <input
                      value={formData.payer_id}
                      onChange={(event) => setFormData({ ...formData, payer_id: event.target.value })}
                      className="w-full rounded-xl border border-black/10 bg-[#F9FAFB] px-4 py-3 text-sm outline-none transition focus:border-[#2563EB]"
                      placeholder="9988776655"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-[#6B7280]">payee_id</label>
                    <input
                      value={formData.payee_id}
                      onChange={(event) => setFormData({ ...formData, payee_id: event.target.value })}
                      className="w-full rounded-xl border border-black/10 bg-[#F9FAFB] px-4 py-3 text-sm outline-none transition focus:border-[#2563EB]"
                      placeholder="MERCHANT121"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-[#6B7280]">amount</label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(event) => setFormData({ ...formData, amount: event.target.value })}
                      className="w-full rounded-xl border border-black/10 bg-[#F9FAFB] px-4 py-3 text-sm outline-none transition focus:border-[#2563EB]"
                      placeholder="9500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-[#6B7280]">location</label>
                    <input
                      value={formData.location}
                      onChange={(event) => setFormData({ ...formData, location: event.target.value })}
                      className="w-full rounded-xl border border-black/10 bg-[#F9FAFB] px-4 py-3 text-sm outline-none transition focus:border-[#2563EB]"
                      placeholder="Delhi"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-xs font-medium text-[#6B7280]">device_id</label>
                    <input
                      value={formData.device_id}
                      onChange={(event) => setFormData({ ...formData, device_id: event.target.value })}
                      className="w-full rounded-xl border border-black/10 bg-[#F9FAFB] px-4 py-3 text-sm outline-none transition focus:border-[#2563EB]"
                      placeholder="ABC123"
                    />
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={analyzeTransaction}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] disabled:opacity-60"
                  >
                    {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                    Analyze Transaction
                  </button>
                  <button
                    onClick={() => setFormData({ payer_id: '', payee_id: '', amount: '', location: '', device_id: '' })}
                    className="rounded-xl border border-black/10 bg-[#F9FAFB] px-5 py-3 text-sm font-semibold text-[#111827] transition hover:bg-[#F3F4F6]"
                  >
                    Clear
                  </button>
                </div>

                {error ? (
                  <div className="mt-4 rounded-xl border border-[#DC2626]/20 bg-[#FEE2E2] px-4 py-3 text-sm text-[#B91C1C]">
                    {error}
                  </div>
                ) : null}
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-2 text-sm font-medium text-[#111827]">
                  <ShieldAlert className="size-4 text-[#DC2626]" />
                  Risk Result
                </div>

                {result ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-2xl border border-black/10 bg-[#F9FAFB] p-4">
                      <div>
                        <p className="text-xs text-[#6B7280]">Risk Score</p>
                        <p className="text-3xl font-semibold text-[#111827]">{result.risk_score}</p>
                      </div>
                      <div
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          result.risk_level === 'HIGH'
                            ? 'bg-[#FEE2E2] text-[#B91C1C]'
                            : result.risk_level === 'MEDIUM'
                              ? 'bg-[#FEF3C7] text-[#B45309]'
                              : 'bg-[#DCFCE7] text-[#166534]'
                        }`}
                      >
                        {result.risk_level}
                      </div>
                    </div>

                    <div className={`rounded-2xl border p-4 ${result.fraud_status ? 'border-[#DC2626]/20 bg-[#FEE2E2]' : 'border-[#16A34A]/20 bg-[#DCFCE7]'}`}>
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        {result.fraud_status ? <AlertTriangle className="size-4 text-[#DC2626]" /> : <CheckCircle2 className="size-4 text-[#16A34A]" />}
                        Fraud status: {result.fraud_status ? 'FLAGGED' : 'SAFE'}
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-xs font-medium text-[#6B7280]">Triggered Rules</p>
                      <div className="flex flex-wrap gap-2">
                        {result.triggered_rules.length > 0 ? result.triggered_rules.map((rule) => (
                          <span key={rule} className="rounded-full border border-black/10 bg-[#F9FAFB] px-3 py-1 text-xs font-medium text-[#111827]">
                            {rule}
                          </span>
                        )) : <span className="text-sm text-[#6B7280]">None</span>}
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-xs font-medium text-[#6B7280]">Reasons</p>
                      <ul className="space-y-2 text-sm text-[#111827]">
                        {result.reasons.map((reason) => (
                          <li key={reason} className="rounded-xl bg-[#F9FAFB] px-3 py-2">{reason}</li>
                        ))}
                      </ul>
                    </div>

                    <p className="text-xs text-[#6B7280]">Transaction ID: {result.transaction_id}</p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-black/10 bg-[#F9FAFB] p-8 text-sm text-[#6B7280]">
                    Enter a transaction on the left and click Analyze Transaction.
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
