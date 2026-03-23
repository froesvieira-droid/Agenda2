export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  categoryId: string;
  dueDate: string;
  reminderTime?: string; // ISO string for date and time
  createdAt: number;
  notified?: boolean;
}

export type FilterType = 'all' | 'active' | 'completed';
