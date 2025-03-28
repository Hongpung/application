import { View } from "react-native"

import { dateState } from "@hongpung/src/features/reservation/model/reservationFormState"
import { TimeSelector } from "@hongpung/src/features/reservation/selectTime/ui/TimeSelector/TimeSelector"
import TimeSelectorHeader from "@hongpung/src/features/reservation/selectTime/ui/TimeSelector/TimeSelectorHeader"

import { useRecoilValue } from "recoil"

export const TimeSelectPage = () => {

    const selectedDate = useRecoilValue(dateState)

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <TimeSelectorHeader
                onPressBackButton={() => { }}
            />
            <TimeSelector
                date={selectedDate?new Date(selectedDate):new Date()}
            />
        </View>
    )
}