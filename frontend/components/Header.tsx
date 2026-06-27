import React from 'react';
import { MapPin, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            AI Day Planner
          </h1>
        </div>
        <div className="flex items-center gap-1 text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          <Sparkles className="w-4 h-4" />
          <span>Agent</span>
        </div>
      </div>
    </header>
  );
};
