import React, { useState } from 'react';
import { Search, Map } from 'lucide-react';

interface AreaInputProps {
  onSubmit: (area: string) => void;
}

export const AreaInput: React.FC<AreaInputProps> = ({ onSubmit }) => {
  const [area, setArea] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (area.trim()) {
      onSubmit(area.trim());
    }
  };

  const suggestions = ['Shibuya', 'Kamakura', 'Kyoto', 'Kona'];

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 mb-4">
          <Map className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Where to?</h2>
        <p className="text-slate-500">Enter an area to discover its possibilities today.</p>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
          placeholder="e.g., Kamakura, Harajuku, Kyoto..."
          required
        />
        <button
          type="submit"
          disabled={!area.trim()}
          className="absolute inset-y-2 right-2 px-6 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Explore
        </button>
      </form>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <span className="text-sm text-slate-400 mr-2">Try:</span>
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => setArea(s)}
            className="px-3 py-1 text-sm bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
};
