import { View } from "react-native";
import MiniCalendarBody from "./MiniCalendarBody";
import MiniCalendarHeader from "./MiniCalendarHeader";

interface MiniCalendarProps {
  dateItems: { [date: string]: string[] };
  selectedDate: Date | null;
  currentMonth: Date;
  onDateSelect: (date: Date | null) => void;
  onMonthChange: (date: Date) => void;
}

const MiniCalendar: React.FC<MiniCalendarProps> = (props) => {
  const { dateItems, selectedDate, currentMonth, onDateSelect, onMonthChange } = props;
  
  return (
    <View>
      <MiniCalendarHeader
        currentMonth={currentMonth}
        onMonthChange={onMonthChange}
      />
      <MiniCalendarBody
        dateItems={dateItems}
        selectedDate={selectedDate}
        currentMonth={currentMonth}
        onDateSelect={onDateSelect}
      />
    </View>
  );
};

export default MiniCalendar;
