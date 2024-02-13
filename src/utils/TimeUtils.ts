import { TimeChangeParams, type TimeData } from "../types";

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

// export function calculateTimeInterval({
//   timeInput,
//   startTime,
// }: TimeData): string {
//   const commonDate = "1970-01-01T";
//   const timeInputDate = new Date(`${commonDate}${timeInput}Z`);
//   const startTimeDate = new Date(`${commonDate}${startTime}Z`);

//   const timeDifference = startTimeDate.getTime() - timeInputDate.getTime();

//   // Convert the time difference to a formatted string (HH:mm:ss)
//   const hours = Math.floor(timeDifference / (1000 * 60 * 60));
//   const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
//   const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

//   return `${hours}:${minutes}:${seconds}`;
// }

export function calculateTimeInterval({
  timeInput,
  startTime,
}: TimeData): string {
  const commonDate = "1970-01-01T";
  const timeInputDate = new Date(`${commonDate}${timeInput}Z`);
  const startTimeDate = new Date(`${commonDate}${startTime}Z`);

  const timeDifference = startTimeDate.getTime() - timeInputDate.getTime();

  // Convert the time difference to a formatted string (HH:mm:ss)
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

/*
export const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};
*/
/*
export const handleTimeChange = ({ e, setDate }: TimeChangeParams) =>
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   setDate: React.Dispatch<React.SetStateAction<Date>>
  {
    const { value, type } = e.target;

    let startDate: string = "";
    let endDate: string = "";

    if (type === "month") {
      // Parse the year and month from the value
      const [year, month] = value.split("-").map((item) => parseInt(item, 10));
      // Set the start date to the first day of the month
      startDate = new Date(year, month - 1, 1).toISOString();
      // Set the end date to the last day of the month
      const lastDayOfMonth = new Date(year, month, 0).getDate();

      endDate = new Date(year, month - 1, lastDayOfMonth).toISOString();
    } else if (type === "week") {
      // Parse the year and week number from the value

      const [year, weekNumber]: string[] =
        value.match(/(\d{4})-W(\d{2})/)?.slice(1) || [];

      const monday = new Date(
        Date.UTC(parseInt(year, 10), 0, 1 + (parseInt(weekNumber, 10) - 1) * 7)
      );
      // Set the start date to the Monday

      startDate = monday.toISOString();

      // Set the end date to the Sunday
      endDate = new Date(
        monday.getTime() + 6 * 24 * 60 * 60 * 1000
      ).toISOString();
    } else if (type === "date") {
      startDate = `${e.target.value}T00:00:00.000Z`;
      endDate = `${e.target.value}T23:59:59.000Z`;
    }

    setDate({ startDate, endDate });
  };
*/
