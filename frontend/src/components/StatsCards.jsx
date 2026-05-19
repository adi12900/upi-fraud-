import React from 'react';

const StatsCards = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Transactions',
      value: stats?.total_transactions || 0,
      icon: '📋',
      color: 'from-blue-600 to-blue-700',
    },
    {
      title: 'Flagged Transactions',
      value: stats?.flagged_transactions || 0,
      icon: '🚫',
      color: 'from-red-600 to-red-700',
      highlight: true,
    },
    {
      title: 'High Risk',
      value: stats?.high_risk_transactions || 0,
      icon: '⚠️',
      color: 'from-orange-600 to-orange-700',
    },
    {
      title: 'Average Risk Score',
      value: `${(stats?.average_risk_score || 0).toFixed(1)}%`,
      icon: '📊',
      color: 'from-purple-600 to-purple-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, idx) => (
        <div
          key={idx}
          className={`bg-gradient-to-br ${card.color} rounded-xl shadow-lg p-6 text-white border border-opacity-20 border-white ${
            card.highlight ? 'ring-2 ring-red-400' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-100 text-sm font-medium">{card.title}</p>
            <span className="text-3xl">{card.icon}</span>
          </div>
          <p className="text-4xl font-bold">{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
