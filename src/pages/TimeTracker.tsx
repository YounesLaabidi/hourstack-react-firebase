import Charts from "@/components/charts/index";
import TasksList from "@/components/tasks-list";
import { Button } from "@/components/ui/button";
import { TimeProvider } from "@/contexts/TimeProvider";
import { useTimer } from "@/hooks/useTimer";
import { Input } from "@/components/ui/input";
import Table from "@/components/table";
import { ModeToggle } from "@/components/ui/mode-toggle";
import ProfileToggle from "@/components/ui/profile-toggle";
import SendVerificationEmail from "@/components/auth/sendVerificationEmail";
import { useAuth } from "@/contexts/AuthProvider";
import AudioPlayer from "@/components/AudioPlayer";
export default function TimeTracker() {
  const {
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
  } = useTimer();
  const { currentUser } = useAuth();
  return (
    <div className="px-5 max-w-screen-xl mx-auto">
      <AudioPlayer playAudio={playAudio} setPlayAudio={setPlayAudio} />
      {!currentUser?.emailVerified && <SendVerificationEmail />}
      <div className="flex gap-2 mt-4 justify-end w-full mb-3">
        <Button
          className="bg-gray-900 text-white w-10 h-10 p-0 rounded-full hover:bg-gray-700"
          onClick={() => setIsRunning((prev) => !prev)}
        >
          <img
            src={isRunning ? "start-watch.svg" : "pause-watch.svg"}
            alt="start-watch"
            className="w-8 h-8"
          />
        </Button>
        <Button
          className="bg-gray-900 text-white w-10 h-10 p-0 rounded-full hover:bg-gray-700  disabled:opacity-80"
          disabled={!isRunning}
          onClick={resetTimer}
        >
          <img src="reset-watch.svg" alt="reset-watch" className="w-8 h-8" />
        </Button>
        <Button
          className="bg-gray-900 text-white w-10 h-10 p-0 rounded-full hover:bg-gray-700  disabled:opacity-80"
          disabled={!isRunning}
          onClick={saveTimer}
        >
          <img src="save-watch.svg" alt="save-watch" className="w-8 h-8" />
        </Button>{" "}
        <ModeToggle />
        <ProfileToggle />
      </div>
      <div className="text-gray-500 flex flex-col items-center">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Write your task"
          // className="rounded-sm focus-visible:ring-0"
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
        <div className="">
          <h2 className="font-bold text-3xl text-center mb-5 mt-5">Tasks</h2>
          <TasksList />
        </div>
      </TimeProvider>
    </div>
  );
}
