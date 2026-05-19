import { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  ShieldAlert,
  TrendingUp,
  Zap,
  AlertCircle,
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { KPICard } from './KPICard';
import { TransactionTable } from './TransactionTable';
import { FraudAlerts } from './FraudAlerts';
import { FraudTimeline } from './FraudTimeline';
import { RiskDistribution } from './RiskDistribution';
import { FraudInsights } from './FraudInsights';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [kpiData, setKpiData] = useState({
    totalTransactions: { value: '0', trend: 0, sparkline: [] as number[] },
    fraudAlerts: { value: '0', trend: 0, sparkline: [] as number[] },
    highRisk: { value: '0', trend: 0, sparkline: [] as number[] },
    avgTrustScore: { value: '0', trend: 0, sparkline: [] as number[] },
    velocityAttacks: { value: '0', trend: 0, sparkline: [] as number[] },
    escalatedCases: { value: '0', trend: 0, sparkline: [] as number[] },
  });

  // fetch stats from backend
  useEffect(() => {
    let mounted = true;
    async function fetchStats() {
      try {
        const res = await fetch('http://localhost:8000/stats');
        const data = await res.json();
        if (!mounted) return;
        setKpiData({
          totalTransactions: { value: String(data.total_transactions), trend: 0, sparkline: [] },
          fraudAlerts: { value: String(data.flagged_transactions), trend: 0, sparkline: [] },
          highRisk: { value: String(data.high_risk_transactions), trend: 0, sparkline: [] },
          avgTrustScore: { value: String(data.average_risk_score), trend: 0, sparkline: [] },
          velocityAttacks: { value: '0', trend: 0, sparkline: [] },
          escalatedCases: { value: '0', trend: 0, sparkline: [] },
        });
      } catch (e) {
        // ignore
      }
    }

    fetchStats();
    const iv = setInterval(fetchStats, 5000);
    return () => {
      mounted = false;
      clearInterval(iv);
    };
  }, []);

  return (
    <div className="flex h-full w-full overflow-hidden">
      <Sidebar currentPage="dashboard" onNavigate={onNavigate} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-auto bg-[#F5F7FA] p-6">
          <div className="max-w-[1800px] mx-auto space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-6 gap-4">
              <KPICard
                title="Total Transactions"
                value={kpiData.totalTransactions.value}
                trend={kpiData.totalTransactions.trend}
                icon={Activity}
                sparklineData={kpiData.totalTransactions.sparkline}
                color="#2563EB"
              />
              <KPICard
                title="Fraud Alerts"
                value={kpiData.fraudAlerts.value}
                trend={kpiData.fraudAlerts.trend}
                icon={AlertTriangle}
                sparklineData={kpiData.fraudAlerts.sparkline}
                color="#D97706"
              />
              <KPICard
                title="High Risk"
                value={kpiData.highRisk.value}
                trend={kpiData.highRisk.trend}
                icon={ShieldAlert}
                sparklineData={kpiData.highRisk.sparkline}
                color="#DC2626"
              />
              <KPICard
                title="Avg Trust Score"
                value={kpiData.avgTrustScore.value}
                trend={kpiData.avgTrustScore.trend}
                icon={TrendingUp}
                sparklineData={kpiData.avgTrustScore.sparkline}
                color="#16A34A"
              />
              <KPICard
                title="Velocity Attacks"
                value={kpiData.velocityAttacks.value}
                trend={kpiData.velocityAttacks.trend}
                icon={Zap}
                sparklineData={kpiData.velocityAttacks.sparkline}
                color="#D97706"
              />
              <KPICard
                title="Escalated Cases"
                value={kpiData.escalatedCases.value}
                trend={kpiData.escalatedCases.trend}
                icon={AlertCircle}
                sparklineData={kpiData.escalatedCases.sparkline}
                color="#DC2626"
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-12 gap-6">
              {/* Live Transaction Feed */}
              <div className="col-span-8">
                <TransactionTable />
              </div>

              {/* Right Sidebar */}
              <div className="col-span-4 space-y-6">
                <FraudAlerts />
                <FraudTimeline />
                <RiskDistribution />
              </div>
            </div>

            {/* Fraud Intelligence Insights */}
            <FraudInsights />
          </div>
        </main>
      </div>
    </div>
  );
}
