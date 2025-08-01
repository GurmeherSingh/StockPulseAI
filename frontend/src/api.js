import axios from 'axios';

// Configure your FastAPI backend URL
const API_BASE_URL = 'http://localhost:8000'; // Change this to your FastAPI server URL

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Real API functions for your FastAPI backend
const stockAPI = {
  getStockData: async (symbol) => {
    try {
      const response = await api.get(`/stocks/data`, {
        params: { symbol: symbol.toUpperCase() }
      });
      
      // Check for API errors
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      
      // Transform the data to match frontend expectations
      // Your backend returns: { symbol, prices: [{ date, open, high, low, close, volume }] }
      return response.data.prices || [];
    } catch (error) {
      console.error('Error fetching stock data:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to fetch stock data');
    }
  },
  
  getStockNews: async (symbol) => {
    try {
      const response = await api.get(`/stocks/news`, {
        params: { symbol: symbol.toUpperCase() }
      });
      
      // Check for API errors
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      
      // Transform news data to match frontend expectations
      // Your backend returns: { symbol, news: [{ title, description, url, publishedAt, sentiment }] }
      const transformedNews = response.data.news?.map(article => ({
        title: article.title,
        summary: article.description || 'No description available',
        publishedDate: article.publishedAt,
        url: article.url,
        sentiment: article.sentiment?.label || 'neutral',
        sentimentScore: article.sentiment?.score || 0
      })) || [];
      
      return transformedNews;
    } catch (error) {
      console.error('Error fetching stock news:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to fetch stock news');
    }
  },
  
  getFinancials: async (symbol) => {
    try {
      const response = await api.get(`/stocks/financials`, {
        params: { symbol: symbol.toUpperCase() }
      });
      
      // Check for API errors in any of the financial data sections
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      
      const data = response.data;
      
      // Transform financial data to match frontend expectations
      // Your backend returns: { symbol, overview, income_statement, balance_sheet, cash_flow }
      return {
        overview: {
          symbol: data.symbol,
          companyName: data.overview?.Name || `${data.symbol} Inc.`,
          marketCap: parseFloat(data.overview?.MarketCapitalization || 0),
          peRatio: parseFloat(data.overview?.PERatio || 0),
          eps: parseFloat(data.overview?.EPS || 0),
          dividend: parseFloat(data.overview?.DividendYield || 0),
          beta: parseFloat(data.overview?.Beta || 0)
        },
        incomeStatement: {
          // AlphaVantage returns annual reports, get the most recent year
          revenue: parseFloat(data.income_statement?.annualReports?.[0]?.totalRevenue || 0),
          grossProfit: parseFloat(data.income_statement?.annualReports?.[0]?.grossProfit || 0),
          operatingIncome: parseFloat(data.income_statement?.annualReports?.[0]?.operatingIncome || 0),
          netIncome: parseFloat(data.income_statement?.annualReports?.[0]?.netIncome || 0)
        },
        balanceSheet: {
          totalAssets: parseFloat(data.balance_sheet?.annualReports?.[0]?.totalAssets || 0),
          totalLiabilities: parseFloat(data.balance_sheet?.annualReports?.[0]?.totalLiabilities || 0),
          shareholderEquity: parseFloat(data.balance_sheet?.annualReports?.[0]?.totalShareholderEquity || 0)
        },
        cashFlow: {
          operatingCashFlow: parseFloat(data.cash_flow?.annualReports?.[0]?.operatingCashflow || 0),
          investingCashFlow: parseFloat(data.cash_flow?.annualReports?.[0]?.cashflowFromInvestment || 0),
          financingCashFlow: parseFloat(data.cash_flow?.annualReports?.[0]?.cashflowFromFinancing || 0)
        }
      };
    } catch (error) {
      console.error('Error fetching financials:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to fetch financial data');
    }
  }
};

// Export for use in your component
export default stockAPI;