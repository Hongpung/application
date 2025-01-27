import { View, Text, ScrollView, Dimensions } from "react-native";
import { BreifSession, Session } from "@hongpung/pages/MyPage/MyPractices/MyPracticesScreen";
import PracticeCard from "@hongpung/components/cards/PracticeCard";
import { useCalendar } from "./useCalendar.context";
import { useCallback, useEffect, useState } from "react";
import { Color } from "@hongpung/ColorSet";

const { width } = Dimensions.get('window')

const useSessionLogList = () => {

    const { selectedDate, sessionList } = useCalendar()
    const [matchedSessionList, setMatchedSessionList] = useState<Record<string, BreifSession[]>>(sessionList || {})

    const matchSessionListToDate = useCallback(() => {

        if (!!selectedDate) {

            const dateString = new Date(selectedDate.getTime() + 9 * 60 * 60 * 1000).toISOString().split('T')[0];
            const matchedSessionListBucket: Record<string, BreifSession[]> = {};

            matchedSessionListBucket[dateString] = sessionList[dateString]

            setMatchedSessionList(matchedSessionListBucket)
            return;
        }

        setMatchedSessionList(sessionList)

    }, [sessionList, selectedDate])

    useEffect(() => {

        matchSessionListToDate();

    }, [sessionList, selectedDate])

    return { matchedSessionList }
}

const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

export const SessionLogList: React.FC<{ onPress: (session: BreifSession) => void }> = ({ onPress }) => {

    const { matchedSessionList } = useSessionLogList();

    return (
        <View style={{ flex: 1 }}>
            <ScrollView bounces={false} contentContainerStyle={{}}>
                {Object.entries(matchedSessionList).map(([dateKey, session]) => {
                    const date = new Date(dateKey);

                    if (!session) return (
                        <View key={dateKey} style={{height:200}}>
                            {/* 날짜 출력 */}
                            <Text style={{ marginVertical: 4, marginHorizontal: 28, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey500'], fontSize: 14 }}>
                                {date.getFullYear()}.{date.getMonth() + 1}.{date.getDate()}({daysOfWeek[date.getDay()]})
                            </Text>
                            <View style={{ width, height: '80%', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: Color['grey300'], fontSize: 18 }}>참여한 일정이 없습니다.</Text>
                            </View>
                        </View>
                    )
                    return (
                        <View key={dateKey}>
                            {/* 날짜 출력 */}
                            <Text style={{ marginVertical: 4, marginHorizontal: 28, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey500'], fontSize: 14 }}>
                                {date.getFullYear()}.{date.getMonth() + 1}.{date.getDate()}({daysOfWeek[date.getDay()]})
                            </Text>

                            {/* 해당 날짜의 모든 세션들을 출력 */}
                            {session?.map((session, index) => (
                                <View key={dateKey + '-' + index} style={{ marginVertical: 6 }}>
                                    <PracticeCard session={session} onPress={onPress} />
                                </View>
                            ))}
                        </View>
                    )
                })}
            </ScrollView>
        </View >
    )
}