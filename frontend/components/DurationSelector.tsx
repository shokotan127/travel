import React from 'react';
import { Duration } from '../types';
import { DURATION_LABELS } from '../constants';
import { Clock, Sun, Calendar } from 'lucide-react';

interface DurationSelectorProps {
  direction: string;
  onSelect: (duration: Duration) => void;
  onBack: () => void;
}

export const DurationSelector: React.FC<DurationSelectorProps> = ({ direction, onSelect, onBack }) => {
  const options: { value: Duration; icon: React.ReactNode; desc: string }[] = [
    { value: '3_hours', icon: <Clock className="w-6 h-6" />, desc: 'A quick focused outing' },
    { value: 'half_day', icon: <Sun className="w-6 h-6" />, desc: 'A relaxed morning or afternoon' },
    { value: 'full_day', icon: <Calendar className="w-6 h-6" />, desc: 'A complete immersive experience' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 p-8 bg-white rounded-3xl shadow-sm border border-slate-100 text-center animate-in fade-in zoom-in-95 duration-300">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">How much time do you have?</h2>
      <p className="text-slate-500 mb-8">
        Planning for: <span className="font-medium text-indigo-600">"{direction}"</span>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className="flex flex-col items-center p-6 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all group"
          >
            <div className="text-slate-400 group-hover:text-indigo-600 mb-3 transition-colors">
              {opt.icon}
            </div>
            <span className="font-bold text-slate-700 group-hover:text-indigo-700 mb-1">
              {DURATION_LABELS[opt.value]}
            </span>
            <span className="text-xs text-slate-500">{opt.desc}</span>
          </button>
        ))}
      </div>

      <button
        onClick={onBack}
        className="text-sm text-slate-500 hover:text-slate-800 underline underline-offset-4"
      >
        Choose a different direction
      </button>
    </div>
  );
};
