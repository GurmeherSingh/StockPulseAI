import React from 'react';
import { Building2, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { CompanyOverview as CompanyOverviewType } from '../../types';
import { formatMarketCap, formatCurrency } from '../utils/format';

interface CompanyOverviewProps {
  overview: CompanyOverviewType;
}

export const CompanyOverview: React.FC<CompanyOverviewProps> = ({ overview }) => {
  if (!overview || !overview.Symbol) {
    return null;
  }

  const metrics = [
    {
      label: 'Market Cap',
      value: formatMarketCap(overview.MarketCapitalization || '0'),
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      label: 'P/E Ratio',
      value: overview.PERatio || 'N/A',
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      label: 'Dividend Yield',
      value: overview.DividendYield ? `${overview.DividendYield}%` : 'N/A',
      icon: <Calendar className="w-4 h-4" />,
    },
  ];

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-4">
        <Building2 className="w-6 h-6 text-primary-600" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{overview.Name}</h3>
          <p className="text-sm text-gray-500">{overview.Symbol}</p>
        </div>
      </div>

      {overview.Description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {overview.Description}
        </p>
      )}

      <div className="grid grid-cols-3 gap-4 mb-4">
        {metrics.map((metric, index) => (
          <div key={index} className="text-center">
            <div className="flex items-center justify-center text-gray-400 mb-1">
              {metric.icon}
            </div>
            <p className="text-sm font-medium text-gray-900">{metric.value}</p>
            <p className="text-xs text-gray-500">{metric.label}</p>
          </div>
        ))}
      </div>

      {(overview['52WeekHigh'] || overview['52WeekLow']) && (
        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-600 mb-2">52-Week Range</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(parseFloat(overview['52WeekLow'] || '0'))}
            </span>
            <div className="flex-1 mx-3 h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-primary-500 rounded-full" style={{ width: '60%' }} />
            </div>
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(parseFloat(overview['52WeekHigh'] || '0'))}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};