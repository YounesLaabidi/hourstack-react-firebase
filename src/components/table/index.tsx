import useTasks from "../../hooks/useTasks";
import { startOfDay, endOfDay, lastDayOfMonth, isSameDay } from "date-fns";

import {
  Table as T,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "../ui/button";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";

import { Calendar } from "@/components/ui/calendar";
import { useTimeContext } from "@/contexts/TimeProvider";
import { useAuth } from "@/contexts/AuthProvider";
import { useTheme } from "@/contexts/ThemeProvider";
import BackSpaceIcon from "../ui/BackSpaceIcon";
import CalendarIcon from "../ui/CalendarIcon";
export default function Table() {
  const { theme } = useTheme();
  const { date, setDate } = useTimeContext();

  const tasks = useTasks(date);
  const { currentUser } = useAuth();
  const deleteTask = async (id: string, name: string) => {
    // getting the document from tasks collection
    const docRef = doc(db, "users", currentUser?.uid as string, "tasks", name);
    const docSnap = await getDoc(docRef);
    // remove the target doc
    if (!docSnap.exists()) {
      return;
    }
    const updatedDoc = docSnap
      .data()
      .refs.filter(({ docRef }: { docRef: string }) => docRef !== id);

    // if the task array now empty
    if (updatedDoc.length <= 0) {
      // delete the doc
      await deleteDoc(docRef);
    } else {
      // update the doc
      await updateDoc(docRef, {
        refs: updatedDoc,
      });
    }
    await deleteDoc(doc(db, "users", currentUser?.uid as string, "timers", id));
  };

  const dateFormatter = new Intl.DateTimeFormat("en-us", {
    dateStyle: "medium",
  });

  const hourFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC",
  });
  const dayFormatter = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
  });

  const handleMonthChange = (month: Date) => {
    const firstDay = startOfDay(month);
    const lastDay = lastDayOfMonth(month);

    setDate((prev) => ({
      ...prev,
      startOfDayOfMonth: firstDay,
      endDate: lastDay,
    }));
  };

  const handleDayClick = (date: Date | undefined) => {
    if (date) {
      setDate(() => ({
        startOfDayOfMonth: null,
        startDate: startOfDay(date),
        endDate: endOfDay(date),
      }));
    }
  };

  const handleWeekClick = (_: number, dateOfWeak: Date[]) => {
    const firstDayOfWeek = dateOfWeak[0];
    const lastDayOfWeek = dateOfWeak[6];
    setDate((prev) => ({
      ...prev,
      startOfDayOfMonth: firstDayOfWeek,
      endDate: lastDayOfWeek,
    }));
  };

  return (
    <div className="mt-3">
      <div className="">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className={cn(
                "w-[130px] pl-3 text-left font-normal bg-transparent border-2 text-gray-800 hover:bg-slate-300 flex gap-2"
              )}
            >
              <span className="dark:text-white">Pick a date</span>
              <CalendarIcon theme={theme} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date.startDate}
              onSelect={(date) => handleDayClick(date)}
              onMonthChange={(month) => handleMonthChange(month)}
              toDate={new Date()}
              showOutsideDays
              showWeekNumber
              onWeekNumberClick={(_, dateOfWeak) =>
                handleWeekClick(_, dateOfWeak)
              }
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="mx-5 mt-8 mb-8">
        <h4 className="my-4 scroll-m-20 text-2xl font-semibold tracking-tighter text-center">
          <span
            className={`${isSameDay(date.startDate, date.endDate) && "hidden"}`}
          >
            From :{" "}
          </span>
          <span className="">
            {dateFormatter.format(new Date(date.startDate))}
          </span>
          <span
            className={`${isSameDay(date.startDate, date.endDate) && "hidden"}`}
          >
            {" "}
            To : {dateFormatter.format(new Date(date.endDate))}
          </span>
        </h4>
        <T className="border-gray-800">
          <TableCaption>A list of Today Tasks</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Task</TableHead>
              <TableHead
                className={`${
                  isSameDay(date.startDate, date.endDate) && "hidden"
                }`}
              >
                Day
              </TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Finished At</TableHead>
              <TableHead className="text-right">Time</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks?.map(({ id, time, name, createdAt, completedAt }) => (
              <TableRow key={id}>
                <TableCell className="capitalize">
                  {name.replace(/-/g, " ")}
                </TableCell>
                <TableCell
                  className={`${
                    isSameDay(date.startDate, date.endDate) && "hidden"
                  }`}
                >
                  {dayFormatter.format(new Date(createdAt))}
                </TableCell>
                <TableCell>
                  {hourFormatter.format(new Date(createdAt))}
                </TableCell>
                <TableCell>
                  {" "}
                  {hourFormatter.format(new Date(completedAt))}
                </TableCell>
                <TableCell className="text-right">{time}</TableCell>
                <TableCell className="text-right">
                  <Button
                    onClick={() => deleteTask(id, name)}
                    className="bg-transparent p-0 hover:bg-transparent"
                  >
                    <BackSpaceIcon theme={theme} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </T>
      </div>
    </div>
  );
}
