import { Alert, Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import LongButton from '@hongpung/src/common/components/buttons/LongButton'
import { Color } from '@hongpung/ColorSet'
import { useReservation } from '../context/ReservationContext'
import CheckboxComponent from '@hongpung/src/common/components/checkboxs/CheckboxComponent'
import { useRecoilValue } from 'recoil'
import { loginUserState } from '@hongpung/recoil/authState'
import { getToken } from '@hongpung/src/common/utils/TokenHandler'
import { findReservationDifferences, parseToReservationForm } from '../ReservationInterface'
import { Icons } from '@hongpung/src/common/components/Icons/Icon'
import { InReservationStackParamList, ReservationStackParamList } from '@hongpung/nav/ReservationStack'
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import Toast from 'react-native-toast-message'
import { instrumentTypes } from '@hongpung/UserType'


type ReservationEditConfirmNavProp = CompositeNavigationProp<
    NativeStackNavigationProp<InReservationStackParamList, 'ReservationEditConfirm'>,
    NativeStackNavigationProp<ReservationStackParamList, 'ReservationStack'>
>

const ReservationEditConfirmScreen: React.FC = () => {

    const navigation = useNavigation<ReservationEditConfirmNavProp>();
    const { reservation, preReservation, setTime, setDate } = useReservation();

    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    const [isAgree, setAgree] = useState(false);

    const loginUser = useRecoilValue(loginUserState);
    const [difference, setDifference] = useState<{ [key: string]: any }>(findReservationDifferences(preReservation, reservation))


    const DateString = useCallback((selectedDate: Date) => {
        return `${selectedDate.getFullYear()}.${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}.${selectedDate.getDate().toString().padStart(2, '0')}(${daysOfWeek[selectedDate.getDay()]})`;
    }, [])

    const preReservationDTO = parseToReservationForm(preReservation);
    const newReservationDTO = parseToReservationForm(reservation);

    const ConfirmHandler = () => {
        const editReservation = async () => {

            if (difference?.title && difference?.title.length == 0) {
                difference.title = `${loginUser?.nickname ? loginUser.nickname : loginUser?.name}의 연습`
            }

            const sendFormat = JSON.stringify(difference);

            const controller = new AbortController();
            const signal = controller.signal;
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            console.log('sendFormat:'+sendFormat)
            try {
                const token = await getToken('token');

                const response = await fetch(
                    `${process.env.EXPO_PUBLIC_BASE_URL}/reservation/${preReservation.reservationId}`
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

                    if (response.status == 409) {
                        Alert.alert('오류', '이 시간에 다른 예약이 생겼어요\n다시 선택해주세요.', [{
                            text: 'OK',
                            onPress: () => {
                                navigation.goBack();

                                setTime('', '')
                            }
                        }])
                        return;
                    }

                    if (response.status == 403) {
                        const { message } = await response.json();
                        if (message == '수정은 전날 22:00까지 가능합니다.')
                            Alert.alert('오류', '예약의 수정이 불가능한 시간이예요.\n(예약일 전일 22:00까지 가능)', [{
                                text: 'OK',
                                onPress: () => {
                                    navigation.goBack();
                                    navigation.goBack();
                                }
                            }])
                        else {
                            Alert.alert('오류', '해당 날짜의 예약이 불가능한 시간이예요.\n(예약일 전일 22:00까지 가능)', [{
                                text: 'OK',
                                onPress: () => {
                                    navigation.goBack()
                                    // { type: 'pop', payload: { count: 2 } }

                                    setTime('', '')
                                    setDate(null)
                                }
                            }])
                        }
                        return;
                    }
                    throw new Error('Network response was not ok', { cause: { status: response.status, statusText: response.statusText } });
                }

                Toast.show({
                    type: 'success',
                    text1: '예약을 변경하고 알림을 전송했어요',
                    position: 'bottom',
                    bottomOffset: 60,
                    visibilityTime: 3000
                });

                navigation.navigate('ReservationDetail', { reservationId: reservation.reservationId! })
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
        <View style={{ display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: Color['grey100'] }}>
            <View style={{
                height: 50,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 24,
                flexShrink: 0,
                backgroundColor: '#FFF'
            }}>
                <Pressable onPress={() => {
                    navigation.goBack();
                }}
                    style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 11, left: 22, width: 28, height: 28 }}
                >
                    <Icons size={24} name={'close'} color={Color['blue500']} />
                </Pressable>
                <Text style={{ textAlign: 'center', fontFamily: 'NanumSquareNeo-Bold', fontSize: 20 }}>예약 정보 변경 확인</Text>
            </View>
            <ScrollView style={{ flex: 1 }}>
                <View style={{ paddingVertical: 48 }} >
                    <View style={{ paddingHorizontal: 18, marginHorizontal: 24, borderRadius: 15, paddingVertical: 8, backgroundColor: '#FFF' }}>
                        {Object.keys(difference)
                            .filter(
                                (key: string) =>
                                    !['addedBorrowInstrumentIds', 'removedBorrowInstrumentIds', 'addedParticipatorIds', 'removedParticipatorIds'].includes(key)
                            )?.map((key: string) => {
                                if (key == 'startTime' || key == 'endTime') {
                                    const time = preReservationDTO[key];
                                    return (
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 14 }}>
                                            <Text style={styles.leftText}>{key == 'startTime' ? '시작시간' : '종료시간'}</Text>
                                            <Text style={[styles.rightText, { color: Color['grey300'] }]}>{time.slice(0, 2)}시 {time.slice(-2)}분</Text>
                                        </View>)
                                }
                                return (
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 14 }}>
                                        <Text style={styles.leftText}>{key == 'startTime' ? '시작시간' : key}</Text>
                                        <Text style={[styles.rightText, { color: Color['grey300'] }]}>{preReservationDTO[key]}</Text>
                                    </View>)
                            })}


                        {(difference.addedBorrowInstrumentIds || difference.removedBorrowInstrumentIds) && (
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 14, }}                    >
                                <Text style={styles.leftText}>대여 악기</Text>
                                {preReservation.borrowInstruments.length > 0 ?
                                    <Text style={[styles.rightText, { color: Color['grey300'] }]}>{instrumentTypes.filter(type => type != '징').map((type) => {
                                        const instCount = preReservation.borrowInstruments.filter((instrument) => instrument.instrumentType == type).length
                                        if (instCount > 0)
                                            return `${type} ${instCount}`
                                    })}
                                    </Text>
                                    :
                                    <Text style={[styles.rightText, { color: Color['grey300'] }]}>{'없음'}</Text>}

                            </View>
                        )}


                        {(difference.addedParticipatorIds || difference.removedParticipatorIds) && (
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 14 }}>
                                <Text style={styles.leftText}>참여 인원</Text>
                                {preReservation.participators.length > 0 ?
                                    <View style={{ display: 'flex', flexDirection: 'row', gap: 8, }}>
                                        <Text style={[styles.rightText, { color: Color['grey300'], maxWidth: 156 }]} numberOfLines={1}>
                                            {`${preReservation.participators.slice(0, 3).map(user => `${user.name}`).filter(Boolean).join(', ')}`}
                                        </Text>
                                        {preReservation.participators.length >= 3 && <Text style={[styles.rightText, { color: Color['grey400'] }]}>{`외 ${reservation.participators?.length} 명`}</Text>}
                                    </View>

                                    :
                                    <Text style={[styles.rightText, { color: Color['grey300'] }]}>
                                        없음
                                    </Text>}
                            </View>
                        )}
                    </View>



                    <View style={{ alignSelf: 'center', paddingVertical: 16 }}>
                        <Icons name='arrow-down' color={Color['red500']} />
                    </View>



                    <View style={{ paddingHorizontal: 18, marginHorizontal: 24, borderRadius: 15, paddingVertical: 8, backgroundColor: '#FFF' }}>


                        {Object.keys(difference)
                            .filter((key: string) => !['addedBorrowInstrumentIds', 'removedBorrowInstrumentIds', 'addedParticipatorIds', 'removedParticipatorIds'].includes(key))
                            ?.map((key: string) => {
                                if (key == 'startTime' || key == 'endTime') {
                                    const time = newReservationDTO[key];
                                    return (
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 14 }}>
                                            <Text style={styles.leftText}>{key == 'startTime' ? '시작시간' : '종료시간'}</Text>
                                            <Text style={[styles.rightText, { color: Color['blue500'] }]}>{time.slice(0, 2)}시 {time.slice(-2)}분</Text>
                                        </View>)
                                }
                                return (
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 14 }}>
                                        <Text style={styles.leftText}>{key}</Text>
                                        <Text style={[styles.rightText, { color: Color['blue500'] }]}>{newReservationDTO[key]}</Text>
                                    </View>)
                            })}


                        {(difference.addedBorrowInstrumentIds || difference.removedBorrowInstrumentIds) && (
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 14 }}>
                                <Text style={styles.leftText}>대여 악기</Text>
                                {reservation.borrowInstruments.length > 0 ?
                                    <Text style={[styles.rightText, { marginRight: 12, color: Color['blue500'] }]}>{instrumentTypes.filter(type => type != '징').map((type) => {
                                        const instCount = reservation.borrowInstruments.filter((instrument) => instrument.instrumentType == type).length
                                        if (instCount > 0)
                                            return `${type} ${instCount}`
                                    })}
                                    </Text>
                                    : <Text style={[styles.rightText, { color: Color['blue500'] }]}>{'없음'}</Text>}

                                {reservation.borrowInstruments.length > 0 &&
                                    <Pressable style={{ position: 'absolute', right: -12 }}
                                        onPress={() => reservation.borrowInstruments.length > 0 && navigation.navigate('ReservationInstrumentsView', { instruments: JSON.stringify(reservation.borrowInstruments) })}>
                                        <Icons size={16} color={Color['grey300']} name={'chevron-forward'}></Icons>
                                    </Pressable>}
                            </View>
                        )}


                        {(difference.addedParticipatorIds || difference.removedParticipatorIds) && (
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 14 }}>
                                <Text style={styles.leftText}>참여 인원</Text>
                                {reservation.participators.length > 0 ?
                                    <View style={{ display: 'flex', flexDirection: 'row', gap: 8, marginRight: 12, }}><Text style={[styles.rightText, { color: Color['blue500'], maxWidth: 156 }]} numberOfLines={1}>
                                        {`${reservation.participators.slice(0, 3).map(user => `${user.name}`).join(', ')}` + `${reservation.participators.length >= 3 ? `외 ${reservation.participators?.length} 명` : ''}`}
                                    </Text>
                                        {reservation.participators.length >= 3 && <Text style={[styles.rightText, { color: Color['grey400'] }]}>{`외 ${reservation.participators?.length} 명`}</Text>}
                                    </View>
                                    :
                                    <Text style={[styles.rightText, { color: Color['blue500'] }]}>
                                        없음
                                    </Text>}

                                {reservation.participators.length > 0 &&
                                    <Pressable style={{ position: 'absolute', right: -12 }}
                                        onPress={() => reservation.participators.length > 0 && navigation.navigate('ReservationParticipatorsView', { participators: JSON.stringify(reservation.participators) })}>
                                        <Icons size={16} color={Color['grey300']} name={'chevron-forward'} />
                                    </Pressable>}
                            </View>
                        )}

                    </View>
                </View>

            </ScrollView>

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
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#FFF',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    paddingTop: 16,
                    justifyContent: 'space-between'
                }}
            >

                <View style={{ height: 36, marginHorizontal: 28, backgroundColor: 'transparent' }}>
                    <CheckboxComponent
                        isChecked={isAgree}
                        innerText="작성된 정보가 일치합니다."
                        onCheck={() => setAgree(!isAgree)}
                    />
                </View>
                <LongButton
                    color="blue"
                    innerText="확정하기"
                    isAble={isAgree}
                    onPress={ConfirmHandler}
                />
            </View>

        </View >
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