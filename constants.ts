import { Theme } from './types';

export const THEMES: Theme[] = [
  { name: 'Victorian Christmas', prompt: 'A classic Charles Dickens style Victorian Christmas scene, snowy London streets, gas lamps, festive warmth', color: 'from-amber-900 to-red-900' },
  { name: 'Cyberpunk 2025', prompt: 'Futuristic Cyberpunk Christmas 2025, neon lights, holograms of reindeer, high-tech Santa sleigh, snowy cyberpunk city', color: 'from-blue-900 to-purple-900' },
  { name: 'Cozy Cabin', prompt: 'Inside a rustic log cabin, crackling fireplace, huge decorated tree, hot cocoa, very cozy and warm atmosphere', color: 'from-orange-800 to-brown-900' },
  { name: 'Galactic Holiday', prompt: 'Christmas on a space station, earth in background, zero gravity ornaments, astronaut Santa, stars and nebulas', color: 'from-slate-900 to-indigo-900' },
  { name: 'Candy Cane Land', prompt: 'A magical world made of candy, gingerbread houses, peppermint trees, chocolate river, bright and colorful', color: 'from-pink-600 to-red-600' },
  { name: 'Steampunk North Pole', prompt: 'Steampunk style Santa workshop, brass gears, steam powered sleigh, elves with goggles, vintage mechanics', color: 'from-stone-800 to-amber-700' },
  { name: 'Tropical Christmas', prompt: 'Christmas on a tropical beach, palm trees with lights, snowman made of sand, sunset over ocean, relaxed vibe', color: 'from-teal-700 to-cyan-600' },
  { name: 'Anime Winter', prompt: 'High quality anime style Christmas illustration, beautiful snowy background, cute characters, magical lighting, Studio Ghibli vibes', color: 'from-blue-500 to-indigo-600' },
  { name: 'Fantasy Forest', prompt: 'Enchanted winter forest, glowing mythical creatures, fairies decorating trees, mystical snow, ethereal atmosphere', color: 'from-emerald-900 to-teal-900' },
  { name: '8-Bit Retro', prompt: 'Pixel art style Christmas scene, retro video game aesthetic, snowy village, vibrant colors', color: 'from-indigo-800 to-purple-800' },
];

export const getRandomTheme = (): Theme => {
  return THEMES[Math.floor(Math.random() * THEMES.length)];
};