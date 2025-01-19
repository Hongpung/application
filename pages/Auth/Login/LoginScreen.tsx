import { Keyboard, KeyboardAvoidingView, Modal, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { StackActions } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { debounce } from 'lodash'

import { RootStackParamList } from '@hongpung/pageTypes'
import { useAuth } from '@hongpung/hoc/useAuth'
import { Color } from '@hongpung/ColorSet'
import LongButton from '@hongpung/components/buttons/LongButton'
import CheckboxComponent from '@hongpung/components/checkboxs/CheckboxComponent'
import { InputBaseComponent } from '@hongpung/components/inputs/InputBaseComponent'

type LoginProps = NativeStackScreenProps<RootStackParamList, "Login">;
type validationCondition = { state: 'PENDING' | 'BEFORE' | 'VALID' } | { state: 'ERROR', errorText: string }

const LoginForm: React.FC = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [emailValidation, setEmailValidation] = useState<validationCondition>({ state: 'BEFORE' })
    const [passwordValidation, setPasswordValidation] = useState<validationCondition>({ state: 'BEFORE' })

    const validateEmail = useCallback((email: string) => {
        const regex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (regex.test(email)) {
            setEmailValidation({ state: 'VALID' })
            return;
        }
        setEmailValidation({ state: 'ERROR', errorText: '이메일 형식이 올바르지 않습니다.' })
    }, [])

    const validatePassword = useCallback((password: string) => {
        const regex: RegExp = /^[A-Za-z\d@$!%*?&]{8,12}$/;
        if (regex.test(password)) {
            setPasswordValidation({ state: 'VALID' })
            return;
        }
        setPasswordValidation({ state: 'ERROR', errorText: '비밀번호는 8~12자 입니다.' })
    }, [])

    const emailRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);

    return (
        <>
            <View style={{
                marginTop: 36,
                alignSelf: 'center'
            }}>
                <InputBaseComponent
                    ref={emailRef}
                    inputValue={email}
                    setInputValue={setEmail}
                    label='이메일'
                    keyboardType={'email-address'}
                    validationCondition={emailValidation}
                    onFocus={() => setEmailValidation({ state: 'PENDING' })}
                    onBlur={() => validateEmail(email)}
                />
            </View>
            <View style={{
                marginTop: 12,
                alignSelf: 'center'
            }}>
                <InputBaseComponent
                    ref={passwordRef}
                    inputValue={password}
                    setInputValue={setPassword}
                    label='비밀번호'
                    isEncryption={true}
                    validationCondition={passwordValidation}
                    onFocus={() => setPasswordValidation({ state: 'PENDING' })}
                    onBlur={() => validatePassword(password)}
                />
            </View>
        </>
    )
}

const LoginScreen: React.FC<LoginProps> = ({ navigation }) => {

    const adminEmail = 'admin@gmail.com'
    const [emailFoundModal, setVisibleEmailFoundModal] = useState(false)
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
        const loadLoginSetting = async () => {
            try {
                const loadedAutoLogin = await AsyncStorage.getItem('autoLogin')//오토 로그인 로두
                setAutoLogin(loadedAutoLogin != null);

                if (loadedAutoLogin == null) {
                    const loadedSaveID = await AsyncStorage.getItem('saveID')//아이디 세이브인지 확인
                    setSaveID(loadedSaveID != null);

                    if (loadedSaveID) {
                        const loadedEmail = await AsyncStorage.getItem('Email') || '';
                        setEmail(loadedEmail)
                    }

                    return;
                }
                else {
                    const loadedEmail = await AsyncStorage.getItem('Email') || '';
                    setEmail(loadedEmail)

                    return;
                }
            } catch (e) { console.error(e) }
        }

        loadLoginSetting()
    }, [])

    const LoginBtnHandler = async () => {
        IDRef.current?.validate();
        PWRef.current?.validate();

        if (!checkVaildID) {
            IDRef.current?.focus();
            return;
        }

        if (!checkVaildPW) {
            PWRef.current?.focus();
            return;
        }

        try {
            const loginResult = await login(Email, password);

            if (!loginResult) throw Error('로그인 정보 불일치')

            if (autoLogin) {
                AsyncStorage.setItem('autoLogin', 'true');
                await AsyncStorage.setItem('saveID', 'true')
                await AsyncStorage.setItem('Email', Email)

                Toast.show({
                    type: 'success',
                    text1: '앞으로 앱 실행시 자동으로 로그인 돼요',
                    position: 'bottom',
                    bottomOffset: 60,
                    visibilityTime: 3000
                });
            }

            else if (saveID) {
                const autoLogin = await AsyncStorage.getItem('autoLogin') || false
                if (autoLogin) {
                    try {
                        await AsyncStorage.removeItem('autoLogin');
                    }
                    catch (e) { console.error(e) }
                }
                await AsyncStorage.setItem('saveID', 'true')
                await AsyncStorage.setItem('Email', Email)
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
                    PWRef.current?.errored('비밀번호가 틀리거나 가입되지 않은 이메일이에요.');
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
                        marginTop: 36,
                        alignSelf: 'center',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text style={{ fontSize: 42, fontFamily: 'NanumSquareNeo-ExtraBold', color: Color['blue400'], textAlign: 'center' }}>{`홍 풍`}</Text>
                        <Text style={{ fontSize: 12, fontFamily: 'NanumSquareNeo-Regular', color: Color['blue400'], textAlign: 'center' }}>({`임시로고`})</Text>
                    </View>
                    <View style={{
                        marginTop: 36,
                        alignSelf: 'center'
                    }}>
                        <LoginForm />
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
                    <View style={{ display: 'flex', flexDirection: 'row', marginTop: 16, width: 300, height: 26, marginHorizontal: 48 }}>
                        <Pressable style={{ flex: 1, alignItems: 'center' }}
                            onPress={() => setVisibleEmailFoundModal(true)}>
                            <Text style={{ fontSize: 16, lineHeight: 22, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey600'] }}>ID 찾기</Text>
                        </Pressable>
                        <Pressable style={{ flex: 1, alignItems: 'center' }}
                            onPress={() => { navigation.push('PWReset') }}>
                            <Text style={{ fontSize: 16, lineHeight: 22, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey600'] }}>비밀번호 변경</Text>
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
                            onPress={debounce(SignupBtnHandler, 500, { leading: true, trailing: false })}
                        />
                    </View>
                </View>
                <Modal visible={emailFoundModal} transparent>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'center' }}>
                        <View style={{ marginHorizontal: 24, paddingVertical: 24, backgroundColor: '#FFF', display: 'flex', gap: 16, borderRadius: 15 }}>
                            <Text style={{
                                paddingHorizontal: 24,
                                fontFamily: 'NanumSquareNeo-Bold',
                                fontSize: 16,
                            }}>이메일 찾기 안내</Text>
                            <Text style={{
                                paddingHorizontal: 24,
                                fontFamily: 'NanumSquareNeo-Regular',
                                fontSize: 14,
                                lineHeight: 20
                            }}>{`이메일은 관리자에게 문의하여 찾을 수 있어요.\n관리자 연락처: ${adminEmail}`}</Text>

                            <LongButton color='blue' innerText={'확인'} isAble={true} onPress={() => {
                                setVisibleEmailFoundModal(false)
                            }} />
                        </View>
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}

export default LoginScreen