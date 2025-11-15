import axios from 'axios';

const API_URL = 'https://lucid-abundance-production.up.railway.app/api/v1';

const api = {
  getPortfolios: (token) => {
    return axios.get(`${API_URL}/portfolios`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  createPortfolio: (token, data) => {
    return axios.post(`${API_URL}/portfolios`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  getPortfolio: (token, portfolioId) => {
    return axios.get(`${API_URL}/portfolios/${portfolioId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  updatePortfolio: (token, portfolioId, data) => {
    return axios.put(`${API_URL}/portfolios/${portfolioId}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  deletePortfolio: (token, portfolioId) => {
    return axios.delete(`${API_URL}/portfolios/${portfolioId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  getPositions: (token, portfolioId) => {
    return axios.get(`${API_URL}/portfolios/${portfolioId}/positions`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  createPosition: (token, portfolioId, data) => {
    return axios.post(`${API_URL}/portfolios/${portfolioId}/positions`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  deletePosition: (token, portfolioId, positionId) => {
    return axios.delete(`${API_URL}/portfolios/${portfolioId}/positions/${positionId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  getTransactions: (token, portfolioId) => {
    return axios.get(`${API_URL}/portfolios/${portfolioId}/transactions`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  createTransaction: (token, portfolioId, data) => {
    return axios.post(`${API_URL}/portfolios/${portfolioId}/transactions`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  deleteTransaction: (token, portfolioId, transactionId) => {
    return axios.delete(`${API_URL}/portfolios/${portfolioId}/transactions/${transactionId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  checkHealth: () => {
    return axios.get(`${API_URL}/../health`);
  },
  getQuote: (token, symbol) => {
    return axios.get(`${API_URL}/market/quote/${symbol}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  refreshPortfolioPrices: (token, portfolioId) => {
    return axios.post(`${API_URL}/market/portfolios/${portfolioId}/refresh-prices`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  getPortfolioSummary: (token, portfolioId, refresh = false) => {
    return axios.get(`${API_URL}/market/portfolios/${portfolioId}/summary`, {
      params: { refresh },
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};

export default api;
