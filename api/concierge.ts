// Serverless function (Vercel-compatible) that proxies requests to the Gemini API.
// The API key stays on the server and is never shipped to the browser.
//
// Local development is handled by a Vite middleware that forwards to the same
// handler — see vite.config.ts.
//
// Environment variable required: GEMINI_API_KEY

import { GoogleGenAI } from '@google/genai';

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

const MODEL = 'gemini-2.5-flash';

let aiSingleton: GoogleGenAI | null = null;
function getClient(): GoogleGenAI | null {
  if (aiSingleton) return aiSingleton;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') return null;
  aiSingleton = new GoogleGenAI({ apiKey });
  return aiSingleton;
}

export interface ConciergeRequestBody {
  prompt?: string;
}

export async function handleConcierge(body: ConciergeRequestBody): Promise<{ status: number; data: { text?: string; error?: string } }> {
  const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : '';
  if (!prompt) {
    return { status: 400, data: { error: 'Missing "prompt" string in request body.' } };
  }
  if (prompt.length > 4000) {
    return { status: 413, data: { error: 'Prompt too long.' } };
  }

  const client = getClient();
  if (!client) {
    return { status: 503, data: { error: 'Concierge is not configured.' } };
  }

  try {
    const response = await client.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
    return { status: 200, data: { text: response.text ?? '' } };
  } catch (error) {
    console.error('[concierge] Gemini API error:', error);
    return { status: 502, data: { error: 'Upstream concierge service unavailable.' } };
  }
}

// Vercel / Next-style default export ------------------------------------------------
// Works under @vercel/node (req: IncomingMessage, res: ServerResponse).
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'POST');
    res.end('Method Not Allowed');
    return;
  }
  let body: ConciergeRequestBody = {};
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {});
  } catch {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Invalid JSON body.' }));
    return;
  }
  const { status, data } = await handleConcierge(body);
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}
