import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Color } from '../../ColorSet'
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg'
import LongButton from '../../components/buttons/LongButton'
import CheckboxComponent from '../../components/checkboxs/CheckboxComponent'
import { debounce } from 'lodash'

const CheckOutScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [isCheckin, CheckIn] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [isAgree, setAgree] = useState(false);

    useEffect(() => { navigation.setOptions({ animation: 'none' }); }, [])

    useEffect(() => {

        setLoading(true);
        setTimeout(() => setLoading(false), 1000)

    }, [isCheckin])

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <View style={{ height: '20%' }}></View>
            {isLoading ? <ActivityIndicator style={{ alignSelf: 'center', marginVertical: 24, width: 180, height: 180 }} color={Color['blue500']} size={100}></ActivityIndicator> :
                <View style={{ flex: 1 }}>
                    <Text style={{
                        fontFamily: 'NanumSquareNeo-Bold',
                        fontSize: 22,
                        color: Color['grey700'], textAlign: 'center'
                    }}>{isCheckin ? '연습 출석 완료' : `연습 종료 확인`}</Text>
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
                            <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14, color: Color['green500'] }}>참가하는 일정 </Text><Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14, color: Color['grey800'] }}>|</Text><Text style={{ fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, marginLeft: 4, color: Color['grey400'] }}>7월 7일</Text>
                        </View>
                        <View style={{ position: 'absolute', width: 208, top: 62, left: 56 }}>
                            <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 18, textAlign: 'center', }} numberOfLines={1} ellipsizeMode='tail' >참가하는 일정 최대 12자</Text>
                        </View>
                        <View style={{ position: 'absolute', right: 20, flexDirection: 'row', bottom: 50 }}>
                            <Text style={{ fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, marginLeft: 4, color: Color['grey400'] }}>17:00~18:00</Text>
                        </View>
                        <View style={{ position: 'absolute', right: 20, flexDirection: 'row', bottom: 20, height: 24, alignItems: 'center' }}>
                            <View style={{ backgroundColor: Color['grey400'], height: 20, width: 20 }} /><Text style={{ fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, marginLeft: 4, color: Color['grey400'] }}>99</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={{
                            fontFamily: 'NanumSquareNeo-Bold',
                            fontSize: 22,
                            color: Color['blue500'], textAlign: 'center', marginBottom: 4
                        }}>{`참가하는 일정 최대 12자`}</Text>
                        <Text style={{
                            fontFamily: 'NanumSquareNeo-Bold',
                            fontSize: 22,
                            color: Color['grey700'], textAlign: 'center'
                        }}>{`연습을 종료할까요?`}</Text>
                    </View>

                    <View style={{ position: 'absolute', width: '100%', bottom: 16 }}>
                        <View style={{ marginHorizontal: 28, marginBottom: 12 }}>
                            <CheckboxComponent
                                isChecked={isAgree}
                                innerText='남은시간을 반납하여, 연습을 종료합니다.' 
                                onCheck={() => isAgree ? setAgree(false) : setAgree(true)}
                            ></CheckboxComponent>
                        </View>
                        <LongButton color='red' innerText={`네, 종료할래요`} isAble={isAgree} onPress={() => { debounce(navigation.push('CheckOutDescript'), 500, { leading: true, trailing: false }) }} />
                    </View>
                </View>}
        </View>
    )
}

export default CheckOutScreen

const styles = StyleSheet.create({})