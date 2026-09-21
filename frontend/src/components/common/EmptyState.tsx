import React from 'react';
import { Link } from 'react-router-dom';
import { SearchX, LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionText?: string;
  actionTo?: string;
  onAction?: () => void;
  icon?: LucideIcon;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Organizations Found',
  message = 'No charities match your current search terms or category selection.',
  actionText = 'Reset Search Filters',
  actionTo,
  onAction,
  icon: Icon = SearchX
}) => {
  return (
    <div className="max-w-md mx-auto p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-4 shadow-xl">
      <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="font-display font-bold text-lg text-white">{title}</h3>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{message}</p>
      </div>

      {actionTo ? (
        <Link
          to={actionTo}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-brand-300 text-xs font-semibold border border-slate-700 transition"
        >
          {actionText}
        </Link>
      ) : onAction ? (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-brand-300 text-xs font-semibold border border-slate-700 transition cursor-pointer"
        >
          {actionText}
        </button>
      ) : null}
    </div>
  );
};

export default EmptyState;
