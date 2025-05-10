import { StyleSheet, View } from 'react-native'

import React, { useState } from 'react'
import { WeekCalendarHeader } from '@hongpung/src/common'

interface TimeSelectorHeaderProps {
    onPressBackButton: () => void
    selectedDate: string
    setDate: (date: string) => void
}

export const TimeSelectorHeader: React.FC<TimeSelectorHeaderProps> = ({ onPressBackButton, selectedDate, setDate }) => {

    return (
        <WeekCalendarHeader changeDate={(date) => setDate(date.toISOString().split('T')[0])} onPressBackButton={onPressBackButton} selectedDate={selectedDate ? new Date(selectedDate) : new Date()} />
    )
}