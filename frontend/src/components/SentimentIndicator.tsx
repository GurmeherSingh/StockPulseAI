import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { SentimentSummary } from '../../types';

interface SentimentIndicatorProps {
  sentiment: SentimentSummary;
  symbol: string;
}

export const SentimentIndicator: React.FC<SentimentIndicatorProps> = ({ sentiment, symbol }) => {
  const getIndicatorColor = () => {
    switch (sentiment.overall) {
      case 'positive':
        return 'bg-success-500';
      case 'negative':
        return 'bg-danger-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getIcon = () => {
    switch (sentiment.overall) {
      case 'positive':
        return <TrendingUp className="w-5 h-5" />;
      case 'negative':
        return <TrendingDown className="w-5 h-5" />;
      default:
        return <Minus className="w-5 h-5" />;
    }
  };

  const getTextColor = () => {
    switch (sentiment.overall) {
      case 'positive':
        return 'text-success-700';
      case 'negative':
        return 'text-danger-700';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Market Sentiment</h3>
        <div className={`w-4 h-4 rounded-full ${getIndicatorColor()} animate-pulse-slow`} />
      </div>

      <div className="flex items-center space-x-3 mb-4">
        <div className={`p-2 rounded-full ${sentiment.overall === 'positive' ? 'bg-success-100' : sentiment.overall === 'negative' ? 'bg-danger-100' : 'bg-gray-100'}`}>
          <div className={getTextColor()}>
            {getIcon()}
          </div>
        </div>
        <div>
          <p className={`text-xl font-bold ${getTextColor()} capitalize`}>
            {sentiment.overall}
          </p>
          <p className="text-sm text-gray-500">Overall sentiment for {symbol}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Positive</span>
          <div className="flex items-center space-x-2">
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-success-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${sentiment.positive}%` }}
              />
            </div>
            <span className="text-sm font-medium text-success-600">{sentiment.positive}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Negative</span>
          <div className="flex items-center space-x-2">
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-danger-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${sentiment.negative}%` }}
              />
            </div>
            <span className="text-sm font-medium text-danger-600">{sentiment.negative}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Neutral</span>
          <div className="flex items-center space-x-2">
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gray-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${sentiment.neutral}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-600">{sentiment.neutral}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};