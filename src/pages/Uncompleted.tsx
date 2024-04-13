import { useAuth } from "@/contexts/AuthProvider";
import { db } from "@/config/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
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
import { useTheme } from "@/contexts/ThemeProvider";
import { Task, TaskFirestoreDoc } from "@/types";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import Spinner from "@/components/ui/Spinner";
import { Toaster, toast } from "sonner";
import ArrowIcon from "@/components/ui/ArrowIcon";

// getting the document from tasks collection

export default function Uncompleted() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState<TaskFirestoreDoc[] | null | undefined>(
    undefined
  );

  useEffect(() => {
    document.title = "Saved Task";
    const q = query(
      collection(db, "users", currentUser?.uid as string, "timers"),
      where("isSaveForLater", "==", true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
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
    return () => unsubscribe();
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
        toast(
          <div>
            <h5 className="font-semibold text-sm">Task Has Been Deleted</h5>
            <h6 className="text-sm">
              {format(Date.now(), "EEEE, MMMM dd, yyyy 'at' h:mm a")}
            </h6>
          </div>
        );
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

  {
    tasks === undefined && <Spinner />;
  }

  return (
    <div className="px-7 max-w-screen-xl mx-auto pt-8">
      <Link
        className="underline mb-4 text-sm font-medium flex gap-1"
        to="/main"
      >
        <ArrowIcon theme={theme} />
        Back To Home
      </Link>
      <h1 className="text-xl font-bold mb-3">Saved To Later Tasks</h1>
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
        <TooltipProvider>
          <TableBody>
            {tasks &&
              tasks.map((task) => {
                return (
                  <TableRow key={task.id}>
                    <TableCell className="font-semibold">{task.name}</TableCell>
                    <TableCell>
                      {format(
                        new Date(task.createdAt),
                        "yyyy/mm/dd (hh:mm:ss)"
                      )}
                    </TableCell>
                    <TableCell>
                      {format(
                        new Date(task.createdAt),
                        "yyyy/mm/dd (hh:mm:ss)"
                      )}
                    </TableCell>
                    <TableCell>{task.remaining}</TableCell>
                    <TableCell className="text-left">
                      <Tooltip>
                        <TooltipTrigger>
                          {" "}
                          <Button
                            className="bg-transparent p-0 hover:bg-transparent"
                            onClick={() =>
                              handleActions({
                                action: "DELETE",
                                payload: { id: task.id, name: task.name },
                              })
                            }
                          >
                            <img
                              className="w-[40px]"
                              src="/remove-icon.svg"
                              alt="remove-icon"
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Remove</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-left">
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            className="bg-transparent p-0 hover:bg-transparent"
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
                            <img
                              className="w-[40px]"
                              src="/resume-icon.svg"
                              alt="resume-icon"
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Resume</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-left">
                      <Tooltip>
                        <TooltipTrigger>
                          {" "}
                          <Button
                            className="bg-transparent p-0 hover:bg-transparent"
                            onClick={() =>
                              handleActions({
                                action: "SAVE",
                                payload: { id: task.id, name: task.name },
                              })
                            }
                          >
                            <img
                              className="w-[34px]"
                              src="/save-icon.svg"
                              alt="save-icon"
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Save Anyway</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </TooltipProvider>
      </T>
      <Toaster />
    </div>
  );
}
