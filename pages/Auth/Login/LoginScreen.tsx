import { Keyboard, KeyboardAvoidingView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { StackActions } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { debounce } from 'lodash'

import { RootStackParamList } from '@hongpung/pageTypes'
import { useAuth } from '@hongpung/hoc/useAuth'
import InputComponent from '@hongpung/components/inputs/InputComponent'
import { Color } from '@hongpung/ColorSet'
import LongButton from '@hongpung/components/buttons/LongButton'
import CheckboxComponent from '@hongpung/components/checkboxs/CheckboxComponent'



type LoginProps = NativeStackScreenProps<RootStackParamList, "Login">;

const LoginScreen: React.FC<LoginProps> = ({ navigation }) => {

    const { login } = useAuth();
    const [Email, setEmail] = useState('');
    const [password, setPassWord] = useState('')
    const [saveID, setSaveID] = useState(false);
    const [autoLogin, setAutoLogin] = useState(false);
    const [checkVaildID, setValidID] = useState(false);
    const [checkVaildPW, setValidPW] = useState(false);

    const IDRef = useRef<any | null>(null);
    const PWRef = useRef<any | null>(null);

    useEffect(() => {
        const loadAutoLogin = async () => {
            try {
                const loadedAutoLogin = await AsyncStorage.getItem('autoLogin')
                setAutoLogin(loadedAutoLogin != null);

                if (loadedAutoLogin == null) {
                    const loadedSaveID = await AsyncStorage.getItem('saveID')
                    setSaveID(loadedSaveID != null);

                    if (loadedSaveID) {
                        const loadedEmail = await AsyncStorage.getItem('Email') || '저장된 아이디';
                        setEmail(loadedEmail)
                    }

                    return
                }
                else {
                    const loadedEmail = await AsyncStorage.getItem('Email') || '저장된 아이디';
                    setEmail(loadedEmail)
                    const loadedPassWord = await AsyncStorage.getItem('password') || '저장된 비밀번호';
                    setPassWord(loadedPassWord)

                    return
                }
            } catch (e) { console.error(e) }
        }
        loadAutoLogin()
    }, [])

    const LoginBtnHandler = async () => {
        IDRef.current?.validate();
        PWRef.current?.validate();

        if (!checkVaildID) {
            IDRef.current?.focus();
            return
        }

        if (!checkVaildPW) {
            PWRef.current?.focus();
            return
        }
        
        try {
            const loginResult = await login(Email, password);

            if (!loginResult) throw Error('로그인 정보 불일치')

            if (autoLogin) {
                AsyncStorage.setItem('autoLogin', 'true');
                Toast.show({
                    type: 'success',
                    text1: '앞으로 앱 실행시 자동으로 로그인 돼요',
                    position: 'bottom',
                    bottomOffset: 60,
                    visibilityTime: 3000
                });
            }

            else if (saveID) {        //     
                const autoLogin = await AsyncStorage.getItem('autoLogin') || false
                if (autoLogin) {
                    try {
                        await AsyncStorage.removeItem('autoLogin');
                    }
                    catch (e) { console.error(e) }
                }
                AsyncStorage.setItem('saveID', 'true')
                Toast.show({
                    type: 'success',
                    text1: '아이디를 저장했어요',
                    position: 'bottom',
                    bottomOffset: 60,
                    visibilityTime: 3000
                });
            }
            else {
                const loadedSaveID = await AsyncStorage.getItem('saveID') || false
                if (loadedSaveID) {
                    try {
                        await AsyncStorage.removeItem('saveID');
                    }
                    catch (e) { console.error(e) }
                }
            }

            navigation.dispatch(StackActions.replace('HomeStack'))
        } catch (e: unknown) {
            if (e instanceof Error) {
                if (e.message == '로그인 정보 불일치') {
                    IDRef.current?.errored('');
                    PWRef.current?.errored('로그인에 실패하였습니다.\n계정을 확인해주세요');
                    IDRef.current?.focus()
                }
            }

            else console.error(e)
        }
    }

    const SignupBtnHandler = () => {
        navigation.push('SignUp');
    }

    useEffect(() => {
        if (autoLogin) setSaveID(true)
    }, [autoLogin])

    useEffect(() => {
        if (!saveID) setAutoLogin(false)
    }, [saveID])

    return (
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); }} >
            <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#FFF" }} behavior='padding' >
                <View style={{ flex: 1, backgroundColor: "#FFF" }}>
                    <View style={{
                        height: 130,
                        width: 240,
                        backgroundColor: Color['blue400'],
                        marginTop: 36,
                        alignSelf: 'center'
                    }}>
                    </View>
                    <View style={{
                        marginTop: 36,
                        alignSelf: 'center'
                    }}>
                        <InputComponent
                            ref={IDRef}
                            inputValue={Email}
                            setInputValue={setEmail}
                            label='이메일'
                            keyboardType={'email-address'}
                            validationCondition={
                                [{
                                    validation: () => {
                                        const regex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                        return regex.test(Email);
                                    },
                                    errorText: "이메일 주소가 유효하지 않습니다"
                                }]
                            }
                            checkValid={setValidID}
                        />
                    </View>
                    <View style={{
                        marginTop: 12,
                        alignSelf: 'center'
                    }}>
                        <InputComponent
                            ref={PWRef}
                            inputValue={password}
                            setInputValue={setPassWord}
                            label='비밀번호'
                            isEncryption={true}
                            validationCondition={
                                [{
                                    validation: () => {
                                        const regex: RegExp = /^[A-Za-z\d@$!%*?&]{8,12}$/;
                                        return regex.test(password);
                                    },
                                    errorText: "비밀번호는 8~12자 입니다"
                                }]
                            }
                            checkValid={setValidPW}
                        />
                    </View>
                    <View style={{
                        marginTop: 16, width: '100%', paddingHorizontal: 60, flexDirection: 'row', justifyContent: 'space-between',
                        alignSelf: 'center'
                    }}>
                        <CheckboxComponent
                            innerText={'ID 저장'}
                            isChecked={saveID}
                            onCheck={setSaveID}
                        /><CheckboxComponent
                            innerText={'자동 로그인'}
                            isChecked={autoLogin}
                            onCheck={setAutoLogin}
                        />
                    </View>
                    <View style={{ marginTop: 20, marginHorizontal: 12 }}>
                        <LongButton
                            color={'blue'}
                            innerText={'로그인'}
                            isAble={true}
                            onPress={debounce(LoginBtnHandler, 500, { leading: true, trailing: false })}
                        />
                    </View>
                    <View style={{ marginTop: 16, width: 300, height: 26, justifyContent: 'center', marginHorizontal: 48 }}>
                        <Text style={{ fontSize: 16, lineHeight: 22, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey600'] }}>홍풍 앱이 처음이시라면?</Text>
                    </View>
                    <View style={{ marginTop: 16, marginHorizontal: 12 }}>
                        <LongButton
                            color={'green'}
                            innerText={'회원가입'}
                            isAble={true}
                            onPress={debounce(SignupBtnHandler, 500, { leading: true, trailing: false })}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    title: {
        flex: 1,
        fontFamily: "NanumSquareNeo-Bold",
        fontSize: 24,
        marginLeft: 20
    }
})