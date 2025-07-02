import dayjs from "dayjs";

export const isOpen = ((): boolean => {
  const koreaTime = dayjs();
  const openTime = dayjs().hour(10).minute(0).second(0).millisecond(0);
  const closeTime = dayjs().hour(22).minute(0).second(0).millisecond(0);

  console.log(openTime, closeTime, koreaTime);
  return openTime.isBefore(koreaTime) && closeTime.isAfter(koreaTime);
})();
