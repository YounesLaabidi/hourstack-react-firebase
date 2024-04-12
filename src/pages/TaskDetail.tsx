import { db } from "@/config/firebase";
import { useAuth } from "@/contexts/AuthProvider";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { calculateTotalTimeInHours, formatDate } from "@/components/tasks-list";
export default function TaskDetail() {
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
    ``;
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
      refs: task?.refs.filter((item, idx) => idx !== index) as any,
    };
    if (task?.refs.length === 1) {
      await deleteDoc(
        doc(db, "users", currentUser?.uid as string, "tasks", id as string)
      );
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
    "...loading"
  ) : task === null ? (
    <div>
      <p>no tasks</p>
      <a href="">back to tasks</a>
    </div>
  ) : (
    <div>
      <h1>{id}</h1>
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
                  <TableCell>{item.createdAt}</TableCell>
                  <TableCell>{item.completedAt}</TableCell>
                  <TableCell>{item.time}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={() => deleteTask(item.docRef, index)}
                    ></Button>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <p className="w-72">no uncompleted tasks</p>
          )}
        </TableBody>
      </T>
      <div>
        <Bar data={getChartData(task.refs) as any} />
      </div>
    </div>
  );
}
