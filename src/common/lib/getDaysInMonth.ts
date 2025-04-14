export const getDaysInMonth = (date: Date): number[][] => {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const prevDays = (day: number) => (day === 0 ? 6 : day - 1);
  const emptyDays = Array.from(
    { length: prevDays(firstDayOfMonth.getDay()) },
    () => 0
  );
  const monthDays = Array.from(
    { length: lastDayOfMonth.getDate() },
    (_, i) => i + 1
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