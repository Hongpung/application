import { Pressable, View, Text, ViewStyle, StyleProp } from "react-native"

import { Color, Icons } from "@hongpung/src/common"
import { useCallback, useMemo } from "react"

type DateTimeDisplayProps = {
    date?: string | null
    startTime?: string | null
    endTime?: string | null
    style?: StyleProp<ViewStyle> | null
};

const useDateTimeHelpers = (date?: string | null, startTime?: string | null, endTime?: string | null) => {

    const daysOfWeek = useMemo(() => ['일', '월', '화', '수', '목', '금', '토'], []);

    const DateString = useCallback(() => {
        if (date) {
            const selectedDate = new Date(date);
            return `${selectedDate.getFullYear()}.${(selectedDate.getMonth() + 1)}.${selectedDate.getDate()}(${daysOfWeek[selectedDate.getDay()]})`;
        }
        return '';
    }, [date, daysOfWeek]);

    const TimeGapText = useCallback(() => {
        if (startTime && endTime) {
            const e1ndTime = Number(endTime.toString().slice(2)) * 60 + Number(endTime.toString().slice(-2));
            const s1tartTime = Number(startTime.toString().slice(2)) * 60 + Number(startTime.toString().slice(-2));

            const timeGap = e1ndTime - s1tartTime;
            const hourGap = timeGap / 60;
            const minuteGap = timeGap % 60;

            return `${hourGap >= 1 ? `${Math.floor(hourGap)}시간` : ''}${minuteGap > 0 && hourGap >= 1 ? `\n` : ''}${minuteGap > 0 ? `${minuteGap}분` : ''}`;
        }
    }, [startTime, endTime]);

    return { DateString, TimeGapText };
};

export const DateTimeViewer: React.FC<DateTimeDisplayProps> = ({ style, ...props }) => {

    const { date, startTime, endTime } = props

    const { DateString, TimeGapText } = useDateTimeHelpers(date, startTime, endTime)

    return (
        <View style={[{ flexDirection: 'column', gap: 16, paddingVertical: 24 }, style]}>

            <Text style={{ marginHorizontal: 24, fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey500'] }}>예약 일시</Text>

            <View
                style={{ height: 100, marginHorizontal: 40, backgroundColor: Color['grey100'], borderRadius: 10 }}>

                <View style={{ flexDirection: 'row', marginTop: 8, marginLeft: 8, alignItems: 'center' }}>
                    {date &&
                        <>
                            <View style={{ height: 24, width: 24, marginRight: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }} >

                                <Icons name='calendar-outline' size={20} color={Color['grey400']} />

                            </View>

                            <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Light', color: Color['grey700'] }}>

                                {DateString()}

                            </Text>
                        </>
                    }
                </View>

                {startTime && endTime ?
                    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'space-evenly' }}>

                        <Text style={{ fontSize: 18, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey700'] }}>{`${startTime}`}</Text>

                        <View style={{ width: 64, paddingVertical: 8, alignItems: 'center', backgroundColor: '#FFF', borderRadius: 5 }}>
                            <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Light', textAlign: 'center', color: Color['grey700'] }}>{TimeGapText()}</Text>
                        </View>

                        <Text style={{ fontSize: 18, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey700'] }}>{`${endTime}`}</Text>

                    </View>
                    :
                    date ?
                        <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center', justifyContent: 'space-evenly' }}>
                            <Text style={{ fontSize: 16, fontFamily: 'NanumSquareNeo-Light', color: Color['grey700'] }}>시간 선택하러 가기</Text>
                        </View>
                        :
                        <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center', justifyContent: 'space-evenly' }}>
                            <Text style={{ fontSize: 16, fontFamily: 'NanumSquareNeo-Light', color: Color['grey700'] }}>예약 일시 선택하러 가기</Text>
                        </View>
                }
            </View>

        </View>
    )
}