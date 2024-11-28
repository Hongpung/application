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
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { InReservationStackParamList, ReservationStackParamList } from '@hongpung/nav/ReservationStack'
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import { InstrumentTypes } from '@hongpung/UserType'

type ReservationConfirmNavProp = CompositeNavigationProp<
    NativeStackNavigationProp<InReservationStackParamList, 'ReservationConfirm'>,
    NativeStackNavigationProp<ReservationStackParamList, 'ReservationStack'>
>

const ReservationConfirmScreen: React.FC = () => {

    const navigation = useNavigation<ReservationConfirmNavProp>();

    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    const [isAgree, setAgree] = useState(false);

    const loginUser = useRecoilValue(loginUserState);

    const DateString = useCallback((selectedDate: Date) => {
        return `${selectedDate.getFullYear()}.${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}.${selectedDate.getDate().toString().padStart(2, '0')}(${daysOfWeek[selectedDate.getDay()]})`;
    }, [])

    const { reservation } = useReservation();

    const ConfirmHandler = () => {
        const createReservation = async () => {

            const data = parseToReservationForm(reservation) as ReservationSubmitForm

            if (data.message.length == 0) {
                data.message = `${loginUser?.nickname ? loginUser.nickname : loginUser?.name}의 연습`
            }

            const sendFormat = JSON.stringify(data)

            const controller = new AbortController();
            const signal = controller.signal;
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            try {
                const token = await getToken('token');

                console.log(sendFormat, `${process.env.BASE_URL}/reservation`)
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

                const utilToken = await getToken('utilToken');
                const notificationResponse = await fetch(`${process.env.SUB_API}/notification/send`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${utilToken}`,
                    },
                    body: JSON.stringify(
                        {
                            to: [...data.participaterIds.map(id => { if (id != loginUser?.memberId) return id })],
                            title: '예약에 포함되었습니다',
                            text: `예약명: ${result.message}\n일시: ${data.date}/${data.startTime.slice(-4, -2)}~${data.endTime.slice(-2)}`
                        }
                    )
                })

                if (!notificationResponse.ok) {
                    Toast.show({
                        type: 'success',
                        text1: '알림 전송에는 실패했어요',
                        position: 'bottom',
                        bottomOffset: 60,
                        visibilityTime: 3000
                    });
                }else{
                    Toast.show({
                        type: 'success',
                        text1: '예약을 생성하고 알림을 전송했어요',
                        position: 'bottom',
                        bottomOffset: 60,
                        visibilityTime: 3000
                    });
                }

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
                    <View style={[{ display: 'flex', flexDirection: 'row', }, reservation.participants.length > 0 && { marginRight: 12 }]}>
                        <Text style={[styles.rightText, { maxWidth: 156 }]} numberOfLines={1}>
                            {reservation.participants.length > 0 ? `${reservation.participants.slice(0, reservation.participants.length > 3 ? 3 : reservation.participants.length).map(user => `${user.name} `)}` : '없음'}
                        </Text>
                        {reservation.participants.length >= 3 && <Text style={styles.rightText}>{`외 ${reservation.participants?.length} 명`}</Text>}
                    </View>
                    {reservation.participants.length > 0 &&
                        <Pressable style={{ position: 'absolute', right: -12 }} onPress={() => { navigation.navigate('ReservationParticipatorsView', { participators: JSON.stringify(reservation.participants) }) }}>
                            <Icons size={16} color={Color['grey300']} name={'chevron-forward'}></Icons>
                        </Pressable>}
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 14 }}>
                    <Text style={styles.leftText}>대여 악기</Text>
                    {reservation.borrowInstruments.length > 0 ?
                        <Text style={[styles.rightText, { marginRight: 12 }]}>{InstrumentTypes.filter(type=> type!='징').map((type) => {
                            const instCount = reservation.borrowInstruments.filter((instrument) => instrument.type == type).length
                            if (instCount > 0)
                                return `${type} ${instCount}`
                        }).filter(Boolean).join(', ')}
                        </Text>
                        : <Text style={[styles.rightText, { color: Color['grey300'] }]}>{'없음'}</Text>}

                    {reservation.borrowInstruments.length > 0 &&
                        <Pressable style={{ position: 'absolute', right: -12 }} onPress={() => { navigation.navigate('ReservationInstrumentsView', { instruments: JSON.stringify(reservation.borrowInstruments) }) }}>
                            <Icons size={16} color={Color['grey300']} name={'chevron-forward'}></Icons>
                        </Pressable>}
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