import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, View, Text } from "react-native";

import InputComponent from "@hongpung/components/inputs/InputComponent";
import { useEffect, useRef, useState } from "react";
import LongButton from "@hongpung/components/buttons/LongButton";
import { Color } from "@hongpung/ColorSet";
import { useNavigation } from "@react-navigation/native";
import { deleteToken, getToken } from "@hongpung/utils/TokenHandler";
import Toast from "react-native-toast-message";



export const ChangePasswordScreen: React.FC = () => {
    const navigation = useNavigation();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const currentPasswordRef = useRef<any | null>(null);
    const newPasswordRef = useRef<any | null>(null);
    const confirmPasswordRef = useRef<any | null>(null);

    const vaildatePassword = (password: string) => {
        const regex: RegExp = /^[A-Za-z\d@$!%*?&]{8,12}$/;
        const newCondition = regex.test(password);
        console.log(password, newCondition)
        return newCondition;
    }

    const changePassword = async ({ currentPassword, newPassword }: { currentPassword: string, newPassword: string }) => {
        const controller = new AbortController();
        const signal = controller.signal;
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 6초 타임아웃


        try {
            const token = await getToken('token')
            console.log(token, JSON.stringify({ currentPassword, newPassword }))

            const response = await fetch(`${process.env.SUB_API}/auth/changePW`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ currentPassword, newPassword }),
                signal
            });


            if (!response.ok) {
                const { message } = await response.json()
                throw Error('Failed to Change Password: ' + message)
            }

            return true;

        } catch (error) {
            console.error(error)
            return false
        } finally {
            clearTimeout(timeoutId);
        }
    }
    return (
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); }} >
            <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#FFF" }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}>
                <View style={{ flex: 1, flexGrow: 1, backgroundColor: `#FFF` }}>
                    <View style={{
                        height: 40,
                    }}>
                    </View>
                    <View style={{
                        marginVertical: 8, paddingHorizontal: 16, marginHorizontal: 36, backgroundColor: Color['grey100'], paddingVertical: 12, borderRadius: 5
                    }}>
                        <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Light', color: Color['grey500'] }}>
                            {'로그인에 사용할 비밀번호를 변경해요.'}
                        </Text>
                        <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Light', color: Color['grey500'], lineHeight: 16 }}>
                            {'새로운 비밀번호는 영문, 숫자, 특수문자를 포함한\n8~12자로 구성해야 해요.'}
                        </Text>
                        <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Light', color: Color['grey500'], lineHeight: 16 }}>
                            {'허용 특수문자: !,@,#,$,%,^,&,+,='}
                        </Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingVertical: 16 }}>
                        <View style={{ alignSelf: 'center' }}>
                            <InputComponent
                                ref={currentPasswordRef}
                                label='현재 비밀번호'
                                color={'green'}
                                isEncryption
                                inputValue={currentPassword}
                                setInputValue={setCurrentPassword}
                                validationCondition={
                                    [{
                                        validation: vaildatePassword,
                                        errorText: "영문, 숫자, 특수문자(!,@,#,$,%,^,&,+,=)를\n포함한 8~12자로 구성되어야 합니다."
                                    }]}
                            />
                        </View>
                        <View style={{ alignSelf: 'center' }}>
                            <InputComponent
                                ref={newPasswordRef}
                                label='새로운 비밀번호'
                                color={'green'}
                                isEncryption
                                inputValue={newPassword}
                                setInputValue={setNewPassword}
                                validationCondition={
                                    [{
                                        validation: vaildatePassword,
                                        errorText: "영문, 숫자, 특수문자(!,@,#,$,%,^,&,+,=)를\n포함한 8~12자로 구성되어야 합니다."
                                    }]}
                            />
                        </View>
                        <View style={{ alignSelf: 'center' }}>
                            <InputComponent
                                ref={confirmPasswordRef}
                                label='새로운 비밀번호 확인'
                                color={'green'}
                                isEncryption
                                inputValue={confirmPassword}
                                setInputValue={setConfirmPassword}
                                validationCondition={[
                                    {
                                        validation: () => {
                                            const newCondition = newPassword == confirmPassword
                                            return newCondition;
                                        },
                                        errorText: "비밀번호가 일치하지 않습니다."
                                    }]}
                            />
                        </View>
                    </View>
                    <View style={[{ paddingHorizontal: 12, marginTop: 24 }]}>
                        <LongButton
                            color={'green'}
                            innerText='비밀번호 변경'
                            isAble={newPassword.length > 0 && confirmPassword.length > 0}
                            onPress={async () => {
                                if (currentPasswordRef.current?.validate() && confirmPasswordRef.current?.validate()) {
                                    const chageResult = await changePassword({ currentPassword, newPassword })
                                    Toast.show({
                                        type: 'success',
                                        text1: '비밀번호가 변경 되었어요!\n다시 로그인해주세요',
                                        position: 'bottom',
                                        bottomOffset: 60,
                                        visibilityTime: 3000
                                    });
                                    if (chageResult) navigation.goBack();
                                }
                                else if (!currentPasswordRef.current?.validate()) currentPasswordRef.current?.focus()
                                else if (!confirmPasswordRef.current?.validate()) confirmPasswordRef.current?.focus();
                            }}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}

export default ChangePasswordScreen;