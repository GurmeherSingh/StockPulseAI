import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="card border-danger-200 bg-danger-50">
      <div className="flex items-center space-x-3">
        <AlertCircle className="w-5 h-5 text-danger-600" />
        <div className="flex-1">
          <p className="text-danger-800 font-medium">Error</p>
          <p className="text-danger-700 text-sm">{message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn-secondary text-sm"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};