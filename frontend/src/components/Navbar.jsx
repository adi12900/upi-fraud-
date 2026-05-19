import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Navbar = ({ stats, onRefresh }) => {
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await onRefresh?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-red-900 to-gray-900 shadow-lg border-b border-red-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">⚠️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">UPI Fraud Detector</h1>
              <p className="text-xs text-red-300">Real-Time Monitoring System</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="text-right">
              <p className="text-red-300 text-sm">Live Status</p>
              <p className="text-white font-semibold flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Active
              </p>
            </div>
            {stats && (
              <div className="text-right">
                <p className="text-red-300 text-sm">Flagged This Session</p>
                <p className="text-white font-bold text-lg">{stats.flagged_transactions || 0}</p>
              </div>
            )}
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? '↻' : '↻'} Refresh
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
