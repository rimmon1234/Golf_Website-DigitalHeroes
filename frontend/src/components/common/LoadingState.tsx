import React from 'react';

interface LoadingStateProps {
  message?: string;
  count?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading verified organizations...',
  count = 4
}) => {
  return (
    <div className="w-full space-y-6" role="status" aria-live="polite">
      <div className="sr-only">{message}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg animate-pulse flex flex-col justify-between"
          >
            <div>
              <div className="h-48 bg-slate-800/60 w-full"></div>
              <div className="p-6 space-y-3">
                <div className="h-4 bg-slate-800 w-1/3 rounded-full"></div>
                <div className="h-6 bg-slate-800 w-3/4 rounded-lg"></div>
                <div className="space-y-2 pt-2">
                  <div className="h-3 bg-slate-800/70 w-full rounded"></div>
                  <div className="h-3 bg-slate-800/70 w-5/6 rounded"></div>
                </div>
              </div>
            </div>
            <div className="p-6 pt-0 border-t border-slate-800/40 mt-4 flex items-center justify-between">
              <div className="h-4 bg-slate-800 w-24 rounded"></div>
              <div className="h-8 bg-slate-800 w-24 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingState;
