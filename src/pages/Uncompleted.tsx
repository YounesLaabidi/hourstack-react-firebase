import { useAuth } from "@/contexts/AuthProvider";
import { db } from "@/config/firebase";
import {
  DocumentData,
  QueryDocumentSnapshot,
  QuerySnapshot,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  startAt,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Table as T,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BackSpaceIcon from "@/components/ui/BackSpaceIcon";
import { useTheme } from "@/contexts/ThemeProvider";
import { Task, TaskFirestoreDoc } from "@/types";
import { Button } from "@/components/ui/button";
import { redirect, useNavigate } from "react-router-dom";

// getting the document from tasks collection

export default function Uncompleted() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState<TaskFirestoreDoc[] | null>(null);
  // get the document with is saveForLater
  // and 10 frist items
  // and order by createdDate
  useEffect(() => {
    const q = query(
      // collection(db, `users/${currentUser?.uid}/timers`),
      collection(db, "users", currentUser?.uid as string, "timers"),
      where("isSaveForLater", "==", true)
    );
    const unsubscribe = () => {
      onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const documents = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Task),
          }));

          setTasks(documents);
        } else {
          setTasks([]);
        }
      });
    };

    return unsubscribe;
  }, []);
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
  const saveTask = async (id: string) => {
    // getting the document from tasks collection
    const docRef = doc(db, "users", currentUser?.uid as string, "timers", id);

    await updateDoc(docRef, {
      isSaveForLater: false,
      remaining: "",
    });
  };
  const handleActions = async ({
    action,
    payload,
  }: {
    action: string;
    payload?: {
      id: string;
      name?: string;
      remaining?: string;
    };
  }) => {
    switch (action) {
      case "RESUME":
        // pass the id and remaining time as params
        navigate(
          `/main?id=${payload?.id}&name=${payload?.name}&remaining=${payload?.remaining}`
        );
        break;
      case "DELETE":
        // DELETE DOC
        if (payload) {
          deleteTask(payload.id, payload.name as string);
        }

        // DELETE DOC
        break;
      case "SAVE":
        if (payload) {
          saveTask(payload.id);
        }
        break;
    }
  };

  return (
    <div className="px-7 max-w-screen-xl mx-auto">
      <h1>Uncompleted Tasks</h1>
      <T className="border-gray-800">
        <TableCaption>A list of Uncompleted Tasks</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Task</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Saved At</TableHead>
            <TableHead>Remaining</TableHead>
            <TableHead>Delete</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Save</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks ? (
            tasks.map((task) => {
              return (
                <TableRow key={task.id}>
                  <TableCell className="font-semibold">{task.name}</TableCell>
                  <TableCell>{task.createdAt}</TableCell>
                  <TableCell>{task.completedAt}</TableCell>
                  <TableCell>{task.remaining}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={() =>
                        handleActions({
                          action: "DELETE",
                          payload: { id: task.id, name: task.name },
                        })
                      }
                    ></Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={() =>
                        handleActions({
                          action: "RESUME",
                          payload: {
                            id: task.id,
                            name: task.name,
                            remaining: task.remaining,
                          },
                        })
                      }
                    >
                      xx
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={() =>
                        handleActions({
                          action: "SAVE",
                          payload: { id: task.id, name: task.name },
                        })
                      }
                    >
                      xx
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
    </div>
  );
}
