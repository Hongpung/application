import { StyleSheet, View } from 'react-native'

import React, { useState } from 'react'
import { WeekCalendarHeader } from '@hongpung/src/common'

const TimeSelectorHeader: React.FC<{ onPressBackButton: () => void, date: string }> = ({ onPressBackButton,date }) => {

    const [selectedDate, setDate] = useState(date)

    return (
        <View>
            <WeekCalendarHeader changeDate={(date) => setDate(date.toISOString().split('T')[0])} onPressBackButton={onPressBackButton} selectedDate={selectedDate ? new Date(selectedDate) : new Date()} />
        </View>
    )
}

export default TimeSelectorHeader

const styles = StyleSheet.create({})