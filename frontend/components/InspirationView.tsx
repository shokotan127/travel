import React from 'react';
import { InspirationResponse, YouTubeVideo } from '../types';
import { CloudSun, Leaf, Users, Play, Compass, ArrowRight, Search } from 'lucide-react';

interface InspirationViewProps {
  area: string;
  data: InspirationResponse;
  youtubeData: Record<string, YouTubeVideo[]>;
  onSelectDirection: (direction: string) => void;
}

export const InspirationView: React.FC<InspirationViewProps> = ({ area, data, youtubeData, onSelectDirection }) => {
  // Check if there is at least one video across all queries
  const hasYouTubeVideos = Object.values(youtubeData).some(videos => videos && videos.length > 0);

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-slate-800">Inspiration for {area}</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">{data.areaSummary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weather & Nature */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center gap-3 text-amber-600 mb-2">
            <CloudSun className="w-6 h-6" />
            <h3 className="font-semibold text-lg">Today's Vibe</h3>
          </div>
          <p className="text-slate-700">{data.weatherSummary}</p>
          
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-emerald-600 mb-3">
              <Leaf className="w-5 h-5" />
              <h4 className="font-medium">Seasonal Hints</h4>
            </div>
            <ul className="space-y-2">
              {data.seasonalInspiration.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-emerald-400 mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-xs text-slate-400 mt-3 italic">*Nature events are possibilities, not guarantees.</p>
          </div>
        </div>

        {/* Culture & Media */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center gap-3 text-indigo-600 mb-2">
            <Users className="w-6 h-6" />
            <h3 className="font-semibold text-lg">Local Happenings</h3>
          </div>
          <ul className="space-y-2">
            {data.humanEvents.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="text-indigo-400 mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-red-500 mb-3">
              <Play className="w-5 h-5" />
              <h4 className="font-medium">Get the Vibe</h4>
            </div>
            
            {hasYouTubeVideos ? (
              <div className="grid grid-cols-1 gap-4">
                {data.youtubeSearches.map((query) => {
                  const videos = youtubeData[query];
                  if (!videos || videos.length === 0) return null;
                  return (
                    <div key={query} className="space-y-2">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Search className="w-3 h-3" /> {query}
                      </p>
                      <div className="flex gap-3 overflow-x-auto pb-2 snap-x custom-scrollbar">
                        {videos.map(v => (
                          <a key={v.id} href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener noreferrer" className="block w-48 shrink-0 snap-start group">
                            <div className="relative aspect-video rounded-lg overflow-hidden mb-1.5 bg-slate-100">
                              {v.thumbnailUrl && (
                                <img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                              )}
                              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                              <Play className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-white opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-md" />
                            </div>
                            <h5 className="text-xs font-medium text-slate-800 line-clamp-2 group-hover:text-red-600 transition-colors" title={v.title}>{v.title}</h5>
                            <p className="text-[10px] text-slate-500 truncate mt-0.5">{v.channelTitle}</p>
                          </a>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {data.youtubeSearches.map((query, idx) => (
                  <a
                    key={idx}
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-red-600 text-xs font-medium rounded-lg border border-slate-200 hover:border-red-200 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" />
                    {query}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Direction Selection */}
      <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100 mt-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Compass className="w-7 h-7 text-indigo-600" />
          <h3 className="text-2xl font-bold text-slate-800">Which direction calls to you?</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.directionOptions.map((direction, idx) => (
            <button
              key={idx}
              onClick={() => onSelectDirection(direction)}
              className="group flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md border border-transparent hover:border-indigo-200 transition-all text-left"
            >
              <span className="font-medium text-slate-700 group-hover:text-indigo-700">{direction}</span>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transform group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
