
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Building2, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { stockApi } from '../../services/api';
import { APILoaderWrapper } from './APILoaderWrapper';
import { formatMarketCap, formatCurrency } from '../utils/format';

interface CompanyFinancialsProps {
  symbol: string;
}

type SectionType = 'overview' | 'income' | 'balance' | 'cashflow';

export const CompanyFinancials: React.FC<CompanyFinancialsProps> = ({ symbol }) => {
  const [expandedSection, setExpandedSection] = useState<SectionType | null>('overview');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['companyFinancials', symbol],
    queryFn: () => stockApi.getCompanyFinancials(symbol),
    enabled: !!symbol,
  });

  const sections = [
    {
      id: 'overview' as SectionType,
      title: 'Company Overview',
      icon: Building2,
      data: data?.overview,
    },
    {
      id: 'income' as SectionType,
      title: 'Income Statement',
      icon: DollarSign,
      data: data?.income_statement,
    },
    {
      id: 'balance' as SectionType,
      title: 'Balance Sheet',
      icon: TrendingUp,
      data: data?.balance_sheet,
    },
    {
      id: 'cashflow' as SectionType,
      title: 'Cash Flow',
      icon: Calendar,
      data: data?.cash_flow,
    },
  ];

  const toggleSection = (sectionId: SectionType) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const renderOverview = (overview: any) => {
    if (!overview || !overview.Symbol) return <p className="text-gray-500">No overview data available</p>;

    const metrics = [
      { label: 'Market Cap', value: formatMarketCap(overview.MarketCapitalization || '0') },
      { label: 'P/E Ratio', value: overview.PERatio || 'N/A' },
      { label: 'Dividend Yield', value: overview.DividendYield ? `${overview.DividendYield}%` : 'N/A' },
      { label: '52W High', value: overview['52WeekHigh'] ? formatCurrency(parseFloat(overview['52WeekHigh'])) : 'N/A' },
      { label: '52W Low', value: overview['52WeekLow'] ? formatCurrency(parseFloat(overview['52WeekLow'])) : 'N/A' },
      { label: 'Beta', value: overview.Beta || 'N/A' },
    ];

    return (
      <div className="space-y-4">
        <div className="mb-4">
          <h4 className="text-xl font-bold text-gray-900 mb-1">{overview.Name}</h4>
          <p className="text-gray-600 text-sm">{overview.Exchange} • {overview.Sector} • {overview.Industry}</p>
        </div>
        
        {overview.Description && (
          <p className="text-gray-700 text-sm leading-relaxed mb-4">{overview.Description}</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              className="bg-gray-50 rounded-lg p-3 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
              <p className="font-bold text-gray-900">{metric.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderFinancialData = (data: any, type: string) => {
    if (!data || Object.keys(data).length === 0) {
      return <p className="text-gray-500">No {type} data available</p>;
    }

    // Extract key financial metrics based on type
    const getKeyMetrics = () => {
      switch (type) {
        case 'income':
          return [
            { label: 'Total Revenue', key: 'totalRevenue' },
            { label: 'Gross Profit', key: 'grossProfit' },
            { label: 'Operating Income', key: 'operatingIncome' },
            { label: 'Net Income', key: 'netIncome' },
          ];
        case 'balance':
          return [
            { label: 'Total Assets', key: 'totalAssets' },
            { label: 'Total Liabilities', key: 'totalLiabilities' },
            { label: 'Total Equity', key: 'totalShareholderEquity' },
            { label: 'Cash & Equivalents', key: 'cashAndCashEquivalentsAtCarryingValue' },
          ];
        case 'cashflow':
          return [
            { label: 'Operating Cash Flow', key: 'operatingCashflow' },
            { label: 'Investing Cash Flow', key: 'cashflowFromInvestment' },
            { label: 'Financing Cash Flow', key: 'cashflowFromFinancing' },
            { label: 'Free Cash Flow', key: 'freeCashFlow' },
          ];
        default:
          return [];
      }
    };

    const metrics = getKeyMetrics();
    const annualReports = data.annualReports || [];

    if (annualReports.length === 0) {
      return <p className="text-gray-500">No annual reports available</p>;
    }

    return (
      <div className="space-y-4">
        {annualReports.slice(0, 3).map((report: any, reportIndex: number) => (
          <motion.div
            key={reportIndex}
            className="border border-gray-200 rounded-lg p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reportIndex * 0.1 }}
          >
            <h5 className="font-semibold text-gray-900 mb-3">
              Fiscal Year {report.fiscalDateEnding?.split('-')[0] || 'Unknown'}
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {metrics.map((metric, index) => (
                <div key={index} className="bg-gray-50 rounded p-3">
                  <p className="text-xs text-gray-600 mb-1">{metric.label}</p>
                  <p className="font-semibold text-gray-900">
                    {report[metric.key] ? formatCurrency(parseInt(report[metric.key])) : 'N/A'}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <APILoaderWrapper
      isLoading={isLoading}
      error={error}
      data={data}
      onRetry={refetch}
      loadingMessage={`Loading ${symbol} financial data...`}
    >
      <motion.div
        className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900">Financial Information</h3>
          <p className="text-gray-600">Comprehensive financial analysis for {symbol}</p>
        </div>

        <div className="divide-y divide-gray-200">
          {sections.map((section, index) => {
            const Icon = section.icon;
            const isExpanded = expandedSection === section.id;

            return (
              <div key={section.id}>
                <motion.button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.8)' }}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">{section.title}</span>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        {section.id === 'overview' 
                          ? renderOverview(section.data)
                          : renderFinancialData(section.data, section.id)
                        }
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>
    </APILoaderWrapper>
  );
};
