import React from 'react';

const RiskResult = ({ result }) => {
  if (!result) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-8 border border-gray-700 text-center">
        <p className="text-gray-400">No transaction analyzed yet</p>
      </div>
    );
  }

  const getRiskColor = (level) => {
    switch (level) {
      case 'LOW':
        return 'from-green-600 to-green-700';
      case 'MEDIUM':
        return 'from-yellow-600 to-yellow-700';
      case 'HIGH':
        return 'from-red-600 to-red-700';
      default:
        return 'from-gray-600 to-gray-700';
    }
  };

  const getRiskBg = (level) => {
    switch (level) {
      case 'LOW':
        return 'bg-green-900/30 border-green-600';
      case 'MEDIUM':
        return 'bg-yellow-900/30 border-yellow-600';
      case 'HIGH':
        return 'bg-red-900/30 border-red-600';
      default:
        return 'bg-gray-900/30 border-gray-600';
    }
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'LOW':
        return '✓';
      case 'MEDIUM':
        return '⚠';
      case 'HIGH':
        return '🚨';
      default:
        return '?';
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-8 border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <span>📊</span>
        Risk Assessment Result
      </h2>

      {/* Main Risk Score and Level */}
      <div className={`bg-gradient-to-r ${getRiskColor(result.risk_level)} rounded-xl p-8 mb-6 text-white shadow-lg`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center">
            <p className="text-gray-200 text-sm font-medium mb-2">RISK SCORE</p>
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={`${(result.risk_score / 100) * 339.3} 339.3`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold">{result.risk_score}</div>
                  <div className="text-xs text-gray-200">/100</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-gray-200 text-sm font-medium mb-2">RISK LEVEL</p>
            <p className="text-5xl font-bold mb-4">{result.risk_level}</p>
            <p className="text-gray-200 text-sm font-medium mb-2">FRAUD STATUS</p>
            <div className="flex items-center gap-3">
              <span className={`text-3xl ${result.fraud_status ? '🚫' : '✅'}`}></span>
              <span className={`text-lg font-semibold ${result.fraud_status ? 'text-red-300' : 'text-green-300'}`}>
                {result.fraud_status ? 'FLAGGED' : 'SAFE'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction ID */}
      <div className="mb-6">
        <p className="text-gray-400 text-sm mb-1">Transaction ID</p>
        <p className="text-white font-mono text-lg">{result.transaction_id}</p>
      </div>

      {/* Triggered Rules */}
      {result.triggered_rules.length > 0 && (
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <span>🎯</span>
            Triggered Rules ({result.triggered_rules.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {result.triggered_rules.map((rule, idx) => (
              <div key={idx} className={`px-4 py-2 rounded-lg border ${getRiskBg(result.risk_level)} text-sm text-white font-medium`}>
                {rule}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fraud Reasons */}
      {result.reasons.length > 0 && (
        <div>
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <span>📝</span>
            Fraud Reasons & Explanations
          </h3>
          <div className="space-y-2">
            {result.reasons.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                <span className="text-yellow-400 mt-1">→</span>
                <p className="text-gray-200 text-sm">{reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskResult;
