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
    const myPracticeUrl = `${process.env.EXPO_PUBLIC_BASE_URL}/session-log/club`

    return (
        <MiniCalendar fetchUrl={myPracticeUrl}>
            <MiniCalendar.Header />
            <MiniCalendar.Body />
            <MiniCalendar.SessionLogList onPress={(session) => { navigation.push('MyClubPracticeInfo', { reservationId: session.sessionId }) }} />
        </MiniCalendar>
    )
}

export default ClubPracticeCalendarScreen