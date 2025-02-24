import { TimeLine } from "@hongpung/src/widgets/reservation/ui/time-line"
import { WeekCalendarHeader } from "@hongpung/src/common/ui/week-calendar-header/week-calendar-header"
import { useState } from "react"
import { View, Text } from "react-native"
import { useDailyReservations } from "@hongpung/src/widgets/reservation/lib/use-daily-reservations"
import { ReservationCard } from "@hongpung/src/features/reservation"

type DailyReservationListProps = {
    date?: Date
}

export const DailyReservationListPage: React.FC<DailyReservationListProps> = ({ date }) => {

    const [selectedDate, selectDate] = useState<Date>(date || new Date());
    const { reservations, isLoading, isError } = useDailyReservations(selectedDate)

    if (isError) {
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
                }}
                selectedDate={selectedDate}
            />
            <TimeLine>
                {reservations.map(reservation =>
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