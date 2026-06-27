export const DURATION_LABELS: Record<string, string> = {
  '3_hours': '3 Hours',
  'half_day': 'Half Day',
  'full_day': 'Full Day',
};

export const SYSTEM_INSTRUCTION = `You are an AI Day Planner Agent. 
Your goal is to inspire users about an area before planning, and then create concrete, realistic plans based on their chosen direction.
Always consider the likely current weather, season, and local vibe of the requested area.
Respond strictly in the requested JSON format.`;
