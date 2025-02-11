import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, View, Text } from "react-native";

import { InputBaseComponent } from "@hongpung/components/common/inputs/InputBaseComponent";
import { useCallback, useEffect, useRef, useState } from "react";
import LongButton from "@hongpung/components/buttons/LongButton";
import { Color } from "@hongpung/ColorSet";
import { useNavigation } from "@react-navigation/native";
import { deleteToken, getToken } from "@hongpung/utils/TokenHandler";
import Toast from "react-native-toast-message";

type validationCondition = | { state: 'PENDING' | 'BEFORE' | 'VALID' } | { state: 'ERROR', errorText: string }

const useCurrentPasswordInput = () => {

    const [currentPassword, setCurrentPassword] = useState('');

    const [currentPasswordValidation, setCurrentPasswordValidation] = useState<validationCondition>({ state: 'BEFORE' })

    const validateCurrentPassword = useCallback((password: string) => {
        const regex: RegExp = /^[A-Za-z\d@$!%*?&]{8,12}$/;
        if (regex.test(password)) {
            setCurrentPasswordValidation({ state: 'VALID' })
            return;
        }
        setCurrentPasswordValidation({ state: 'ERROR', errorText: '비밀번호는 8~12자 입니다.' })
    }, [])

    return { currentPassword, setCurrentPassword, setCurrentPasswordValidation, currentPasswordValidation, validateCurrentPassword }
}

const useNewPasswordInput = () => {

    const [newPassword, setNewPassword] = useState('');

    const [newPasswordValidation, setNewPasswordValidation] = useState<validationCondition>({ state: 'BEFORE' })

    const validateNewPassword = useCallback((password: string) => {
        const regex: RegExp = /^[A-Za-z\d@$!%*?&]{8,12}$/;
        if (regex.test(password)) {
            setNewPasswordValidation({ state: 'VALID' })
            return;
        }
        setNewPasswordValidation({ state: 'ERROR', errorText: '비밀번호는 8~12자 입니다.' })
    }, [])

    return { newPassword, setNewPassword, setNewPasswordValidation, newPasswordValidation, validateNewPassword }
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


export const ChangePasswordScreen: React.FC = () => {
    const navigation = useNavigation();

    const { currentPassword, setCurrentPassword, currentPasswordValidation, validateCurrentPassword } = useCurrentPasswordInput();
    const { newPassword, setNewPassword, newPasswordValidation, validateNewPassword } = useNewPasswordInput();
    const { confirmPassword, setConfirmPassword, confirmPasswordValidation, validateConfirmPassword } = useConfirmPasswordInput();

    const currentPasswordRef = useRef<any | null>(null);
    const newPasswordRef = useRef<any | null>(null);
    const confirmPasswordRef = useRef<any | null>(null);


    const changePassword = async ({ currentPassword, newPassword }: { currentPassword: string, newPassword: string }) => {
        const controller = new AbortController();
        const signal = controller.signal;
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 6초 타임아웃


        try {
            const token = await getToken('token')
            console.log(token, JSON.stringify({ currentPassword, newPassword }))

            const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/auth/changePW`, {
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

    const onPressChangeButton = async () => {
        if (currentPasswordValidation.state == 'VALID' && newPasswordValidation.state == 'VALID' && confirmPasswordValidation.state == 'VALID') {
            const chageResult = await changePassword({ currentPassword, newPassword })
            Toast.show({
                type: 'success',
                text1: '비밀번호가 변경 되었어요!\n다음 로그인부터 적용돼요',
                position: 'bottom',
                bottomOffset: 60,
                visibilityTime: 3000
            });
            if (chageResult) navigation.goBack();
        }
        else if (currentPasswordValidation.state != 'VALID') currentPasswordRef.current?.focus()
        else if (newPasswordValidation.state != 'VALID') newPasswordRef.current?.focus()
        else if (confirmPasswordValidation.state != 'VALID') confirmPasswordRef.current?.focus();
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
                        <View style={{ marginHorizontal: 48, }}>
                            <InputBaseComponent
                                ref={currentPasswordRef}
                                label='현재 비밀번호'
                                color={'green'}
                                isEncryption
                                inputValue={currentPassword}
                                setInputValue={setCurrentPassword}
                                onBlur={() => validateCurrentPassword(currentPassword)}
                                validationCondition={currentPasswordValidation}
                            />
                        </View>
                        <View style={{ marginHorizontal: 48, }}>
                            <InputBaseComponent
                                ref={newPasswordRef}
                                label='새로운 비밀번호'
                                color={'green'}
                                isEncryption
                                inputValue={newPassword}
                                setInputValue={setNewPassword}
                                onBlur={() => validateNewPassword(newPassword)}
                                validationCondition={newPasswordValidation}
                            />
                        </View>
                        <View style={{ marginHorizontal: 48, }}>
                            <InputBaseComponent
                                ref={confirmPasswordRef}
                                label='새로운 비밀번호 확인'
                                color={'green'}
                                isEncryption
                                inputValue={confirmPassword}
                                setInputValue={setConfirmPassword}
                                onBlur={() => validateConfirmPassword(newPassword, confirmPassword)}
                                validationCondition={confirmPasswordValidation}
                            />
                        </View>
                    </View>
                    <View style={[{ paddingHorizontal: 12, marginTop: 24 }]}>
                        <LongButton
                            color={'green'}
                            innerText='비밀번호 변경'
                            isAble={newPassword.length > 0 && confirmPassword.length > 0}
                            onPress={onPressChangeButton}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}

export default ChangePasswordScreen;