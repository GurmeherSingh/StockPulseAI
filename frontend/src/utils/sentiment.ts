import { NewsArticle, SentimentSummary } from '../../types';

export const calculateSentimentSummary = (articles: NewsArticle[]): SentimentSummary => {
  const total = articles.length;
  if (total === 0) {
    return { positive: 0, negative: 0, neutral: 0, overall: 'neutral' };
  }

  const positive = articles.filter(article => article.sentiment === 'positive').length;
  const negative = articles.filter(article => article.sentiment === 'negative').length;
  const neutral = articles.filter(article => article.sentiment === 'neutral').length;

  const positivePercent = (positive / total) * 100;
  const negativePercent = (negative / total) * 100;

  let overall: 'positive' | 'negative' | 'neutral' = 'neutral';
  if (positivePercent > negativePercent && positivePercent > 40) {
    overall = 'positive';
  } else if (negativePercent > positivePercent && negativePercent > 40) {
    overall = 'negative';
  }

  return {
    positive: Math.round(positivePercent),
    negative: Math.round(negativePercent),
    neutral: Math.round((neutral / total) * 100),
    overall,
  };
};

export const getSentimentColor = (sentiment: string) => {
  switch (sentiment) {
    case 'positive':
      return 'text-success-600 bg-success-50';
    case 'negative':
      return 'text-danger-600 bg-danger-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export const getSentimentIcon = (sentiment: string) => {
  switch (sentiment) {
    case 'positive':
      return '📈';
    case 'negative':
      return '📉';
    default:
      return '➖';
  }
};