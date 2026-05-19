import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Transaction endpoints
export const analyzeTransaction = async (transactionData) => {
  const response = await apiClient.post('/transaction', transactionData);
  return response.data;
};

export const getAllTransactions = async () => {
  const response = await apiClient.get('/transactions');
  return response.data;
};

export const getFlaggedTransactions = async () => {
  const response = await apiClient.get('/flagged');
  return response.data;
};

export const getStatistics = async () => {
  const response = await apiClient.get('/stats');
  return response.data;
};

export const exportFlaggedTransactions = async () => {
  const response = await apiClient.get('/export', {
    responseType: 'blob',
  });
  return response.data;
};

export const generateDemoData = async () => {
  const response = await apiClient.post('/generate-demo-data');
  return response.data;
};

export const clearAllData = async () => {
  const response = await apiClient.post('/clear-data');
  return response.data;
};

export default apiClient;
