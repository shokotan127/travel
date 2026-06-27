import React from 'react';
import { Sparkles } from 'lucide-react';

interface LoadingSpinnerProps {
  message: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-300">
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-indigo-600 animate-pulse">
          <Sparkles className="w-6 h-6" />
        </div>
      </div>
      <p className="text-lg font-medium text-slate-600 animate-pulse">{message}</p>
    </div>
  );
};
