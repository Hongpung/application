import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, View, Text, Modal, ActivityIndicator } from "react-native"
import { usePasswordReset } from "./context/PWResetContext"
import { useCallback, useRef, useState } from "react";
import LongButton from "@hongpung/components/buttons/LongButton";

import { Color } from "@hongpung/ColorSet";
import { verifyingEmail } from "./Utils";
import { showEmailVirificationCompleteToast, showExpiredCodeToast, showProblemToast, showUncorrectCodeToast } from "./toasts/sign-up-toast";
import PWResetEmailInput from "@hongpung/components/common/inputs/PWResetEmailInput";
import { InputBaseComponent } from "@hongpung/components/common/inputs/InputBaseComponent";
import { debounce } from "lodash";



type validationCondition = | { state: 'PENDING' | 'BEFORE' | 'VALID' } | { state: 'ERROR', errorText: string }

const useVerificationCode = () => {

    const [verificationCode, setVerificationCode] = useState('');
    const [verificationCodeValidation, setVerificationCodeValidation] = useState<validationCondition>({ state: 'BEFORE' })

    const validateVerificationCode = useCallback((verificationCode: string) => {
        const regex: RegExp = /^\d{6}$/;

        if (regex.test(verificationCode)) {
            setVerificationCodeValidation({ state: 'VALID' })
            return;
        }
        setVerificationCodeValidation({ state: 'ERROR', errorText: '인증번호는 6자리 숫자입니다.' })
    }, [])

    return { verificationCode, setVerificationCode, verificationCodeValidation, setVerificationCodeValidation, validateVerificationCode }
}


export const EmailCheck: React.FC = () => {

    const { passwordResetInfo, setEmail, setStep } = usePasswordReset();
    const [isVerifed, setVerified] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const { verificationCode, setVerificationCode, verificationCodeValidation, validateVerificationCode } = useVerificationCode();

    const verificationCodeRef = useRef<any | null>(null)

    const verifyingEmailButton = debounce(async () => {
        if (verificationCodeValidation.state=='VALID') {
            try {
                setLoading(true);
                console.log(passwordResetInfo.email, verificationCode)

                const verified = await verifyingEmail(passwordResetInfo.email, verificationCode);

                if (verified == 201) {
                    setStep('비밀번호 재설정')
                    showEmailVirificationCompleteToast()
                }
                else if (verified == 405) {
                    showUncorrectCodeToast();
                } else if (verified == 403) {
                    showExpiredCodeToast()
                } else {
                    showProblemToast()
                }
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false);
            }
        }
    }, 100)

    return (
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); }} >
            <KeyboardAvoidingView
                style={{ flex: 1, backgroundColor: "#FFF" }}
                behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}>
                <Text style={{
                    alignSelf: 'flex-start',
                    height: 40,
                    left: 40,
                    marginTop: 28,
                    fontSize: 24,
                    lineHeight: 26,
                    fontFamily: "NanumSquareNeo-Bold",
                }}>
                    비밀번호 재설정
                </Text>
                <View style={{
                    marginVertical: 8, paddingHorizontal: 16, marginHorizontal: 36, backgroundColor: Color['grey100'], paddingVertical: 16, borderRadius: 5
                }}>
                    <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Light', color: Color['grey500'], lineHeight: 18 }}>
                        {'비밀번호를 재설정 하기 전에\n로그인에 사용하는 이메일을 인증해요.'}
                    </Text>
                </View>

                <View style={{ marginTop: 12 }}>
                    <PWResetEmailInput
                        label='이메일'
                        inputValue={passwordResetInfo.email}
                        setInputValue={setEmail}
                        onCodeSend={() => {
                            setVerified(true)
                        }}
                    />
                </View>
                <View style={{ marginTop: 20, marginHorizontal: 48 }}>
                    {isVerifed &&
                        <InputBaseComponent
                            ref={verificationCodeRef}
                            inputValue={verificationCode}
                            setInputValue={setVerificationCode}
                            keyboardType='number-pad'
                            isRequired={true}
                            label='인증번호'
                            color={'green'}
                            onBlur={() => validateVerificationCode(verificationCode)}
                            validationCondition={verificationCodeValidation}
                        />}
                </View>
                <View style={[{ paddingHorizontal: 12, marginTop: 24 }]}>
                    <LongButton
                        color={'green'}
                        innerText='이메일 인증'
                        isAble={isVerifed}
                        onPress={verifyingEmailButton}
                    />
                </View>
                <Modal visible={isLoading} transparent>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator color={'#FFFFF'} size={'large'} />
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}

export default EmailCheck;