import { GoogleGenAI, Type } from "@google/genai";
import { Theme, GeneratedContent, UserData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateChristmasContent = async (
  userData: UserData,
  theme: Theme
): Promise<GeneratedContent> => {
  
  // Parallel execution for text and image to speed up the "magic"
  const textPromise = generateText(userData, theme);
  const imagePromise = generateImage(userData, theme);

  const [textContent, imageUrl] = await Promise.all([textPromise, imagePromise]);

  return {
    ...textContent,
    theme: theme.name,
    imageUrl,
  };
};

const generateText = async (userData: UserData, theme: Theme): Promise<{ greeting: string; poem: string }> => {
  try {
    const prompt = `
      Create a personalized Christmas greeting card text for ${userData.name || 'a friend'}.
      Theme: ${theme.name}.
      
      Requirements:
      1. A short, warm 1-sentence greeting title.
      2. A creative 4-line rhyming poem matching the ${theme.name} theme.
      3. Mention "2025" in the poem or greeting.
      
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
    return {
      greeting: `Happy Holidays 2025!`,
      poem: `The stars shine bright above the night,\nTo bring you joy and pure delight.\nA magic box just for you,\nMay all your Christmas wishes come true.`
    };
  }
};

const generateImage = async (userData: UserData, theme: Theme): Promise<string | undefined> => {
  try {
    let prompt = `A high quality, detailed, festive Christmas scene. Theme: ${theme.prompt}. The year 2025 is subtly visible somewhere.`;
    let model = 'gemini-2.5-flash-image';
    let parts: any[] = [];

    // If user provided a photo, we use it to "personalize" the character
    if (userData.photoBase64) {
      prompt += ` Include a character in the center that loosely resembles the person in the provided image, styled to fit the ${theme.name} theme (e.g. wearing theme-appropriate festive attire). Make it look magical and artistic.`;
      
      // Remove data:image/jpeg;base64, prefix if present
      const base64Data = userData.photoBase64.split(',')[1];
      
      parts = [
        {
            inlineData: {
                data: base64Data,
                mimeType: 'image/jpeg' 
            }
        },
        { text: prompt }
      ];
    } else {
       parts = [{ text: prompt }];
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts },
      config: {
         // Using default config for flash-image
      }
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
       if (part.inlineData) {
         return `data:image/png;base64,${part.inlineData.data}`;
       }
    }
    
    return undefined;

  } catch (error) {
    console.error("Image generation failed", error);
    // Return undefined to let the UI show a placeholder or handle it
    return undefined;
  }
};