import React, { useState } from 'react';
import { User, ArrowRight } from 'lucide-react';
import { UserData } from '../types';

interface PersonalizeProps {
  onComplete: (data: UserData) => void;
}

const Personalize: React.FC<PersonalizeProps> = ({ onComplete }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    // Passing undefined for photoBase64 as we removed the feature
    onComplete({ name, photoBase64: undefined });
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
                autoFocus
              />
            </div>
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