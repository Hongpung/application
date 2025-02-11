import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native'
import React, { Children, useEffect, useState } from 'react'
import { Color } from '../../ColorSet'
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg'
import LongButton from '../../components/buttons/LongButton'
import CheckboxComponent from '../../components/checkboxs/CheckboxComponent'
import { debounce } from 'lodash'
import { loginUserState, useOnReserve } from '@hongpung/recoil/authState'
import { useRecoilState, useRecoilValue } from 'recoil'
import { onUseSession } from '@hongpung/recoil/sessionState'
import { josa } from 'es-hangul'
import { Icons } from '@hongpung/components/common/Icon'
import { CheckOutProvider, useCheckOut } from './context/useCheckOutContext'
import { useNavigation } from '@react-navigation/native'
import CheckOutDescriptScreen from './CheckOutDescriptScreen'
import CheckOutCameraScreen from './CheckOutCameraScreen'
import PictureCheckScreen from './PictureCheckScreen'
import CheckOutEndScreen from './CheckOutEndScreen'

const CheckOutScreen: React.FC = () => {

    const navigation = useNavigation();
    const { usingSession, setStep } = useCheckOut();
    const [isAgree, setAgree] = useState(false);
    const loginUser = useRecoilValue(loginUserState)

    useEffect(() => { navigation.setOptions({ animation: 'none' }); }, [])

    if (!loginUser || !usingSession)
        return (
            <View>
                <Modal visible={true} transparent>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <View style={{
                            borderRadius: 20,
                            minHeight: 200,
                            paddingVertical: 24,
                            marginHorizontal: 24,
                            display: 'flex',
                            gap: 12,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#fff',
                        }}>
                            <Text style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: 'red',
                            }}>세션 정보가 존재하지 않습니다.</Text>
                            <Text style={{
                                fontSize: 16,
                                color: '#333',
                            }}>확인 후 다시 시도해주세요.</Text>
                            <View style={{ width: '100%', marginTop: 16 }}>
                                <LongButton color='blue' innerText='확인' isAble={true} onPress={() => navigation.goBack()} />
                            </View>
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
                }}>{`연습 종료 확인`}</Text>
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
                        <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14, color: Color['green500'] }}>{usingSession.creatorId != loginUser.memberId ? `참가하는 일정 ` : `내가 만든 일정 `} </Text>
                        <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14, color: Color['grey800'] }}>|</Text>
                        <Text style={{ fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, marginLeft: 4, color: Color['grey400'] }}>{usingSession.date}</Text>
                    </View>
                    <View style={{ position: 'absolute', width: 208, top: 62, left: 56 }}>
                        <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 18, textAlign: 'center', }} numberOfLines={1} ellipsizeMode='tail' >
                            {usingSession.title}
                        </Text>
                    </View>
                    <View style={{ position: 'absolute', right: 20, flexDirection: 'row', bottom: 50 }}>
                        <Text style={{ fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, marginLeft: 4, color: Color['grey400'] }}>{usingSession.startTime.slice(0, -3)}~{usingSession.endTime.slice(0, -3)}</Text>
                    </View>
                    <View style={{ position: 'absolute', right: 20, flexDirection: 'row', bottom: 20, height: 24, alignItems: 'center' }}>
                        {usingSession.sessionType == 'RESERVED' ?
                            <>
                                <Icons name='people' color={Color['grey400']} size={24} />
                                <Text style={{ fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, marginLeft: 4, color: Color['grey400'] }}>{usingSession.participatorIds!.length}</Text></> :
                            <Text style={{ fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, marginLeft: 4, color: Color['grey400'] }}>실시간 예약</Text>
                        }
                    </View>
                </View>
                <View>
                    <Text style={{
                        fontFamily: 'NanumSquareNeo-Bold',
                        fontSize: 22,
                        color: Color['blue500'], textAlign: 'center', marginBottom: 4
                    }}>
                        {usingSession.title}
                    </Text>
                    <Text style={{
                        fontFamily: 'NanumSquareNeo-Bold',
                        fontSize: 22,
                        color: Color['grey700'], textAlign: 'center'
                    }}>{`연습실 이용을 종료할까요?`}</Text>
                </View>

                <View style={{ position: 'absolute', width: '100%', bottom: 16 }}>
                    <View style={{ marginHorizontal: 28, marginBottom: 12 }}>
                        <CheckboxComponent
                            isChecked={isAgree}
                            innerText='남은시간을 반납하여, 연습실 이용을 종료합니다.'
                            onCheck={() => isAgree ? setAgree(false) : setAgree(true)}
                        ></CheckboxComponent>
                    </View>
                    <LongButton color='red' innerText={`네, 종료할래요`} isAble={isAgree} onPress={() => {
                        setStep('Description')
                    }} />
                </View>
            </View>
        </View>
    )
}

export default CheckOutScreen

const styles = StyleSheet.create({})


export const CheckOutContainer: React.FC = () => {
    return (
        <CheckOutProvider>
            <CheckOutScreen2 />
        </CheckOutProvider>
    )
}

const CheckOutScreen2: React.FC = () => {

    const { onStep } = useCheckOut();

    switch (onStep) {
        case 'CheckOutConfirm':
            return (<CheckOutScreen />)
        case 'Description':
            return (<CheckOutDescriptScreen />)
        case 'Camera':
            return (<CheckOutCameraScreen />)
        case 'CheckPicture':
            return (<PictureCheckScreen />)
        case 'CheckOutComplete':
            return (<CheckOutEndScreen/>)

    }
}