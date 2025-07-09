import { Pressable } from "react-native";

import { DateTimeViewer } from "@hongpung/src/entities/reservation/ui/DateTimeViewer/DateTimeViewer";
import React from "react";

type DateTimeSelectorProps = {
  date?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  onPress: () => void;
};

export const DateTimeSelector: React.FC<DateTimeSelectorProps> = (props) => {
  const { date, startTime, endTime, onPress } = props;

  return (
    <Pressable onPress={onPress}>
      <DateTimeViewer date={date} endTime={endTime} startTime={startTime} />
    </Pressable>
  );
};
export default React.memo(DateTimeSelector);
