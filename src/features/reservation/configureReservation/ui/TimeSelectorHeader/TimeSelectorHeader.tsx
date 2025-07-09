import { WeekCalendarHeader } from "@hongpung/src/common";
import dayjs from "dayjs";

interface TimeSelectorHeaderProps {
  onPressBackButton: () => void;
  selectedDate: string;
  setDate: (date: string) => void;
}

export const TimeSelectorHeader: React.FC<TimeSelectorHeaderProps> = ({
  onPressBackButton,
  selectedDate,
  setDate,
}) => {
  return (
    <WeekCalendarHeader
      changeDate={(date) => setDate(dayjs(date).format("YYYY-MM-DD"))}
      onPressBackButton={onPressBackButton}
      selectedDate={
        selectedDate ? dayjs(selectedDate).toDate() : dayjs().toDate()
      }
      isLimit={true}
    />
  );
};
