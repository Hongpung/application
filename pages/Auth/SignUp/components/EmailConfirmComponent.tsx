import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SignUpEmailInput from '../../../../components/inputs/SignupEmailInput';
import { useSignUp } from '../context/SignUpContext';

const EmailConfirmComponent: React.FC<{ setStep: (step: any) => void, isEditible?: boolean }> = ({ setStep, isEditible = false }) => {
    const { signUpInfo, setEmail } = useSignUp();

    return (
        <View>
            <SignUpEmailInput
                label='이메일'
                color={'green'}
                inputValue={signUpInfo.email}
                setInputValue={setEmail}
                isEditible={isEditible}
                checkValid={(value) => {
                    if (value) setStep(`이메일 인증`);
                }}
            />
        </View>
    )
}

export default EmailConfirmComponent

const styles = StyleSheet.create({})