import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, View, Text } from "react-native";
import { useSignUp } from "../context/SignUpContext";
import InputComponent from "@hongpung/components/inputs/InputComponent";
import { useRef, useState } from "react";
import { vaildatePassword } from "../Utils";
import LongButton from "@hongpung/components/buttons/LongButton";
import { Color } from "@hongpung/ColorSet";

export const PasswordCheck: React.FC = () => {
    const { setPassword: setContexPassword, setStep } = useSignUp();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const passwordRef = useRef<any | null>(null);
    const confirmPasswordRef = useRef<any | null>(null);

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
                        marginVertical: 8, paddingHorizontal: 16, marginHorizontal: 36, backgroundColor: Color['grey100'], paddingVertical: 16, borderRadius: 5, gap:4
                    }}>
                        <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Light', color: Color['grey500'] }}>
                            {'로그인에 사용할 비밀번호를 정해요.'}
                        </Text>
                        <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Light', color: Color['grey500'],lineHeight:16 }}>
                            {'비밀번호는 영문, 숫자, 특수문자를 포함한\n8~12자로 구성해야 해요.'}
                        </Text>
                        <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Light', color: Color['grey500'],lineHeight:16 }}>
                            {'허용 특수문자: !,@,#,$,%,^,&,+,='}
                        </Text>
                    </View>
                    <View style={{ alignSelf: 'center', marginTop: 12 }}>
                        <InputComponent
                            ref={passwordRef}
                            label='비밀번호'
                            color={'green'}
                            isEncryption
                            inputValue={password}
                            setInputValue={setPassword}
                            validationCondition={
                                [{
                                    validation: vaildatePassword,
                                    errorText: "영문, 숫자, 특수문자(!,@,#,$,%,^,&,+,=)를\n포함한 8~12자로 구성되어야 합니다."
                                }]}
                        />
                    </View>
                    <View style={{ alignSelf: 'center', marginTop: 24 }}>
                        <InputComponent
                            ref={confirmPasswordRef}
                            label='비밀번호 확인'
                            color={'green'}
                            isEncryption
                            inputValue={confirmPassword}
                            setInputValue={setConfirmPassword}
                            validationCondition={[
                                {
                                    validation: () => {
                                        const newCondition = password == confirmPassword
                                        console.log(confirmPassword, newCondition)
                                        return newCondition;
                                    },
                                    errorText: "비밀번호가 일치하지 않습니다."
                                }]}
                        />
                    </View>
                    <View style={[{ paddingHorizontal: 12, marginTop: 24 }]}>
                        <LongButton
                            color={'green'}
                            innerText='비밀번호 저장'
                            isAble={password.length > 0 && confirmPassword.length > 0}
                            onPress={() => {
                                if (passwordRef.current?.validate() && confirmPasswordRef.current?.validate()) {
                                    setContexPassword(password)
                                    setStep('개인 정보 입력')
                                }
                                else if (!passwordRef.current?.validate()) passwordRef.current?.focus()
                                else if (!confirmPasswordRef.current?.validate()) confirmPasswordRef.current?.focus();
                            }}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}

export default PasswordCheck;