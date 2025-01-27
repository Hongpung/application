import React from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import { MyPageParamList } from '@hongpung/nav/MyPageStack'
import { User } from '@hongpung/UserType'
import { sessionType } from '@hongpung/pages/Reservation/SessionTypes'
import { reservationType } from '@hongpung/pages/Reservation/ReservationInterface'

import MiniCalendar from '@hongpung/components/common/CalendarView'

type MyPracticesNavProps = NativeStackNavigationProp<MyPageParamList, 'MyPractices'>;

export interface AttendanceStatus { member: User, status: '참가' | '출석' | '결석' | '지각' };

export interface Session {
    sessionId: number;
    date: string;
    title: string;
    startTime: string;
    endTime: string;
    creatorId: number;
    extendCount: number;
    creatorName: string;
    creatorNickname: string | null;
    sessionType: sessionType;
    reservationType?: reservationType;
    participationAvailable: boolean;
    returnImageUrl: string[];
    forceEnd: boolean;
    attendanceList: AttendanceStatus[];
}

export type BreifSession = Omit<Session, 'returnImageUrl' | 'extendCount' | 'attendanceList'>;


const MyPracticesScreen: React.FC = () => {

    const navigation = useNavigation<MyPracticesNavProps>();
    const myPracticeUrl = `${process.env.SUB_API}/session-log`

    return (
        <MiniCalendar fetchUrl={myPracticeUrl}>
            <MiniCalendar.Header />
            <MiniCalendar.Body />
            <MiniCalendar.SessionLogList onPress={(session) => { navigation.push('MyPracticeInfo', { sessionId: session.sessionId }) }} />
        </MiniCalendar>
    )
}

export default MyPracticesScreen