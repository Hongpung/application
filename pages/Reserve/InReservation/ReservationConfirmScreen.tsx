import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import LongButton from '../../../components/buttons/LongButton'
import { Color } from '../../../ColorSet'
import { useReservation } from '../context/ReservationContext'
import CheckboxComponent from '../../../components/checkboxs/CheckboxComponent'
import { useRecoilValue } from 'recoil'
import { loginUserState } from '@hongpung/recoil/authState'
import { getToken } from '@hongpung/utils/TokenHandler'
import { parseToReservationDetail, parseToReservationForm, ReservationDTO, ReservationSubmitForm } from '../ReserveInterface'
import { Icons } from '@hongpung/components/Icon'

const ReservationConfirmScreen: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {

    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    const [isAgree, setAgree] = useState(false);

    const loginUser = useRecoilValue(loginUserState);

    const DateString = useCallback((selectedDate: Date) => {
        return `${selectedDate.getFullYear()}.${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}.${selectedDate.getDate().toString().padStart(2, '0')}(${daysOfWeek[selectedDate.getDay()]})`;
    }, [])

    const { reservation } = useReservation();

    const ConfirmHandler = () => {
        const createReservation = async () => {

            const data = parseToReservationForm(reservation) as any

            if (data.message.length == 0) {
                data.message = `${loginUser?.nickname ? loginUser.nickname : loginUser?.name}의 연습`
            }

            const sendFormat = JSON.stringify(data)

            const controller = new AbortController();
            const signal = controller.signal;
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            try {
                const token = await getToken('token');

                console.log(sendFormat,`${process.env.BASE_URL}/reservation`)
                const response = await fetch(
                    `${process.env.BASE_URL}/reservation`
                    , {
                        method: 'POST',
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
                    navigation.navigate('DailyReserveList', { date: reservation.date!.toISOString() })
            }
            catch (e) {
                console.error(e)
            } finally {
                clearTimeout(timeoutId);
            }
        }

        createReservation();
    };
    return (
        <View style={{ flex: 1, backgroundColor: Color['grey100'] }}>
            <View style={{
                height: 50,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 24
            }}>
                <Pressable onPress={() => {
                    navigation.goBack();
                }}
                    style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 11, left: 22, width: 28, height: 28 }}
                >
                    <Icons size={24} name={'close'} color={Color['blue500']} />
                </Pressable>
            </View>
            <View style={{ height: 88 }} />
            <Text style={{ textAlign: 'center', fontFamily: 'NanumSquareNeo-Bold', fontSize: 20, marginBottom: 24 }}>예약 정보 확인</Text>
            <View style={{ borderRadius: 15, marginHorizontal: 16, paddingHorizontal: 16, paddingVertical: 4, backgroundColor: '#FFF' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 14 }}>
                    <Text style={styles.leftText}>예약 일자</Text>
                    <Text style={styles.rightText}>{DateString(reservation.date!)}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 14 }}>
                    <Text style={styles.leftText}>예약 시간</Text>
                    <Text style={styles.rightText}>{`${reservation.Time.startTime.toString().slice(5, 7)}:${reservation.Time.startTime.toString().slice(7)} ~ ${reservation.Time.endTime.toString().slice(5, 7)}:${reservation.Time.endTime.toString().slice(7)}`}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 14 }}>
                    <Text style={styles.leftText}>예약자</Text>
                    <Text style={styles.rightText}>{`${loginUser?.nickname ? `${loginUser?.name}(${loginUser.nickname})` : loginUser?.name}`}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 14 }}>
                    <Text style={styles.leftText}>예약명</Text>
                    <Text style={styles.rightText}>{reservation.reservationName.length > 0 ? reservation.reservationName : `${loginUser?.nickname ? loginUser.nickname : loginUser?.name}의 연습`}</Text>
                </View>
            </View>

            <View style={{ height: 24, }} />

            <View style={{ borderRadius: 15, marginHorizontal: 16, paddingHorizontal: 16, paddingVertical: 4, backgroundColor: '#FFF' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 14 }}>
                    <Text style={styles.leftText}>예약 유형</Text>
                    <Text style={styles.rightText}>{reservation.isRegular ? '정기 연습' : '개인 연습'} ({reservation.isParticipatible ? '참여 가능' : '참여 불가'})</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 14 }}>
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
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 14 }}>
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
                </View>
            </View>


            <View style={{ position: 'absolute', bottom: 0, backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingVertical: 8, width: '100%' }}>
                <View style={{ marginHorizontal: 28, marginBottom: 12, marginTop: 8 }}>

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

export default ReservationConfirmScreen

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