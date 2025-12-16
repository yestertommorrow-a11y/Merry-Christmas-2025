import React, { useState, useRef, useCallback } from 'react';
import { Camera, Upload, User, ArrowRight, X } from 'lucide-react';
import { UserData } from '../types';

interface PersonalizeProps {
  onComplete: (data: UserData) => void;
}

const Personalize: React.FC<PersonalizeProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error", err);
      setIsCameraOpen(false);
      alert("Could not access camera. Please upload a photo instead.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        setPhoto(canvas.toDataURL('image/jpeg'));
        stopCamera();
      }
    }
  };

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onComplete({ name, photoBase64: photo || undefined });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
      <div className="max-w-md w-full bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/10">
        <h2 className="text-2xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
          Personalize the Magic
        </h2>
        <p className="text-gray-400 text-center mb-8 text-sm">
          To create your unique 2025 greeting, the box needs to know who you are.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Your Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-500" size={20} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Santa Claus"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Photo Section */}
          <div className="space-y-2">
             <label className="block text-sm font-medium text-gray-300">
               Selfie (Optional - for AI Magic)
             </label>
             
             {!isCameraOpen && !photo && (
               <div className="grid grid-cols-2 gap-4">
                 <button
                   type="button"
                   onClick={startCamera}
                   className="flex flex-col items-center justify-center p-4 border border-dashed border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors"
                 >
                   <Camera className="mb-2 text-blue-400" />
                   <span className="text-xs">Take Photo</span>
                 </button>
                 <button
                   type="button"
                   onClick={() => fileInputRef.current?.click()}
                   className="flex flex-col items-center justify-center p-4 border border-dashed border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors"
                 >
                   <Upload className="mb-2 text-purple-400" />
                   <span className="text-xs">Upload</span>
                 </button>
                 <input 
                   type="file" 
                   ref={fileInputRef} 
                   className="hidden" 
                   accept="image/*" 
                   onChange={handleFileUpload} 
                 />
               </div>
             )}

             {isCameraOpen && (
               <div className="relative rounded-lg overflow-hidden bg-black aspect-square">
                 <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                 <button 
                   type="button" 
                   onClick={capturePhoto}
                   className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-4 shadow-lg hover:scale-110 transition-transform"
                 >
                   <div className="w-4 h-4 bg-red-500 rounded-full" />
                 </button>
                 <button
                   type="button"
                   onClick={stopCamera}
                   className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white"
                 >
                   <X size={16} />
                 </button>
               </div>
             )}

             {photo && (
               <div className="relative rounded-lg overflow-hidden bg-black aspect-square group">
                 <img src={photo} alt="Preview" className="w-full h-full object-cover opacity-80" />
                 <button
                    type="button"
                    onClick={() => setPhoto(null)}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                 >
                   <X className="text-white w-8 h-8" />
                 </button>
               </div>
             )}
          </div>

          <button
            type="submit"
            disabled={!name}
            className={`w-full flex items-center justify-center space-x-2 py-3 rounded-lg font-bold text-white transition-all transform ${
              name ? 'bg-gradient-to-r from-green-600 to-teal-600 hover:scale-[1.02] shadow-lg' : 'bg-gray-700 cursor-not-allowed'
            }`}
          >
            <span>Reveal My Surprise</span>
            <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Personalize;