import { WeekCalendarHeader } from "@hongpung/src/common/ui/WeekCalendarHeader/WeekCalendarHeader"
import { TimeSelector } from "@hongpung/src/widgets/reservation/ui/time-selector"
import { useState } from "react"
import { View } from "react-native"

export const TimeSelectPage = () => {

    const [selectedDate, selectDate] = useState<Date>(new Date())

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <WeekCalendarHeader
                changeDate={selectDate}
                selectedDate={selectedDate}
                onPressBackButton={() => { }}
            />
            <TimeSelector
                date={selectedDate}
            />
        </View>
    )
}