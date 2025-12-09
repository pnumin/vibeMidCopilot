export enum GameStage {
  INTRO = 'INTRO',
  LEVEL_1_PROMPT = 'LEVEL_1_PROMPT',
  LEVEL_2_EXTENSION = 'LEVEL_2_EXTENSION',
  LEVEL_3_CRITICAL = 'LEVEL_3_CRITICAL',
  CERTIFICATE = 'CERTIFICATE',
}

export interface UserProfile {
  name: string;
  school: string;
  grade: string;
}

export interface UserState {
  profile: UserProfile;
  score: number;
  badges: string[];
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface PromptChallenge {
  id: number;
  scenario: string;
  badPrompt: string;
  betterPromptOptions: string[];
  correctIndex: number;
  explanation: string;
}

export interface FactCheckScenario {
  topic: string;
  statement: string;
  isTrue: boolean;
  correction: string;
}