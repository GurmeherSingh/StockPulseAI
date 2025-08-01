
import React, { useState } from 'react';
import { BarChart3, Brain, Newspaper, Building, Sparkles, TrendingUp, Activity } from 'lucide-react';
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
  const [activeSection, setActiveSection] = useState<string>('all');

  const handleSearch = async (symbol: string) => {
    setLoading(true);
    setError(null);
    setCurrentSymbol(symbol);
    setActiveSection('all');

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

  const sectionButtons = [
    { id: 'all', label: 'All Data', icon: Activity },
    { id: 'chart', label: 'Price Chart', icon: BarChart3 },
    { id: 'overview', label: 'Company Info', icon: Building },
    { id: 'sentiment', label: 'Sentiment', icon: Brain },
    { id: 'news', label: 'News Feed', icon: Newspaper },
  ];

  const shouldShowSection = (section: string) => {
    if (activeSection === 'all') return true;
    return activeSection === section;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-75"></div>
                <div className="relative p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  StockPulseAI
                </h1>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  AI-Powered Stock Analytics Platform
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Live Market Data
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Search Section */}
          <div className="relative">
            <StockSearch onSearch={handleSearch} loading={loading} />
          </div>

          {/* Section Filter Buttons */}
          {!loading && (stockData || newsData || financialData) && (
            <div className="flex flex-wrap gap-3 justify-center">
              {sectionButtons.map((button) => {
                const Icon = button.icon;
                return (
                  <button
                    key={button.id}
                    onClick={() => setActiveSection(button.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                      activeSection === button.id
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105'
                        : 'bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-md hover:scale-105'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {button.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-20 animate-pulse"></div>
                  <LoadingSpinner size="lg" className="relative mx-auto text-blue-600" />
                </div>
                <p className="text-xl font-semibold text-gray-800 mb-2">Analyzing {currentSymbol}...</p>
                <p className="text-gray-600 flex items-center justify-center gap-2">
                  <Brain className="w-4 h-4 text-blue-600 animate-pulse" />
                  Fetching stock data, news, and sentiment analysis
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="animate-fade-in">
              <ErrorMessage message={error} onRetry={handleRetry} />
            </div>
          )}

          {/* Results */}
          {!loading && (stockData || newsData || financialData) && (
            <div className="space-y-8 animate-fade-in">
              {/* Top Row - Chart and Company Overview */}
              {(shouldShowSection('chart') || shouldShowSection('overview')) && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {stockData && shouldShowSection('chart') && (
                    <div className="lg:col-span-2 transform hover:scale-[1.02] transition-transform duration-200">
                      <StockChart data={stockData.prices} symbol={stockData.symbol} />
                    </div>
                  )}
                  {financialData?.overview && shouldShowSection('overview') && (
                    <div className="lg:col-span-1 transform hover:scale-[1.02] transition-transform duration-200">
                      <CompanyOverview overview={financialData.overview} />
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Row - Sentiment and News */}
              {(shouldShowSection('sentiment') || shouldShowSection('news')) && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {sentimentSummary && shouldShowSection('sentiment') && (
                    <div className="lg:col-span-1 transform hover:scale-[1.02] transition-transform duration-200">
                      <SentimentIndicator 
                        sentiment={sentimentSummary} 
                        symbol={currentSymbol} 
                      />
                    </div>
                  )}
                  {newsData && shouldShowSection('news') && (
                    <div className="lg:col-span-2 transform hover:scale-[1.02] transition-transform duration-200">
                      <NewsFeed articles={newsData.news} symbol={currentSymbol} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && !stockData && !newsData && !financialData && (
            <div className="text-center py-20 animate-fade-in">
              <div className="flex justify-center space-x-6 mb-8">
                {[
                  { icon: BarChart3, color: 'from-blue-500 to-blue-600', delay: '0s' },
                  { icon: Brain, color: 'from-green-500 to-green-600', delay: '0.2s' },
                  { icon: Newspaper, color: 'from-purple-500 to-purple-600', delay: '0.4s' },
                  { icon: Building, color: 'from-orange-500 to-orange-600', delay: '0.6s' },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="relative animate-bounce-slow" style={{ animationDelay: item.delay }}>
                      <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-2xl blur opacity-30`}></div>
                      <div className={`relative p-4 bg-gradient-to-r ${item.color} rounded-2xl shadow-lg`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                    </div>
                  );
                })}
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                Welcome to StockPulseAI
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Enter a stock symbol above to unlock real-time data, AI-powered sentiment analysis from financial news, 
                and comprehensive insights to help you navigate the market with confidence.
              </p>
              <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
                <TrendingUp className="w-4 h-4 text-green-500" />
                Powered by advanced AI and real-time market data
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative bg-white/60 backdrop-blur-lg border-t border-gray-200/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <p className="text-sm text-gray-600 font-medium">© 2025 StockPulseAI</p>
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
            </div>
            <p className="text-xs text-gray-500">
              Built with FastAPI and React • Powered by Alpha Vantage API and NewsAPI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
