import React, { useEffect, useState } from 'react';
import { Sparkles, Snowflake, Gift, Wand2 } from 'lucide-react';

const LOADING_MESSAGES = [
  "Consulting the North Pole Archives...",
  "Mixing starlight and snowflakes...",
  "Teaching reindeer to fly...",
  "Recording elf choirs...",
  "Wrapping your personalized surprise...",
  "Calibrating Christmas magic...",
  "Checking the Naughty or Nice list..."
];

const LoadingMagic: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 overflow-hidden relative">
        {/* Dynamic Background Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-black to-black animate-pulse" />
        
        <div className="relative z-10 flex flex-col items-center">
            {/* Central Magic Circle */}
            <div className="relative w-48 h-48 flex items-center justify-center mb-8">
                {/* Rotating Outer Ring */}
                <div className="absolute inset-0 border-2 border-dashed border-white/10 rounded-full animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-4 border border-white/5 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                
                {/* Rotating Inner Ring with Icons */}
                <div className="absolute inset-0 animate-[spin_4s_linear_infinite]">
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gray-900 p-3 rounded-full border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.4)] transform rotate-0">
                        <Snowflake className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="absolute top-[65%] -right-3 bg-gray-900 p-3 rounded-full border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.4)] transform -rotate-[120deg]">
                        <Gift className="w-6 h-6 text-red-400" />
                    </div>
                    <div className="absolute top-[65%] -left-3 bg-gray-900 p-3 rounded-full border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.4)] transform rotate-[120deg]">
                        <Wand2 className="w-6 h-6 text-purple-400" />
                    </div>
                </div>

                {/* Central Pulsating Core */}
                <div className="relative z-10 bg-gray-900/80 backdrop-blur-md p-8 rounded-full border border-yellow-500/30 shadow-[0_0_50px_rgba(234,179,8,0.2)] animate-pulse-fast">
                   <Sparkles className="w-12 h-12 text-yellow-400 animate-spin-slow" />
                </div>
            </div>
          
            <div className="h-16 flex items-center justify-center">
              <h3 className="text-2xl md:text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-white to-cyan-300 transition-all duration-500">
                  {LOADING_MESSAGES[messageIndex]}
              </h3>
            </div>
            
            {/* Decorative loading bar */}
             <div className="w-64 h-1 bg-gray-800 rounded-full mt-8 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full -translate-x-full animate-[shimmer_1.5s_infinite_linear]" />
                <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 w-full animate-progress-indeterminate" />
            </div>
        </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes progress-indeterminate {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(0%); }
            100% { transform: translateX(100%); }
        }
         .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        .animate-pulse-fast {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingMagic;