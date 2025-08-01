import React, { useState } from 'react';
import { BarChart3, Brain, Newspaper, Building } from 'lucide-react';
import { StockSearch } from './components/StockSearch';
import { StockChart } from './components/StockChart';
import { SentimentIndicator } from './components/SentimentIndicator';
import { NewsFeed } from './components/NewsFeed';
import { CompanyOverview } from './components/CompanyOverview';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { ErrorMessage } from './components/ui/ErrorMessage';
import { stockApi } from '../services/api';
import { StockData, NewsData, FinancialData } from '../types';
import { calculateSentimentSummary } from './utils/sentiment';

function App() {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [newsData, setNewsData] = useState<NewsData | null>(null);
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSymbol, setCurrentSymbol] = useState<string>('');

  const handleSearch = async (symbol: string) => {
    setLoading(true);
    setError(null);
    setCurrentSymbol(symbol);

    try {
      // Fetch all data in parallel
      const [stockResponse, newsResponse, financialResponse] = await Promise.allSettled([
        stockApi.getStockData(symbol),
        stockApi.getStockNews(symbol),
        stockApi.getCompanyFinancials(symbol),
      ]);

      // Handle stock data
      if (stockResponse.status === 'fulfilled') {
        setStockData(stockResponse.value);
      } else {
        console.error('Stock data error:', stockResponse.reason);
      }

      // Handle news data
      if (newsResponse.status === 'fulfilled') {
        setNewsData(newsResponse.value);
      } else {
        console.error('News data error:', newsResponse.reason);
      }

      // Handle financial data
      if (financialResponse.status === 'fulfilled') {
        setFinancialData(financialResponse.value);
      } else {
        console.error('Financial data error:', financialResponse.reason);
      }

      // If all requests failed, show error
      if (
        stockResponse.status === 'rejected' &&
        newsResponse.status === 'rejected' &&
        financialResponse.status === 'rejected'
      ) {
        setError('Failed to fetch data. Please check your API keys and try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (currentSymbol) {
      handleSearch(currentSymbol);
    }
  };

  const sentimentSummary = newsData?.news 
    ? calculateSentimentSummary(newsData.news)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-600 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">StockPulseAI</h1>
              <p className="text-sm text-gray-600">AI-Powered Stock Analytics Platform</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Search Section */}
          <StockSearch onSearch={handleSearch} loading={loading} />

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <LoadingSpinner size="lg" className="mx-auto mb-4" />
                <p className="text-gray-600">Analyzing {currentSymbol}...</p>
                <p className="text-sm text-gray-500 mt-1">Fetching stock data, news, and sentiment</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <ErrorMessage message={error} onRetry={handleRetry} />
          )}

          {/* Results */}
          {!loading && (stockData || newsData || financialData) && (
            <div className="space-y-8">
              {/* Top Row - Chart and Company Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {stockData && (
                  <div className="lg:col-span-2">
                    <StockChart data={stockData.prices} symbol={stockData.symbol} />
                  </div>
                )}
                {financialData?.overview && (
                  <div className="lg:col-span-1">
                    <CompanyOverview overview={financialData.overview} />
                  </div>
                )}
              </div>

              {/* Bottom Row - Sentiment and News */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {sentimentSummary && (
                  <div className="lg:col-span-1">
                    <SentimentIndicator 
                      sentiment={sentimentSummary} 
                      symbol={currentSymbol} 
                    />
                  </div>
                )}
                {newsData && (
                  <div className="lg:col-span-2">
                    <NewsFeed articles={newsData.news} symbol={currentSymbol} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && !stockData && !newsData && !financialData && (
            <div className="text-center py-12">
              <div className="flex justify-center space-x-4 mb-6">
                <div className="p-3 bg-primary-100 rounded-full">
                  <BarChart3 className="w-8 h-8 text-primary-600" />
                </div>
                <div className="p-3 bg-success-100 rounded-full">
                  <Brain className="w-8 h-8 text-success-600" />
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Newspaper className="w-8 h-8 text-blue-600" />
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Building className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Welcome to StockPulseAI
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Enter a stock symbol above to get real-time data, sentiment analysis from financial news, 
                and AI-powered insights to help you gauge market pulse.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>© 2025 StockPulseAI. Built with FastAPI and React.</p>
            <p className="mt-1">
              Powered by Alpha Vantage API and NewsAPI for real-time financial data.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;