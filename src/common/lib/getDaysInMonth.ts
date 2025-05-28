import dayjs from "dayjs";

export const getDaysInMonth = (date: Date): number[][] => {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDayOfMonth = dayjs().year(year).month(month).date(1);
  const lastDayOfMonth = dayjs()
    .year(year)
    .month(month + 1)
    .date(0);

  const prevDays = (day: number) => (day === 0 ? 6 : day - 1);
  const emptyDays = Array.from(
    { length: prevDays(firstDayOfMonth.day()) },
    () => 0,
  );
  const monthDays = Array.from(
    { length: lastDayOfMonth.date() },
    (_, i) => i + 1,
  );
  const fullDaysArray = [...emptyDays, ...monthDays];

  const fullMonth = [
    ...fullDaysArray,
    ...Array.from({ length: 7 - (fullDaysArray.length % 7 || 7) }, () => 0),
  ];

  return fullMonth.reduce((acc: number[][], day, index) => {
    if (index % 7 === 0) acc.push([]);
    acc[acc.length - 1].push(day);
    return acc;
  }, []);
};
