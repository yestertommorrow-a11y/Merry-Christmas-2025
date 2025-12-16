import React, { useState, useEffect } from 'react';
import Landing from './components/Landing';
import Personalize from './components/Personalize';
import LoadingMagic from './components/LoadingMagic';
import ResultCard from './components/ResultCard';
import { generateText, generateImage, generateSpeech } from './services/geminiService';
import { AppState, GeneratedContent, UserData } from './types';
import { THEMES, getRandomTheme } from './constants';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  // Check for shared content in URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const themeName = params.get('theme');
    const greeting = params.get('greeting');
    const poem = params.get('poem');

    if (themeName && greeting && poem) {
      // 1. Restore text content immediately
      setContent({
        theme: themeName,
        greeting,
        poem,
        imageUrl: undefined,
        audioBase64: undefined
      });
      setAppState(AppState.RESULT);
      // We start with false so the FallbackVisuals show immediately without triggering API calls
      // This prevents "Allow Drive Access" popups for non-signed-in users
      setIsImageLoading(false); 
    }
  }, []);

  const handleOpen = () => {
    setAppState(AppState.PERSONALIZE);
  };

  const handlePersonalizeComplete = async (userData: UserData) => {
    setAppState(AppState.GENERATING);
    
    try {
      const theme = getRandomTheme();
      
      // 1. Start Image Generation in background
      const imagePromise = generateImage(userData, theme);
      
      // 2. Await Text Generation (Fast)
      const textData = await generateText(userData, theme);
      
      // 3. Show Result immediately with Text
      setContent({
        ...textData,
        theme: theme.name,
      });
      setIsImageLoading(true);
      setAppState(AppState.RESULT);

      // 4. Start Speech Generation in background (needs text)
      generateSpeech(textData.poem).then(audio => {
        setContent(prev => prev ? ({ ...prev, audioBase64: audio }) : prev);
      });

      // 5. Handle Image Completion
      imagePromise.then(imageUrl => {
        setContent(prev => prev ? ({ ...prev, imageUrl }) : prev);
      }).finally(() => {
        setIsImageLoading(false);
      });

    } catch (error) {
      console.error("Failed to generate content", error);
      setAppState(AppState.LANDING); 
      alert("The elves are taking a nap. Please try again!");
    }
  };

  const handleReset = () => {
    setAppState(AppState.LANDING);
    setContent(null);
    setIsImageLoading(false);
    window.history.pushState({}, '', window.location.pathname);
  };

  return (
    <main className="antialiased text-slate-900 bg-slate-900 min-h-screen">
      {appState === AppState.LANDING && <Landing onOpen={handleOpen} />}
      {appState === AppState.PERSONALIZE && <Personalize onComplete={handlePersonalizeComplete} />}
      {appState === AppState.GENERATING && <LoadingMagic />}
      {appState === AppState.RESULT && content && (
        <ResultCard 
          content={content} 
          onReset={handleReset} 
          isImageLoading={isImageLoading} 
        />
      )}
    </main>
  );
};

export default App;