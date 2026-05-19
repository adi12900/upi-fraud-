import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import TransactionForm from './components/TransactionForm';
import RiskResult from './components/RiskResult';
import StatsCards from './components/StatsCards';
import RiskCharts from './components/RiskCharts';
import AlertsTable from './components/AlertsTable';
import LiveFeed from './components/LiveFeed';
import {
  getAllTransactions,
  getStatistics,
  generateDemoData,
  exportFlaggedTransactions,
  clearAllData,
} from './api';
import './index.css';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch transactions and stats
  const fetchData = useCallback(async () => {
    try {
      const [txns, statsData] = await Promise.all([
        getAllTransactions(),
        getStatistics(),
      ]);
      setTransactions(txns);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh every 3 seconds
  useEffect(() => {
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleTransactionSuccess = (result) => {
    setLastResult(result);
    fetchData();
  };

  const handleGenerateDemo = async () => {
    setLoading(true);
    try {
      await generateDemoData();
      setTimeout(fetchData, 1000);
    } catch (error) {
      console.error('Failed to generate demo data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await exportFlaggedTransactions();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'flagged_transactions.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to export CSV:', error);
    }
  };

  const handleClearData = async () => {
    if (window.confirm('Are you sure you want to clear all transactions?')) {
      try {
        await clearAllData();
        setTransactions([]);
        setStats(null);
        setLastResult(null);
        fetchData();
      } catch (error) {
        console.error('Failed to clear data:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Navbar */}
      <Navbar stats={stats} onRefresh={fetchData} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section with Demo Buttons */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={handleGenerateDemo}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg transition-all disabled:opacity-50 shadow-lg"
                >
                  {loading ? '⟳ Generating...' : '🎬 Generate Fraud Traffic'}
                </button>
                <button
                  onClick={handleExportCSV}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all shadow-lg"
                >
                  📥 Export Suspicious CSV
                </button>
                <button
                  onClick={handleClearData}
                  className="w-full px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-lg transition-all shadow-lg"
                >
                  🗑️ Clear All Data
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-900/20 to-gray-900 rounded-xl shadow-xl p-6 border border-red-600/30">
              <h2 className="text-xl font-bold text-white mb-4">About This System</h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Real-time UPI fraud detection using weighted rule-based scoring. Analyzes 11 fraud patterns to identify suspicious transactions instantly.
              </p>
              <p className="text-red-300 text-xs">
                ⚠️ Demo system - Use test data only
              </p>
            </div>
          </div>

          {/* Statistics Dashboard */}
          <StatsCards stats={stats} />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Form and Result */}
          <div className="lg:col-span-1 space-y-6">
            <TransactionForm
              onSuccess={handleTransactionSuccess}
              onLoading={setLoading}
            />
            <RiskResult result={lastResult} />
          </div>

          {/* Right Column - Charts */}
          <div className="lg:col-span-2">
            <RiskCharts transactions={transactions} />
          </div>
        </div>

        {/* Alerts Table */}
        <div className="mb-8">
          <AlertsTable transactions={transactions} />
        </div>

        {/* Live Feed */}
        <div className="mb-8">
          <LiveFeed transactions={transactions} />
        </div>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-gray-700 mt-12">
          <p className="text-gray-400 text-sm">
            UPI Fraud Detector v1.0 • Built for real-time monitoring • FastAPI + React
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
