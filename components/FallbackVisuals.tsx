import React from 'react';
import { Star } from 'lucide-react';

const FallbackVisuals: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gray-900 overflow-hidden">
      {/* Decorative Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-black" />
      
      {/* CSS Christmas Tree */}
      <div className="relative z-10 animate-float-slow">
        {/* Glow behind tree */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/20 blur-[60px] rounded-full" />
        
        {/* Tree Layers */}
        <div className="flex flex-col items-center -space-y-6">
           <div className="w-0 h-0 border-l-[30px] border-r-[30px] border-b-[50px] border-l-transparent border-r-transparent border-b-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)] z-30" />
           <div className="w-0 h-0 border-l-[50px] border-r-[50px] border-b-[70px] border-l-transparent border-r-transparent border-b-emerald-600 drop-shadow-[0_0_15px_rgba(5,150,105,0.5)] z-20" />
           <div className="w-0 h-0 border-l-[70px] border-r-[70px] border-b-[90px] border-l-transparent border-r-transparent border-b-emerald-800 drop-shadow-[0_0_15px_rgba(6,78,59,0.5)] z-10" />
        </div>
        
        {/* Trunk */}
        <div className="w-8 h-12 bg-amber-900 mx-auto mt-0 rounded-b-lg shadow-lg relative z-0" />
        
        {/* Star */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-40 animate-pulse">
           <Star className="w-10 h-10 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.8)]" />
        </div>

        {/* Ornaments (CSS dots) */}
        <div className="absolute top-[20px] left-[45%] w-3 h-3 bg-red-500 rounded-full animate-ping-slow" />
        <div className="absolute top-[45px] left-[35%] w-3 h-3 bg-blue-400 rounded-full animate-ping-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[55px] left-[60%] w-3 h-3 bg-yellow-300 rounded-full animate-ping-slow" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-[80px] left-[40%] w-3 h-3 bg-purple-400 rounded-full animate-ping-slow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-[85px] left-[70%] w-3 h-3 bg-red-400 rounded-full animate-ping-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 mt-8 text-center px-4">
        <p className="text-white/60 text-sm font-light tracking-widest uppercase">
          Magical Scene
        </p>
      </div>

      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }
        @keyframes ping-slow {
           75%, 100% { transform: scale(1.5); opacity: 0; }
        }
        .animate-ping-slow {
            animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default FallbackVisuals;