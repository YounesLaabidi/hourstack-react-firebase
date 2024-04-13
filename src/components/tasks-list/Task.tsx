import { DataItem } from "@/types";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeProvider";

const toTimeString = (seconds: number) => {
  let hour: number | string = parseInt((seconds / 3600).toString(), 10);
  let minute: number | string = Math.abs(Math.trunc(hour * 60 - seconds / 60));
  if (hour === 0) {
    hour = "";
  }
  if (minute === 0) {
    minute = "";
  } else if (minute < 10) {
    minute = "0" + minute;
  }
  return `${hour}${hour == 0 ? "" : "h"}${minute}${hour == 0 ? "m" : ""}`;
};
export default function Task({ taskData }: { taskData: DataItem }) {
  function convertToSecond(time: string) {
    const [hour, minute, second] = time.split(":").map(Number);
    return hour * 3600 + minute * 60 + second;
  }
  const hoursToSecond = taskData.refs.map((currentTask) =>
    convertToSecond(currentTask.time)
  );
  const totalNumberOfHours = hoursToSecond.reduce(
    (total, item) => (total += item),
    0
  );
  const maxiumNumberOfHoursPerDay = Math.max(...hoursToSecond);
  const minimunNumberOfHoursPerDay = Math.min(...hoursToSecond);
  const { theme } = useTheme();

  return (
    <Card
      className={`border-[1px] w-60 p-3 ${
        theme !== "dark" ? "border-zinc-800" : "border-white"
      } ${theme == "dark" ? "bg-slate-900" : "bg-gray-100"}`}
    >
      <CardHeader className="p-0">
        <CardTitle
          className={`${
            theme !== "dark" ? "text-gray-700" : "text-white"
          } text-xl p-1 capitalize`}
        >
          {taskData.id}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-1">
        <p className="text-sm">
          <span className="font-medium">Total Tasks : </span>
          {taskData.refs.length}
        </p>
        <p className="text-[15px]">
          <span className="font-medium">Total Hours : </span>
          {toTimeString(totalNumberOfHours)}
        </p>
        <p className="text-[15px]">
          <span className="font-medium">Max/Day : </span>
          {toTimeString(maxiumNumberOfHoursPerDay)}
        </p>
        <p className="text-[15px]">
          <span className="font-medium">Min/Day : </span>
          {toTimeString(minimunNumberOfHoursPerDay)}
        </p>
      </CardContent>
      <Link
        className={`w-full block text-center py-2 capitalize text-[13px] rounded-sm mt-2 font-medium ${
          theme !== "dark" ? "text-zinc-100" : "bg-slate-800"
        } ${theme !== "dark" ? "bg-zinc-400" : "bg-slate-800"}`}
        to={`/tasks/${taskData.id}`}
      >
        view more
      </Link>
    </Card>
  );
}
