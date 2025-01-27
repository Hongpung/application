import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Color } from '../../ColorSet'
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg'
import LongButton from '../../components/buttons/LongButton'
import { StackActions, useNavigation } from '@react-navigation/native'
import { MainStackParamList } from '@hongpung/nav/HomeStacks'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { loginUserState, useOnReserve } from '@hongpung/recoil/authState'
import { RealtimeSession, ReservationSession } from '../Reservation/SessionTypes'
import { Icons } from '@hongpung/components/common/Icon'
import useFetchUsingToken from '@hongpung/hoc/useFetchUsingToken'
import { getToken } from '@hongpung/utils/TokenHandler'
import CustomSwitch from '@hongpung/components/common/CustomSwitch'

type CheckPossible =
    {
        session: ReservationSession | RealtimeSession | null,
        nextReservation: ReservationSession | null,
        timeLimit: boolean | undefined,
        createPossible: boolean,
        isPariticipant: boolean | undefined,
        message: string | null,
        participationAvailable: boolean | undefined
    }

const TimetoDate = (time: string): Date => {
    const utcTime = new Date();
    const koreaTime = new Date(utcTime.getTime() + 9 * 60 * 60 * 1000);
    const today = koreaTime.toISOString().split('T')[0]

    return new Date(today + 'T' + time + 'Z')
}

const CheckInScreen: React.FC = () => {

    const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

    const loginUser = useRecoilValue(loginUserState)
    const setRoomSocket = useSetRecoilState(useOnReserve); // 쓰기 전용
    const [isCheckin, CheckIn] = useState(false);
    const [checkinStatus, setStatus] = useState<'create' | 'attend' | 'start' | 'late' | null>(null);
    const [participationAvailable, setParticipationAvailable] = useState(false)

    const { data: sessionData, loading, error } = useFetchUsingToken<CheckPossible>(`${process.env.SUB_API}/check-in/check-possible`,)

    console.log(sessionData)
    useEffect(() => { navigation.setOptions({ animation: 'none' }); }, [])

    const startSession = () => {
        const start = async () => {
            try {
                if (!loginUser) throw Error('유저 정보가 없습니다.')

                const token = await getToken('token')
                if (!token) throw Error('Invalid Token')

                const response = await fetch(`${process.env.BASE_URL}/check-in/start`,
                    {

                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({participationAvailable})
                    }
                )
                if (!response.ok) throw Error('session 입장에 실패했습니다.')

                const data = await response.json();

                const { status } = await data;

                console.log(status)

                setStatus(status);

                CheckIn(true)

                if (status) {

                    setRoomSocket(true)

                }
            } catch (e) {
                alert(e)
            }
        }

        start();
    }

    const attendSession = () => {
        const attend = async () => {
            try {
                if (!loginUser) throw Error('유저 정보가 없습니다.')
                const token = await getToken('token')
                if (!token) throw Error('Invalid Token')
                const response = await fetch(`${process.env.SUB_API}/check-in/attend`,
                    {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(loginUser)
                    }
                )
                if (!response.ok) throw Error('session 입장에 실패했습니다.')

                const data = await response.json();

                const { status } = await data;

                console.log(status)

                setStatus(status);

                CheckIn(true)

                if (status) {

                    setRoomSocket(true)

                }
            } catch (e) {
                alert(e)
            }
        }

        attend();
    }

    const signRender = () => {
        switch (checkinStatus) {
            case 'late':
                return <LateSign />;
            case 'attend':
                return <AttendanceSign />
            case 'start':
                return <StartSign />
            case 'create':
                return <CreateSign />
        }
    }

    if (loading)
        return (
            <View style={{ flex: 1, backgroundColor: '#FFF' }}>
                <ActivityIndicator style={{ alignSelf: 'center', marginVertical: 24, width: 180, height: 180 }} color={Color['blue500']} size={100} />
            </View>
        )

    if (!!sessionData?.timeLimit)
        return (
            <View style={{ flex: 1, backgroundColor: '#FFF' }}>
                <Modal visible={true} transparent>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'center' }}>
                        <View style={{ marginHorizontal: 24, paddingVertical: 24, backgroundColor: '#FFF', display: 'flex', gap: 16, borderRadius: 15 }}>
                            <Text style={{
                                paddingHorizontal: 24,
                                fontFamily: 'NanumSquareNeo-Bold',
                                fontSize: 20,
                            }}>사용불가</Text>
                            <Text style={{
                                paddingHorizontal: 24,
                                fontFamily: 'NanumSquareNeo-Regular',
                                fontSize: 16,
                            }}>연습실 사용시간: 10:00 ~ 22:00</Text>
                            <LongButton color='blue' innerText={'확인'} isAble={true} onPress={() => {
                                navigation.goBack()
                                navigation.goBack()
                            }} />
                        </View>
                    </View>
                </Modal>
            </View>
        )

    if (!!sessionData?.message)
        return (
            <View style={{ flex: 1, backgroundColor: '#FFF' }}>
                <Modal visible={true} transparent>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'center' }}>
                        <View style={{ marginHorizontal: 24, paddingVertical: 24, backgroundColor: '#FFF', display: 'flex', gap: 16, borderRadius: 15 }}>
                            <Text style={{
                                paddingHorizontal: 24,
                                fontFamily: 'NanumSquareNeo-Bold',
                                fontSize: 20,
                            }}>참여 불가</Text>
                            <Text style={{
                                paddingHorizontal: 24,
                                fontFamily: 'NanumSquareNeo-Regular',
                                fontSize: 16,
                            }}>이미 참가중인 세션이에요</Text>
                            <LongButton color='blue' innerText={'확인'} isAble={true} onPress={() => {
                                navigation.goBack()
                                navigation.goBack()
                            }} />
                        </View>
                    </View>
                </Modal>
            </View>
        )
    if (!sessionData?.createPossible && !sessionData?.isPariticipant && !sessionData?.participationAvailable)
        return (
            <View style={{ flex: 1, backgroundColor: '#FFF' }}>
                <Modal visible={true} transparent>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'center' }}>
                        <View style={{ marginHorizontal: 24, paddingVertical: 24, backgroundColor: '#FFF', display: 'flex', gap: 16, borderRadius: 15 }}>
                            <Text style={{
                                paddingHorizontal: 24,
                                fontFamily: 'NanumSquareNeo-Bold',
                                fontSize: 20,
                            }}>참여 불가</Text>
                            <Text style={{
                                paddingHorizontal: 24,
                                fontFamily: 'NanumSquareNeo-Regular',
                                fontSize: 16,
                            }}>참여할 수 없는 세션이에요</Text>
                            <LongButton color='blue' innerText={'확인'} isAble={true} onPress={() => {
                                navigation.goBack()
                                navigation.goBack()
                            }} />
                        </View>
                    </View>
                </Modal>
            </View>
        )
    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <View style={{ height: '20%' }}></View>
            <View style={{ flex: 1 }}>
                <Text style={{
                    fontFamily: 'NanumSquareNeo-Bold',
                    fontSize: 22,
                    color: Color['grey700'], textAlign: 'center'
                }}>
                    {isCheckin ? !!sessionData?.session ? '연습 출석 완료' : '바로 사용 가능' : !!sessionData?.session ? `연습 참가 확인` : '바로 사용하기'}
                </Text>
                {
                    isCheckin ?
                        checkinStatus == 'late' ?
                            <View style={{
                                width: 180, height: 180, borderRadius: 5, borderWidth: 1, borderColor: Color['red500'], marginVertical: 24, overflow: 'hidden', alignSelf: 'center', backgroundColor: Color['red200']
                            }}></View> : <View style={{
                                width: 180, height: 180, borderRadius: 5, borderWidth: 1, borderColor: Color['blue500'], marginVertical: 24, overflow: 'hidden', alignSelf: 'center', backgroundColor: Color['blue200']
                            }}></View>
                        : !!sessionData?.session ?
                            sessionData.session.sessionType == 'RESERVED' ?
                                <View style={{
                                    width: 320, height: 180, borderRadius: 5, borderWidth: 1, borderColor: Color['grey100'], marginVertical: 24, overflow: 'hidden', alignSelf: 'center',
                                }}>
                                    <Svg height="420" width="400" style={[StyleSheet.absoluteFill, { opacity: 0.3 }]}>
                                        <Defs>
                                            <RadialGradient
                                                id="grad"
                                                cx="30%"
                                                cy="56%"
                                                rx="34%"
                                                ry="32%"
                                                fx="32%"
                                                fy="58%"
                                                gradientUnits="userSpaceOnUse"
                                            >
                                                <Stop offset="0%" stopColor="#5BBF88" />
                                                <Stop offset="60%" stopColor="#B2CF82" />
                                                <Stop offset="100%" stopColor="#FFFFFF" />
                                            </RadialGradient>
                                        </Defs>
                                        <Rect width="100%" height="100%" fill="url(#grad)" />
                                    </Svg>
                                    <View style={{ position: 'absolute', flexDirection: 'row', left: 18, top: 18 }}>
                                        <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14, color: Color['green500'] }}>참가하는 일정 </Text><Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14, color: Color['grey800'] }}>|</Text><Text style={{ fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, marginLeft: 4, color: Color['grey400'] }}>
                                            {sessionData.session.date}
                                        </Text>
                                    </View>
                                    <View style={{ position: 'absolute', width: 208, top: 62, left: 56 }}>
                                        <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 18, textAlign: 'center', }} numberOfLines={1} ellipsizeMode='tail' >{sessionData.session.creatorName}</Text>
                                    </View>
                                    <View style={{ position: 'absolute', right: 20, flexDirection: 'row', bottom: 50 }}>
                                        <Text style={{ fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, marginLeft: 4, color: Color['grey400'] }}>{sessionData.session.startTime.slice(0, -3)}~{sessionData.session.endTime.slice(0, -3)}</Text>
                                    </View>
                                    <View style={{ position: 'absolute', right: 20, flexDirection: 'row', bottom: 20, height: 24, alignItems: 'center' }}>
                                        <Icons name='people' color={Color['grey400']} size={24} />
                                        <Text style={{ fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, marginLeft: 4, color: Color['grey400'] }}>
                                            {sessionData.session.participatorIds!.length}
                                        </Text>
                                    </View>
                                </View>
                                :
                                <View style={{
                                    width: 320, height: 180, borderRadius: 5, borderWidth: 1, borderColor: Color['grey100'], marginVertical: 24, overflow: 'hidden', alignSelf: 'center',
                                }}>
                                    <Svg height="420" width="400" style={[StyleSheet.absoluteFill, { opacity: 0.3 }]}>
                                        <Defs>
                                            <RadialGradient
                                                id="grad"
                                                cx="30%"
                                                cy="56%"
                                                rx="34%"
                                                ry="32%"
                                                fx="32%"
                                                fy="58%"
                                                gradientUnits="userSpaceOnUse"
                                            >
                                                <Stop offset="0%" stopColor="#5BBF88" />
                                                <Stop offset="60%" stopColor="#B2CF82" />
                                                <Stop offset="100%" stopColor="#FFFFFF" />
                                            </RadialGradient>
                                        </Defs>
                                        <Rect width="100%" height="100%" fill="url(#grad)" />
                                    </Svg>
                                    <View style={{ position: 'absolute', flexDirection: 'row', left: 18, top: 18 }}>
                                        <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14, color: Color['green500'] }}>참가하는 일정 </Text><Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14, color: Color['grey800'] }}>|</Text><Text style={{ fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, marginLeft: 4, color: Color['grey400'] }}>
                                            {sessionData.session.date}
                                        </Text>
                                    </View>
                                    <View style={{ position: 'absolute', width: 208, top: 62, left: 56 }}>
                                        <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 18, textAlign: 'center', }} numberOfLines={1} ellipsizeMode='tail' >{sessionData.session.creatorName}</Text>
                                    </View>
                                    <View style={{ position: 'absolute', right: 20, flexDirection: 'row', bottom: 50 }}>
                                        <Text style={{ fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, marginLeft: 4, color: Color['grey400'] }}>{sessionData.session.startTime.slice(0, -3)}~{sessionData.session.endTime.slice(0, -3)}</Text>
                                    </View>
                                    <View style={{ position: 'absolute', right: 20, flexDirection: 'row', bottom: 20, height: 24, alignItems: 'center' }}>
                                        <Text style={{ fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, marginLeft: 4, color: Color['grey400'] }}>실시간 예약</Text>
                                    </View>
                                </View>
                            :
                            <View style={{
                                width: 320, height: 180, borderRadius: 5, borderWidth: 1, borderColor: Color['grey100'], marginVertical: 24, overflow: 'hidden', alignSelf: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 20, color: Color['grey600'] }}>이 시간은 예약이 없어요</Text>
                                <Text style={{ fontFamily: 'NanumSquareNeo-Regular', fontSize: 16, lineHeight: 24, color: Color['grey400'] }}>바로 사용할 수 있어요</Text>
                                {sessionData.nextReservation &&
                                    <Text style={{ position: 'absolute', bottom: 24, fontFamily: 'NanumSquareNeo-Regular', fontSize: 16, lineHeight: 24, color: Color['grey400'] }}>
                                        다음 연습까지 남은 시간: {Math.floor((TimetoDate(sessionData.nextReservation?.startTime).getTime() - (new Date().getTime() + 9 * 60 * 60 * 1000)) / 1000 / 60 / 60)}시간 {Math.floor((TimetoDate(sessionData.nextReservation?.startTime).getTime() - (new Date().getTime() + 9 * 60 * 60 * 1000)) / 1000 / 60 % 60)}분
                                    </Text>}
                            </View>}
                {isCheckin ?
                    signRender()
                    : !!sessionData?.session ?
                        <View>
                            <Text style={{
                                fontFamily: 'NanumSquareNeo-Bold',
                                fontSize: 22,
                                color: Color['green500'], textAlign: 'center', marginBottom: 4
                            }}>{`참가하는 일정 최대 12자`}</Text>
                            <Text style={{
                                fontFamily: 'NanumSquareNeo-Bold',
                                fontSize: 22,
                                color: Color['grey700'], textAlign: 'center'
                            }}>{sessionData?.isPariticipant ? `연습에 출석하시나요?` : `연습에 참가하시나요?`}</Text>
                        </View>
                        :
                        <View>
                            <Text style={{
                                fontFamily: 'NanumSquareNeo-Bold',
                                fontSize: 18,
                                color: Color['green500'], textAlign: 'center', marginBottom: 4
                            }}>{sessionData?.nextReservation ? `${sessionData.nextReservation.startTime.slice(0, 2) + '시 ' + sessionData.nextReservation.startTime.slice(-2)}분 까지 사용하실 수 있어요` : '제한 없이 사용할 수 있어요'}</Text>
                            <Text style={{
                                fontFamily: 'NanumSquareNeo-Bold',
                                fontSize: 20,
                                color: Color['grey700'], textAlign: 'center'
                            }}>{`시작하시겠어요?`}</Text>
                            <View style={{marginTop:64, flexDirection: 'row', gap: 12, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14, color: participationAvailable ? Color['green500'] : Color['red500'] }}>{participationAvailable ? '열린 연습' : '참여 불가'}</Text>
                                <CustomSwitch onChange={setParticipationAvailable} value={participationAvailable} />
                            </View>
                        </View>}

                <View style={{ position: 'absolute', width: '100%', bottom: 16 }}>
                    {isCheckin ?
                        <LongButton color='blue' innerText={'확인'} isAble={true} onPress={() => {
                            console.log('ss')
                            navigation.dispatch(StackActions.replace('HomeStack'))
                        }} /> :
                        <LongButton color='blue' innerText={!!sessionData ? '맞아요' : '바로 사용할래요'} isAble={true}
                            onPress={() => {
                                if (!!sessionData.session) attendSession();
                                else startSession();
                            }} />}

                </View>
            </View>
        </View>
    )
}

export default CheckInScreen


const LateSign: React.FC = () => {
    return (
        <View>
            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <Text style={{
                    fontFamily: 'NanumSquareNeo-Bold',
                    fontSize: 22,
                    color: Color['red500'], textAlign: 'center', marginBottom: 4
                }}>{`7`}</Text>
                <Text style={{
                    fontFamily: 'NanumSquareNeo-Bold',
                    fontSize: 22,
                    color: Color['grey700'], textAlign: 'center', marginBottom: 4
                }}>{`분`}</Text>
                <Text style={{
                    fontFamily: 'NanumSquareNeo-Bold',
                    fontSize: 22,
                    color: Color['red500'], textAlign: 'center', marginBottom: 4
                }}>{` 지각`}</Text>
                <Text style={{
                    fontFamily: 'NanumSquareNeo-Bold',
                    fontSize: 22,
                    color: Color['grey700'], textAlign: 'center', marginBottom: 4
                }}>{`했어요!`}</Text>
            </View>
        </View>
    )
}

const AttendanceSign: React.FC = () => {
    return (
        <View>
            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <Text style={{
                    fontFamily: 'NanumSquareNeo-Bold',
                    fontSize: 22,
                    color: Color['grey700'], textAlign: 'center', marginBottom: 4
                }}>{`정상적으로`}</Text>
                <Text style={{
                    fontFamily: 'NanumSquareNeo-Bold',
                    fontSize: 22,
                    color: Color['blue500'], textAlign: 'center', marginBottom: 4
                }}>{` 출석`}</Text>
                <Text style={{
                    fontFamily: 'NanumSquareNeo-Bold',
                    fontSize: 22,
                    color: Color['grey700'], textAlign: 'center', marginBottom: 4
                }}>{`했어요!`}</Text>
            </View>

            <Text style={{
                fontFamily: 'NanumSquareNeo-Bold',
                fontSize: 22,
                color: Color['grey700'], textAlign: 'center'
            }}>{`열심히 연습하세요~`}</Text>
        </View>
    )
}

const StartSign: React.FC = () => {
    return (
        <View>
            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <Text style={{
                    fontFamily: 'NanumSquareNeo-Bold',
                    fontSize: 22,
                    color: Color['grey700'], textAlign: 'center', marginBottom: 4
                }}>{`정상적으로`}</Text>
                <Text style={{
                    fontFamily: 'NanumSquareNeo-Bold',
                    fontSize: 22,
                    color: Color['blue500'], textAlign: 'center', marginBottom: 4
                }}>{` 시작`}</Text>
                <Text style={{
                    fontFamily: 'NanumSquareNeo-Bold',
                    fontSize: 22,
                    color: Color['grey700'], textAlign: 'center', marginBottom: 4
                }}>{`했어요!`}</Text>
            </View>

            <Text style={{
                fontFamily: 'NanumSquareNeo-Bold',
                fontSize: 22,
                color: Color['grey700'], textAlign: 'center'
            }}>{`열심히 연습하세요~`}</Text>
        </View>
    )
}

const CreateSign: React.FC = () => {
    return (
        <View>
            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <Text style={{
                    fontFamily: 'NanumSquareNeo-Bold',
                    fontSize: 22,
                    color: Color['grey700'], textAlign: 'center', marginBottom: 4
                }}>{`실시간 사용이`}</Text>
                <Text style={{
                    fontFamily: 'NanumSquareNeo-Bold',
                    fontSize: 22,
                    color: Color['blue500'], textAlign: 'center', marginBottom: 4
                }}>{` 허가`}</Text>
                <Text style={{
                    fontFamily: 'NanumSquareNeo-Bold',
                    fontSize: 22,
                    color: Color['grey700'], textAlign: 'center', marginBottom: 4
                }}>{`됐어요!`}</Text>
            </View>

            <Text style={{
                fontFamily: 'NanumSquareNeo-Bold',
                fontSize: 22,
                color: Color['grey700'], textAlign: 'center'
            }}>{`즐거운 연습돼세요~`}</Text>
        </View>
    )
}