
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { stockApi } from '../../services/api';
import { APILoaderWrapper } from './APILoaderWrapper';
import { formatCurrency, formatDate } from '../utils/format';

interface PriceChartProps {
  symbol: string;
}

export const PriceChart: React.FC<PriceChartProps> = ({ symbol }) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['stockData', symbol],
    queryFn: () => stockApi.getStockData(symbol),
    enabled: !!symbol,
  });

  const chartData = data?.prices?.map(price => ({
    ...price,
    formattedDate: formatDate(price.date),
  })) || [];

  const currentPrice = data?.prices?.[0]?.close || 0;
  const previousPrice = data?.prices?.[1]?.close || 0;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = ((priceChange / previousPrice) * 100);
  const isPositive = priceChange >= 0;

  return (
    <APILoaderWrapper
      isLoading={isLoading}
      error={error}
      data={data}
      onRetry={refetch}
      loadingMessage={`Fetching ${symbol} price data...`}
    >
      <motion.div
        className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200/50 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-3xl font-bold text-gray-900">{symbol}</h3>
            <div className="flex items-center space-x-3 mt-2">
              <span className="text-4xl font-bold text-gray-900">
                {formatCurrency(currentPrice)}
              </span>
              <motion.span 
                className={`flex items-center text-lg font-semibold px-3 py-1 rounded-full ${
                  isPositive 
                    ? 'text-green-700 bg-green-100' 
                    : 'text-red-700 bg-red-100'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                {isPositive ? '↗' : '↘'} {formatCurrency(Math.abs(priceChange))} ({Math.abs(priceChangePercent).toFixed(2)}%)
              </motion.span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 font-medium">7-Day Range</p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(Math.min(...(data?.prices?.map(d => d.low) || [0])))} - {formatCurrency(Math.max(...(data?.prices?.map(d => d.high) || [0])))}
            </p>
          </div>
        </div>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData.reverse()}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="formattedDate" 
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value: number) => [formatCurrency(value), 'Close Price']}
                labelStyle={{ color: '#374151', fontWeight: 'bold' }}
              />
              <Area
                type="monotone"
                dataKey="close"
                stroke="#0ea5e9"
                strokeWidth={3}
                fill="url(#colorPrice)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </APILoaderWrapper>
  );
};
