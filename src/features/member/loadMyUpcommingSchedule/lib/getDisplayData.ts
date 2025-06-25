import { Color } from "@hongpung/src/common";

export const getDisplayDate = (date: string) => {
  const UTCTime = new Date();
  const korTime = new Date(UTCTime.getTime() + 9 * 60 * 60 * 1000);
  const korDate = korTime.toISOString().split("T")[0];

  const targetDate = new Date(date);
  const today = new Date(korDate);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const dayOfWeek = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  if (korDate === date)
    return {
      string: "오늘",
      style: { color: Color["grey700"], fontSize: 16 },
    };
  if (tomorrow.toISOString().split("T")[0] === date)
    return {
      string: "내일",
      style: { color: Color["grey700"], fontSize: 14 },
    };
  if (targetDate >= startOfWeek && targetDate <= endOfWeek)
    return { string: "이번 주", style: { color: Color["grey500"] } };
  if (targetDate >= startOfMonth && targetDate <= endOfMonth)
    return { string: "이번 달", style: { color: Color["grey400"] } };
  return { string: date, style: { color: Color["grey400"] } };
};
