import { View } from "react-native";

import { TimeSelector } from "@hongpung/src/features/reservation/configureReservation/ui/TimeSelector/TimeSelector";
import { TimeSelectorHeader } from "@hongpung/src/features/reservation/configureReservation/ui/TimeSelectorHeader/TimeSelectorHeader";

import { LongButton, TimeArray, TimeFormat } from "@hongpung/src/common";
import { useMemo, useState } from "react";
import { useOccupiedTimes } from "@hongpung/src/features/reservation/configureReservation/model/useOccupiedTimes";
import { useSelectTimes } from "@hongpung/src/features/reservation/configureReservation/model/useSelectTimes";
import { useEditReservation } from "@hongpung/src/features/reservation/editReservation/model/useEditReservation.context";
import { EditReservationStackScreenProps } from "@hongpung/src/common/navigation";

import dayjs from "dayjs";

const TimeSelectPage: React.FC<
  EditReservationStackScreenProps<"EditReservationTimeSelect">
> = ({ navigation }) => {
  const { reservation, prevReservation, setDate, setStartTime, setEndTime } =
    useEditReservation();

  const { startTime, endTime, date: prevDate } = reservation;
  const [selectedDate, setSelectedDate] = useState<string>(
    prevDate || dayjs().format("YYYY-MM-DD"),
  );
  const [selectedTimeBlocks, setTimeBlocks] = useState<TimeFormat[]>([]);

  console.log("selectedDate", reservation);
  const { occupiedTimes, error, isLoading } = useOccupiedTimes({
    date: selectedDate,
    reservationId: prevReservation.reservationId,
  });

  const { toggleTimeBlock } = useSelectTimes({
    date: selectedDate,
    prevDate,
    occupiedTimes,
    startTime,
    endTime,
    selectedTimeBlocks,
    setTimeBlocks,
  });

  const newTimes = useMemo(() => {
    const newStartTime = selectedTimeBlocks[0];
    const newEndTime =
      TimeArray[
        TimeArray.indexOf(selectedTimeBlocks[selectedTimeBlocks.length - 1]) + 1
      ];
    return { newStartTime, newEndTime };
  }, [selectedTimeBlocks]);

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <TimeSelectorHeader
        onPressBackButton={() =>
          navigation.replace("EditReservationDateSelect")
        }
        selectedDate={selectedDate}
        setDate={setSelectedDate}
      />

      <TimeSelector
        occupiedTimes={occupiedTimes}
        isLoading={isLoading}
        error={error}
        selectedTimeBlocks={selectedTimeBlocks}
        toggleTimeBlock={toggleTimeBlock}
      />

      {selectedTimeBlocks.length > 0 && (
        <View
          style={{
            paddingTop: 16,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            backgroundColor: "#FFF",
          }}
        >
          <LongButton
            innerContent={`${selectedTimeBlocks[0]} ~ ${
              TimeArray[
                TimeArray.indexOf(
                  selectedTimeBlocks[selectedTimeBlocks.length - 1],
                ) + 1
              ]
            }`}
            color="blue"
            onPress={() => {
              navigation.navigate("EditReservationForm");
              const { newStartTime, newEndTime } = newTimes;
              console.log("newStartTime", newStartTime);
              console.log("newEndTime", newEndTime);
              setDate(selectedDate);
              setStartTime(selectedTimeBlocks[0]);
              setEndTime(
                TimeArray[
                  TimeArray.indexOf(
                    selectedTimeBlocks[selectedTimeBlocks.length - 1],
                  ) + 1
                ],
              );
            }}
          />
        </View>
      )}
    </View>
  );
};

export default TimeSelectPage;
