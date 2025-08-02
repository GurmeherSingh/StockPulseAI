import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BarChart3, Brain, Newspaper, Building, Sparkles, TrendingUp, Activity, ArrowRight } from 'lucide-react';
import { StockSearchBar } from './components/StockSearchBar';
import { Dashboard } from './components/Dashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const [selectedStock, setSelectedStock] = useState<string>('');
  const [showDashboard, setShowDashboard] = useState(false);

  const handleStockSelect = (symbol: string) => {
    setSelectedStock(symbol);
    setShowDashboard(true);
  };

  const handleBackToLanding = () => {
    setShowDashboard(false);
    setSelectedStock('');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"
            animate={{ 
              scale: [1.1, 1, 1.1],
              opacity: [0.5, 0.3, 0.5]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>

        <AnimatePresence mode="wait">
          {!showDashboard ? (
            <LandingPage key="landing" onStockSelect={handleStockSelect} />
          ) : (
            <Dashboard key="dashboard" selectedStock={selectedStock} onBack={handleBackToLanding} />
          )}
        </AnimatePresence>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

interface LandingPageProps {
  onStockSelect: (symbol: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStockSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div 
            className="flex items-center justify-between"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-75"></div>
                <div className="relative p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  StockPulse AI
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
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-20 lg:py-32">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-6">
              StockPulse AI
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Unlock market insights with AI-powered sentiment analysis, real-time data, and comprehensive financial analytics
            </p>
          </motion.div>

          {/* Feature Icons */}
          <motion.div 
            className="flex justify-center space-x-8 mb-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {[
              { icon: BarChart3, label: 'Real-time Charts', color: 'from-blue-500 to-blue-600' },
              { icon: Brain, label: 'AI Sentiment', color: 'from-green-500 to-green-600' },
              { icon: Newspaper, label: 'News Analysis', color: 'from-purple-500 to-purple-600' },
              { icon: Building, label: 'Company Data', color: 'from-orange-500 to-orange-600' },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={index}
                  className="text-center"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="relative mb-3">
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-2xl blur opacity-30`}></div>
                    <div className={`relative p-4 bg-gradient-to-r ${item.color} rounded-2xl shadow-lg`}>
                      <Icon className="w-8 h-8 text-white mx-auto" />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-700">{item.label}</p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Search Section */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            <StockSearchBar onStockSelect={onStockSelect} />

            <motion.button
              onClick={() => onStockSelect('AAPL')}
              className="mt-6 inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try with Apple (AAPL)
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              { label: 'Stocks Analyzed', value: '10,000+' },
              { label: 'News Articles Processed', value: '1M+' },
              { label: 'AI Accuracy', value: '94%' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative bg-white/60 backdrop-blur-lg border-t border-gray-200/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <p className="text-sm text-gray-600 font-medium">© 2025 StockPulse AI</p>
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
            </div>
            <p className="text-xs text-gray-500">
              Built with FastAPI and React • Powered by Alpha Vantage API and NewsAPI
            </p>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};

export default App;