export type Clan = 'Blue Clan' | 'Red Clan';

export interface QuestionOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface Question {
  id: number;
  sectionId: number;
  sectionName: string;
  tag: string;
  scenario: string;
  question: string;
  options: QuestionOption[];
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  xp: number;
}

export interface GymSection {
  id: number; // 1, 2, 3, 4, 5
  name: string;
  bubbleLabel: string; // e.g. "Gym 1", "Gym 2"
  shortTitle: string;
  description: string;
  icon: string;
  isHandsOn?: boolean;
}

export interface QuizResult {
  answers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  score: number; // Correct count out of 12
  totalXP: number;
  completedAt: string;
  sectionScores: Record<string, { correct: number; total: number }>;
  completedGyms: number[]; // Array of Gym IDs completed (e.g. [1, 2, 3, 4, 5])
  handsOnPassed: boolean;
  questionTimes?: Record<number, number>; // questionId -> time taken in seconds
  totalTimeSeconds?: number;
}

export interface Trainer {
  handle: string;
  clan: Clan;
  avatarUrl: string;
  level: number;
  xp: number;
  badges: string[];
  completedGyms: number[];
  handsOnPassed?: boolean;
  totalTimeSeconds?: number;
}

export interface LeaderboardEntry {
  id: string;
  handle: string;
  clan: Clan;
  avatarUrl: string;
  scoreXP: number;
  passedCount: number;
  badgeCount: number;
  totalTimeSeconds?: number;
  completedGymsCount?: number;
  completedGyms?: number[];
  handsOnPassed?: boolean;
  isCurrentUser?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  sectionId?: number;
  gymId?: number;
  unlocked: boolean;
  unlockedAt?: string;
  type: 'section' | 'mastery' | 'clan' | 'speed' | 'handson';
}

export interface SheetConfig {
  activeGym: number; // 1, 2, 3, 4, 5 (from Config!B1)
  codeword: string;  // Codeword required to pass hands-on / quiz
  webhookUrl?: string; // Google Apps Script Webhook URL to record student scores
}

export type ViewState = 'enrollment' | 'quiz' | 'certificate' | 'leaderboard' | 'inventory' | 'dashboard';

