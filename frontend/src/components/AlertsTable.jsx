import React from 'react';

const AlertsTable = ({ transactions }) => {
  // Only show flagged transactions
  const flaggedTransactions = transactions.filter(t => t.fraud_status).reverse();

  if (flaggedTransactions.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-8 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span>🚨</span>
          Fraud Alerts
        </h2>
        <p className="text-gray-400 text-center py-8">No fraudulent transactions detected</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-6 border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <span>🚨</span>
        Fraud Alerts ({flaggedTransactions.length})
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="px-4 py-3 text-left text-gray-300 font-semibold">TXN ID</th>
              <th className="px-4 py-3 text-left text-gray-300 font-semibold">Payer</th>
              <th className="px-4 py-3 text-left text-gray-300 font-semibold">Payee</th>
              <th className="px-4 py-3 text-right text-gray-300 font-semibold">Amount</th>
              <th className="px-4 py-3 text-center text-gray-300 font-semibold">Risk Score</th>
              <th className="px-4 py-3 text-left text-gray-300 font-semibold">Level</th>
              <th className="px-4 py-3 text-left text-gray-300 font-semibold">Reasons</th>
            </tr>
          </thead>
          <tbody>
            {flaggedTransactions.map((txn, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-700 hover:bg-red-900/20 transition-colors bg-red-900/10"
              >
                <td className="px-4 py-3 text-gray-300 font-mono text-xs">{txn.transaction_id}</td>
                <td className="px-4 py-3 text-gray-300">{txn.payer_id}</td>
                <td className="px-4 py-3 text-gray-300">{txn.payee_id}</td>
                <td className="px-4 py-3 text-right text-gray-300 font-semibold">₹{txn.amount.toLocaleString()}</td>
                <td className="px-4 py-3 text-center">
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full font-bold text-xs">
                    {txn.risk_score}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="bg-red-700 text-white px-3 py-1 rounded-lg text-xs font-semibold">
                    {txn.risk_level}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs max-w-xs truncate" title={txn.reasons.join(', ')}>
                  {txn.reasons.join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AlertsTable;
