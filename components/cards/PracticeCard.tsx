import { View, Text, Pressable } from "react-native"
import { Color } from "@hongpung/ColorSet"
import { Icons } from "@hongpung/src/common/components/Icons/Icon"
import { useMemo } from "react"
import { BreifSession } from "@hongpung/pages/Home/MyPage/MyPractices/MyPracticesScreen"



const PracticeCard: React.FC<{ session: BreifSession, onPress: (session: BreifSession) => void }> = ({ session, onPress }) => {

    const isBefore = useMemo(() => new Date(session.date) < new Date(), []);

    return (
        <View style={{
            backgroundColor:'#FFF',
            marginHorizontal: 24, height: 120, borderRadius: 10, borderWidth: 1.5,
            borderColor: session.reservationType == 'REGULAR' ?
                isBefore ?
                    Color['blue200']
                    :
                    Color['blue500']
                :
                session.participationAvailable ?
                    isBefore ?
                        Color['green200']
                        :
                        Color['green500']
                    :
                    isBefore ?
                        Color['red200']
                        :
                        Color['red500']
        }}>

            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20 }}>
                <Text style={{
                    fontFamily: 'NanumSquareNeo-Bold',
                    paddingTop: 14,
                    fontSize: 18,
                    color: isBefore ? Color['grey400'] : Color['grey700']
                }}>
                    {session.title}
                </Text>

                {/* 동아리 개별 연습 유형 */
                    session.reservationType == 'REGULAR' ?
                        <View style={{
                            width: 48, height: 48, marginTop: -4
                        }} >
                            <Icons name="bookmark-sharp" size={48} color={Color['blue500']} />
                        </View>
                        :
                        <View style={{ paddingTop: 16, flexDirection: 'column', alignItems: 'flex-end' }}>
                            <Text style={{
                                textAlign: 'right',
                                fontFamily: 'NanumSquareNeo-Regular',
                                fontSize: 14,
                                color: Color['grey600']
                            }}>
                                {session.creatorName}
                            </Text>
                            <View style={{ height: 4 }} />
                            {session.creatorNickname &&
                                <Text style={{
                                    textAlign: 'right',
                                    fontFamily: 'NanumSquareNeo-Regular',
                                    fontSize: 12,
                                    color: Color['grey400']
                                }}>{session.creatorNickname}
                                </Text>
                            }
                        </View>
                }
            </View>
            
            <View style={{ flex: 1 }} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 12 }}>
                <Text style={{
                    fontFamily: 'NanumSquareNeo-Light',
                    fontSize: 14,
                    color: Color['grey400']
                }}>
                    {session.startTime} ~ {session.endTime}
                </Text>

                <Pressable style={{}} onPress={() => onPress(session)}>
                    <Text style={{
                        textAlign: 'right',
                        fontFamily: 'NanumSquareNeo-Light',
                        fontSize: 14,
                        color: Color['grey400']
                    }}>
                        {`자세히 보기 >`}
                    </Text>
                </Pressable>
            </View>
        </View>
    )
}

export default PracticeCard