import slugify from "slugify";

import { useState, useEffect, useRef } from "react";
import {
  calculateTimeInterval,
  convertTime,
  formatTime,
} from "../utils/TimeUtils";
import { type SearchEntriesType, type Task } from "../types";
import { saveTaskToFirestore } from "../services/firestoreService";
import { useAuth } from "@/contexts/AuthProvider";
import { User } from "firebase/auth";
import { format } from "date-fns";
import { toast } from "sonner";

const useTimer = (searchEntries: SearchEntriesType) => {
  const { currentUser } = useAuth();
  const [timeInput, setTimeInput] = useState<string>(
    searchEntries.remaining || "00:00:00"
  );
  const [taskInput, setTaskInput] = useState<string>(searchEntries.name || "");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [playAudio, setPlayAudio] = useState(false);
  const [inputValidation, setInputValidation] = useState<boolean>(false);
  const [task, setTask] = useState<Task>({
    name: "",
    createdAt: "",
    completedAt: "",
    completed: false,
    time: "",
  });
  const originalTitle = "Hourstack";

  useEffect(() => {
    if (isRunning) {
      document.title = timeInput;
    }
  }, [timeInput]);
  const timeInterval = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function startTimer(): void {
    if (!task.createdAt) {
      const inputValue = inputRef.current?.value ?? "";
      setTask((prev) => ({
        ...prev,
        name: slugify(inputValue, { lower: true, trim: true }) ?? "",
        createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
        time: timeInput,
      }));
    }
    let [hours, minutes, seconds] = convertTime(timeInput);
    timeInterval.current = setInterval(async function () {
      setTimeInput(formatTime([hours, minutes, seconds]));
      if (seconds > 0) {
        seconds--;
      } else if (minutes > 0) {
        minutes--;
        seconds = 59;
      } else if (hours > 0) {
        hours--;
        minutes = 59;
        seconds = 59;
      } else {
        clearInterval(timeInterval.current as NodeJS.Timeout);
        timeInterval.current = null;
        setIsRunning(false);
        setTask((prev) => ({
          ...prev,
          completedAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
          completed: true,
        }));
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    }, 1000);
  }

  function pauseTimer(): void {
    clearInterval(timeInterval.current as NodeJS.Timeout);
    timeInterval.current = null;
    setIsRunning(false);
  }

  function resetTimer(): void {
    setIsRunning(false);
    clearInterval(timeInterval.current as NodeJS.Timeout);
    setTimeInput("00:00:00");
    timeInterval.current = null;
    setTask({
      name: "",
      createdAt: "",
      completedAt: "",
      completed: false,
      time: "",
    });
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    document.title = originalTitle;
  }

  function saveTimer(): void {
    const timeInterval = calculateTimeInterval({
      timeInput,
      startTime: task.time,
    });

    setTask((prev) => ({
      ...prev,
      time: timeInterval,
      completed: true,
      completedAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
    }));

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function saveToLater() {
    const timeInterval = calculateTimeInterval({
      timeInput,
      startTime: task.time,
    });

    setTask((prev) => ({
      ...prev,
      time: timeInterval,
      completed: true,
      completedAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
      isSaveForLater: true,
      remaining: timeInput,
    }));
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  useEffect(() => {
    if (task.completed) {
      toast(
        <div>
          <h5 className="font-semibold text-sm">Task Has Been Saved</h5>
          <h6 className="text-sm">
            {format(Date.now(), "EEEE, MMMM dd, yyyy 'at' h:mm a")}
          </h6>
        </div>
      );
      if (searchEntries.id) {
        saveTaskToFirestore(task, currentUser as User, searchEntries.id);
      } else {
        saveTaskToFirestore(task, currentUser as User);
      }
      resetTimer();
      setPlayAudio(true);
      document.title = originalTitle;
    }
    return () => {};
  }, [task.completed]);

  useEffect(() => {
    if (isRunning) {
      if (!inputRef.current?.value || timeInput === "00:00:00") {
        setIsRunning(false);
        return setInputValidation(true);
      }
      setInputValidation(false);
      startTimer();
    } else {
      pauseTimer();
    }
    return () => clearInterval(timeInterval.current as NodeJS.Timeout);
  }, [isRunning]);
  return {
    taskInput,
    setTaskInput,
    timeInput,
    setTimeInput,
    isRunning,
    setIsRunning,
    resetTimer,
    saveTimer,
    inputRef,
    inputValidation,
    playAudio,
    setPlayAudio,
    saveToLater,
  };
};

export { useTimer };
