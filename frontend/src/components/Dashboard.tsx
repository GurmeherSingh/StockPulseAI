
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart3, Brain, Newspaper, Building, Activity } from 'lucide-react';
import { StockSearchBar } from './StockSearchBar';
import { PriceChart } from './PriceChart';
import { SentimentNews } from './SentimentNews';
import { CompanyFinancials } from './CompanyFinancials';
import { AISummary } from './AISummary';

interface DashboardProps {
  selectedStock: string;
  onBack: () => void;
}

type TabType = 'price' | 'sentiment' | 'financials' | 'ai';

export const Dashboard: React.FC<DashboardProps> = ({ selectedStock, onBack }) => {
  const [activeTab, setActiveTab] = useState<TabType>('price');
  const [currentStock, setCurrentStock] = useState(selectedStock);

  const tabs = [
    { id: 'price' as TabType, label: 'Price Data', icon: BarChart3, color: 'blue' },
    { id: 'sentiment' as TabType, label: 'Sentiment News', icon: Brain, color: 'green' },
    { id: 'financials' as TabType, label: 'Company Financials', icon: Building, color: 'purple' },
    { id: 'ai' as TabType, label: 'AI Summary', icon: Activity, color: 'orange' },
  ];

  const handleStockChange = (symbol: string) => {
    setCurrentStock(symbol);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'price':
        return <PriceChart symbol={currentStock} />;
      case 'sentiment':
        return <SentimentNews symbol={currentStock} />;
      case 'financials':
        return <CompanyFinancials symbol={currentStock} />;
      case 'ai':
        return <AISummary symbol={currentStock} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen"
    >
      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Landing
            </motion.button>
            
            <div className="flex-1 max-w-2xl mx-8">
              <StockSearchBar onStockSelect={handleStockChange} />
            </div>

            <div className="text-right">
              <h2 className="text-2xl font-bold text-gray-900">{currentStock}</h2>
              <p className="text-sm text-gray-600">Live Analysis</p>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  isActive
                    ? `bg-gradient-to-r from-${tab.color}-600 to-${tab.color}-700 text-white shadow-lg`
                    : 'bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-md'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={false}
                animate={isActive ? { scale: 1.05 } : { scale: 1 }}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </motion.button>
            );
          })}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </motion.div>
  );
};
