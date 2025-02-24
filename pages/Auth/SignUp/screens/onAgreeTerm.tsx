import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useSignUp } from '@hongpung/pages/Auth/SignUp/context/SignUpContext';
import { Color } from '@hongpung/ColorSet';
import { Icons } from '@hongpung/src/common/components/icons/Icon';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@hongpung/pageTypes';
import { useNavigation } from '@react-navigation/native';
import LongButton from '@hongpung/src/common/components/buttons/long-button';

type SginUpNavProp = NativeStackNavigationProp<RootStackParamList, "SignUp">;

export const AgreeTerm: React.FC = () => {

    const navigation = useNavigation<SginUpNavProp>()

    const { setStep } = useSignUp();

    const [serviceTerm, setServiceTerm] = useState(false)
    const [personalTerm, setPersonalTerm] = useState(false)

    const selectAllAccept = () => {
        if (serviceTerm && personalTerm) {
            setServiceTerm(false); setPersonalTerm(false)
        }
        else {
            setServiceTerm(true); setPersonalTerm(true)
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <View style={{ flex: 1 }}>
                <Text style={{
                    alignSelf: 'flex-start',
                    height: 40,
                    left: 40,
                    marginTop: 28,
                    fontSize: 24,
                    lineHeight: 26,
                    fontFamily: "NanumSquareNeo-Bold",
                }}>
                    회원가입
                </Text>
                <View style={{
                    marginVertical: 8, paddingHorizontal: 16, marginHorizontal: 36, backgroundColor: Color['grey100'], paddingVertical: 16, borderRadius: 5
                }}>
                    <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Light', color: Color['grey500'] }}>
                        {'서비스를 이용하기 위한 약관 사항에 동의해요.'}
                    </Text>
                </View>

                <View style={{ paddingVertical: 24, gap: 16 }}>
                    <Pressable style={{ marginHorizontal: 36, paddingHorizontal: 12, paddingVertical: 16, backgroundColor: Color['green100'], borderRadius: 4, flexDirection: 'row', gap: 8, alignItems: 'center' }}
                        onPress={selectAllAccept}>
                        <View style={{ borderRadius: 5, width: 20, height: 20, borderWidth: 1, backgroundColor: serviceTerm && personalTerm ? Color['green400'] : 'white', borderColor: serviceTerm && personalTerm ? Color['green400'] : Color['grey400'], alignItems: 'center', justifyContent: 'center' }}>
                            {serviceTerm && personalTerm && <Icons color={'white'} name='checkmark-outline' size={16} />}
                        </View>
                        <Text style={[serviceTerm && personalTerm ?
                            { fontFamily: 'NanumSquareNeo-Bold', color: Color['grey700'] }
                            :
                            { fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'], },
                        { fontSize: 14 }]}>모든 약관에 동의합니다.</Text>
                    </Pressable>
                    <View style={{ gap: 12 }}>
                        <Pressable style={{ marginHorizontal: 36, paddingHorizontal: 12, paddingVertical: 12, flexDirection: 'row', gap: 8, alignItems: 'center' }}
                            onPress={() => setServiceTerm(prev => !prev)}>
                            <View style={{ borderRadius: 5, width: 20, height: 20, borderWidth: 1, backgroundColor: serviceTerm ? Color['green400'] : 'white', borderColor: serviceTerm && personalTerm ? Color['green400'] : Color['grey400'], alignItems: 'center', justifyContent: 'center' }}>
                                {serviceTerm && <Icons color={'white'} name='checkmark-outline' size={16} />}
                            </View>
                            <View style={{ justifyContent: 'space-between', flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                                <Text style={[serviceTerm ?
                                    { fontFamily: 'NanumSquareNeo-Bold', color: Color['grey700'] }
                                    :
                                    { fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'], },
                                { fontSize: 14 }]}>서비스 이용 약관에 동의합니다.</Text>
                                <Pressable style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }} onPress={() => navigation.push("WebView", { url: 'https://storage.hongpung.com/terms/%EC%84%9C%EB%B9%84%EC%8A%A4+%EC%9D%B4%EC%9A%A9%EC%95%BD%EA%B4%80.html', title: '서비스 이용약관' })}>
                                    <Icons name='chevron-forward-outline' size={20} color={Color['grey300']} />
                                </Pressable>
                            </View>
                        </Pressable>
                        <Pressable style={{ marginHorizontal: 36, paddingHorizontal: 12, paddingVertical: 12, flexDirection: 'row', gap: 8, alignItems: 'center' }}
                            onPress={() => setPersonalTerm(prev => !prev)}>
                            <View style={{ borderRadius: 5, width: 20, height: 20, borderWidth: 1, backgroundColor: personalTerm ? Color['green400'] : 'white', borderColor: serviceTerm && personalTerm ? Color['green400'] : Color['grey400'], alignItems: 'center', justifyContent: 'center' }}>
                                {personalTerm && <Icons color={'white'} name='checkmark-outline' size={16} />}
                            </View>
                            <View style={{ justifyContent: 'space-between', flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                                <Text style={[personalTerm ?
                                    { fontFamily: 'NanumSquareNeo-Bold', color: Color['grey700'] }
                                    :
                                    { fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'], },
                                { fontSize: 14 }]}>개인정보 처리 방침에 동의합니다.</Text>
                                <Pressable style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }} onPress={() => navigation.push("WebView", { url: 'https://storage.hongpung.com/terms/%EA%B0%9C%EC%9D%B8%EC%A0%95%EB%B3%B4+%EC%B2%98%EB%A6%AC%EB%B0%A9%EC%B9%A8.html', title: '개인정보 처리 방침' })}>
                                    <Icons name='chevron-forward-outline' size={20} color={Color['grey300']} />
                                </Pressable>
                            </View>
                        </Pressable>
                    </View>
                </View>
            </View>

            <View>
                <LongButton
                    isAble={serviceTerm && personalTerm}
                    color='green'
                    onPress={() => setStep('이메일 인증')}
                    innerText='다음'
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})