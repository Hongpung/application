import dayjs from "dayjs";

export const isEditible = (date: string) => {
  const koreaTime = dayjs();
  const limitTime = dayjs(date).hour(0).minute(0).second(0).subtract(2, "hour");
  return koreaTime.isBefore(limitTime);
};
