
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, ChevronDown } from 'lucide-react';

interface StockSearchBarProps {
  onStockSelect: (symbol: string) => void;
}

const POPULAR_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'TSLA', name: 'Tesla, Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'META', name: 'Meta Platforms Inc.' },
  { symbol: 'NFLX', name: 'Netflix Inc.' },
];

export const StockSearchBar: React.FC<StockSearchBarProps> = ({ onStockSelect }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredStocks, setFilteredStocks] = useState(POPULAR_STOCKS);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = POPULAR_STOCKS.filter(
        stock => 
          stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
          stock.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredStocks(filtered);
      setIsOpen(true);
    } else {
      setFilteredStocks(POPULAR_STOCKS);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStockSelect = (symbol: string) => {
    setQuery(symbol);
    setIsOpen(false);
    onStockSelect(symbol);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onStockSelect(query.trim().toUpperCase());
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <motion.div 
        className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden"
        whileHover={{ shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
        transition={{ duration: 0.2 }}
      >
        <form onSubmit={handleSubmit} className="flex items-center">
          <div className="flex items-center flex-1 px-6 py-4">
            <Search className="w-6 h-6 text-gray-400 mr-4" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsOpen(true)}
              placeholder="Enter stock symbol (e.g., AAPL, TSLA, GOOGL)"
              className="flex-1 text-lg font-medium bg-transparent border-none outline-none placeholder-gray-400 text-gray-900"
            />
            <motion.button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </motion.button>
          </div>
          <motion.button
            type="submit"
            className="mx-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!query.trim()}
          >
            Analyze
          </motion.button>
        </form>
      </motion.div>

      {/* Dropdown */}
      <AnimatePresence>
        {(isOpen || query.length === 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-gray-200/50 overflow-hidden z-50"
          >
            <div className="p-4">
              <div className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
                {query.length > 0 ? 'Search Results' : 'Popular Stocks'}
              </div>
              <div className="grid grid-cols-1 gap-1 max-h-64 overflow-y-auto">
                {filteredStocks.map((stock) => (
                  <motion.button
                    key={stock.symbol}
                    onClick={() => handleStockSelect(stock.symbol)}
                    className="flex items-center justify-between p-3 text-left hover:bg-blue-50 rounded-lg transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div>
                      <div className="font-semibold text-gray-900">{stock.symbol}</div>
                      <div className="text-sm text-gray-600 truncate">{stock.name}</div>
                    </div>
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
