import Charts from "@/components/charts/index";
import { TimeProvider } from "@/contexts/TimeProvider";
import { useTimer } from "@/hooks/useTimer";
import { Input } from "@/components/ui/input";
import Table from "@/components/table";
import { ModeToggle } from "@/components/ui/mode-toggle";
import ProfileToggle from "@/components/ui/profile-toggle";
import SendVerificationEmail from "@/components/auth/sendVerificationEmail";
import { useAuth } from "@/contexts/AuthProvider";
import AudioPlayer from "@/components/AudioPlayer";
import { useLocation } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

import { type SearchEntriesType } from "@/types";
import { useEffect } from "react";

export default function TimeTracker() {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);

  const searchEntries: SearchEntriesType = Object.fromEntries(
    Array.from(searchParams.entries())
  );
  const {
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
  } = useTimer(searchEntries);
  const { currentUser } = useAuth();
  useEffect(() => {
    document.title = "HourStack";
  });
  return (
    <div className="px-5 max-w-screen-xl mx-auto">
      <AudioPlayer playAudio={playAudio} setPlayAudio={setPlayAudio} />
      {!currentUser?.emailVerified && <SendVerificationEmail />}
      <TooltipProvider>
        <div className="flex gap-2 mt-4 justify-end w-full mb-3">
          <Tooltip>
            <TooltipTrigger
              className="bg-gray-900 text-white w-10 h-10 p-0 rounded-full hover:bg-gray-700 flex justify-center items-center cursor-pointer"
              onClick={() => setIsRunning((prev) => !prev)}
            >
              <img
                src={isRunning ? "start-watch.svg" : "pause-watch.svg"}
                alt="start-watch"
                className="w-8 h-8"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Start</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              className="bg-gray-900 text-white w-10 h-10 p-0 rounded-full hover:bg-gray-700 flex justify-center items-center cursor-pointer"
              disabled={!isRunning}
              onClick={resetTimer}
            >
              <img
                src="reset-watch.svg"
                alt="reset-watch"
                className="w-8 h-8"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Cancel</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              className="bg-gray-900 text-white w-10 h-10 p-0 rounded-full hover:bg-gray-700 flex justify-center items-center cursor-pointer"
              disabled={!isRunning}
              onClick={saveTimer}
            >
              <img src="save-watch.svg" alt="save-watch" className="w-8 h-8" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Save</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              className="bg-gray-900 text-white w-10 h-10 p-0 rounded-full hover:bg-gray-700 flex justify-center items-center cursor-pointer"
              disabled={!isRunning}
              onClick={saveToLater}
            >
              <img src="save-later.svg" alt="save-watch" className="w-7 h-7" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Save To Later</p>
            </TooltipContent>
          </Tooltip>
          <ModeToggle />
          <ProfileToggle />
        </div>{" "}
      </TooltipProvider>
      <div className="text-gray-500 flex flex-col items-center">
        <Input
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          ref={inputRef}
          type="text"
          placeholder="Write your task"
           className={`rounded-sm focus-visible:ring-0 ${
            inputValidation && "border-red-600"
          } dark:text-white dark:placeholder:text-gray-300`}
          required
        />
        <Input
          type="text"
          value={timeInput}
          onChange={(e) => setTimeInput(e.target.value)}
          className={`mt-2 rounded-sm focus-visible:ring-0 ${
            inputValidation && "border-red-600"
          } dark:text-white`}
          required
        />
      </div>
      <TimeProvider>
        <Table />
        <Charts />
      </TimeProvider>
      <Toaster />
    </div>
  );
}
