import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Theme, UserData } from '../types';

// Lazy initialization to ensure API key is available
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

// 1. Generate Text (Fastest - Blocking for UI)
export const generateText = async (userData: UserData, theme: Theme): Promise<{ greeting: string; poem: string }> => {
  try {
    const ai = getAiClient();
    if (!ai) throw new Error("No API Key");

    const prompt = `
      Create a personalized Christmas greeting card text for ${userData.name || 'a friend'}.
      Theme: ${theme.name}.
      
      Requirements:
      1. A short, warm 1-sentence greeting title.
      2. A creative 4-line lyrics/poem matching the ${theme.name} theme. It must be gentle, flowing, and heartwarming, suitable for a soothing song.
      3. Mention "2025" in the lyrics or greeting.
      
      Output JSON format only.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            greeting: { type: Type.STRING },
            poem: { type: Type.STRING }
          },
          required: ['greeting', 'poem']
        }
      }
    });

    const json = JSON.parse(response.text || '{}');
    return {
      greeting: json.greeting || `Merry Christmas 2025, ${userData.name}!`,
      poem: json.poem || "Snow is falling, engines roar,\nChristmas cheer and so much more.\nIn twenty-twenty-five we say,\nHave a happy holiday!"
    };

  } catch (error) {
    console.error("Text generation failed", error);
    // Return fallback text if API fails
    return {
      greeting: `Merry Christmas 2025!`,
      poem: `The stars shine bright above the night,\nTo bring you joy and pure delight.\nA magic box just for you,\nMay all your Christmas wishes come true.`
    };
  }
};

// 2. Generate Speech (Depends on Text - Background)
export const generateSpeech = async (text: string): Promise<string | undefined> => {
  try {
    const ai = getAiClient();
    if (!ai) return undefined;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: { parts: [{ text: `Sing the following Christmas lyrics in a sweet, gentle, and soothing voice. Use a melody similar to a soft Christmas lullaby. Perform it warmly and softly: "${text}"` }] },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' }, 
          },
        },
      },
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("Speech generation failed", error);
    return undefined;
  }
};

// 3. Generate Image (Independent - Background)
export const generateImage = async (userData: UserData, theme: Theme): Promise<string | undefined> => {
  try {
    const ai = getAiClient();
    if (!ai) return undefined;

    let prompt = `A high quality, detailed, festive Christmas scene. Theme: ${theme.prompt}. The year 2025 is subtly visible somewhere.`;
    let model = 'gemini-2.5-flash-image';
    let parts: any[] = [];

    // If user provided a photo
    if (userData.photoBase64) {
      prompt += ` Include a character in the center that loosely resembles the person in the provided image, styled to fit the ${theme.name} theme.`;
      const base64Data = userData.photoBase64.split(',')[1];
      parts = [
        { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
        { text: prompt }
      ];
    } else {
       parts = [{ text: prompt }];
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
       if (part.inlineData) {
         return `data:image/png;base64,${part.inlineData.data}`;
       }
    }
    return undefined;

  } catch (error) {
    console.error("Image generation failed", error);
    return undefined;
  }
};