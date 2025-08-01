import React from 'react';
import { ExternalLink, Clock } from 'lucide-react';
import { NewsArticle } from '../../types';
import { getSentimentColor, getSentimentIcon } from '../utils/sentiment';

import { formatDateTime } from '../utils/format';

interface NewsFeedProps {
  articles: NewsArticle[];
  symbol: string;
}

export const NewsFeed: React.FC<NewsFeedProps> = ({ articles, symbol }) => {
  if (articles.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest News</h3>
        <p className="text-gray-500 text-center py-8">No recent news found for {symbol}</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Latest News</h3>
        <span className="text-sm text-gray-500">{articles.length} articles</span>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {articles.map((article, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors duration-200"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 line-clamp-2 mb-1">
                  {article.title}
                </h4>
                {article.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {article.description}
                  </p>
                )}
              </div>
              <div className={`ml-3 px-2 py-1 rounded-full text-xs font-medium border ${getSentimentColor(article.sentiment)}`}>
                {getSentimentIcon(article.sentiment)} {article.sentiment}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                {formatDateTime(article.publishedAt)}
              </div>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-xs text-primary-600 hover:text-primary-700 font-medium"
              >
                Read more
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};