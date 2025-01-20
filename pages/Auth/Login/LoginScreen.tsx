import { Keyboard, KeyboardAvoidingView, Modal, Pressable, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import { StackActions, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack'
import { debounce } from 'lodash'

import { RootStackParamList } from '@hongpung/pageTypes'
import { Color } from '@hongpung/ColorSet'
import LongButton from '@hongpung/components/buttons/LongButton'
import CheckboxComponent from '@hongpung/components/checkboxs/CheckboxComponent'
import { InputBaseComponent } from '@hongpung/components/common/inputs/InputBaseComponent'
import { useEmailInput, usePasswordInput } from './useLogin'
import { saveLoginOptions } from './service/loginService'
import { useLoginOptions } from './useLoginOptions'
import { useAuth } from '@hongpung/hoc/useAuth'

type LoginProps = NativeStackScreenProps<RootStackParamList, "Login">;

type LoginNavProps = NativeStackNavigationProp<RootStackParamList, "Login">;


const LoginForm: React.FC = () => {

    const navigation = useNavigation<LoginNavProps>();

    const { email, setEmail, setEmailValidation, emailValidation, validateEmail } = useEmailInput();
    const { password, setPassword, setPasswordValidation, passwordValidation, validatePassword } = usePasswordInput();

    const { saveID, setSaveID, autoLogin, setAutoLogin } = useLoginOptions({ setEmail })

    const { login } = useAuth();
    
    const emailRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);

    const handleBlur = useCallback(() => {
        if (passwordValidation.state != 'BEFORE')
            validatePassword(password);

        if (emailValidation.state != 'BEFORE')
            validateEmail(email);
    }, [password, email, passwordValidation, emailValidation])


    const LoginBtnHandler = useCallback(async () => {

        if (emailValidation.state == 'ERROR') {
            emailRef.current?.focus();
            return;
        }

        if (passwordValidation.state == 'ERROR') {
            passwordRef.current?.focus();
            return;
        }

        try {
            const loginResult = await login(email, password);

            if (!loginResult) throw Error('로그인 정보 불일치')

            saveLoginOptions({ email, autoLogin, saveID })

            navigation.dispatch(StackActions.replace('HomeStack'))

        } catch (e: unknown) {

            if (e instanceof Error) {
                if (e.message == '로그인 정보 불일치') {
                    setEmailValidation({ state: 'ERROR', errorText: '비밀번호가 틀리거나 가입되지 않은 이메일이에요.' });
                    setPasswordValidation({ state: 'ERROR', errorText: '비밀번호가 틀리거나 가입되지 않은 이메일이에요.' });
                }
            }
            else console.error(e)
        }
    }, [email, password, emailValidation, passwordValidation, saveID, autoLogin])


    return (
        <>
            <View style={{
                paddingHorizontal: 48
            }}>
                <InputBaseComponent
                    ref={emailRef}
                    inputValue={email}
                    setInputValue={setEmail}
                    label='이메일'
                    keyboardType={'email-address'}
                    validationCondition={emailValidation}
                    onFocus={() => setEmailValidation({ state: 'PENDING' })}
                    onBlur={() => handleBlur()}
                />
            </View>
            <View style={{ height: 24 }}></View>
            <View style={{
                paddingHorizontal: 48
            }}>
                <InputBaseComponent
                    ref={passwordRef}
                    inputValue={password}
                    setInputValue={setPassword}
                    label='비밀번호'
                    isEncryption={true}
                    validationCondition={passwordValidation}
                    onFocus={() => setPasswordValidation({ state: 'PENDING' })}
                    onBlur={() => handleBlur()}
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
                />
                <CheckboxComponent
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
        </>
    )
}

const LoginScreen: React.FC<LoginProps> = ({ navigation }) => {

    const adminEmail = 'admin@gmail.com'

    const [emailFoundModal, setVisibleEmailFoundModal] = useState(false)


    const SignupBtnHandler = () => {
        navigation.push('SignUp');
    }

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