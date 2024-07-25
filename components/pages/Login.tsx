import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import InputComponent from '../inputs/InputComponent'
import { Color } from '../../ColorSet'
import LongButton from '../buttons/LongButton'
import tryLogin from '../../logics/login'
import CheckboxComponent from '../checkboxs/CheckboxComponent'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from './pageTypes'
import { StackActions } from '@react-navigation/native'



type LoginProps = NativeStackScreenProps<RootStackParamList, "Login">;

const Login: React.FC<LoginProps> = ({ navigation }) => {

    const LoginBtnHandler = () => {
        navigation.dispatch(StackActions.replace('HomeStack'))
    }

    const SignupBtnHandler = () => {
        navigation.push('SignUp');
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#FFF", alignItems: 'center' }}>
            <View style={{
                height: 130,
                width: 240,
                backgroundColor: Color['blue400'],
                marginTop: 36
            }}>
            </View>
            <View style={{ marginTop: 36 }}>
                <InputComponent
                    label='이메일'
                    validationCondition={
                        {
                            validation: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            errorText: "이메일 주소가 유효하지 않습니다"
                        }
                    }
                />
            </View>
            <View style={{ marginTop: 28 }}>
                <InputComponent
                    label='비밀번호'
                    isEncryption={true}
                    validationCondition={
                        {
                            validation: /^[A-Za-z\d@$!%*?&]{8,12}$/,
                            errorText: "비밀번호는 8~12자 입니다"
                        }
                    }
                />
            </View>
            <View style={{ marginTop: 36, width: 244, flexDirection: 'row', justifyContent: 'space-between' }}>
                <CheckboxComponent
                    innerText={'ID 저장'}
                /><CheckboxComponent
                    innerText={'자동 로그인'}
                />
            </View>
            <View style={{ marginTop: 20 }}>
                <LongButton
                    color={'blue'}
                    innerText={'로그인'}
                    isAble={true}
                    onPress={LoginBtnHandler}
                />
            </View>
            <View style={{ marginTop: 16, width: 300, height: 26, justifyContent: 'center' }}>
                <Text style={{ fontSize: 16, lineHeight: 22 }}>홍풍 앱이 처음이시라면?</Text>
            </View>
            <View style={{ marginTop: 16 }}>
                <LongButton
                    color={'green'}
                    innerText={'회원가입'}
                    isAble={true}
                    onPress={SignupBtnHandler}
                />
            </View>
        </View>
    )
}

export default Login

const styles = StyleSheet.create({
    title: {
        flex: 1,
        fontFamily: "NanumSquareNeo-Bold",
        fontSize: 24,
        marginLeft: 20
    }
})