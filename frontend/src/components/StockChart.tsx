import React from 'react';
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
import { StockPrice } from '../../types';
import { formatCurrency, formatDate } from '../utils/format';

interface StockChartProps {
  data: StockPrice[];
  symbol: string;
}

export const StockChart: React.FC<StockChartProps> = ({ data, symbol }) => {
  const chartData = data.map(price => ({
    ...price,
    formattedDate: formatDate(price.date),
  }));

  const currentPrice = data[0]?.close || 0;
  const previousPrice = data[1]?.close || 0;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = ((priceChange / previousPrice) * 100);
  const isPositive = priceChange >= 0;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{symbol}</h3>
          <div className="flex items-center space-x-3 mt-1">
            <span className="text-3xl font-bold text-gray-900">
              {formatCurrency(currentPrice)}
            </span>
            <span className={`flex items-center text-sm font-medium px-2 py-1 rounded-full ${
              isPositive 
                ? 'text-success-700 bg-success-100' 
                : 'text-danger-700 bg-danger-100'
            }`}>
              {isPositive ? '↗' : '↘'} {formatCurrency(Math.abs(priceChange))} ({Math.abs(priceChangePercent).toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">7-Day Range</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatCurrency(Math.min(...data.map(d => d.low)))} - {formatCurrency(Math.max(...data.map(d => d.high)))}
          </p>
        </div>
      </div>

      <div className="h-80">
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
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: number) => [formatCurrency(value), 'Close Price']}
              labelStyle={{ color: '#374151' }}
            />
            <Area
              type="monotone"
              dataKey="close"
              stroke="#0ea5e9"
              strokeWidth={2}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};