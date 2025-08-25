import { Pressable } from "react-native";

import { DateTimeViewer } from "@hongpung/src/entities/reservation";
import React from "react";
import { Color } from "@hongpung/src/common";

type DateTimeSelectorProps = {
  date?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  onPress: () => void;
};

export const DateTimeSelector: React.FC<DateTimeSelectorProps> = (props) => {
  const { date, startTime, endTime, onPress } = props;

  return (
    <Pressable onPress={onPress} style={{ backgroundColor: Color["white"] }}>
      <DateTimeViewer date={date} endTime={endTime} startTime={startTime} />
    </Pressable>
  );
};
export default React.memo(DateTimeSelector);
