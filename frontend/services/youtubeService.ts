import { YouTubeVideo } from '../types';

const getYoutubeApiKey = () => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env.YOUTUBE_API_KEY || '';
    }
  } catch (e) {}
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      return (import.meta as any).env.VITE_YOUTUBE_API_KEY || (import.meta as any).env.YOUTUBE_API_KEY || '';
    }
  } catch (e) {}
  return '';
};

export const fetchVideosForQueries = async (queries: string[]): Promise<Record<string, YouTubeVideo[]>> => {
  const apiKey = getYoutubeApiKey();
  const results: Record<string, YouTubeVideo[]> = {};
  
  if (!apiKey) {
    console.warn("YOUTUBE_API_KEY is not set. Falling back to search links.");
    return results;
  }

  await Promise.all(queries.map(async (query) => {
    try {
      const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=2&q=${encodeURIComponent(query)}&type=video&key=${apiKey}`);
      if (res.ok) {
        const data = await res.json();
        if (data.items) {
          const videos = data.items
            .filter((item: any) => item.id && item.id.videoId)
            .map((item: any) => ({
              id: item.id.videoId,
              title: item.snippet.title,
              thumbnailUrl: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || '',
              channelTitle: item.snippet.channelTitle
            }));
          
          if (videos.length > 0) {
            results[query] = videos;
          }
        }
      } else {
        console.error(`YouTube API error: ${res.status}`);
      }
    } catch (e) {
      console.error(`Failed to fetch YouTube videos for query: ${query}`, e);
    }
  }));

  return results;
};
