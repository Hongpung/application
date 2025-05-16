import React from "react"
import { Pressable, View, Text, Dimensions } from "react-native"

import { Color, Icons } from "@hongpung/src/common"

import { DailyReservation } from "../../model/type"
import { getReservationColor } from "../../lib/getReservationColor"
import { style } from "./ReservationCard.module"


type ReservationCardProps = {
    reservation: DailyReservation
    onPress: () => void
}

const { width } = Dimensions.get('window')

export const ReservationCard: React.FC<ReservationCardProps> = ({ reservation, onPress }) => {

    const [startHour, startMinnute] = reservation.startTime.split(':').map((time: string) => Number(time))
    const [endHour, endMinnute] = reservation.endTime.split(':').map((time: string) => Number(time))

    const timeGap = endHour * 60 - startHour * 60 + endMinnute - startMinnute

    const cardTopPosition = 12 + (Number(startHour) - 10) * 80 + (startMinnute > 0 ? 40 : 0);
    const cardHeight = 40 * (timeGap / 30);

    const color = getReservationColor(reservation) + '500'

    return (

        <Pressable
            key={'rid' + reservation.reservationId}
            style={{ position: 'absolute', top: cardTopPosition, width: width - 72, height: cardHeight, borderRadius: 10, borderWidth: 2, borderColor: Color[color], backgroundColor: '#FFF', marginHorizontal: 36, overflow: 'hidden' }}
            onPress={onPress}>

            {/* title */}
            <Text numberOfLines={1} style={{ position: 'absolute', width: width / 2, top: timeGap > 30 ? 16 : 8, left: 16, fontSize: 18, fontFamily: 'NanumSquareNeo-Bold' }}>
                {reservation.title}
            </Text>

            {/* 내부 요소 분기 처리 */}
            {timeGap > 30 &&
                <View style={{ position: 'absolute', bottom: 12, flexDirection: 'row', width: '100%', paddingHorizontal: 12, gap: 4, alignItems: 'center', justifyContent: 'space-between' }}>
                    {reservation.reservationType === 'EXTERNAL' ?
                        <Text style={[style.footerText, { paddingHorizontal: 4 }]}>
                            외부 예약
                        </Text>
                        :
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Icons size={24} name={'people'} color={Color['grey300']} />
                            <Text style={style.footerText}>{reservation.amountOfParticipators}</Text>
                        </View>}

                    {timeGap > 60 && <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Icons size={24} name={'time-outline'} color={Color['grey300']} />
                        <Text style={style.footerText}>{reservation.startTime}~{reservation.endTime}</Text>
                    </View>}

                </View>
            }

            {reservation.reservationType == 'REGULAR' ?
                timeGap > 30 &&
                <View style={{ position: 'absolute', top: -4, right: 8, }} >
                    <Icons size={48} name={'bookmark-sharp'} color={Color['blue500']} />
                </View>
                :
                <View style={{ position: 'absolute', top: 10, right: 14, paddingVertical: 4, gap: 2, alignItems: 'flex-end', justifyContent: 'flex-start' }}>

                    <Text style={style.creatorName}>{reservation.creatorName}</Text>

                    {reservation.creatorNickname &&
                        <Text style={style.creatorNickname}>{reservation.creatorNickname}</Text>
                    }

                </View>
            }

        </Pressable>

    )
}

export default React.memo(ReservationCard);