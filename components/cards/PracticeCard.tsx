import { View, Text, Pressable } from "react-native"
import { Color } from "../../ColorSet"

const PracticeCard: React.FC<{ date: Date, onPress: () => void }> = ({ date, onPress }) => {
    return (
        <View style={{ marginHorizontal: 24, height: 120, borderRadius: 10, borderWidth: 1, borderColor: Color['red200'] }}>
            <Text style={{
                position: 'absolute', left: 18, top: 20,
                fontFamily: 'NanumSquareNeo-Bold',
                fontSize: 18,
                color: Color['grey700']
            }}>나는 바보</Text>
            <Text style={{
                position: 'absolute', left: 18, top: 52,
                fontFamily: 'NanumSquareNeo-Light',
                fontSize: 14,
                color: Color['grey400']
            }}>17:00~18:00</Text>
            <View style={{ position: 'absolute', left: 18, bottom: 16, flexDirection: 'row', alignItems: 'center' }}>
                {/* 인원 아이콘 */}
                <View style={{ width: 24, height: 24, backgroundColor: Color['grey200'] }} />
                <Text style={{
                    marginLeft: 8,
                    fontFamily: 'NanumSquareNeo-Light',
                    fontSize: 14,
                    color: Color['grey400']
                }}>24명</Text>
            </View>
            <Pressable style={{ position: 'absolute', right: 16, bottom: 12 }} onPress={onPress}>
                <Text style={{
                    textAlign: 'right',
                    fontFamily: 'NanumSquareNeo-Light',
                    fontSize: 14,
                    color: Color['grey400']
                }}>{`자세히 보기 >`}</Text>
            </Pressable>

            {/* 동아리 개별 연습 유형 */
                <View style={{
                    position: 'absolute', right: 20, top: 20,
                }}>
                    <Text style={{
                        textAlign: 'right',
                        fontFamily: 'NanumSquareNeo-Regular',
                        fontSize: 14,
                        color: Color['grey600']
                    }}>홍길동</Text>
                    <View style={{ height: 4 }} />
                    <Text style={{
                        textAlign: 'right',
                        fontFamily: 'NanumSquareNeo-Regular',
                        fontSize: 12,
                        color: Color['grey400']
                    }}>홍길동</Text>
                </View>}
            {/* 동아리 정기 연습 유형 */
            /* {<View style={{
                position: 'absolute', right: 28, top: -1, width: 24, height: 40, backgroundColor: Color['blue500']
            }} />} */}
        </View>
    )
}

export default PracticeCard