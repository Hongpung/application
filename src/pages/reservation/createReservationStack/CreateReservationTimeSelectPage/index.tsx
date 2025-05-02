import { ScrollView, View } from "react-native";

import { TimeSelector } from "@hongpung/src/features/reservation/configureReservation/ui/TimeSelector/TimeSelector";
import TimeSelectorHeader from "@hongpung/src/features/reservation/configureReservation/ui/TimeSelectorHeader/TimeSelectorHeader";

import { useCreateReservation } from "@hongpung/src/features/reservation/createReservation/model/useCreateReservation.context";
import { LongButton, TimeArray, TimeFormat } from "@hongpung/src/common";
import { useState } from "react";
import { useOccupiedTimes } from "@hongpung/src/features/reservation/configureReservation/model/useOccupiedTimes";
import { useSelectTimes } from "@hongpung/src/features/reservation/configureReservation/model/useSelectTimes";
import { CreateReservationStackScreenProps } from "@hongpung/src/common/navigation/createReservation";

const CreateReservationTimeSelectScreen: React.FC<
  CreateReservationStackScreenProps<"CreateReservationTimeSelect">
> = ({ navigation }) => {
  const { reservation, setDate, setStartTime, setEndTime } =
    useCreateReservation();
  const [selectedTimeBlocks, setTimeBlocks] = useState<TimeFormat[]>([]);

  const {
    startTime,
    endTime,
    date: selectedDate = new Date().toISOString().split("T")[0],
  } = reservation;
  const { occupiedTimes, error, isLoading } = useOccupiedTimes({
    date: selectedDate,
  });
  const { toggleTimeBlock } = useSelectTimes({
    occupiedTimes,
    startTime,
    endTime,
    selectedTimeBlocks,
    setTimeBlocks,
  });

  console.log(occupiedTimes);
  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <TimeSelectorHeader
        onPressBackButton={navigation.goBack}
        selectedDate={selectedDate}
        setDate={setDate}
      />
      <ScrollView>
        <TimeSelector
          occupiedTimes={occupiedTimes}
          isLoading={isLoading}
          error={error}
          selectedTimeBlocks={selectedTimeBlocks}
          toggleTimeBlock={toggleTimeBlock}
        />
      </ScrollView>
      {selectedTimeBlocks.length > 0 && (
        <LongButton
          innerContent={`${selectedTimeBlocks[0]} ~ ${
            TimeArray[TimeArray.indexOf(selectedTimeBlocks[selectedTimeBlocks.length - 1]) + 1]
          }`}
          color="blue"
          onPress={() => {
            navigation.navigate("CreateReservationForm");
            setStartTime(selectedTimeBlocks[0]);
            setEndTime(TimeArray[TimeArray.indexOf(selectedTimeBlocks[selectedTimeBlocks.length - 1]) + 1]);
          }}
        />
      )}
    </View>
  );
};

export default CreateReservationTimeSelectScreen;
