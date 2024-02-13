import { useEffect, useState } from "react";
import { type TDate, type TaskFirestoreDoc } from "../types";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { formatISO } from "date-fns";
import { db } from "../config/firebase";
import { useAuth } from "@/contexts/AuthProvider";

export default function (date: TDate): TaskFirestoreDoc[] {
  const [tasks, setTasks] = useState<TaskFirestoreDoc[]>([]);
  const { currentUser } = useAuth();
  const startDate = date.startOfDayOfMonth || date.startDate;

  useEffect(() => {
    const q = query(
      collection(db, "users", currentUser?.uid, "timers"),
      where("completedAt", ">=", formatISO(startDate)),
      where("completedAt", "<", formatISO(date.endDate))
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
