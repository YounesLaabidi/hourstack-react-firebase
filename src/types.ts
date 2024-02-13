export type Task = {
  name: string;
  createdAt: string;
  completedAt: string;
  completed: boolean;
  time: string;
};

export type TaskFirestoreDoc = Task & { id: string };

export type TimeData = {
  timeInput: string;
  startTime: string;
};

export type TDate = {
  startOfDayOfMonth: null | Date;
  startDate: Date;
  endDate: Date;
};

export type TimeChangeParams = {
  e: React.ChangeEvent<HTMLInputElement>;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
};

export type MonthlyHoursState = {
  month: string;
  totalHours: number;
};

export type DailyHoursState = {
  day: number;
  totalHours: number;
};

export type TimeContextValue = {
  date: TDate;
  setDate: React.Dispatch<React.SetStateAction<TDate>>;
};

type DocRef = {
  docRef: string;
  time: string;
  createdAt: string;
  completedAt: string;
};

export interface DataItem {
  id: string;
  refs: DocRef[];
}

export type Theme = "dark" | "light" | "system";

export type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};
export type EditProfileProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
