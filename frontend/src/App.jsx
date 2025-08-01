import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, Calendar, ExternalLink, BarChart3, DollarSign, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// At the top of your App.jsx, replace the mockAPI import
import stockAPI from './api'; // Import your real API functions

// Replace the handleSearch function with this:
const handleSearch = async (e) => {
  e?.preventDefault?.();
  if (!symbol.trim()) return;
  
  setLoading(true);
  setError('');
  setSearchSymbol(symbol.toUpperCase());
  
  try {
    const [stocks, news, financials] = await Promise.all([
      stockAPI.getStockData(symbol),
      stockAPI.getStockNews(symbol),
      stockAPI.getFinancials(symbol)
    ]);
    
    setStockData(stocks);
    setNewsData(news);
    setFinancialData(financials);
    setCurrentView('dashboard');
  } catch (err) {
    setError(err.message || 'Failed to fetch data. Please try again.');
    console.error('API Error:', err);
  } finally {
    setLoading(false);
  }
};
// Components
const LoadingCard = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border animate-pulse">
    <div className="h-4 bg-gray-200 rounded mb-3"></div>
    <div className="h-3 bg-gray-200 rounded mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
  </div>
);

const NewsCard = ({ article }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md transition-all duration-200">
    <div className="flex items-start justify-between mb-3">
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getSentimentColor(article.sentiment)}`}>
        {getSentimentIcon(article.sentiment)}
        {article.sentiment}
      </div>
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-blue-600 transition-colors"
      >
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
    <p className="text-gray-600 text-sm mb-3 line-clamp-3">{article.summary}</p>
    <div className="flex items-center text-xs text-gray-500">
      <Calendar className="w-3 h-3 mr-1" />
      {formatDate(article.publishedDate)}
    </div>
  </div>
);

const StockDashboard = () => {
  const [symbol, setSymbol] = useState('');
  const [searchSymbol, setSearchSymbol] = useState('');
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, financials
  const [priceType, setPriceType] = useState('close');
  
  const [stockData, setStockData] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!symbol.trim()) return;
    
    setLoading(true);
    setError('');
    setSearchSymbol(symbol.toUpperCase());
    
    try {
      const [stocks, news, financials] = await Promise.all([
        mockAPI.getStockData(symbol),
        mockAPI.getStockNews(symbol),
        mockAPI.getFinancials(symbol)
      ]);
      
      setStockData(stocks);
      setNewsData(news);
      setFinancialData(financials);
      setCurrentView('dashboard');
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const chartData = stockData.map(item => ({
    date: item.date,
    value: item[priceType],
    ...item
  }));

  if (!searchSymbol && !loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
                <h1 className="text-xl font-bold text-gray-900">StockSentiment</h1>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center max-w-2xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Track Stock Sentiment & Performance
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Get real-time stock data, news sentiment analysis, and comprehensive financial insights all in one place.
            </p>
            
            <div className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                  placeholder="Enter stock symbol (e.g., AAPL, TSLA, AMZN)"
                  className="w-full px-6 py-4 text-lg border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="absolute right-2 top-2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Search className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">StockSentiment</h1>
              {searchSymbol && (
                <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {searchSymbol}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex">
                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                  placeholder="Search symbol..."
                  className="px-4 py-2 border border-gray-300 rounded-l-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Navigation Tabs */}
      {searchSymbol && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  currentView === 'dashboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('financials')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  currentView === 'financials'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Financials
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border">
                <div className="h-8 bg-gray-200 rounded mb-4 animate-pulse"></div>
                <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map(i => <LoadingCard key={i} />)}
            </div>
          </div>
        </div>
      ) : currentView === 'dashboard' ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-sm border">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Price Chart</h2>
                  <select
                    value={priceType}
                    onChange={(e) => setPriceType(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="close">Close Price</option>
                    <option value="open">Open Price</option>
                    <option value="high">High Price</option>
                    <option value="low">Low Price</option>
                  </select>
                </div>
                
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip 
                        formatter={(value) => [formatCurrency(value), priceType.charAt(0).toUpperCase() + priceType.slice(1)]}
                        labelFormatter={(value) => formatDate(value)}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* News Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent News & Sentiment</h2>
              <div className="space-y-4">
                {newsData.map((article, index) => (
                  <NewsCard key={index} article={article} />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Financials View
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Overview Cards */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Market Cap</p>
                  <p className="text-xl font-semibold">{formatLargeNumber(financialData?.overview.marketCap)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <div className="flex items-center">
                <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">P/E Ratio</p>
                  <p className="text-xl font-semibold">{financialData?.overview.peRatio}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">EPS</p>
                  <p className="text-xl font-semibold">${financialData?.overview.eps}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <div className="flex items-center">
                <Activity className="w-8 h-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Beta</p>
                  <p className="text-xl font-semibold">{financialData?.overview.beta}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Income Statement */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Income Statement</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Revenue</span>
                  <span className="font-medium">{formatLargeNumber(financialData?.incomeStatement.revenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gross Profit</span>
                  <span className="font-medium">{formatLargeNumber(financialData?.incomeStatement.grossProfit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Operating Income</span>
                  <span className="font-medium">{formatLargeNumber(financialData?.incomeStatement.operatingIncome)}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-gray-900 font-medium">Net Income</span>
                  <span className="font-semibold text-green-600">{formatLargeNumber(financialData?.incomeStatement.netIncome)}</span>
                </div>
              </div>
            </div>

            {/* Balance Sheet */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Balance Sheet</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Assets</span>
                  <span className="font-medium">{formatLargeNumber(financialData?.balanceSheet.totalAssets)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Liabilities</span>
                  <span className="font-medium">{formatLargeNumber(financialData?.balanceSheet.totalLiabilities)}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-gray-900 font-medium">Shareholder Equity</span>
                  <span className="font-semibold text-blue-600">{formatLargeNumber(financialData?.balanceSheet.shareholderEquity)}</span>
                </div>
              </div>
            </div>

            {/* Cash Flow */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cash Flow</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Operating Cash Flow</span>
                  <span className="font-medium text-green-600">{formatLargeNumber(financialData?.cashFlow.operatingCashFlow)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Investing Cash Flow</span>
                  <span className="font-medium text-red-600">{formatLargeNumber(financialData?.cashFlow.investingCashFlow)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Financing Cash Flow</span>
                  <span className="font-medium text-red-600">{formatLargeNumber(financialData?.cashFlow.financingCashFlow)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockDashboard;