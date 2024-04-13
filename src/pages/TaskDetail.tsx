import { db } from "@/config/firebase";
import { useAuth } from "@/contexts/AuthProvider";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DataItem, DocRef } from "../types";
import {
  Table as T,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Bar } from "react-chartjs-2";
import { format, parse, parseISO } from "date-fns";
import BackSpaceIcon from "@/components/ui/BackSpaceIcon";
import { useTheme } from "@/contexts/ThemeProvider";
import Spinner from "@/components/ui/Spinner";
import ArrowIcon from "@/components/ui/ArrowIcon";

export function formatDate(inputDate: string) {
  // Parse the ISO string into a Date object
  const parsedDate = parseISO(inputDate);

  // Format the date as "YYYY/MM/DD"
  const formattedDate = format(parsedDate, "yyyy/MM/dd");

  return formattedDate;
}
export function calculateTotalTimeInHours(timeString: string) {
  // Parse the time string into a Date object
  const parsedTime = parse(timeString, "HH:mm:ss", new Date(0));

  // Extract hours, minutes, and seconds from the parsed time
  const hours = parsedTime.getHours();
  const minutes = parsedTime.getMinutes();
  const seconds = parsedTime.getSeconds();

  // Calculate the total time in hours
  const totalTimeInHours = hours + minutes / 60 + seconds / 3600;

  return totalTimeInHours;
}
export default function TaskDetail() {
  const { theme } = useTheme();

  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [task, setTask] = useState<DataItem | null | undefined>(undefined);
  const { id } = useParams();
  useEffect(() => {
    (async () => {
      const document = await getDoc(
        doc(db, "users", currentUser?.uid as string, "tasks", id as string)
      );
      if (!document.exists()) {
        setTask(null);
      } else {
        setTask({ id: document.id, ...document.data() } as DataItem);
      }
    })();
    document.title =
      `${id?.charAt(0).toUpperCase()}${id?.slice(1, id.length)}`.trim() ||
      "Tasks";

    return () => {};
  }, [id]);
  async function deleteTask(docRef: string, index: number) {
    // delete task from timers collection
    await deleteDoc(
      doc(db, "users", currentUser?.uid as string, "timers", docRef as string)
    );
    // update the task in tasks collection
    const filteredDoc = {
      ...task,
      refs: task?.refs.filter((item, idx) => item && idx !== index),
    };
    if (task?.refs.length === 1) {
      await deleteDoc(
        doc(db, "users", currentUser?.uid as string, "tasks", id as string)
      );
      setTask(filteredDoc as DataItem);
    } else {
      await updateDoc(
        doc(db, "users", currentUser?.uid as string, "tasks", id as string),
        filteredDoc
      );
      navigate("/tasks");
    }
  }
  function getChartData(refs: DocRef[]) {
    const date = refs.map((ref) => formatDate(ref.createdAt));
    const numberOfHours = refs.map((ref) => {
      const time = calculateTotalTimeInHours(ref.time);
      let decimalPart = Math.round((time % 1) * 100);
      decimalPart = Math.round((decimalPart * 60) / 100);
      const integerPart = Math.trunc(time);
      return (integerPart * 100 + decimalPart) / 100;
    });

    return {
      labels: date,
      datasets: [
        {
          label: task && task.id,
          data: numberOfHours,
          backgroundColor: "#d5dde7",
        },
      ],
    };
  }
  return task === undefined ? (
    <Spinner />
  ) : task === null ? (
    <div>
      <h2 className="pt-[32vh] flex mx-auto justify-center items-center text-lg font-semibold">
        No Task
        <Link
          className="underline  font-semibold flex gap-1 ms-1 italic"
          to="/main"
        >
          Back To Home
        </Link>
      </h2>
    </div>
  ) : (
    <div className="px-7 max-w-screen-xl mx-auto pt-8">
      <Link
        className="underline mb-4 text-sm font-medium flex gap-1"
        to="/main"
      >
        <ArrowIcon theme={theme} />
        Back To Home
      </Link>
      <h1 className="text-xl font-bold mb-3 capitalize">{id}</h1>
      <T className="border-gray-800">
        <TableCaption>A list of Uncompleted Tasks</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Created At</TableHead>
            <TableHead>completedAt</TableHead>
            <TableHead>time</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {task ? (
            task.refs.map((item, index) => {
              return (
                <TableRow key={item.docRef}>
                  <TableCell>
                    {format(new Date(item.createdAt), "yyyy/mm/dd (hh:mm:ss)")}
                  </TableCell>
                  <TableCell>
                    {format(
                      new Date(item.completedAt),
                      "yyyy/mm/dd (hh:mm:ss)"
                    )}
                  </TableCell>
                  <TableCell>{item.time}</TableCell>
                  <TableCell className="text-left">
                    <Button
                      className="bg-transparent p-0 hover:bg-transparent"
                      onClick={() => deleteTask(item.docRef, index)}
                    >
                      <BackSpaceIcon theme={theme} />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <p className="w-72">no uncompleted tasks</p>
          )}
        </TableBody>
      </T>
      <div className="mt-10 relative w-[100%] sm:h-[50vh] mx-auto md:h-[60vh] lg:h-[70vh] flex justify-center">
        <Bar data={getChartData(task.refs) as any} />
      </div>
    </div>
  );
}
