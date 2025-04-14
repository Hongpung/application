import { useRef } from "react";
import { ScrollView, View, Text, Pressable, Dimensions } from "react-native"

import { Color, TimeArray, TimeFormat } from '@hongpung/src/common'

type TimeLineProps = {
    occupiedTimes: TimeFormat[],
    isLoading: boolean,
    error: Error | null,
    selectedTimeBlocks: TimeFormat[],
    toggleTimeBlock: (time: TimeFormat) => void
}

const { width } = Dimensions.get('window')

/**
 *   AM 10~ PM10까지의 시간 선택(눈금 표시)
 */
export const TimeSelector: React.FC<TimeLineProps> = ({

    occupiedTimes,
    isLoading,
    error,
    selectedTimeBlocks,
    toggleTimeBlock

}) => {


    const TimesRef = useRef<ScrollView | null>(null)

    if (isLoading && occupiedTimes == null)
        return (
            <View>
                <Text>
                    로딩중...
                </Text>
            </View>
        )

    if (error || occupiedTimes == null)
        return null;

    return (
        <ScrollView ref={TimesRef}>
            {Array.from({ length: 13 }, (_, index) => (index + 10)).map((time, index) => {
                return (
                    <View key={time + index} pointerEvents="none">

                        <View style={{ flexDirection: 'row', marginHorizontal: 24, alignItems: 'center', height: 24, justifyContent: 'center' }}>

                            <View>
                                <View style={[{ position: 'absolute', height: 9.2, width: 56, top: 0, }, (selectedTimeBlocks.includes(`${time - 1}:30` as TimeFormat)) ?
                                    { backgroundColor: Color['blue100'], zIndex: 2 }
                                    :
                                    occupiedTimes.includes(`${time - 1}:30` as TimeFormat) ?
                                        { backgroundColor: Color['grey200'], zIndex: 2 }
                                        :
                                        { backgroundColor: '#FFF', zIndex: 0 },]} />

                                <View style={[{ position: 'absolute', height: 12, width: 56, top: 7.2, }, (selectedTimeBlocks.includes(`${time}:00` as TimeFormat)) ?
                                    { backgroundColor: Color['blue100'], zIndex: 2 }
                                    :
                                    occupiedTimes.includes(`${time}:00` as TimeFormat)
                                        ? { backgroundColor: Color['grey200'], zIndex: 2 }
                                        :
                                        { backgroundColor: '#FFF', zIndex: 0 },]} />

                                <Text
                                    style={[
                                        { zIndex: 2, alignSelf: 'center', fontSize: 16, width: 56, textAlign: 'center', color: Color['grey300'], fontFamily: 'NanumSquareNeo-Regular' },
                                        (selectedTimeBlocks.includes(`${time}:00` as TimeFormat) || selectedTimeBlocks.includes(`${time - 1}:30` as TimeFormat)) && { color: Color['blue500'] }
                                    ]}
                                >
                                    {time}
                                </Text>
                            </View>

                        </View>
                        {index < TimeArray.length - 1 && <View style={{ height: 56 }} />}

                    </View>
                );
            })}

            <View style={{ position: 'absolute', flex: 1, top: 11, bottom: 12, zIndex: -1 }}>
                {
                    TimeArray.map((time, index) => {
                        if (index == TimeArray.length - 1) return null;
                        return (
                            <Pressable
                                key={time + '_pressable'} // 고유한 key를 부여
                                style={[
                                    { position: 'relative', display: 'flex', height: 42, borderWidth: 2, borderColor: Color['grey200'], marginHorizontal: 24, width: width - 48, borderStyle: 'dotted', backgroundColor: occupiedTimes.includes(time) ? Color['grey200'] : '#FFF', zIndex: index },
                                    index != 0 && { top: -index * 2, height: 42 }, selectedTimeBlocks.includes(time) && { borderColor: Color['blue500'], backgroundColor: Color['blue100'], zIndex: index + 2 }
                                ]}
                                onPress={() => { if (!occupiedTimes.includes(time)) toggleTimeBlock(time) }}>
                                {/* { <View style={{ position: 'absolute', backgroundColor: Color['grey200'], height: 42, width: '100%', left: 20, top: -2, }}></View>} */}
                            </Pressable>
                        );
                    })
                }
            </View>
        </ScrollView>
    )
}