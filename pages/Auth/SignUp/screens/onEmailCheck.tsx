import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, View, Text, Modal, ActivityIndicator } from "react-native"
import { useSignUp } from "../context/SignUpContext"
import { useCallback, useRef, useState } from "react";
import LongButton from "@hongpung/src/common/components/buttons/long-button";
import SignUpEmailInput from "@hongpung/src/common/components/inputs/SignupEmailInput";
import { Color } from "@hongpung/ColorSet";
import { verifyingEmail } from "../Utils";
import { showEmailVirificationCompleteToast, showExpiredCodeToast, showProblemToast, showUncorrectCodeToast } from "../toasts/sign-up-toast";
import { debounce } from "lodash";
import { InputBaseComponent } from "@hongpung/src/common/components/inputs/InputBaseComponent";

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

    const { signUpInfo, setEmail, setStep } = useSignUp();
    const [isVerifed, setVerified] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const { verificationCode, setVerificationCode, verificationCodeValidation, setVerificationCodeValidation, validateVerificationCode } = useVerificationCode();

    const verificationCodeRef = useRef<any | null>(null)

    const verifyingEmailButton = debounce(async () => {
        if (verificationCodeValidation.state == 'VALID' || !isLoading) {
            try {
                setLoading(true);
                const verified = await verifyingEmail(signUpInfo.email, verificationCode);

                if (verified == 200) {
                    setStep('비밀번호 설정')
                    showEmailVirificationCompleteToast()
                }
                else if (verified == 405) {
                    setVerificationCodeValidation({state:'ERROR',errorText:'인증번호가 일치하지 않습니다.'})
                } else if (verified == 403) {
                    setVerificationCodeValidation({state:'ERROR',errorText:'인증번호 유효시간이 만료되었습니다.'})
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
            <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#FFF" }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}>
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
                        {'로그인에 사용할 이메일을 등록하고 인증해요.'}
                    </Text>
                </View>

                <View style={{ marginTop: 12 }}>
                    <SignUpEmailInput
                        label='이메일'
                        inputValue={signUpInfo.email}
                        setInputValue={setEmail}
                        onCodeSend={() => {
                            setVerified(true)
                        }}
                    />
                </View>
                <View style={{height:24}}></View>
                <View style={{  marginHorizontal:48 }}>
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
                        key={verificationCode}
                        color={'green'}
                        innerText='이메일 인증'
                        isAble={isVerifed&&verificationCodeValidation.state=='VALID'}
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