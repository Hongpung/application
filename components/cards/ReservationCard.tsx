import { View, Text, Pressable } from "react-native"
import { Color } from "@hongpung/ColorSet"
import { ReservationDTO } from "@hongpung/pages/Reserve/ReservationInterface"
import { Icons } from "@hongpung/components/common/Icon"
import { useMemo } from "react"
import { useNavigation } from "@react-navigation/native"
import { MyClubStackStackParamList } from "@hongpung/nav/MyClubStack"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { MainStackParamList } from "@hongpung/nav/HomeStacks"

type ClubPracticeNavProp = NativeStackNavigationProp<MyClubStackStackParamList, 'ClubCalendar'>
type HomeNavProp = NativeStackNavigationProp<MainStackParamList, 'Home'>

const ReservationCard: React.FC<{ reservation: ReservationDTO }> = ({ reservation }) => {

    const isBefore = useMemo(() => new Date(reservation.date) >= new Date(), []);
    const navigation = useNavigation<ClubPracticeNavProp>();
    const homeNavigation = useNavigation<HomeNavProp>();

    return (
        <View style={{ marginHorizontal: 24, height: 120, borderRadius: 10, borderWidth: 1.5, borderColor: reservation.type == '정규연습' ? !isBefore ? Color['blue200'] : Color['blue500'] : reservation.participationAvailable ? !isBefore ? Color['green200'] : Color['green500'] : !isBefore ? Color['red200'] : Color['red500'] }}>
            <Text style={{
                position: 'absolute', left: 18, top: 20,
                fontFamily: 'NanumSquareNeo-Bold',
                fontSize: 18,
                color: !isBefore ? Color['grey400'] : Color['grey700']
            }}>{reservation.message}</Text>
            <Text style={{
                position: 'absolute', left: 18, bottom: 12,
                fontFamily: 'NanumSquareNeo-Light',
                fontSize: 14,
                color: Color['grey400']
            }}>{reservation.startTime.slice(0, -3)} ~ {reservation.endTime.slice(0, -3)}
            </Text>
            <Pressable
                style={{ position: 'absolute', right: 16, bottom: 12 }}
                onPress={() => {
                    console.log('clicked');
                    if (isBefore)
                        homeNavigation.navigate('Reservation', { screen: 'ReservationDetail', params: { reservationId: reservation.reservationId! } })
                    else
                        navigation.navigate('MyClubPracticeInfo', { reservationId: reservation.reservationId! })
                }}>
                <Text style={{
                    textAlign: 'right',
                    fontFamily: 'NanumSquareNeo-Light',
                    fontSize: 14,
                    color: Color['grey400']
                }}>{`자세히 보기 >`}</Text>
            </Pressable>
            {/* 동아리 개별 연습 유형 */
                reservation.type == '정규연습' ?
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
                        }}>{reservation.creatorName}</Text>
                        <View style={{ height: 4 }} />
                        {reservation.creatorNickname && <Text style={{
                            textAlign: 'right',
                            fontFamily: 'NanumSquareNeo-Regular',
                            fontSize: 12,
                            color: Color['grey400']
                        }}>{reservation.creatorNickname}</Text>}
                    </View>
            }
        </View>
    )
}

export default ReservationCard