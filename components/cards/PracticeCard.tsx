import { View, Text, Pressable } from "react-native"
import { Color } from "@hongpung/ColorSet"
import { Icons } from "@hongpung/components/Icon"
import { useMemo } from "react"
import { breifSessionInfo } from "@hongpung/pages/Home/MyPage/MyPractices/MyPracticesScreen"


const PracticeCard: React.FC<{ session: breifSessionInfo, onPress: (session: breifSessionInfo) => void }> = ({ session, onPress }) => {

    const isBefore = useMemo(() => new Date(session.date) < new Date(), []);

    return (
        <View style={{
            marginHorizontal: 24, height: 120, borderRadius: 10, borderWidth: 1.5,
            borderColor: session.reservationType == '정규연습' ?
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


            <Text style={{
                position: 'absolute', left: 18, top: 20,
                fontFamily: 'NanumSquareNeo-Bold',
                fontSize: 18,
                color: isBefore ? Color['grey400'] : Color['grey700']
            }}>
                {session.title}
            </Text>


            <Text style={{
                position: 'absolute', left: 18, bottom: 12,
                fontFamily: 'NanumSquareNeo-Light',
                fontSize: 14,
                color: Color['grey400']
            }}>
                {session.startTime} ~ {session.endTime}
            </Text>


            <Pressable style={{ position: 'absolute', right: 16, bottom: 12 }} onPress={() => onPress(session)}>

                <Text style={{
                    textAlign: 'right',
                    fontFamily: 'NanumSquareNeo-Light',
                    fontSize: 14,
                    color: Color['grey400']
                }}>
                    {`자세히 보기 >`}
                </Text>

            </Pressable>



            {/* 동아리 개별 연습 유형 */
                session.reservationType == 'REGULAR' ?
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
                        }}>{session.creatorName}</Text>
                        <View style={{ height: 4 }} />
                        {session.creatorNickname && <Text style={{
                            textAlign: 'right',
                            fontFamily: 'NanumSquareNeo-Regular',
                            fontSize: 12,
                            color: Color['grey400']
                        }}>{session.creatorNickname}</Text>}
                    </View>
            }
            
        </View>
    )
}

export default PracticeCard