/**
 * 1. 로그인 정보를 담는 상태관리 변수 email, password가 있어야 함
 * 2. 로그인 정보의 상태를 담는 상태관리 변수가 있어야 하므로
 *    {password:string, state: error, errorText?:string}
 *     이런 식으로 구성하는게 더 이로움
 * 그렇게 하려면 inputComponet를 더 분리 해서 써야 함
 * 지금 해야될 일이 바로 그거네 inputComponent 리팩토링하고 즉각 적용하기
 */

import { useAuth } from "@hongpung/hoc/useAuth";
import { RootStackParamList } from "@hongpung/pageTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackActions, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { debounce } from "lodash";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Keyboard } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

type LoginNavProps = NativeStackNavigationProp<RootStackParamList, "Login">;


type validationCondition = | { state: 'PENDING' | 'BEFORE' | 'VALID' } | { state: 'ERROR', errorText: string }


interface LoginFormValue {
    email: string,
    password: string
}

interface LoginFormValidation {
    email: validationCondition
    password: validationCondition
}


export const useLoginForm = () => {

    const navigation = useNavigation<LoginNavProps>();

    const { login } = useAuth();


    //formData는 로그인 정보를 담는 상태관리 변수
    const [formData, setFormData] = useState<LoginFormValue>({ email: '', password: '' })

    //formValidation은 로그인 정보의 상태를 담는 상태관리 변수
    const [formValidation, setFormValidation] = useState<LoginFormValidation>({ email: { state: 'BEFORE' }, password: { state: 'BEFORE' } })

    //emailRef, passwordRef는 InputBaseComponent의의 ref를 담는 변수
    const emailRef = useRef<TextInput>(null)
    const passwordRef = useRef<TextInput>(null)

    //options는 로그인 옵션을 담는 상태관리 변수
    const [options, setOptions] = useState({ autoLogin: false, saveID: false })


    //페이지 로드전에 로그인 옵션을 로드하고 사전 정보를 입력
    useLayoutEffect(() => {

        //loadLoginSetting은 로그인 옵션을 로드하고 사전 정보를 입력하는 함수

        const loadLoginSetting = async () => {
            try {

                await AsyncStorage.removeItem('autoLogin')

                const loadedSaveID = await AsyncStorage.getItem('saveID')//아이디 세이브인지 확인

                if (loadedSaveID) {

                    const loadedEmail = await AsyncStorage.getItem('Email');

                    if (!loadedEmail) {
                        setOptions(prev => ({ ...prev, saveID: false }));
                        return;
                    }

                    setOptions(prev => ({ ...prev, saveID: true }));
                    setFormData(prev => ({ ...prev, email: loadedEmail }))
                }

                return;

            } catch (e) { console.error(e) }
        };

        loadLoginSetting()

    }, [])


    const setSaveID = (value: boolean) => {
        if (value)
            setOptions(prev => ({ ...prev, saveID: value }));
        else
            setOptions({ saveID: false, autoLogin: false });
    };


    const setAutoLogin = (value: boolean) => {
        if (value) setOptions({ saveID: true, autoLogin: true });
        else
            setOptions(prev => ({ ...prev, autoLogin: false }));
    };

    //onChangeFormData는 로그인 정보를 입력하는 함수
    const onChangeFormData = (key: keyof LoginFormValue, value: string) => {
        setFormData(prev => ({
            ...prev,
            [key]: value,
        }));

        setFormValidation(prev => ({
            ...prev,
            [key]: { state: 'PENDING' }
        }))
    };

    const validateEmail = useCallback(() => {
        const emailFormRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        console.log('called email validate')
        if (emailFormRegex.test(formData.email)) {
            setFormValidation(prev => ({ ...prev, email: { state: 'VALID' } }))
            return;
        }

        setFormValidation(prev => ({ ...prev, email: { state: 'ERROR', errorText: '이메일 형식이 올바르지 않습니다.' } }))
    }, [formData.email])


    const validatePassword = useCallback(() => {
        const regex: RegExp = /^[A-Za-z\d@$!%*?&]{8,12}$/;
        console.log('called Password validate', regex.test(formData.password))
        if (regex.test(formData.password)) {
            setFormValidation(prev => ({ ...prev, password: { state: 'VALID' } }))
            return;
        }
        setFormValidation(prev => ({ ...prev, password: { state: 'ERROR', errorText: '비밀번호는 8~12자 입니다.' } }))

    }, [formData.password])


    //onBlurValidateAllInput은 모든 input에 대해 유효성 검사를 하는 함수
    //이 함수는 onBlur 이벤트가 발생할 때 실행됨
    const onBlurValidateAllInput = useCallback(() => {
        if (formValidation.password.state != 'BEFORE') {
            validatePassword();
        }

        if (formValidation.email.state != 'BEFORE') {
            validateEmail();
        }

    }, [formData, formValidation])


    const saveLoginOptions = useCallback(async ({ email, autoLogin, saveID }: { email: string, autoLogin: boolean, saveID: boolean }) => {
        if (autoLogin) {
            await AsyncStorage.setItem('autoLogin', 'true');
            await AsyncStorage.setItem('saveID', 'true');
            await AsyncStorage.setItem('Email', email);
            Toast.show({
                type: 'success',
                text1: '앞으로 앱 실행시 자동으로 로그인 돼요',
                position: 'bottom',
                bottomOffset: 60,
                visibilityTime: 3000
            });
        } else if (saveID) {

            await AsyncStorage.removeItem('autoLogin');
            await AsyncStorage.setItem('saveID', 'true');
            await AsyncStorage.setItem('Email', email);

            Toast.show({
                type: 'success',
                text1: '아이디를 저장했어요',
                position: 'bottom',
                bottomOffset: 60,
                visibilityTime: 3000
            });

        } else {

            await AsyncStorage.removeItem('saveID');
            await AsyncStorage.removeItem('Email');

        }
    }, []);

    //tryLogin은 로그인을 시도하는 함수
    const tryLogin = useCallback(async () => {
        Keyboard.dismiss();
        if (formData.email.length == 0) {
            setFormValidation(prev => ({ ...prev, email: { state: 'ERROR', errorText: '이메일을 입력해주세요.' } }))
            emailRef.current?.focus();
            return;
        }
        if (formData.password.length == 0) {
            setFormValidation(prev => ({ ...prev, password: { state: 'ERROR', errorText: '비밀번호를 입력해주세요.' } }))
            passwordRef.current?.focus();
            return;
        }
        if (formValidation.email.state == 'ERROR') {
            emailRef.current?.focus();
            return;
        }

        if (formValidation.password.state == 'ERROR') {
            passwordRef.current?.focus();
            return;
        }

        try {
            const { email, password } = formData;

            const { autoLogin, saveID } = options;

            const loginResult = await login(email, password, autoLogin);

            if (!loginResult) throw Error('로그인 정보 불일치')

            saveLoginOptions({ email, autoLogin, saveID })

            console.log('logined')
            navigation.dispatch(StackActions.replace('HomeStack'))

        } catch (e: unknown) {
            
            if (e instanceof Error) {
                console.log(e)

                if ((e.message == 'Check Email Or Password!') || (e.message == '로그인 정보 불일치')) {
                    setFormValidation({ email: { state: 'ERROR', errorText: '' }, password: { state: 'ERROR', errorText: '비밀번호가 틀리거나 가입되지 않은 이메일이에요.' } });
                }
                if (e.message == "You're not accepted") {

                    Toast.show({
                        type: 'fail',
                        text1: '가입이 진행중인 계정입니다\n(승낙시 확인 메일이 발송돼요)',
                        position: 'bottom',
                        bottomOffset: 60,
                        visibilityTime: 3000
                    });
                }
            }
            // else console.error(e)
        }

    }, [formData, formValidation, options])

    //onLogin은 로그인을 시도하는 함수를 디바운스 처리한 함수
    const onLogin = debounce(tryLogin, 500, { leading: true, trailing: false })


    return {
        formData,
        onChangeFormData,

        emailRef,
        passwordRef,

        formValidation,
        onBlurValidateAllInput,

        options,
        setSaveID,
        setAutoLogin,

        onLogin
    };

}