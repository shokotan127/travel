import React from 'react';
import { PlanResponse } from '../types';
import { Target, Lightbulb, MapPin, Play, Search, CalendarPlus } from 'lucide-react';

interface PlanViewProps {
  area: string;
  plan: PlanResponse;
  onReset: () => void;
}

export const PlanView: React.FC<PlanViewProps> = ({ area, plan, onReset }) => {
  return (
    <div className="w-full max-w-3xl mx-auto mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-12">
      
      {/* Mission Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-indigo-200 mb-3">
            <Target className="w-5 h-5" />
            <span className="font-semibold tracking-wider uppercase text-sm">Today's Mission</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
            {plan.mission}
          </h2>
          <div className="flex items-start gap-3 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
            <Lightbulb className="w-6 h-6 text-amber-300 shrink-0 mt-0.5" />
            <p className="text-indigo-50 leading-relaxed">
              {plan.why}
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <h3 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
          <MapPin className="w-6 h-6 text-indigo-500" />
          Your Itinerary in {area}
        </h3>
        
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
          {plan.timeline.map((item, idx) => (
            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              
              {/* Timeline Dot */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-indigo-100 text-indigo-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>
              </div>
              
              {/* Content Card */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-5 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded text-sm">
                    {item.time}
                  </span>
                </div>
                <p className="text-slate-700 font-medium mb-4">{item.activity}</p>
                
                {/* Action Links */}
                <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-200">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.searchQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-blue-200 transition-colors"
                  >
                    <Search className="w-3.5 h-3.5" />
                    Maps
                  </a>
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(item.searchQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-red-600 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-red-200 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" />
                    YouTube Search
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors"
        >
          <CalendarPlus className="w-5 h-5" />
          Plan Another Day
        </button>
      </div>
    </div>
  );
};
