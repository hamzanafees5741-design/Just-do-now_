
export enum Frequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  SPECIFIC_DAYS = 'SPECIFIC_DAYS',
}

export interface HabitLog {
  date: string; // YYYY-MM-DD
  completed: boolean;
  efficiency?: number; // 0-100 rating of how well it was done
}

export interface Habit {
  id: string;
  title: string;
  description?: string;
  frequency: Frequency;
  frequencyDays: number[]; // 0 = Sunday, 1 = Monday, etc.
  reminderTime?: string; // HH:mm
  duration?: number; // In minutes
  category: string;
  icon: string; // Icon name from Lucide
  createdAt: string;
  logs: Record<string, HabitLog>; // Map date string to log object
  streak: number;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  effect: 'freeze' | 'multiplier' | 'theme';
  active: boolean;
}

export interface UserStats {
  totalCompleted: number;
  currentStreak: number;
  completionRate: number;
  xp: number;
  level: number;
  credits: number;
  inventory: string[]; // Array of purchased item IDs
  attributes: {
    vitality: number; // Health
    intellect: number; // Work/Skill
    willpower: number; // Mindset
    tech: number; // Routine
    charisma: number; // Social/Other
  }
}

export type ViewState = 'habits' | 'stats' | 'add' | 'coach' | 'focus' | 'shop' | 'settings';
