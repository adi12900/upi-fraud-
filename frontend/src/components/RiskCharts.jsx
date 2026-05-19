import React from 'react';
import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const RiskCharts = ({ transactions }) => {
  // Prepare data for pie chart (risk distribution)
  const riskDistribution = {
    LOW: transactions.filter(t => t.risk_level === 'LOW').length,
    MEDIUM: transactions.filter(t => t.risk_level === 'MEDIUM').length,
    HIGH: transactions.filter(t => t.risk_level === 'HIGH').length,
  };

  const pieData = [
    { name: 'Low Risk', value: riskDistribution.LOW, fill: '#10b981' },
    { name: 'Medium Risk', value: riskDistribution.MEDIUM, fill: '#f59e0b' },
    { name: 'High Risk', value: riskDistribution.HIGH, fill: '#ef4444' },
  ];

  // Prepare data for bar chart (safe vs flagged)
  const barData = [
    {
      name: 'Transactions',
      Safe: transactions.filter(t => !t.fraud_status).length,
      Flagged: transactions.filter(t => t.fraud_status).length,
    },
  ];

  // Prepare data for line chart (recent risk scores)
  const recentTransactions = transactions.slice(-10);
  const lineData = recentTransactions.map((t, idx) => ({
    id: idx + 1,
    score: t.risk_score,
    timestamp: t.timestamp.split('T')[1]?.substring(0, 5) || `#${idx + 1}`,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Pie Chart - Risk Distribution */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 border border-gray-700">
        <h3 className="text-white font-bold mb-4 text-lg">Risk Distribution</h3>
        {pieData.reduce((sum, item) => sum + item.value, 0) > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} txn`, 'Count']} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[250px] flex items-center justify-center text-gray-400">
            No transactions yet
          </div>
        )}
      </div>

      {/* Bar Chart - Safe vs Flagged */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 border border-gray-700">
        <h3 className="text-white font-bold mb-4 text-lg">Safe vs Flagged</h3>
        {barData[0].Safe + barData[0].Flagged > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #444' }} />
              <Legend />
              <Bar dataKey="Safe" fill="#10b981" />
              <Bar dataKey="Flagged" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[250px] flex items-center justify-center text-gray-400">
            No transactions yet
          </div>
        )}
      </div>

      {/* Line Chart - Recent Risk Scores */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 border border-gray-700">
        <h3 className="text-white font-bold mb-4 text-lg">Recent Risk Scores</h3>
        {lineData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="timestamp" stroke="#999" />
              <YAxis stroke="#999" domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #444' }}
                formatter={(value) => [value.toFixed(1), 'Risk Score']}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#f59e0b"
                dot={{ fill: '#f59e0b', r: 4 }}
                activeDot={{ r: 6 }}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[250px] flex items-center justify-center text-gray-400">
            No transactions yet
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskCharts;
