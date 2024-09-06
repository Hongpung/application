import { Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import InputComponent from '../../components/inputs/InputComponent'
import { Color } from '../../ColorSet'
import LongButton from '../../components/buttons/LongButton'
import CheckboxComponent from '../../components/checkboxs/CheckboxComponent'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../pageTypes'
import Toast from 'react-native-toast-message'
import { useAuth } from '../../context/AuthContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StackActions } from '@react-navigation/native'



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
        // if (!checkVaildID) {
        //     console.log('Email을 확인하세요');

        //     PWRef.current?.focus();
        //     PWRef.current?.blur();

        //     IDRef.current?.focus();
        //     IDRef.current?.blur()
        //     IDRef.current?.focus();
        //     return
        // }

        // if (!checkVaildPW) {
        //     console.log('password를 확인하세요');
        //     PWRef.current?.focus();
        //     PWRef.current?.blur();
        //     PWRef.current?.focus();
        //     return
        // }

        login(Email,password);//로그인 로직임


        //     AsyncStorage.setItem('Email', Email);
        //     AsyncStorage.setItem('password', password);

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
                            onPress={LoginBtnHandler}
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
                            onPress={SignupBtnHandler}
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