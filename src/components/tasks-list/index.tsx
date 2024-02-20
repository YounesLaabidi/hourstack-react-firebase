import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/config/firebase";
import { format, parse, parseISO } from "date-fns";
import { isSameDay } from "date-fns/isSameDay";
import { type DataItem } from "@/types";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { Bar } from "react-chartjs-2";
import { useAuth } from "@/contexts/AuthProvider";
import { type DocRef } from "@/types";
ChartJS.register(ArcElement, Tooltip, Legend);

function formatDate(inputDate: string) {
  // Parse the ISO string into a Date object
  const parsedDate = parseISO(inputDate);

  // Format the date as "YYYY/MM/DD"
  const formattedDate = format(parsedDate, "yyyy/MM/dd");

  return formattedDate;
}

function calculateTotalTimeInHours(timeString: string) {
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

type TChartVisibility = [{ id: string }[]] | [];
export default function TasksList() {
  const [tasks, setTasks] = useState<DataItem[] | null>(null);
  const [chartVisibility, setChartVisibility] = useState<TChartVisibility>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    // get the user tasks
    const q = query(
      collection(db, "users", currentUser?.uid as string, "tasks")
    );
    // attach database listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docSnap = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTasks(docSnap as DataItem[]);
    });

    return () => unsubscribe();
  }, []);

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
          label: tasks && tasks[0].id,
          data: numberOfHours,
          backgroundColor: "#d5dde7",
        },
      ],
    };
  }

  // this function takes taskId
  const toggleChartVisibility = (taskId: string) => {
    setChartVisibility((prevVisibility) => ({
      ...prevVisibility,
      [taskId]: !prevVisibility[taskId as keyof typeof prevVisibility],
    }));
  };
  // debugger;
  return (
    tasks && (
      <div className="container  my-8 w-full px-0 ">
        {tasks?.map((item) => (
          <div
            key={item.id}
            className="mb-8 border-[1px] rounded-sm  pt-3 px-3"
          >
            <h2 className="text-xl font-bold mb-4 capitalize text-slate-800">
              {item.id.replace(/-/g, " ")}
            </h2>
            <ul className="ps-3 pt-3 flex-row border-[1px] mb-3 rounded-sm">
              {item.refs.map(({ docRef, time, createdAt, completedAt }) => (
                <li key={docRef} className="mb-4 flex text-sm">
                  <p className="">
                    <span className="font-semibold">From </span>
                    {format(new Date(createdAt), "MM/dd/yyyy hh:mm:ss")}
                  </p>
                  <p className="">
                    <span className="font-semibold">&nbsp;To&nbsp;</span>
                    {format(
                      new Date(completedAt),
                      `${
                        !isSameDay(new Date(createdAt), new Date(completedAt))
                          ? "MM/dd/yyyy hh:mm"
                          : "hh:mm:ss"
                      }  `
                    )}
                  </p>
                  <p className="font-semibold">&nbsp;{time}&nbsp;</p>
                </li>
              ))}
            </ul>
            <button
              onClick={() => toggleChartVisibility(item.id)}
              className="ms-auto block underline font-semibold text-sm mb-2"
            >
              {chartVisibility[item.id as any] ? "Hide Chart" : "Show Chart"}
            </button>
            {chartVisibility[item.id as any] && (
              <div className="relative w-[100%] sm:h-[50vh] mx-auto md:h-[60vh] lg:h-[70vh] flex justify-center">
                <Bar data={getChartData(item.refs) as any} />
              </div>
            )}
          </div>
        ))}
      </div>
    )
  );
}
