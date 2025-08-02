
import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, TrendingUp, AlertTriangle, Info } from 'lucide-react';

interface AISummaryProps {
  symbol: string;
}

export const AISummary: React.FC<AISummaryProps> = ({ symbol }) => {
  // Placeholder data - in a real implementation, this would come from an ML API
  const mockInsights = [
    {
      type: 'bullish',
      title: 'Strong Technical Indicators',
      description: 'Moving averages suggest an upward trend with RSI indicating room for growth.',
      confidence: 85,
    },
    {
      type: 'neutral',
      title: 'Mixed Sentiment Analysis',
      description: 'Recent news sentiment shows balanced positive and negative coverage.',
      confidence: 72,
    },
    {
      type: 'bearish',
      title: 'Valuation Concerns',
      description: 'P/E ratio indicates the stock may be trading above historical averages.',
      confidence: 68,
    },
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'bullish':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'bearish':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'bullish':
        return 'border-green-200 bg-green-50';
      case 'bearish':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200/50 p-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">AI-Powered Analysis</h3>
            <p className="text-gray-600">Intelligent insights for {symbol}</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-purple-800">Coming Soon</span>
          </div>
          <p className="text-purple-700 text-sm">
            Advanced machine learning models will provide comprehensive stock analysis, 
            combining technical indicators, sentiment analysis, and market trends.
          </p>
        </div>

        {/* Mock Overall Score */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-3 bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">7.2</div>
              <div className="text-sm text-gray-600">AI Score</div>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="text-left">
              <div className="text-sm font-medium text-gray-900">Investment Outlook</div>
              <div className="text-sm text-blue-600">Moderately Bullish</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mock Insights */}
      <motion.div
        className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200/50 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h4 className="text-xl font-bold text-gray-900 mb-4">Key Insights</h4>
        <div className="space-y-4">
          {mockInsights.map((insight, index) => (
            <motion.div
              key={index}
              className={`border rounded-xl p-4 ${getInsightColor(insight.type)}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start space-x-3">
                {getInsightIcon(insight.type)}
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-900 mb-1">{insight.title}</h5>
                  <p className="text-gray-700 text-sm mb-2">{insight.description}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-600">Confidence:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-24">
                      <motion.div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${insight.confidence}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-900">{insight.confidence}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Feature Preview */}
      <motion.div
        className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h4 className="text-xl font-bold mb-3">What's Coming Next?</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Real-time sentiment scoring</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Technical pattern recognition</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Risk assessment algorithms</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Price prediction models</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Portfolio optimization</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Personalized recommendations</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
