
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ExternalLink, Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { stockApi } from '../../services/api';
import { APILoaderWrapper } from './APILoaderWrapper';
import { formatDateTime } from '../utils/format';
import { getSentimentColor, getSentimentIcon } from '../utils/sentiment';

interface SentimentNewsProps {
  symbol: string;
}

export const SentimentNews: React.FC<SentimentNewsProps> = ({ symbol }) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['stockNews', symbol],
    queryFn: () => stockApi.getStockNews(symbol),
    enabled: !!symbol,
  });

  const articles = data?.news || [];

  const sentimentCounts = articles.reduce((acc, article) => {
    acc[article.sentiment] = (acc[article.sentiment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return <TrendingUp className="w-4 h-4" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  return (
    <APILoaderWrapper
      isLoading={isLoading}
      error={error}
      data={data}
      onRetry={refetch}
      loadingMessage={`Analyzing ${symbol} news sentiment...`}
    >
      <div className="space-y-6">
        {/* Sentiment Summary */}
        <motion.div
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200/50 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Sentiment Overview</h3>
          <div className="grid grid-cols-3 gap-4">
            {['positive', 'neutral', 'negative'].map((sentiment) => (
              <motion.div
                key={sentiment}
                className={`text-center p-4 rounded-xl ${
                  sentiment === 'positive' ? 'bg-green-50 border border-green-200' :
                  sentiment === 'negative' ? 'bg-red-50 border border-red-200' :
                  'bg-gray-50 border border-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                <div className={`flex items-center justify-center mb-2 ${
                  sentiment === 'positive' ? 'text-green-600' :
                  sentiment === 'negative' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {getSentimentIcon(sentiment)}
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {sentimentCounts[sentiment] || 0}
                </div>
                <div className="text-sm text-gray-600 capitalize">{sentiment}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* News Articles */}
        <motion.div
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200/50 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Latest News</h3>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {articles.length} articles
            </span>
          </div>

          {articles.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent news found for {symbol}</p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {articles.map((article, index) => (
                <motion.div
                  key={index}
                  className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-md transition-all duration-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 pr-4">
                      <h4 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                        {article.title}
                      </h4>
                      {article.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {article.description}
                        </p>
                      )}
                    </div>
                    <div className={`ml-3 px-3 py-1 rounded-full text-xs font-medium border ${getSentimentColor(article.sentiment)}`}>
                      {getSentimentIcon(article.sentiment)} {article.sentiment}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDateTime(article.publishedAt)}
                    </div>
                    <motion.a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-xs text-blue-600 hover:text-blue-700 font-medium"
                      whileHover={{ scale: 1.05 }}
                    >
                      Read more
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </motion.a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </APILoaderWrapper>
  );
};
