import React from 'react';
import { Package } from 'lucide-react';

interface LandingProps {
  onOpen: () => void;
}

const Landing: React.FC<LandingProps> = ({ onOpen }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-gray-900 to-black -z-10" />
      
      <div className="relative z-10 max-w-lg w-full">
        <h1 className="font-christmas text-6xl md:text-7xl text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] mb-4 animate-float">
          Merry Christmas 2025
        </h1>
        <p className="text-blue-200 text-lg mb-12 font-light tracking-wide">
          A mysterious gift has arrived for you via WhatsApp...
        </p>

        <button 
          onClick={onOpen}
          className="group relative inline-flex items-center justify-center p-1"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-green-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-glow"></div>
          <div className="relative bg-black border border-white/10 rounded-xl p-8 md:p-12 cursor-pointer transform transition-transform hover:scale-105 active:scale-95">
             <Package size={80} className="text-yellow-400 mb-4 mx-auto animate-bounce" />
             <span className="block text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-500 uppercase tracking-widest">
               Open Pandora's Box
             </span>
          </div>
        </button>

        <p className="mt-8 text-sm text-gray-500">
          Warning: Opening this box generates a unique reality every time.
        </p>
      </div>

      {/* Footer Credit */}
      <div className="absolute bottom-6 left-0 w-full text-center z-20">
        <p className="text-white/30 text-xs font-light tracking-[0.2em] uppercase">
          A Mini Project by Steven Cai
        </p>
      </div>

      {/* Snowflakes simple overlay */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-5 opacity-20">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute bg-white rounded-full opacity-70 animate-float"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 5 + 2}px`,
                height: `${Math.random() * 5 + 2}px`,
                animationDuration: `${Math.random() * 5 + 5}s`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
      </div>
    </div>
  );
};

export default Landing;