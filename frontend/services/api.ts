import axios from 'axios';
import { StockData, NewsData, FinancialData } from '../types';

// It's a good practice to use environment variables for the API base URL.
// This makes it easy to switch between development and production environments.
// In Vite, you can create a .env file in your project's root directory:
// VITE_API_BASE_URL=http://localhost:8000
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Using axios interceptors for error handling can centralize error logic.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can add custom error handling here, e.g., for logging
    // or transforming error messages before they reach your components.
    return Promise.reject(error);
  },
);

export const stockApi = {
  getStockData: async (symbol: string): Promise<StockData> => {
    // Using the `params` object is safer as it handles URL encoding for you.
    const response = await api.get('/stocks/data', { params: { symbol } });
    return response.data;
  },
  getStockNews: async (symbol: string): Promise<NewsData> => {
    const response = await api.get('/stocks/news', { params: { symbol } });
    return response.data;
  },
  getCompanyFinancials: async (symbol: string): Promise<FinancialData> => {
    const response = await api.get('/stocks/financials', { params: { symbol } });
    return response.data;
  },
};

export default api;