import React from 'react';
import { CharityEvent } from '../../types/charity.js';
import { Calendar, Clock, Sparkles } from 'lucide-react';

interface CharityEventsProps {
  events: CharityEvent[];
}

export const CharityEvents: React.FC<CharityEventsProps> = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-full bg-slate-800/60 flex items-center justify-center text-slate-500">
          <Calendar className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="font-display font-semibold text-sm text-slate-300">No Upcoming Events</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            This charity currently has no scheduled community events or tournaments. Check back soon for announcements.
          </p>
        </div>
      </div>
    );
  }

  // Sort events by date ascending if available
  const sortedEvents = [...events].sort((a, b) => {
    if (!a.event_date) return 1;
    if (!b.event_date) return -1;
    return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
  });

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Date TBA';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-brand-400 font-bold">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Charity Initiatives & Events ({sortedEvents.length})</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedEvents.map((evt) => (
          <div
            key={evt.id}
            className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 transition flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-500/10 text-brand-300 text-xs font-semibold">
                <Calendar className="w-3.5 h-3.5 text-brand-400" />
                <span>{formatDate(evt.event_date)}</span>
              </div>
              <h4 className="font-display font-bold text-base text-white">{evt.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {evt.description || 'Community engagement event supported by subscribers and volunteers.'}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/60 flex items-center gap-1.5 text-[11px] text-slate-500">
              <Clock className="w-3 h-3" />
              <span>Registered Charity Event</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharityEvents;
