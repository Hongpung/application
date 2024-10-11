import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import LongButton from '@hongpung/components/buttons/LongButton'
import { Color } from '@hongpung/ColorSet'
import { useReservation } from '../context/ReservationContext'
import CheckboxComponent from '@hongpung/components/checkboxs/CheckboxComponent'
import { useRecoilValue } from 'recoil'
import { loginUserState } from '@hongpung/recoil/authState'
import { getToken } from '@hongpung/utils/TokenHandler'
import { findReservationDifferences } from '../ReserveInterface'

const ReservationEditConfirmScreen: React.FC<{ navigation: any }> = ({ navigation }) => {

    const { reservation, preReservation } = useReservation();

    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    const [isAgree, setAgree] = useState(false);

    const loginUser = useRecoilValue(loginUserState);
    const [difference, setDifference] = useState<{ [key: string]: any }>(findReservationDifferences(preReservation, reservation))

    const DateString = useCallback((selectedDate: Date) => {
        return `${selectedDate.getFullYear()}.${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}.${selectedDate.getDate().toString().padStart(2, '0')}(${daysOfWeek[selectedDate.getDay()]})`;
    }, [])

    console.log(difference)
    const ConfirmHandler = () => {
        const editReservation = async () => {
            console.log(difference)

            if (difference?.message && difference?.message.length == 0) {
                difference.message = `${loginUser?.nickname ? loginUser.nickname : loginUser?.name}의 연습`
            }

            const sendFormat = JSON.stringify(difference)

            console.log(sendFormat, preReservation.reservationId);

            const controller = new AbortController();
            const signal = controller.signal;
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            try {
                const token = await getToken('token');

                console.log(sendFormat)
                const response = await fetch(
                    `${process.env.BASE_URL}/reservation/${preReservation.reservationId}`
                    , {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: sendFormat,
                        signal
                    })

                if (!response.ok) {
                    console.log(response.status + response.statusText)
                    throw new Error('Network response was not ok');
                }
                const result: any = await response.json();

                if (result != null)
                    navigation.navigate('DailyReserveList', { date: reservation.date?.toISOString() })
            }
            catch (e) {
                console.error(e)
            } finally {
                clearTimeout(timeoutId);
            }
        }

        editReservation();
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <View style={{ height: 88 }} />
            <Text style={{ textAlign: 'center', fontFamily: 'NanumSquareNeo-Bold', fontSize: 20, marginBottom: 34 }}>예약 정보 확인</Text>
            {Object.keys(difference)?.map((key: any) =>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 36, marginVertical: 14 }}>
                    <Text style={styles.leftText}>{key}</Text>
                    <Text style={styles.rightText}>{difference[key]}</Text>
                </View>)}
            {/*<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 36, marginVertical: 14 }}>
                <Text style={styles.leftText}>예약 일자</Text>
                <Text style={styles.rightText}>{DateString(reservation.date)}</Text>
            </View>
             <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 36, marginVertical: 14 }}>
                <Text style={styles.leftText}>예약 시간</Text>
                <Text style={styles.rightText}>{`${reservation.Time.startTime.toString().slice(5, 7)}:${reservation.Time.startTime.toString().slice(7)} ~ ${reservation.Time.endTime.toString().slice(5, 7)}:${reservation.Time.endTime.toString().slice(7)}`}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 36, marginVertical: 14 }}>
                <Text style={styles.leftText}>예약자</Text>
                <Text style={styles.rightText}>{`${loginUser?.nickname ? `${loginUser?.name}(${loginUser.nickname})` : loginUser?.name}`}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 36, marginVertical: 14 }}>
                <Text style={styles.leftText}>예약명</Text>
                <Text style={styles.rightText}>{reservation.reservationName.length > 0 ? reservation.reservationName : `${loginUser?.nickname ? loginUser.nickname : loginUser?.name}의 연습`}</Text>
            </View>
            <View style={{ height: 16, backgroundColor: Color['grey100'], marginVertical: 10 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 36, marginVertical: 14 }}>
                <Text style={styles.leftText}>예약 유형</Text>
                <Text style={styles.rightText}>{reservation.isRegular ? '정기 연습' : '개인 연습'} ({reservation.isParticipatible ? '참여 가능' : '참여 불가'})</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 36, marginVertical: 14 }}>
                <Text style={styles.leftText}>참여자</Text>
                <Text style={styles.rightText}>
                    {reservation.participants.length > 0 ? `${reservation.participants.slice(0, reservation.participants.length > 3 ? 3 : reservation.participants.length).map(user => `${user.name} `)}${reservation.participants.length >= 3 ? `외 ${reservation.participants?.length} 명` : ''}` : '없음'}
                </Text>
                {reservation.participants.length > 0 && <Pressable style={{ position: 'absolute', right: -16 }}><Text style={{
                    fontFamily: 'NanumSquareNeo-ExtarBold',
                    fontSize: 16,
                    color: Color['grey400']
                }}>{'>'}</Text></Pressable>}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 36, marginVertical: 14 }}>
                <Text style={styles.leftText}>대여악기</Text>
                <Text style={styles.rightText}>
                    {reservation.borrowInstruments.length > 0 ? ['쇠', '장구', '북', '소고', '새납'].map((type) => {
                        const instCount = reservation.borrowInstruments.filter((instrument) => instrument.type == type).length
                        if (instCount > 0)
                            return `${type} ${instCount}`
                    }) : '없음'}
                </Text>
                {reservation.borrowInstruments.length > 0 && <Pressable style={{ position: 'absolute', right: -16 }}><Text style={{
                    fontFamily: 'NanumSquareNeo-ExtarBold',
                    fontSize: 16,
                    color: Color['grey400']
                }}>{'>'}</Text></Pressable>}
            </View> */}
            <View style={{ position: 'absolute', bottom: 0, paddingVertical: 8, width: '100%' }}>
                <View style={{ marginHorizontal: 28, marginBottom: 12 }}>

                    <CheckboxComponent
                        isChecked={isAgree}
                        innerText='작성된 정보가 일치합니다.'
                        onCheck={() => setAgree(!isAgree)}
                    ></CheckboxComponent>
                </View>
                <LongButton color='blue' innerText='확정하기' isAble={isAgree} onPress={ConfirmHandler} />
            </View>
        </View>
    )
}

export default ReservationEditConfirmScreen

const styles = StyleSheet.create({
    leftText: {
        fontFamily: 'NanumSquareNeo-Regular',
        fontSize: 16,
        color: Color['grey400']
    },
    rightText: {
        fontFamily: 'NanumSquareNeo-Bold',
        fontSize: 16,
        color: Color['grey700']
    }
})