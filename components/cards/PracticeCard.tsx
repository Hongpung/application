import { View, Text, Pressable } from "react-native"
import { Color } from "@hongpung/ColorSet"
import { ReservationDTO } from "@hongpung/pages/Reserve/ReserveInterface"
import { Icons } from "@hongpung/components/Icon"
import { useMemo } from "react"

const PracticeCard: React.FC<{ reserve: ReservationDTO, onPress: (reserve: ReservationDTO) => void }> = ({ reserve, onPress }) => {
    const isBefore = useMemo(() => new Date(reserve.date) < new Date(), []);
    return (
        <View style={{ marginHorizontal: 24, height: 120, borderRadius: 10, borderWidth: 1.5, borderColor: reserve.type == '정규연습' ? isBefore ? Color['blue200'] : Color['blue500'] : reserve.participationAvailable ? isBefore ? Color['green200'] : Color['green500'] : isBefore ? Color['red200'] : Color['red500'] }}>
            <Text style={{
                position: 'absolute', left: 18, top: 20,
                fontFamily: 'NanumSquareNeo-Bold',
                fontSize: 18,
                color: isBefore ?Color['grey400']:Color['grey700']
            }}>{reserve.message}</Text>
            <Text style={{
                position: 'absolute', left: 18, bottom: 12,
                fontFamily: 'NanumSquareNeo-Light',
                fontSize: 14,
                color: Color['grey400']
            }}>{reserve.startTime.slice(0, -3)}~{reserve.endTime.slice(0, -3)}
            </Text>
            <Pressable style={{ position: 'absolute', right: 16, bottom: 12 }} onPress={() => onPress(reserve)}>
                <Text style={{
                    textAlign: 'right',
                    fontFamily: 'NanumSquareNeo-Light',
                    fontSize: 14,
                    color: Color['grey400']
                }}>{`자세히 보기 >`}</Text>
            </Pressable>
            {/* 동아리 개별 연습 유형 */
                reserve.type == '정규연습' ?
                    <View style={{
                        position: 'absolute', right: 12, top: -4, width: 48, height: 48
                    }} >
                        <Icons name="bookmark-sharp" size={48} color={Color['blue500']} />
                    </View>
                    : <View style={{
                        position: 'absolute', right: 20, top: 20,
                    }}>
                        <Text style={{
                            textAlign: 'right',
                            fontFamily: 'NanumSquareNeo-Regular',
                            fontSize: 14,
                            color: Color['grey600']
                        }}>{reserve.name}</Text>
                        <View style={{ height: 4 }} />
                        {reserve.nickname && <Text style={{
                            textAlign: 'right',
                            fontFamily: 'NanumSquareNeo-Regular',
                            fontSize: 12,
                            color: Color['grey400']
                        }}>{reserve.nickname}</Text>}
                    </View>
            }
        </View>
    )
}

export default PracticeCard