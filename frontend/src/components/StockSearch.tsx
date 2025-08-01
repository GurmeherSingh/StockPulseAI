import React, { useState } from 'react';
import { Search, TrendingUp } from 'lucide-react';

interface StockSearchProps {
  onSearch: (symbol: string) => void;
  loading?: boolean;
}

const POPULAR_STOCKS = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA'];

export const StockSearch: React.FC<StockSearchProps> = ({ onSearch, loading }) => {
  const [symbol, setSymbol] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symbol.trim()) {
      onSearch(symbol.trim().toUpperCase());
    }
  };

  const handlePopularStock = (stock: string) => {
    setSymbol(stock);
    onSearch(stock);
  };

  return (
    <div className="card card-hover">
      <div className="flex items-center space-x-3 mb-4">
        <TrendingUp className="w-6 h-6 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-900">Stock Analysis</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="Enter stock symbol (e.g., AAPL)"
            className="input-field pl-10 pr-4 py-3 text-lg"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !symbol.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary px-6"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </form>

      <div>
        <p className="text-sm text-gray-600 mb-2">Popular stocks:</p>
        <div className="flex flex-wrap gap-2">
          {POPULAR_STOCKS.map((stock) => (
            <button
              key={stock}
              onClick={() => handlePopularStock(stock)}
              disabled={loading}
              className="btn-secondary text-sm px-3 py-1 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200"
            >
              {stock}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};