
import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface APILoaderWrapperProps {
  isLoading: boolean;
  error: Error | null;
  data: any;
  onRetry?: () => void;
  loadingMessage?: string;
  children: React.ReactNode;
}

export const APILoaderWrapper: React.FC<APILoaderWrapperProps> = ({
  isLoading,
  error,
  data,
  onRetry,
  loadingMessage = 'Loading...',
  children,
}) => {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-16 space-y-4"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-20 animate-pulse"></div>
          <LoadingSpinner size="lg" className="relative text-blue-600" />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800">{loadingMessage}</p>
          <p className="text-gray-600">Please wait while we fetch the data...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-red-50 border border-red-200 rounded-xl p-8 text-center"
      >
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Data</h3>
        <p className="text-red-600 mb-4">{error.message}</p>
        {onRetry && (
          <motion.button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </motion.button>
        )}
      </motion.div>
    );
  }

  if (!data) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <p className="text-gray-500">No data available</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};
