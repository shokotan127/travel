import { GoogleGenAI, Type } from '@google/genai';
import { InspirationResponse, PlanResponse, Duration } from '../types';
import { SYSTEM_INSTRUCTION } from '../constants';

// Initialize the Gemini client strictly using process.env.API_KEY and vertexai: true
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });
const MODEL_NAME = 'gemini-2.5-flash';

const fetchWithRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await operation();
    } catch (error: any) {
      attempt++;
      console.error(`API call failed (attempt ${attempt}/${maxRetries}):`, error);
      
      const status = error?.status || error?.response?.status;
      // Do not retry on 4xx errors except 429 (Too Many Requests)
      if (status && status >= 400 && status < 500 && status !== 429) {
        throw error;
      }

      if (attempt >= maxRetries) {
        throw error;
      }
      
      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error("Unexpected end of retry loop");
};

const cleanJsonResponse = (text: string): string => {
  let jsonStr = text.trim();
  if (jsonStr.startsWith('```json')) {
    jsonStr = jsonStr.substring(7);
  } else if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.substring(3);
  }
  if (jsonStr.endsWith('```')) {
    jsonStr = jsonStr.substring(0, jsonStr.length - 3);
  }
  return jsonStr.trim();
};

export const getAreaInspiration = async (area: string): Promise<InspirationResponse> => {
  const prompt = `Provide inspiration for a day trip or outing in the area: "${area}".
  
  Include:
  1. A brief summary of what makes this area special.
  2. A plausible weather summary for today (make a reasonable guess based on typical current conditions, e.g., "Sunny and pleasant, perfect for walking").
  3. 2-3 seasonal or natural events that might be happening (e.g., "Hydrangeas might be blooming", "Good chance of a clear sunset").
  4. 2-3 types of human-made events or activities likely happening (e.g., "Local farmers market", "Live music in cafes").
  5. 3 YouTube search queries that would give a good vibe of the area (e.g., "${area} cafe vlog").
  6. 3-4 distinct "directions" or themes the user could choose for their day (e.g., "Enjoy nature and sunset", "Cafe hopping and culture", "Active exploration").`;

  const response = await fetchWithRetry(() => ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          areaSummary: { type: Type.STRING, description: "Brief summary of the area's appeal." },
          weatherSummary: { type: Type.STRING, description: "Plausible current weather summary." },
          seasonalInspiration: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of seasonal or natural events."
          },
          humanEvents: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of human-made events or activities."
          },
          youtubeSearches: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of YouTube search queries."
          },
          directionOptions: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of distinct directions or themes for the day."
          },
        },
        required: ["areaSummary", "weatherSummary", "seasonalInspiration", "humanEvents", "youtubeSearches", "directionOptions"],
      },
    },
  }));

  if (!response.text) {
    throw new Error("Failed to generate inspiration: Empty response from model.");
  }

  const jsonStr = cleanJsonResponse(response.text);

  try {
    return JSON.parse(jsonStr) as InspirationResponse;
  } catch (e) {
    console.error("Failed to parse inspiration response. Raw text:", response.text);
    throw new Error("Failed to parse inspiration response from the model.");
  }
};

export const getDayPlan = async (
  area: string,
  direction: string,
  duration: Duration,
  weather: string
): Promise<PlanResponse> => {
  const durationText = duration.replace('_', ' ');
  const prompt = `Create a concrete ${durationText} plan for "${area}".
  
  Context:
  - Chosen Direction: "${direction}"
  - Assumed Weather: "${weather}"
  
  Requirements:
  1. Define a clear "Mission" for the day based on the direction.
  2. Explain "Why" this plan is good today (incorporating weather and direction).
  3. Provide a timeline of activities. For a 3-hour plan, provide 2-3 items. For half-day, 3-4 items. For full-day, 5-7 items.
  4. For each timeline item, provide a specific time (e.g., "13:00"), a description of the activity, and a highly relevant search query (e.g., "${area} best coffee roaster") that the user can use to find specific places on Google Maps.`;

  const response = await fetchWithRetry(() => ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          mission: { type: Type.STRING, description: "The overarching mission for the plan." },
          why: { type: Type.STRING, description: "Why this plan is recommended today." },
          timeline: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING, description: "Time of the activity, e.g., 10:00" },
                activity: { type: Type.STRING, description: "Description of what to do." },
                searchQuery: { type: Type.STRING, description: "A search query to find this place/activity." },
              },
              required: ["time", "activity", "searchQuery"],
            },
            description: "Chronological list of activities."
          },
        },
        required: ["mission", "why", "timeline"],
      },
    },
  }));

  if (!response.text) {
    throw new Error("Failed to generate plan: Empty response from model.");
  }

  const jsonStr = cleanJsonResponse(response.text);

  try {
    return JSON.parse(jsonStr) as PlanResponse;
  } catch (e) {
    console.error("Failed to parse plan response. Raw text:", response.text);
    throw new Error("Failed to parse plan response from the model.");
  }
};
