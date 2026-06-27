export interface InspirationResponse {
  areaSummary: string;
  weatherSummary: string;
  seasonalInspiration: string[];
  humanEvents: string[];
  youtubeSearches: string[];
  directionOptions: string[];
}

export interface TimelineItem {
  time: string;
  activity: string;
  searchQuery: string;
}

export interface PlanResponse {
  mission: string;
  why: string;
  timeline: TimelineItem[];
}

export type Duration = '3_hours' | 'half_day' | 'full_day';

export type AppStep = 'input' | 'loading_inspiration' | 'inspiration' | 'loading_plan' | 'plan';

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnailUrl: string;
  channelTitle: string;
}
