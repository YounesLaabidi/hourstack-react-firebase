import { useEffect, useState } from "react";
import { MonthlyHoursState } from "../types";
import { allMonths, data } from "../constants";

const useMonthlyHours = () => {
  const [monthlyHours, setMonthlyHours] = useState<MonthlyHoursState[]>([]);

  useEffect(() => {
    if (!data.length) return; // Don't run until data is available

    const calculatedHours = allMonths.map((month) => {
      let totalHours = 0;
      data.forEach((item) => {
        const date = new Date(item.createdAt);
        if (date.getMonth() === allMonths.indexOf(month)) {
          const seconds =
            parseInt(item.time.split(":")[0]) * 3600 +
            parseInt(item.time.split(":")[1]) * 60 +
            parseInt(item.time.split(":")[2]);
          totalHours += seconds / 3600;
        }
      });
      return { month, totalHours };
    });

    setMonthlyHours(calculatedHours);
  }, [data]); // Recalculate on data change

  return { monthlyHours };
};

export { useMonthlyHours };
