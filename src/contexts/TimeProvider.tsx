import { useContext, createContext, useState, ReactNode } from "react";
import { type TDate, type TimeContextValue } from "@/types";
import { endOfDay, startOfDay } from "date-fns";

const TimeContext = createContext<TimeContextValue | undefined>(undefined);

export const useTimeContext = () => {
  const context = useContext(TimeContext);
  if (!context) {
    throw new Error("useTimeContext must be used within a TimeProvider");
  }
  return context;
};

export const TimeProvider = ({ children }: { children: ReactNode }) => {
  const today = new Date();

  const [date, setDate] = useState<TDate>({
    startOfDayOfMonth: null,
    startDate: startOfDay(today),
    endDate: endOfDay(today),
  });

  const contextValue: TimeContextValue = {
    date,
    setDate,
  };

  return (
    <TimeContext.Provider value={contextValue}>{children}</TimeContext.Provider>
  );
};
