import React from 'react';
import { Heart, Info } from 'lucide-react';

interface ContributionControlProps {
  value: number;
  onChange: (val: number) => void;
  disabled?: boolean;
}

export const ContributionControl: React.FC<ContributionControlProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  const presets = [10, 15, 25, 50, 100];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseFloat(e.target.value);
    if (!isNaN(num)) {
      onChange(Math.min(100, Math.max(10, num)));
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
            <Heart className="w-4 h-4 fill-brand-400" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-white">Charity Allocation Share</h3>
            <p className="text-xs text-slate-400">
              Select what percentage of your membership fee supports your designated charity.
            </p>
          </div>
        </div>

        {/* Current Percentage Display */}
        <div className="px-4 py-2 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-right">
          <div className="font-mono font-black text-2xl text-brand-400 leading-none">
            {value}%
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Allocation
          </span>
        </div>
      </div>

      {/* Interactive Slider */}
      <div className="space-y-3">
        <div className="relative">
          <input
            type="range"
            min={10}
            max={100}
            step={1}
            value={value}
            disabled={disabled}
            onChange={handleSliderChange}
            aria-label="Charity contribution percentage"
            className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-brand-400 disabled:opacity-50"
          />
        </div>

        {/* Preset Chips */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              disabled={disabled}
              onClick={() => onChange(preset)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                value === preset
                  ? 'bg-brand-500 text-slate-950 font-bold shadow-md shadow-brand-500/20'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {preset}% {preset === 10 && <span className="text-[10px] font-normal">(Min)</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Safety & Compliance Notice */}
      <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/90 flex items-start gap-3 text-xs text-slate-400 leading-relaxed">
        <Info className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
        <div>
          <span className="text-slate-200 font-semibold">Minimum 10% Contribution Guaranteed:</span>{' '}
          All Digital Heroes subscriptions allocate at least 10% of revenue to your chosen charity.
          Actual payment processing and monetary distribution will take effect with Stripe membership
          in Phase 4.
        </div>
      </div>
    </div>
  );
};

export default ContributionControl;
