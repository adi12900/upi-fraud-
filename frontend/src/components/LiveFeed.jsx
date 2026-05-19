import React, { useState, useEffect } from 'react';

const LiveFeed = ({ transactions }) => {
  const [displayCount, setDisplayCount] = useState(5);

  // Show most recent transactions first
  const recentTransactions = [...transactions].reverse().slice(0, displayCount);

  useEffect(() => {
    // Auto-refresh periodically
    const interval = setInterval(() => {
      setDisplayCount(prev => Math.min(prev + 1, transactions.length));
    }, 3000);

    return () => clearInterval(interval);
  }, [transactions.length]);

  if (transactions.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-8 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="animate-pulse">🔴</span>
          Live Transaction Feed
        </h2>
        <p className="text-gray-400 text-center py-8">Waiting for transactions...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-6 border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="animate-pulse">🔴</span>
        Live Transaction Feed (Latest {recentTransactions.length})
      </h2>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {recentTransactions.map((txn, idx) => {
          const bgColor =
            txn.risk_level === 'HIGH'
              ? 'bg-red-900/30 border-red-600'
              : txn.risk_level === 'MEDIUM'
              ? 'bg-yellow-900/30 border-yellow-600'
              : 'bg-green-900/30 border-green-600';

          const riskIcon =
            txn.risk_level === 'HIGH' ? '🚨' : txn.risk_level === 'MEDIUM' ? '⚠️' : '✅';

          return (
            <div
              key={idx}
              className={`p-4 rounded-lg border ${bgColor} text-white animate-in fade-in slide-in-from-top-2 duration-500`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{riskIcon}</span>
                    <span className="font-mono text-xs text-gray-400">{txn.transaction_id}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-400">{new Date(txn.timestamp).toLocaleTimeString()}</span>
                  </div>

                  <div className="text-sm mb-2">
                    <span className="text-gray-300">
                      {txn.payer_id} → {txn.payee_id}
                    </span>
                    <span className="text-gray-400 ml-4">₹{txn.amount.toLocaleString()}</span>
                  </div>

                  {txn.reasons.length > 0 && (
                    <p className="text-xs text-gray-400">{txn.reasons[0]}</p>
                  )}
                </div>

                <div className="text-right">
                  <div className="font-bold text-lg">{txn.risk_score}</div>
                  <div className="text-xs text-gray-400">{txn.risk_level}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {displayCount < transactions.length && (
        <button
          onClick={() => setDisplayCount(prev => prev + 5)}
          className="w-full mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors text-sm"
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default LiveFeed;
