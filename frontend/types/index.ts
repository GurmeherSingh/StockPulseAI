export interface StockPrice {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockData {
  symbol: string;
  prices: StockPrice[];
}

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface NewsData {
  symbol: string;
  news: NewsArticle[];
}

export interface CompanyOverview {
  Symbol: string;
  Name: string;
  Description: string;
  MarketCapitalization: string;
  PERatio: string;
  DividendYield: string;
  '52WeekHigh': string;
  '52WeekLow': string;
}

export interface FinancialData {
  symbol: string;
  overview: CompanyOverview;
  income_statement: any;
  balance_sheet: any;
  cash_flow: any;
}

export interface SentimentSummary {
  positive: number;
  negative: number;
  neutral: number;
  overall: 'positive' | 'negative' | 'neutral';
}