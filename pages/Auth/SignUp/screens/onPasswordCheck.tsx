import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, View, Text } from "react-native";
import { useSignUp } from "../context/SignUpContext";

import { useCallback, useRef, useState } from "react";
import LongButton from "@hongpung/src/common/components/buttons/long-button";
import { Color } from "@hongpung/ColorSet";
import { InputBaseComponent } from "@hongpung/src/common/components/inputs/InputBaseComponent";

type validationCondition = | { state: 'PENDING' | 'BEFORE' | 'VALID' } | { state: 'ERROR', errorText: string }

const usePasswordInput = () => {

    const [password, setPassword] = useState('');

    const [passwordValidation, setPasswordValidation] = useState<validationCondition>({ state: 'BEFORE' })

    const validatePassword = useCallback((password: string) => {
        const regex: RegExp = /^[A-Za-z\d@$!%*?&]{8,12}$/;
        if (regex.test(password)) {
            setPasswordValidation({ state: 'VALID' })
            return;
        }
        setPasswordValidation({ state: 'ERROR', errorText: '비밀번호는 8~12자 입니다.' })
    }, [])

    return { password, setPassword, setPasswordValidation, passwordValidation, validatePassword }
}

const useConfirmPasswordInput = () => {

    const [confirmPassword, setConfirmPassword] = useState('');

    const [confirmPasswordValidation, setConfirmPasswordValidation] = useState<validationCondition>({ state: 'BEFORE' })

    const validateConfirmPassword = useCallback((password: string, confirmPassword: string) => {

        if (password == confirmPassword) {
            setConfirmPasswordValidation({ state: 'VALID' })
            return;
        }
        setConfirmPasswordValidation({ state: 'ERROR', errorText: '비밀번호와 일치하지 않습니다.' })
    }, [])

    return { confirmPassword, setConfirmPassword, setConfirmPasswordValidation, confirmPasswordValidation, validateConfirmPassword }
}

export const PasswordCheck: React.FC = () => {
    const { setPassword: setContexPassword, setStep } = useSignUp();

    const { password, setPassword, passwordValidation, setPasswordValidation, validatePassword } = usePasswordInput()
    const { confirmPassword, setConfirmPassword, confirmPasswordValidation, setConfirmPasswordValidation, validateConfirmPassword } = useConfirmPasswordInput();

    const passwordRef = useRef<any | null>(null);
    const confirmPasswordRef = useRef<any | null>(null);


    const handlePasswordCheckOut = () => {
        if (password != confirmPassword) { validateConfirmPassword(password, confirmPassword); return; }
        if (passwordValidation.state == 'VALID' && confirmPasswordValidation.state == 'VALID') {
            setContexPassword(password)
            setStep('개인 정보 입력')
        }
        else if (passwordValidation.state == 'ERROR') passwordRef.current?.focus()
        else if (confirmPasswordValidation.state == 'ERROR') confirmPasswordRef.current?.focus();

    }
    return (
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); }} >
            <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#FFF" }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}>
                <View style={{ flex: 1, flexGrow: 1, backgroundColor: `#FFF` }}>
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
                        marginVertical: 8, paddingHorizontal: 16, marginHorizontal: 36, backgroundColor: Color['grey100'], paddingVertical: 16, borderRadius: 5, gap: 4
                    }}>
                        <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Light', color: Color['grey500'] }}>
                            {'로그인에 사용할 비밀번호를 정해요.'}
                        </Text>
                        <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Light', color: Color['grey500'], lineHeight: 16 }}>
                            {'비밀번호는 영문, 숫자, 특수문자를 포함한\n8~12자로 구성해야 해요.'}
                        </Text>
                        <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Light', color: Color['grey500'], lineHeight: 16 }}>
                            {'허용 특수문자: !,@,#,$,%,^,&,+,='}
                        </Text>
                    </View>
                    <View style={{ marginHorizontal: 48, marginTop: 12 }}>
                        <InputBaseComponent
                            ref={passwordRef}
                            label='비밀번호'
                            color={'green'}
                            isEncryption
                            inputValue={password}
                            setInputValue={setPassword}
                            onBlur={() => validatePassword(password)}
                            validationCondition={passwordValidation} />
                    </View>
                    <View style={{ marginHorizontal: 48, marginTop: 24 }}>
                        <InputBaseComponent
                            ref={confirmPasswordRef}
                            label='비밀번호 확인'
                            color={'green'}
                            isEncryption
                            inputValue={confirmPassword}
                            setInputValue={setConfirmPassword}
                            onBlur={() => validateConfirmPassword(password, confirmPassword)}
                            validationCondition={confirmPasswordValidation}
                        />
                    </View>
                    <View style={[{ paddingHorizontal: 12, marginTop: 48 }]}>
                        <LongButton
                            color={'green'}
                            innerText='비밀번호 저장'
                            isAble={passwordValidation.state == 'VALID' && confirmPasswordValidation.state == 'VALID'}
                            onPress={handlePasswordCheckOut}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}

export default PasswordCheck;