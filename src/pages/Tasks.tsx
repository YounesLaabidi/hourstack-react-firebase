import { db } from "@/config/firebase";
import { useAuth } from "@/contexts/AuthProvider";
import { DataItem } from "@/types";

import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
function Task({ taskData }: { taskData: DataItem }) {
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

  return (
    <div className="border-2">
      <p>{taskData.id}</p>
      <p>{taskData.refs.length}</p>
      <p>total number {toTimeString(totalNumberOfHours)} :</p>
      <p>max {toTimeString(maxiumNumberOfHoursPerDay)} :</p>
      <p>minimum {toTimeString(minimunNumberOfHoursPerDay)} :</p>
      <Link to={`/tasks/${taskData.id}`}>view more</Link>
    </div>
  );
}

export default function Tasks() {
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

    return () => unsubscribe();
  }, []);
  return (
    <div>
      {tasks === undefined
        ? "loading"
        : tasks === null
        ? "empty"
        : tasks.map((task: DataItem) => <Task key={task.id} taskData={task} />)}
    </div>
  );
}
