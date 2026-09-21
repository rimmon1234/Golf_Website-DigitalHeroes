import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to Load Data',
  message = 'We encountered an issue retrieving charity information. Please try again.',
  onRetry
}) => {
  return (
    <div
      className="max-w-md mx-auto p-8 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center space-y-4 shadow-xl"
      role="alert"
    >
      <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div>
        <h3 className="font-display font-bold text-lg text-white">{title}</h3>
        <p className="text-xs text-rose-200/80 mt-1 leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-brand-400" /> Retry Request
        </button>
      )}
    </div>
  );
};

export default ErrorState;
