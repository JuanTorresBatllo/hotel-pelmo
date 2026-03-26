import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;
const ai = apiKey && apiKey !== 'PLACEHOLDER_API_KEY' ? new GoogleGenAI({ apiKey }) : null;

const SYSTEM_INSTRUCTION = `
You are the exclusive digital concierge for Hotel Al Pelmo, a mountain resort located in Pieve di Cadore, The Dolomites, Italy. Your tone is elegant, welcoming, highly professional, and concise.

Your primary goal is to assist guests with information regarding the hotel, local skiing, hiking, dining, and travel logistics.

CRITICAL INSTRUCTIONS:

1. STRICT LANGUAGE MATCHING: You must dynamically detect the language the user is speaking and reply in that EXACT same language. If they ask in German, reply in German. If they ask in Italian, reply in Italian. Do not default to English unless the user speaks English.

2. ZERO HALLUCINATION POLICY: You must ONLY provide information that is factually accurate regarding the region and the hotel.
- If a user asks for a restaurant, ski slope, or hiking trail that you are not 100% certain exists, DO NOT make one up.
- If you do not know the answer, you must politely decline by saying: "I want to ensure you have the most accurate information. Please reach out to our front desk or human concierge team at +39 0435 500900, and they will be delighted to assist you with this specific request."

3. SCOPE OF ASSISTANCE: You are a hospitality expert. If a user asks you to write code, solve math problems, or discuss politics/controversial topics, politely refuse and guide the conversation back to the hotel and the surrounding area.

4. FORMATTING: Keep your responses scannable. Use bullet points when listing multiple restaurants, slopes, or activities. Do not write massive walls of text.

CURRENT CONTEXT:
- Hotel Name: Hotel Al Pelmo
- Location: Pieve di Cadore, Belluno, Italia
- Contact: +39 0435 500900
`;

export async function getConciergeResponse(prompt: string) {
  if (!ai) {
    return simulateResponse(prompt);
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text || "I apologize, I'm having trouble connecting to the concierge desk right now. How else may I assist you?";
  } catch (error) {
    console.error("Gemini API Error:", error);
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