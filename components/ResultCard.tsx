import React, { useState } from 'react';
import { Share2, RefreshCw, MessageCircle, Sparkles, Copy, Facebook, Twitter, X } from 'lucide-react';
import { GeneratedContent } from '../types';
import { THEMES } from '../constants';

interface ResultCardProps {
  content: GeneratedContent;
  onReset: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ content, onReset }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Generate a URL that encodes the content in query parameters
  const generateShareUrl = () => {
    const params = new URLSearchParams();
    if (content.theme) params.set('theme', content.theme);
    if (content.greeting) params.set('greeting', content.greeting);
    if (content.poem) params.set('poem', content.poem);
    
    // Always use origin + pathname to ensure we build off the app root, avoiding 404s
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  };

  const handleShare = async () => {
    const shareUrl = generateShareUrl();
    const shareText = '🎁 I have a magical Christmas surprise for you!';
    const shareData = {
      title: 'Merry Christmas 2025',
      text: shareText,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Native share failed or cancelled', err);
      }
    } else {
      setShowShareModal(true);
    }
  };

  const handleCopyLink = async () => {
    const shareUrl = generateShareUrl();
    const shareText = '🎁 I have a magical Christmas surprise for you!';
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert('Greeting link copied to clipboard!');
    } catch (clipboardErr) {
      prompt('Copy this link to share:', shareUrl);
    }
    setShowShareModal(false);
  };

  const handleTwitter = () => {
    const shareUrl = generateShareUrl();
    const text = encodeURIComponent('🎁 I have a magical Christmas surprise for you! Open Pandora\'s Box:');
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    setShowShareModal(false);
  };

  const handleFacebook = () => {
    const shareUrl = generateShareUrl();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    setShowShareModal(false);
  };

  const handleWhatsApp = () => {
    const shareUrl = generateShareUrl();
    // By placing the URL at the end and keeping the text engaging, WhatsApp is more likely to render the rich preview card defined in index.html
    const text = encodeURIComponent(`🎁 I have a magical Christmas surprise for you! Tap to open Pandora's Box:\n\n${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // Find theme details for fallback styling
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
         
         {/* Custom Share Modal Overlay */}
         {showShareModal && (
           <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
             <div className="w-full max-w-sm bg-gray-800 border border-white/10 rounded-2xl p-6 shadow-2xl relative animate-modal-pop">
               <button 
                 onClick={() => setShowShareModal(false)}
                 className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
               >
                 <X size={20} />
               </button>
               
               <h3 className="text-xl font-christmas text-yellow-400 mb-6 text-center">Share the Magic</h3>
               
               <div className="space-y-3">
                 <button onClick={handleCopyLink} className="w-full flex items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-white group">
                   <div className="p-2 bg-gray-700 rounded-lg mr-3 group-hover:bg-gray-600">
                     <Copy size={20} className="text-gray-300" />
                   </div>
                   <span className="font-medium">Copy Link</span>
                 </button>

                 <button onClick={handleTwitter} className="w-full flex items-center p-3 rounded-xl bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 border border-[#1DA1F2]/20 transition-colors text-white group">
                   <div className="p-2 bg-[#1DA1F2]/20 rounded-lg mr-3 group-hover:bg-[#1DA1F2]/30">
                     <Twitter size={20} className="text-[#1DA1F2]" />
                   </div>
                   <span className="font-medium">Twitter / X</span>
                 </button>

                 <button onClick={handleFacebook} className="w-full flex items-center p-3 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/20 transition-colors text-white group">
                   <div className="p-2 bg-[#1877F2]/20 rounded-lg mr-3 group-hover:bg-[#1877F2]/30">
                     <Facebook size={20} className="text-[#1877F2]" />
                   </div>
                   <span className="font-medium">Facebook</span>
                 </button>
               </div>
             </div>
           </div>
         )}

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
             <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center animate-pulse">
               <Sparkles className="w-16 h-16 text-yellow-400 mb-4 animate-spin-slow" />
               <h3 className="font-christmas text-2xl text-white mb-2">Magical Greeting</h3>
               <p className="text-white/60 text-sm">
                 (The visual magic was unique to the sender's moment. Generate your own to see the spectacle!)
               </p>
             </div>
           )}
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden" />
           
           {/* Magical Sparkles overlay on image */}
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
         </div>

         {/* Text Section */}
         <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-left relative overflow-hidden">
           
           {/* Background glow effect behind text */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-yellow-500/5 to-purple-500/5 blur-3xl -z-10 animate-pulse-slow"></div>

           <div className="mb-2 animate-slide-in-right opacity-0" style={{ animationDelay: '0.4s' }}>
             <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-white/70 border border-white/5 shadow-lg backdrop-blur-sm">
               Theme: {content.theme}
             </span>
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

           <div className="mt-auto flex flex-col gap-3 animate-fade-in-up opacity-0" style={{ animationDelay: '1.8s' }}>
             <button 
               onClick={handleWhatsApp}
               className="group flex items-center justify-center space-x-2 w-full py-3 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl font-semibold transition-all shadow-lg shadow-green-900/50 hover:shadow-green-900/80 hover:-translate-y-1"
             >
               <MessageCircle size={20} className="group-hover:animate-bounce" />
               <span>Send via WhatsApp</span>
             </button>

             <div className="flex gap-3">
                <button 
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all border border-white/20 hover:border-white/40 hover:-translate-y-1"
                >
                  <Share2 size={18} />
                  <span>Share</span>
                </button>
                
                <button 
                  onClick={onReset}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all border border-white/20 hover:border-white/40 hover:-translate-y-1"
                >
                  <RefreshCw size={18} />
                  <span>{content.imageUrl ? 'Restart' : 'Create Mine'}</span>
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

          @keyframes modal-pop {
            0% { opacity: 0; transform: scale(0.9); }
            100% { opacity: 1; transform: scale(1); }
          }
          .animate-modal-pop {
            animation: modal-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
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