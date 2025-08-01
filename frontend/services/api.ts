import axios from 'axios';
import { StockData, NewsData, FinancialData } from '../types';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const stockApi = {
  getStockData: async (symbol: string): Promise<StockData> => {
    const response = await api.get(`/stocks/data?symbol=${symbol}`);
    return response.data;
  },

  getStockNews: async (symbol: string): Promise<NewsData> => {
    const response = await api.get(`/stocks/news?symbol=${symbol}`);
    return response.data;
  },

  getCompanyFinancials: async (symbol: string): Promise<FinancialData> => {
    const response = await api.get(`/stocks/financials?symbol=${symbol}`);
    return response.data;
  },
};

export default api;