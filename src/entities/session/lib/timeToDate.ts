import dayjs from "dayjs";

export const timeToDate = (time: string): Date => {
  const [hour, minute, second = 0] = time.split(":").map(Number);

  return dayjs().hour(hour).minute(minute).second(second).toDate();
};
