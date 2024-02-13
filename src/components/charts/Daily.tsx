import { Bar } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { useDailyHours } from "../../hooks/useDailyHours";
import { useTimeContext } from "@/contexts/TimeProvider";
import { getDaysInMonth, isSameWeek } from "date-fns";
import { useMonthlyTask } from "@/hooks/useMonthTasks";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Daily() {
  const { date } = useTimeContext();
  const data = useMonthlyTask(date);
  const selectedMonth = date.startOfDayOfMonth || date.startDate;
  const numberOfDayInMonth = getDaysInMonth(selectedMonth);

  let { dailyHours } = useDailyHours(numberOfDayInMonth, data);

  if (isSameWeek(date.startOfDayOfMonth, date.endDate)) {
    const startDay = new Date(date.startOfDayOfMonth).getDate();
    const endDay = new Date(date.endDate).getDate();
    dailyHours = dailyHours?.filter(
      (item) => item.day >= startDay && item.day <= endDay
    );
  }
  if (!dailyHours?.length)
    return (
      <h2 className="text-center my-4 font-medium text-red-400">
        No Task Completed Yet This Month
      </h2>
    ); // Handle loading state
  const chartData = {
    labels: dailyHours.map((item) => item.day),
    datasets: [
      {
        label: "Daily Hour",
        data: dailyHours.map((item) => item.totalHours),
        backgroundColor: "#d5dde7",
      },
    ],
  };
  return (
    <div className="relative w-[100%] sm:h-[50vh] mx-auto md:h-[60vh] lg:h-[70vh] flex justify-center">
      <Bar data={chartData} />
    </div>
  );
}
