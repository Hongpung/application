import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, View, Text, Modal, ActivityIndicator } from "react-native"
import { usePasswordReset } from "./context/PWResetContext"
import { useCallback, useRef, useState } from "react";
import LongButton from "@hongpung/components/buttons/LongButton";
import SignUpEmailInput from "@hongpung/components/inputs/SignupEmailInput";
import InputComponent from "@hongpung/components/inputs/InputComponent";
import { Color } from "@hongpung/ColorSet";
import { verifyingEmail } from "./Utils";
import { showEmailVirificationCompleteToast, showExpiredCodeToast, showProblemToast, showUncorrectCodeToast } from "./toasts/sign-up-toast";
import PWResetEmailInput from "@hongpung/components/inputs/PWResetEmailInput";

export const EmailCheck: React.FC = () => {

    
    const { passwordResetInfo, setEmail, setStep } = usePasswordReset();
    const [isVerifed, setVerified] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const [verificationCode, setVerificationCode] = useState('');
    const verificationCodeRef = useRef<any | null>(null)

    const checkVerifiedCode = useCallback(() => {
        const regex: RegExp = /^\d{6}$/;
        console.log(regex.test(verificationCode))
        return regex.test(verificationCode);
    }, [verificationCode])

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
                    비밀번호 재설정
                </Text>
                <View style={{
                    marginVertical: 8, paddingHorizontal: 16, marginHorizontal: 36, backgroundColor: Color['grey100'], paddingVertical: 16, borderRadius: 5
                }}>
                    <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Light', color: Color['grey500'], lineHeight:18 }}>
                        {'비밀번호를 재설정 하기 전에\n로그인에 사용하는 이메일을 인증해요.'}
                    </Text>
                </View>

                <View style={{ alignSelf: 'center', marginTop: 12 }}>
                    <PWResetEmailInput
                        label='이메일'
                        color={'green'}
                        inputValue={passwordResetInfo.email}
                        setInputValue={setEmail}
                        isEditible={!isVerifed}
                        setValid={() => {
                            setVerified(true)
                        }}
                    />
                </View>
                <View style={{ marginTop: 20, alignSelf: 'center' }}>
                    {isVerifed &&
                        <InputComponent
                            ref={verificationCodeRef}
                            inputValue={verificationCode}
                            setInputValue={setVerificationCode}
                            keyboardType='number-pad'
                            isRequired={true}
                            label='인증번호'
                            color={'green'}
                            checkValid={setVerified}
                            validationCondition={
                                [{
                                    validation: checkVerifiedCode,
                                    errorText: "인증번호는 6자리 숫자에요"
                                }]
                            }
                        />}
                </View>
                <View style={[{ paddingHorizontal: 12, marginTop: 24 }]}>
                    <LongButton
                        color={'green'}
                        innerText='이메일 인증'
                        isAble={isVerifed}
                        onPress={async () => {
                            if (verificationCodeRef.current?.validate()) {
                                try {
                                    setLoading(true);
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
                        }}
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