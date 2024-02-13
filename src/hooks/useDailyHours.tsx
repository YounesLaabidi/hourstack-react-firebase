import { useEffect, useState } from "react";
import { type DailyHoursState, type Task } from "../types";
// import { data } from "../constants";

const calculateDailyHours = (data: Task[]) => {
  const dailyHoursMap = new Map();

  data.forEach((entry: any) => {
    const date = new Date(entry.createdAt);
    const day = date.getDate();

    const seconds =
      parseInt(entry.time.split(":")[0]) * 3600 +
      parseInt(entry.time.split(":")[1]) * 60 +
      parseInt(entry.time.split(":")[2]);

    if (!dailyHoursMap.has(day)) {
      dailyHoursMap.set(day, 0);
    }

    dailyHoursMap.set(day, dailyHoursMap.get(day) + seconds / 3600);
  });

  return dailyHoursMap;
};

export const useDailyHours = (numberOfDays: number, data: Task[]) => {
  const [dailyHours, setDailyHours] = useState<DailyHoursState[] | undefined>();

  useEffect(() => {
    if (data.length >= 0) {
      const dailyHoursMap = calculateDailyHours(data);

      const allDays = Array.from({ length: numberOfDays }, (_, i) => i + 1);

      const calculatedHours = allDays.map((day) => ({
        day,
        totalHours: dailyHoursMap.get(day) || 0,
      }));
      setDailyHours(calculatedHours);
    }
  }, [data]);

  return { dailyHours };
};
