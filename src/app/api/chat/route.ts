import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not set in environment variables.' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // YatraRide system prompt
    const systemPrompt = `You are the official AI Assistant for YatraRide, a legendary ride-hailing service app.
Your main goal is to assist users with booking rides, explaining fares, features, support, app history, and captain/driver related queries.
Never answer questions unrelated to YatraRide, general knowledge, or coding unless it's strictly an analogy for the app.
Keep your answers concise, helpful, and friendly. Always reply in English by default.

Key Info about YatraRide:
- YatraRide was created and developed by Mahendra Singh Rajput.
- YatraRide is a platform to book cabs, autos, and bikes easily.
- Provides real-time tracking, live location mapping, secure OTP based rides.
- We have separate platforms for Users (Passengers) and Captains (Drivers).
`;

    // Construct the context
    let promptText = systemPrompt + "\n\n";
    if (history && history.length > 0) {
      promptText += "Conversation History:\n";
      history.forEach((msg: any) => {
        promptText += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
      });
      promptText += "\n";
    }
    promptText += `User: ${message}\nAssistant:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptText,
    });

    return NextResponse.json({ reply: response.text });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
