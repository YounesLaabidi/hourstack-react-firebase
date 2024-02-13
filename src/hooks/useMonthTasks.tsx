import { db } from "@/config/firebase";
import { useAuth } from "@/contexts/AuthProvider";
import { TDate, TaskFirestoreDoc } from "@/types";
import {
  endOfDay,
  endOfMonth,
  formatISO,
  isThisMonth,
  startOfMonth,
} from "date-fns";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

export function useMonthlyTask(date: TDate): TaskFirestoreDoc[] {
  const [tasks, setTasks] = useState<TaskFirestoreDoc[]>([]);
  const { currentUser } = useAuth();
  const selectedMonth = date.startOfDayOfMonth || date.startDate;
  const firstDayOfMonth = startOfMonth(selectedMonth);
  let lastDayOfMonth: Date;

  if (isThisMonth(selectedMonth)) {
    lastDayOfMonth = endOfDay(new Date());
  } else {
    lastDayOfMonth = endOfMonth(selectedMonth);
  }

  useEffect(() => {
    const q = query(
      collection(db, "users", currentUser?.uid as string, "timers"),
      where("completedAt", ">=", formatISO(firstDayOfMonth)),
      where("completedAt", "<", formatISO(lastDayOfMonth))
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newTasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTasks(newTasks as TaskFirestoreDoc[]);
    });

    return () => unsubscribe();
  }, [date]);

  return tasks;
}
