import { ScrollView, View } from "react-native"

import { TimeSelector } from "@hongpung/src/features/reservation/configureReservation/ui/TimeSelector/TimeSelector"
import TimeSelectorHeader from "@hongpung/src/features/reservation/configureReservation/ui/TimeSelectorHeader/TimeSelectorHeader"

import { useCreateReservation } from "@hongpung/src/features/reservation/createReservation/model/useCreateReservation.context"
import { TimeFormat } from "@hongpung/src/common"
import { useState } from "react"
import { useOccupiedTimes } from "@hongpung/src/features/reservation/figureReservation/model/useOccupiedTimes"
import { useSelectTimes } from "@hongpung/src/features/reservation/figureReservation/model/useSelectTimes"
import { useNavigation } from "@react-navigation/native"
import { useEditReservation } from "@hongpung/src/features/reservation/editReservation/model/useEditReservation.context"

const TimeSelectPage = () => {

    const navigation = useNavigation()

    const { reservation, setDate } = useEditReservation()
    const [selectedTimeBlocks, setTimeBlocks] = useState<TimeFormat[]>([])

    const { startTime, endTime, date: selectedDate = new Date().toISOString().split('T')[0] } = reservation
    const { occupiedTimes, error, isLoading } = useOccupiedTimes({ date: selectedDate })
    const { toggleTimeBlock } = useSelectTimes({ occupiedTimes, startTime, endTime, selectedTimeBlocks, setTimeBlocks })

    return (

        <ScrollView style={{ flex: 1, backgroundColor: '#FFF' }}>

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

        </ScrollView>
    )
}

export default TimeSelectPage