import { Keyboard, KeyboardAvoidingView, Modal, Pressable, Text, TouchableWithoutFeedback, View } from 'react-native'
import React, { useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { debounce } from 'lodash'

import { RootStackParamList } from '@hongpung/pageTypes'
import { Color } from '@hongpung/ColorSet'
import LongButton from '@hongpung/components/buttons/LongButton'
import { LoginForm } from './components/LoginForm'
import { AlertModal } from '@hongpung/components/AlertModal/AlertModal'

type LoginProps = NativeStackScreenProps<RootStackParamList, "Login">;

const LoginScreen: React.FC<LoginProps> = ({ navigation }) => {

    const SignupBtnHandler = () => {
        navigation.push('SignUp');
    }

    const onPressSignUpButton = debounce(SignupBtnHandler, 500, { leading: true, trailing: false })

    return (
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); }} >
            <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#FFF" }} behavior='padding' >
                <View style={{ flex: 1, backgroundColor: "#FFF" }}>

                    <Text style={{
                        alignSelf: 'flex-start',
                        paddingHorizontal:40,
                        paddingTop:52,
                        paddingBottom:28,
                        marginTop: 28,
                        fontSize: 24,
                        lineHeight: 26,
                        fontFamily: "NanumSquareNeo-Bold",
                    }}>
                        로그인
                    </Text>


                    <LoginForm />


                    <View style={{ display: 'flex', flexDirection: 'row', marginTop: 16, width: 300, height: 26, marginHorizontal: 48 }}>
                        <View style={{ flex: 1 }}>
                            <AlertModal
                                triggerNode={<Text style={{ width: '100%', fontSize: 16, lineHeight: 22, fontFamily: 'NanumSquareNeo-Bold', textAlign: 'center', color: Color['grey600'] }}>ID 찾기</Text>}
                                title='이메일 찾기 안내'
                                content={`이메일은 관리자에게 문의하여 찾을 수 있어요.\n관리자 연락처: admin@gmail.com`}
                            />
                        </View>

                        <Pressable style={{ flex: 1, alignItems: 'center' }}
                            onPress={() => { navigation.push('PWReset') }}>
                            <Text style={{ fontSize: 16, lineHeight: 22, fontFamily: 'NanumSquareNeo-Bold', textAlign: 'center', color: Color['grey600'] }}>비밀번호 변경</Text>
                        </Pressable>
                    </View>

                    <View style={{ marginTop: 16, width: 300, height: 26, justifyContent: 'center', marginHorizontal: 48 }}>
                        <Text style={{ fontSize: 16, lineHeight: 22, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey600'] }}>홍풍 앱이 처음이시라면?</Text>
                    </View>

                    <View style={{ marginTop: 16, marginHorizontal: 12 }}>
                        <LongButton
                            color={'green'}
                            innerText={'회원가입'}
                            isAble={true}
                            onPress={onPressSignUpButton}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}

export default LoginScreen