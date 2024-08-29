import { View, Text, Pressable } from "react-native"
import { Color } from "../../ColorSet"
import { Reserve } from "../../pages/Home/MyClub/ClubCalendar/ClubCalendar"

const PracticeCard: React.FC<{ reserve: Reserve, onPress: (reserve: Reserve) => void }> = ({ reserve, onPress }) => {
    return (
        <View style={{ marginHorizontal: 24, height: 120, borderRadius: 10, borderWidth: 1, borderColor: reserve.type == 'regular' ? Color['blue200'] : Color['red200'] }}>
            <Text style={{
                position: 'absolute', left: 18, top: 20,
                fontFamily: 'NanumSquareNeo-Bold',
                fontSize: 18,
                color: Color['grey700']
            }}>{reserve.title}</Text>
            <Text style={{
                position: 'absolute', left: 18, top: 52,
                fontFamily: 'NanumSquareNeo-Light',
                fontSize: 14,
                color: Color['grey400']
            }}>{reserve.startTime}:00~{reserve.endTime}:00</Text>
            <View style={{ position: 'absolute', left: 18, bottom: 16, flexDirection: 'row', alignItems: 'center' }}>
                {/* 인원 아이콘 */}
                <View style={{ width: 24, height: 24, backgroundColor: Color['grey200'] }} />
                <Text style={{
                    marginLeft: 8,
                    fontFamily: 'NanumSquareNeo-Light',
                    fontSize: 14,
                    color: Color['grey400']
                }}>{reserve.personnel}</Text>
            </View>
            <Pressable style={{ position: 'absolute', right: 16, bottom: 12 }} onPress={() => onPress(reserve)}>
                <Text style={{
                    textAlign: 'right',
                    fontFamily: 'NanumSquareNeo-Light',
                    fontSize: 14,
                    color: Color['grey400']
                }}>{`자세히 보기 >`}</Text>
            </Pressable>

            {/* 동아리 개별 연습 유형 */
                reserve.type == 'regular' ? <View style={{
                    position: 'absolute', right: 28, top: -1, width: 24, height: 40, backgroundColor: Color['blue500']
                }} />
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