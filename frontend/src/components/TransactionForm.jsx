import React, { useState } from 'react';
import { analyzeTransaction } from '../api';

const TransactionForm = ({ onSuccess, onLoading }) => {
  const [formData, setFormData] = useState({
    payer_id: '',
    payee_id: '',
    amount: '',
    location: '',
    device_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || '' : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    onLoading?.(true);

    try {
      // Validate required fields
      if (!formData.payer_id || !formData.payee_id || !formData.amount || !formData.location || !formData.device_id) {
        setError('All fields are required');
        return;
      }

      // Add current timestamp in ISO format
      const transactionData = {
        ...formData,
        timestamp: new Date().toISOString(),
        amount: parseFloat(formData.amount),
      };

      const result = await analyzeTransaction(transactionData);
      
      // Reset form
      setFormData({
        payer_id: '',
        payee_id: '',
        amount: '',
        location: '',
        device_id: '',
      });

      // Call success callback
      onSuccess?.(result);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to analyze transaction');
    } finally {
      setLoading(false);
      onLoading?.(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-6 border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="text-yellow-400">📝</span>
        Analyze Transaction
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Payer ID */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Payer ID</label>
            <input
              type="text"
              name="payer_id"
              value={formData.payer_id}
              onChange={handleChange}
              placeholder="e.g., 9988776655"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
            />
          </div>

          {/* Payee ID */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Payee ID / Merchant</label>
            <input
              type="text"
              name="payee_id"
              value={formData.payee_id}
              onChange={handleChange}
              placeholder="e.g., MERCHANT121"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Amount (₹)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="e.g., 9500"
              step="0.01"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Delhi"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
            />
          </div>

          {/* Device ID */}
          <div className="md:col-span-2">
            <label className="block text-gray-300 text-sm font-medium mb-2">Device ID</label>
            <input
              type="text"
              name="device_id"
              value={formData.device_id}
              onChange={handleChange}
              placeholder="e.g., ABC123"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⟳</span>
              Analyzing...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>🔍</span>
              Analyze Transaction
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
