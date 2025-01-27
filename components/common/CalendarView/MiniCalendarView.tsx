import React from 'react';
import { Dimensions, View } from "react-native";
import { CalendarProvider } from "./useCalendar.context";


const { width } = Dimensions.get('window')

interface CalendarViewProps {
    // initialDate: Date;
    fetchUrl: string;
    children: React.ReactNode;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ fetchUrl, children }) => {

    return (
        <CalendarProvider fetchUrl={fetchUrl}>
            <View style={{ position:'relative', flex: 1, width, backgroundColor: '#FFF', gap: 12, alignItems: 'center' }}>
                {children}
            </View>
        </CalendarProvider>
    )
}
