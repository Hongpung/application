import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '@hongpung/pageTypes';

import { useSignUp } from '@hongpung/pages/Auth/SignUp/context/SignUpContext'

import EmailCheck from './screens/onEmailCheck';
import PasswordCheck from './screens/onPasswordCheck';
import PersonalInformationCheck from './screens/onPersonalInfomation';

type SignUpProps = NativeStackScreenProps<RootStackParamList, "SignUp">;

const SignUpScreen: React.FC = () => {

    const { onStep } = useSignUp();

    switch (onStep) {
        case '이메일 인증':
            return (<EmailCheck />)
        case '비밀번호 설정':
            return (<PasswordCheck />)
        case '개인 정보 입력':
            return (<PersonalInformationCheck />)
    }
}

export default SignUpScreen

