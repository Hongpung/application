import { useState } from "react"
import { View, Text } from "react-native"
import { useNavigation } from "@react-navigation/native"

import { WeekCalendarHeader } from "@hongpung/src/common/ui/WeekCalendarHeader/WeekCalendarHeader"

import { useLoadDailyReservationsFetch } from "@hongpung/src/entities/reservation"
import { ReservationCard } from "@hongpung/src/entities/reservation/ui/ReservationCard/ReservationCard"

import { TimeLine } from "@hongpung/src/widgets/reservation/ui/TimeLine/TimeLine"

type DailyReservationListProps = {
    date?: Date
}

export const DailyReservationListPage: React.FC<DailyReservationListProps> = ({ date }) => {

    const navigation = useNavigation();
    const [selectedDate, selectDate] = useState<Date>(date || new Date());
    const { data: reservations, isLoading, error } = useLoadDailyReservationsFetch({ date: selectedDate })

    if (error) {
        return null
    }

    if (isLoading)
        return (
            <View>
                <Text>
                    로딩중...
                </Text>
            </View>
        )

    return (
        <View>
            <WeekCalendarHeader
                changeDate={(newDate) => { selectDate(newDate) }}
                onPressBackButton={() => {
                    //이전 화면으로 이동
                    if (navigation.canGoBack())
                        navigation.goBack();
                }}
                selectedDate={selectedDate}
            />
            <TimeLine>
                {reservations?.map(reservation =>
                (<ReservationCard
                    reservation={reservation}
                    onPress={() => {
                        //예약 화면으로 이동
                    }}
                />)
                )}
            </TimeLine>
        </View>
    )
}