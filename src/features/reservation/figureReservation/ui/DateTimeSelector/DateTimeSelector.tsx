import { Pressable, View, Text } from "react-native"

import { Color } from "@hongpung/src/common"
import { DateTimeViewer } from "@hongpung/src/entities/reservation/ui/DateTimeViewer/DateTimeViewer"
import React from "react"

type DateTimeSelectorProps = {
    date?: string | null
    startTime?: string | null
    endTime?: string | null
    onPress: () => void
}

export const DateTimeSelector: React.FC<DateTimeSelectorProps> = (props) => {

    const { date, startTime, endTime, onPress } = props

    return (
        <View style={{ flexDirection: 'column', gap: 16, paddingVertical: 24 }}>
            <Text style={{ marginHorizontal: 24, fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey500'] }}>예약 일시</Text>
            <Pressable style={{ flexDirection: 'column', gap: 16, paddingVertical: 24 }} onPress={onPress}>
                <DateTimeViewer date={date} endTime={endTime} startTime={startTime} />
            </Pressable>
        </View>
    )
}
export default React.memo(DateTimeSelector)