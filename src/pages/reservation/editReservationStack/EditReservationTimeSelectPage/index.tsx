import { View, ScrollView } from "react-native"

import { TimeSelector } from "@hongpung/src/features/reservation/configureReservation/ui/TimeSelector/TimeSelector"
import { TimeSelectorHeader } from "@hongpung/src/features/reservation/configureReservation/ui/TimeSelectorHeader/TimeSelectorHeader"

import { LongButton, TimeArray, TimeFormat } from "@hongpung/src/common"
import { useState } from "react"
import { useOccupiedTimes } from "@hongpung/src/features/reservation/configureReservation/model/useOccupiedTimes"
import { useSelectTimes } from "@hongpung/src/features/reservation/configureReservation/model/useSelectTimes"
import { useEditReservation } from "@hongpung/src/features/reservation/editReservation/model/useEditReservation.context"
import { EditReservationStackScreenProps } from "@hongpung/src/common/navigation"

const TimeSelectPage: React.FC<EditReservationStackScreenProps<"EditReservationTimeSelect">> = ({ navigation }) => {
    const { reservation, setDate, setStartTime, setEndTime } = useEditReservation()
    const [selectedTimeBlocks, setTimeBlocks] = useState<TimeFormat[]>([])

    const { startTime, endTime, date: selectedDate = new Date().toISOString().split('T')[0] } = reservation
    const { occupiedTimes, error, isLoading } = useOccupiedTimes({ date: selectedDate })
    const { toggleTimeBlock } = useSelectTimes({ date: reservation.date, occupiedTimes, startTime, endTime, selectedTimeBlocks, setTimeBlocks })

    return (

        <View style={{ flex: 1, backgroundColor: '#FFF' }}>

            <TimeSelectorHeader
                onPressBackButton={navigation.goBack}
                selectedDate={selectedDate}
                setDate={setDate}
            />

            <TimeSelector
                occupiedTimes={occupiedTimes}
                isLoading={isLoading}
                error={error}
                selectedTimeBlocks={selectedTimeBlocks}
                toggleTimeBlock={toggleTimeBlock}
            />

            {selectedTimeBlocks.length > 0 && (
                <View style={{ paddingTop: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16, backgroundColor: "#FFF" }}>
                    <LongButton
                        innerContent={`${selectedTimeBlocks[0]} ~ ${TimeArray[TimeArray.indexOf(selectedTimeBlocks[selectedTimeBlocks.length - 1]) + 1]
                            }`}
                        color="blue"
                        onPress={() => {
                            navigation.navigate("EditReservationForm");
                            setStartTime(selectedTimeBlocks[0]);
                            setEndTime(TimeArray[TimeArray.indexOf(selectedTimeBlocks[selectedTimeBlocks.length - 1]) + 1]);
                        }}
                    />
                </View>
            )}
        </View>
    )
}

export default TimeSelectPage