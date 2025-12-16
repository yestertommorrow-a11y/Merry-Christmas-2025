import React, { useState, useEffect } from 'react';
import Landing from './components/Landing';
import Personalize from './components/Personalize';
import LoadingMagic from './components/LoadingMagic';
import ResultCard from './components/ResultCard';
import { generateChristmasContent } from './services/geminiService';
import { AppState, GeneratedContent, UserData } from './types';
import { getRandomTheme } from './constants';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [content, setContent] = useState<GeneratedContent | null>(null);

  // Check for shared content in URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const themeName = params.get('theme');
    const greeting = params.get('greeting');
    const poem = params.get('poem');

    if (themeName && greeting && poem) {
      setContent({
        theme: themeName,
        greeting,
        poem,
        imageUrl: undefined // Shared links won't have the generated image due to URL size limits
      });
      setAppState(AppState.RESULT);
    }
  }, []);

  const handleOpen = () => {
    setAppState(AppState.PERSONALIZE);
  };

  const handlePersonalizeComplete = async (userData: UserData) => {
    setAppState(AppState.GENERATING);
    try {
      const theme = getRandomTheme();
      const result = await generateChristmasContent(userData, theme);
      setContent(result);
      setAppState(AppState.RESULT);
    } catch (error) {
      console.error("Failed to generate content", error);
      // Even in error, show something (fallback handled in service, but safety net here)
      setAppState(AppState.LANDING); 
      alert("The elves are taking a nap. Please try again!");
    }
  };

  const handleReset = () => {
    setAppState(AppState.LANDING);
    setContent(null);
    // Clear URL params so refresh goes to landing
    window.history.pushState({}, '', window.location.pathname);
  };

  return (
    <main className="antialiased text-slate-900 bg-slate-900 min-h-screen">
      {appState === AppState.LANDING && <Landing onOpen={handleOpen} />}
      {appState === AppState.PERSONALIZE && <Personalize onComplete={handlePersonalizeComplete} />}
      {appState === AppState.GENERATING && <LoadingMagic />}
      {appState === AppState.RESULT && content && <ResultCard content={content} onReset={handleReset} />}
    </main>
  );
};

export default App;