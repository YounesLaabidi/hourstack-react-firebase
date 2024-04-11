import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { type Task } from "../types";
import { db } from "../config/firebase";
import { User } from "firebase/auth";

export const saveTaskToFirestore = async (
  task: Task,
  currentUser: User,
  docId?: string
): Promise<void> => {
  try {
    const timersDocRef = collection(db, "users", currentUser.uid, "timers");
    // if this is from uncompleted update the document
    if (docId) {
      const docRef = doc(
        db,
        "users",
        currentUser?.uid as string,
        "timers",
        docId
      );

      await updateDoc(docRef, {
        isSaveForLater: false,
        remaining: "",
      });
    }
    // add the saved later task to database
    const addedDoc = await addDoc(timersDocRef, task);
    const tasksCollectionRef = collection(
      db,
      "users",
      currentUser.uid,
      "tasks"
    );
    const tasksDocRef = doc(tasksCollectionRef, task.name);

    const tasksDoc = await getDoc(tasksDocRef);

    if (tasksDoc.exists()) {
      await updateDoc(tasksDocRef, {
        refs: arrayUnion({
          docRef: addedDoc.id,
          createdAt: new Date().toISOString(),
          completedAt: task.completedAt,
          time: task.time,
        }),
      });
    } else {
      await setDoc(tasksDocRef, {
        refs: [
          {
            docRef: addedDoc.id,
            createdAt: task.createdAt,
            completedAt: task.completedAt,
            time: task.time,
          },
        ],
      });
    }
  } catch (error) {}
};
