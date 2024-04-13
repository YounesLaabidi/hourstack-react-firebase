import { type TimeData } from "../types";

export const convertTime = (time: string): number[] => {
  const [hours, seconds, minutes] = time
    .split(":")
    .map((item) => parseInt(item, 10));
  return [hours, seconds, minutes];
};

export const formatTime = ([hours, minutes, seconds]: number[]): string => {
  const formatedHours = hours < 10 ? `0${hours}` : hours;
  const formatedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formatedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${formatedHours}:${formatedMinutes}:${formatedSeconds}`;
};

export function calculateTimeInterval({
  timeInput,
  startTime,
}: TimeData): string {
  const commonDate = "1970-01-01T";
  const timeInputDate = new Date(`${commonDate}${timeInput}Z`);
  const startTimeDate = new Date(`${commonDate}${startTime}Z`);

  const timeDifference = startTimeDate.getTime() - timeInputDate.getTime();

   const hours = Math.floor(timeDifference / (1000 * 60 * 60))
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000)
    .toString()
    .padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}
