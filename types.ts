export enum AppState {
  LANDING = 'LANDING',
  PERSONALIZE = 'PERSONALIZE',
  GENERATING = 'GENERATING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}

export interface GeneratedContent {
  greeting: string;
  poem: string;
  theme: string;
  imageUrl?: string;
  audioBase64?: string;
}

export interface UserData {
  name: string;
  photoBase64?: string;
}

export interface Theme {
  name: string;
  prompt: string;
  color: string;
}