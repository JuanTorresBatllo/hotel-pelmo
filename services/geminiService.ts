// Client-side concierge service. Calls a backend proxy so the Gemini API key
// is never shipped to the browser.

const ENDPOINT = '/api/concierge';

export async function getConciergeResponse(prompt: string): Promise<string> {
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      // 503 = backend not configured (e.g. local dev without GEMINI_API_KEY).
      // Fall back to a friendly canned response so the UI still works.
      return simulateResponse(prompt);
    }

    const data = (await res.json()) as { text?: string; error?: string };
    if (data.error || !data.text) return simulateResponse(prompt);
    return data.text;
  } catch (error) {
    console.error('Concierge request failed:', error);
    return simulateResponse(prompt);
  }
}

function simulateResponse(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes('weather')) {
    return "Great question! Are you planning an outdoor activity, or just want to know how to dress? And are you here this week or planning a future trip? That way I can give you the most useful info 😊";
  }
  if (lower.includes('hik') || lower.includes('trail') || lower.includes('walk')) {
    return "I'd love to help you find the perfect trail! A couple of quick questions — what's your fitness level like (casual stroller, moderate, or experienced hiker)? And are you going solo or with family/kids? 🥾";
  }
  if (lower.includes('ski') || lower.includes('snow') || lower.includes('winter')) {
    return "Exciting — the slopes are calling! Before I recommend, are you a beginner, intermediate, or advanced skier? And are you looking for a full day out or just a few hours? ⛷️";
  }
  if (lower.includes('bike') || lower.includes('cycling') || lower.includes('mtb')) {
    return "Love it! Mountain biking here is incredible. Quick question — are you looking for an adrenaline downhill ride or more of a scenic tour? And do you have your own gear or would you need rentals? 🚵";
  }
  if (lower.includes('restaurant') || lower.includes('food') || lower.includes('din') || lower.includes('eat')) {
    return "Our Ristorante 1919 is a real gem! Are you looking for a romantic dinner, a family meal, or are you curious about local Cadore specialties? I can tailor my suggestions 🍽️";
  }
  return "Welcome! 👋 I can help with so many things — hiking trails, ski conditions, restaurant tips, wellness treatments, or cultural visits. What sounds most interesting to you? And tell me a bit about your group — couple, family, solo adventure?";
}
