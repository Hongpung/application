import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { usePasswordReset } from './context/PWResetContext';
import PasswordCheck from './onPasswordCheck';
import EmailCheck from './onEmailCheck';

const PWResetScreen: React.FC = () => {

    const { onStep } = usePasswordReset();

    switch (onStep) {
        case '이메일 인증':
            return (<EmailCheck />)
        case '비밀번호 재설정':
            return (<PasswordCheck />)
    }
}

export default PWResetScreen

const styles = StyleSheet.create({})