import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw, Sparkles, Volume2, Square, Music, Share2, Loader2 } from 'lucide-react';
import { GeneratedContent } from '../types';
import { THEMES } from '../constants';
import FallbackVisuals from './FallbackVisuals';

interface ResultCardProps {
  content: GeneratedContent;
  onReset: () => void;
  isImageLoading?: boolean;
}

// -- Audio Helpers --
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const ResultCard: React.FC<ResultCardProps> = ({ content, onReset, isImageLoading = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const hasAutoplayedRef = useRef(false);
  
  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopAudio();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Autoplay Effect
  useEffect(() => {
    // Only attempt autoplay if we have audio and haven't played yet
    if (content.audioBase64 && !hasAutoplayedRef.current) {
      // Small delay to allow visual transition to complete or for user interaction to register
      const timer = setTimeout(() => {
        handlePlayAudio(true); // true = isAutoplay
      }, 1000);
      hasAutoplayedRef.current = true;
      return () => clearTimeout(timer);
    }
  }, [content.audioBase64]);

  const stopAudio = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
  };

  const handlePlayAudio = async (isAutoplay = false) => {
    if (isPlaying && !isAutoplay) {
      stopAudio();
      return;
    }

    if (!content.audioBase64) return;

    try {
      setIsPlaying(true);
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }

      const ctx = audioContextRef.current;
      
      // Attempt to resume context if suspended (browser autoplay policy)
      if (ctx.state === 'suspended') {
        try {
            await ctx.resume();
        } catch (e) {
            console.warn("Autoplay blocked by browser policy. User interaction required.");
            setIsPlaying(false);
            return; // Exit if we can't play automatically
        }
      }

      const audioBytes = decode(content.audioBase64);
      const audioBuffer = await decodeAudioData(audioBytes, ctx, 24000, 1);
      
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      
      source.onended = () => {
        setIsPlaying(false);
        sourceNodeRef.current = null;
      };

      source.start();
      sourceNodeRef.current = source;
    } catch (e) {
      console.error("Audio playback failed", e);
      setIsPlaying(false);
      // Only alert if user manually clicked. Silent fail for autoplay.
      if (!isAutoplay) {
         alert("Magic voice could not be played on this device.");
      }
    }
  };

  const handleShare = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('theme', content.theme);
    url.searchParams.set('greeting', content.greeting);
    url.searchParams.set('poem', content.poem);
    
    const text = encodeURIComponent(`Merry Christmas 2025! Check out this magical greeting I made: ${url.toString()}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const currentTheme = THEMES.find(t => t.name === content.theme);
  const themeGradient = currentTheme?.color || 'from-gray-900 to-black';

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br ${content.imageUrl ? 'bg-black' : 'from-gray-900 to-black'} overflow-hidden relative`}>
       
       {/* Background Particles (Snow/Sparkles) */}
       <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div 
              key={i}
              className="absolute bg-white rounded-full opacity-60 animate-float-particle"
              style={{
                top: `${Math.random() * 120 - 20}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                animationDuration: `${Math.random() * 15 + 10}s`,
                animationDelay: `-${Math.random() * 20}s`,
                boxShadow: `0 0 ${Math.random() * 5 + 2}px rgba(255,255,255,0.8)`
              }}
            />
          ))}
       </div>

       <div className="relative max-w-2xl w-full bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row animate-card-entrance shadow-white/5 transform-style-3d">
         
         {/* Image Section */}
         <div className={`w-full md:w-1/2 relative min-h-[300px] md:min-h-[500px] bg-gradient-to-br ${themeGradient} overflow-hidden group`}>
           {/* Shimmer / Reveal Effect */}
           <div className="absolute inset-0 bg-white/30 z-20 animate-reveal-wipe pointer-events-none" />
           
           {content.imageUrl ? (
             <img 
               src={content.imageUrl} 
               alt="Generated Christmas" 
               className="absolute inset-0 w-full h-full object-cover animate-ken-burns"
             />
           ) : (
             <>
               {isImageLoading ? (
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-30">
                    <Loader2 className="w-12 h-12 text-white/80 animate-spin mb-4" />
                    <p className="text-white/80 text-sm font-medium animate-pulse">Painting your magical scene...</p>
                    <p className="text-white/40 text-xs mt-2">Gemini is generating pixels</p>
                 </div>
               ) : (
                 <div className="relative w-full h-full">
                    <FallbackVisuals />
                 </div>
               )}
             </>
           )}
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden" />
           
           {/* Magical Sparkles overlay on image */}
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
         </div>

         {/* Text Section */}
         <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-left relative overflow-hidden">
           
           {/* Background glow effect behind text */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-yellow-500/5 to-purple-500/5 blur-3xl -z-10 animate-pulse-slow"></div>

           <div className="mb-2 animate-slide-in-right opacity-0 flex justify-between items-start" style={{ animationDelay: '0.4s' }}>
             <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-white/70 border border-white/5 shadow-lg backdrop-blur-sm">
               Theme: {content.theme}
             </span>
             
             {/* Audio Player Button - Only shows if audio exists */}
             {content.audioBase64 && (
                <button 
                  onClick={() => handlePlayAudio(false)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${isPlaying ? 'bg-yellow-400 text-black border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]' : 'bg-white/10 text-yellow-300 border-yellow-500/50 hover:bg-white/20'}`}
                >
                  {isPlaying ? (
                    <>
                      <Square size={12} className="fill-current" />
                      <span>Stop Singing</span>
                      <div className="flex space-x-0.5 h-3 items-end ml-1">
                         <div className="w-0.5 bg-black h-1.5 animate-bounce" style={{ animationDelay: '0s' }}></div>
                         <div className="w-0.5 bg-black h-3 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                         <div className="w-0.5 bg-black h-2 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </>
                  ) : (
                    <>
                      <Music size={12} />
                      <span>Play Song</span>
                    </>
                  )}
                </button>
             )}
           </div>

           <h2 className="font-christmas text-4xl md:text-5xl text-yellow-400 mb-6 leading-tight drop-shadow-lg animate-slide-in-right opacity-0" style={{ animationDelay: '0.6s' }}>
             {content.greeting}
           </h2>
           
           <div className="space-y-4 mb-8">
              {content.poem.split('\n').map((line, i) => (
                <p 
                  key={i} 
                  className="text-gray-200 text-lg md:text-xl font-light italic leading-relaxed animate-slide-in-right opacity-0" 
                  style={{ animationDelay: `${0.8 + (i * 0.2)}s` }}
                >
                  {line}
                </p>
              ))}
           </div>

           <div className="mt-auto animate-fade-in-up opacity-0 space-y-3" style={{ animationDelay: '1.8s' }}>
              <div className="grid grid-cols-5 gap-2">
                 <button 
                  onClick={onReset}
                  className="col-span-4 w-full flex items-center justify-center space-x-2 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all border border-white/20 hover:border-white/40 hover:-translate-y-1"
                >
                  <RefreshCw size={18} />
                  <span>{content.imageUrl || isImageLoading ? 'Create Another Magic Box' : 'Create Mine'}</span>
                </button>
                <button 
                   onClick={handleShare}
                   className="col-span-1 flex items-center justify-center bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl transition-all hover:-translate-y-1 shadow-lg"
                   title="Share on WhatsApp"
                >
                  <Share2 size={20} />
                </button>
              </div>
           </div>
         </div>
       </div>

       <style>{`
          @keyframes float-particle {
            0% { transform: translateY(0) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
          }
          .animate-float-particle {
            animation: float-particle linear infinite;
          }

          @keyframes card-entrance {
            0% { opacity: 0; transform: scale(0.95) translateY(30px); filter: blur(10px); }
            100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
          }
          .animate-card-entrance {
            animation: card-entrance 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }

          @keyframes reveal-wipe {
            0% { transform: translateX(-100%) skewX(-15deg); }
            100% { transform: translateX(200%) skewX(-15deg); }
          }
          .animate-reveal-wipe {
            animation: reveal-wipe 1.5s cubic-bezier(0.8, 0, 0.2, 1) forwards;
          }

          @keyframes ken-burns {
            0% { transform: scale(1.15); }
            100% { transform: scale(1); }
          }
          .animate-ken-burns {
            animation: ken-burns 20s ease-out forwards;
          }

          @keyframes slide-in-right {
            0% { opacity: 0; transform: translateX(20px); }
            100% { opacity: 1; transform: translateX(0); }
          }
          .animate-slide-in-right {
            animation: slide-in-right 0.8s ease-out forwards;
          }

          @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out forwards;
          }

          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 8s linear infinite;
          }

          @keyframes pulse-slow {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
          }
          .animate-pulse-slow {
            animation: pulse-slow 4s ease-in-out infinite;
          }
       `}</style>
    </div>
  );
};

export default ResultCard;