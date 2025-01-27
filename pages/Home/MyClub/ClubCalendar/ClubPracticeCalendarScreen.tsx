import { StyleSheet } from 'react-native'
import React from 'react'
import { Color } from '@hongpung/ColorSet'
import { useNavigation } from '@react-navigation/native'
import MiniCalendar from '@hongpung/components/common/CalendarView'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MyClubStackStackParamList } from '@hongpung/nav/MyClubStack'


type ClubMembersProps = NativeStackNavigationProp<MyClubStackStackParamList, 'ClubCalendar'>

const ClubPracticeCalendarScreen: React.FC = () => {

    const navigation = useNavigation<ClubMembersProps>();
    const myPracticeUrl = `${process.env.SUB_API}/session-log/club`
    // `${process.env.BASE_URL}/reservation/year-month-member?year=${calendarMonth.getFullYear()}&month=${Number(calendarMonth.getMonth()) + 1}&memberId=${userInfo?.memberId!}`,

    return (
        <MiniCalendar fetchUrl={myPracticeUrl}>
            <MiniCalendar.Header />
            <MiniCalendar.Body />
            <MiniCalendar.SessionLogList onPress={(session) => { navigation.push('MyClubPracticeInfo', { reservationId: session.sessionId }) }} />
        </MiniCalendar>
    )
}

export default ClubPracticeCalendarScreen

const styles = StyleSheet.create({
    MonthRow: {
        height: 24,
        marginHorizontal: 32,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    MonthNumber: {
        width: 56,
        textAlign: 'center',
        fontSize: 20,
        marginHorizontal: 4,
        fontFamily: 'NanumSquareNeo-Bold',
        color: Color['grey700']
    },
    MonthBtn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
    },
    DayText: {
        width: 28,
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'NanumSquareNeo-Bold',
        color: Color['grey500'],
    },
    CalendarText: {
        width: 28,
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'NanumSquareNeo-Bold',
        color: Color['grey300'],
        marginVertical: 2,
    }
})