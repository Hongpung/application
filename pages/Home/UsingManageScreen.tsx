import { StyleSheet, Text, View, ScrollView, Modal } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Color } from '../../ColorSet'
import ProfileMiniCard from '../../components/cards/ProfileMiniCard'
import { UserProvider } from '../../context/UserContext'
import { User } from '../../UserType'
import LongButton from '../../components/buttons/LongButton'
import { debounce } from 'lodash'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainStackParamList } from '@hongpung/nav/HomeStacks'
import { StackActions, useNavigation } from '@react-navigation/native'
import { loginUserState } from '@hongpung/recoil/authState'
import { useRecoilValue } from 'recoil'
import { onUseSession } from '@hongpung/recoil/sessionState'
import { Icons } from '@hongpung/components/Icon'
import { getToken } from '@hongpung/utils/TokenHandler'

type UsingManageNavProp = NativeStackNavigationProp<MainStackParamList, 'UsingManage'>

const UsingManageScreen: React.FC = () => {

    const navigation = useNavigation<UsingManageNavProp>()
    const sessionData = useRecoilValue(onUseSession)
    const [canExtand, setExtendPossible] = useState(true);
    const [canReturn, setcanReturnPossible] = useState(true);


    const [attendUsers, setAttendUsers] = useState<User[]>([])
    const [lateUsers, setLateUsers] = useState<User[]>([])
    const [absentUsers, setAbsentUsers] = useState<User[]>([])
    const loginUser = useRecoilValue(loginUserState)

    const seperateUser = useCallback((sessionAttendanceList: { user: User, status: '참가' | '출석' | '결석' | '지각' }[]) => {
        const attendanceList = sessionAttendanceList
        const attends: User[] = []
        const lates: User[] = []
        const absences: User[] = []

        if (sessionData?.sessionType == 'Reservation') {
            attendanceList?.map(({ user, status }) => {
                if (status == '참가' || status == '출석')
                    attends.push(user)
                else if (status == '지각')
                    lates.push(user)
                else if (status == '결석')
                    absences.push(user)

            })

            setAttendUsers(attends)
            setLateUsers(lates)
            setAbsentUsers(absences)
        } else {
            attendanceList?.map(({ user, status }) => {
                if (status == '참가')
                    attends.push(user)
            })
            setAttendUsers(attends)
        }

    }, [])

    useEffect(() => {
        if (!!sessionData)
            seperateUser(sessionData?.attendanceList)
    }, [sessionData?.attendanceList])

    const extendSession = () => {
        const endfetch = async () => {
            try {
                const token = await getToken('utilToken')

                const response = await fetch(`${process.env.SUB_API}/room-session/extend`, {
                    method: 'POST', 
                    headers: {
                        Authorization: `Bearer ${token}`,  // Authorization 헤더에 Bearer 토큰 추가
                    },
                })

                if (!response.ok) throw Error('Failed')
                const { message } = await response.json();
                console.log(message)
                if (message != 'Fail')
                    navigation.goBack()
                else
                    alert('연습 시간 연장에 실패했어요.')
            } catch (err) {
                if (err instanceof Error) {
                    // `invalid Token` 메시지일 경우 처리
                    if (err.message === 'invalid Token') {

                        navigation.dispatch(StackActions.replace('Login'))
                        return;
                    }
                }
                console.log(err)
                alert(err)
            }
        }
        endfetch()
    }
    const calculateTimeDifference = () => {
        if (sessionData) {
            const now = new Date();

            // 목표 시각 생성
            const [hours, minutes, seconds] = sessionData?.endTime.split(':').map(Number);
            const endDate = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                hours,
                minutes,
                seconds
            );

            // 시간 차이 계산
            const diff = endDate.getTime() - now.getTime();
            if (diff <= 15 * 60 * 1000) {
                setExtendPossible(false)
            }
            const [shours, sminutes, sseconds] = sessionData?.startTime.split(':').map(Number);
            const startDate = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                shours,
                sminutes,
                sseconds
            );
            const diff2 = now.getTime() - startDate.getTime()
            if (diff2 >= 20 * 60 * 1000) {
                setcanReturnPossible(true)
            }

        }
    };


    useEffect(() => {
        // 초기 시간 계산
        calculateTimeDifference();

        // 1초마다 시간 업데이트
        const interval = setInterval(calculateTimeDifference, 1000);

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 타이머 정리
    }, [sessionData?.endTime]);


    if (!sessionData) return (
        <View>
            <Modal visible={true} transparent>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'center' }}>
                    <View style={{ marginHorizontal: 24, paddingVertical: 24, backgroundColor: '#FFF', display: 'flex', gap: 16, borderRadius: 15 }}>
                        <Text style={{
                            paddingHorizontal: 24,
                            fontFamily: 'NanumSquareNeo-Regular',
                            fontSize: 16,
                        }}>세션 정보가 없어요</Text>
                        <LongButton color='blue' innerText={'확인'} isAble={true} onPress={() => {
                            navigation.goBack()
                        }} />
                    </View>
                </View>
            </Modal>
        </View>
    )

    return (
        <UserProvider>
            <View style={{ flex: 1, backgroundColor: '#FFF' }}>
                <ScrollView style={{ flex: 1, backgroundColor: '#FFF' }} showsVerticalScrollIndicator={false}>
                    <View style={{ height: 16 }} />
                    <Text style={{ marginHorizontal: 32, fontFamily: 'NanumSquareNeo-Bold', fontSize: 18 }}>
                        연습 예정 시간
                    </Text>
                    <View style={{ height: 20 }} />
                    <View style={{ flexDirection: 'row', width: 176, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <Icons name='time-outline' color={Color['grey400']} />
                        <Text style={{ fontFamily: 'NanumSquareNeo-Regular', fontSize: 20 }}>{sessionData.startTime.slice(0, -3)} ~ {sessionData.endTime.slice(0, -3)}</Text>
                    </View>


                    <View style={{ height: 16 }} />

                    <View style={{ marginHorizontal: 24, display: 'flex', gap: 8 }}>
                        <Text style={{ marginHorizontal: 8, fontFamily: 'NanumSquareNeo-Bold', fontSize: 18 }}>{sessionData?.sessionType == 'Reservation' ? '출석한 사람' : '참가한 사람'}</Text>
                        {attendUsers.map((user) => (
                            <View key={user.memberId + 'container'} style={{ marginVertical: 4 }}>
                                <ProfileMiniCard key={user.name} user={user} isPicked={false} view={'inReserveView'} onPick={() => { }} />
                            </View>
                        ))}
                        {sessionData.sessionType == 'Reservation' && <>
                            {lateUsers.length != 0 &&
                                <>
                                    <Text style={{ marginHorizontal: 8, fontFamily: 'NanumSquareNeo-Bold', fontSize: 18 }}>지각한 사람</Text>
                                    {lateUsers.map((user) => (
                                        <View key={user.memberId + 'container'} style={{ marginVertical: 4 }}>
                                            <ProfileMiniCard key={user.name} user={user} isPicked={false} view={'inReserveView'} onPick={() => { }} />
                                        </View>
                                    ))}
                                </>}
                            {absentUsers.length != 0 &&
                                <><Text style={{ marginHorizontal: 8, fontFamily: 'NanumSquareNeo-Bold', fontSize: 18 }}>아직 안 온 사람</Text>
                                    {absentUsers.map((user) => (
                                        <View key={user.memberId + 'container'} style={{ marginVertical: 4 }}>
                                            <ProfileMiniCard key={user.name} user={user} isPicked={false} view={'inReserveView'} onPick={() => { }} />
                                        </View>
                                    ))}
                                </>}
                        </>}
                        <View style={{ height: 24 }} />
                    </View>

                </ScrollView>
                <View style={{ bottom: 0, display: 'flex', gap: 12, paddingBottom: 28 }}>
                    {(!canExtand) && <Text style={{ alignSelf: 'center', color: Color['red700'], fontSize: 14, fontFamily: 'NanumSquareNeo-Bold' }}>연장은 종료 15분 이전까지만 가능해요</Text>}
                    {(!canReturn) && <Text style={{ alignSelf: 'center', color: Color['red700'], fontSize: 14, fontFamily: 'NanumSquareNeo-Bold' }}>종료는 20분 이상 이용 후 가능해요</Text>}
                    <LongButton color='green' innerText='30분 연장하기' isAble={canExtand} onPress={() => { extendSession() }} />
                    <LongButton color='red' innerText='종료하기' isAble={canReturn} onPress={() => { navigation.replace('CheckOut') }} />
                </View>
            </View>
        </UserProvider>
    )
}

export default UsingManageScreen

const styles = StyleSheet.create({})