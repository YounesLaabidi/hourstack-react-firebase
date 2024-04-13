import Task from "@/components/tasks-list/Task";
import ArrowIcon from "@/components/ui/ArrowIcon";
import Spinner from "@/components/ui/Spinner";
import { db } from "@/config/firebase";
import { useAuth } from "@/contexts/AuthProvider";
import { useTheme } from "@/contexts/ThemeProvider";
import { DataItem } from "@/types";

import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Tasks() {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState<DataItem[] | null | undefined>(undefined);
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
      if (snapshot.empty) {
        setTasks(null);
      } else {
        setTasks(docSnap as DataItem[]);
      }
    });
    document.title = "Tasks";

    return () => unsubscribe();
  }, []);
  return (
    <div>
      {tasks == undefined ? (
        <Spinner />
      ) : tasks === null ? (
        <h2 className="pt-[32vh] flex mx-auto justify-center items-center text-lg font-semibold">
          No Task
          <Link
            className="underline  font-semibold flex gap-1 ms-1 italic"
            to="/main"
          >
            Back To Home
          </Link>
        </h2>
      ) : (
        <div className="py-6 px-5 max-w-screen-xl mx-auto w-64 sm:w-full">
          <Link
            className="underline mb-4 text-sm font-medium flex gap-1"
            to="/main"
          >
            <ArrowIcon theme={theme} />
            Back To Home
          </Link>
          <div className="flex flex-wrap gap-3 max-md:justify-center">
            {tasks.map((task: DataItem) => (
              <Task key={task.id} taskData={task} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
