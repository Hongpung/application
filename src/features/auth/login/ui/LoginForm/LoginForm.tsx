import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Checkbox, Color, Input, LongButton } from '@hongpung/src/common'
import { useLoginForm } from './useLoginForm'

const LoginForm: React.FC = () => {
    const { emailRef, formData, formValidation, onBlurValidateAllInput, onChangeFormData, onLogin, options, passwordRef, setAutoLogin, setSaveID, isLoading, LoginError } = useLoginForm();

    return (
        <View style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>

            <View style={{
                paddingHorizontal: 48
            }}>
                <Input
                    ref={emailRef}
                    inputValue={formData.email}
                    setInputValue={(email) => onChangeFormData('email', email)}
                    label='이메일'
                    keyboardType={'email-address'}
                    validationCondition={formValidation.email}
                    onBlur={onBlurValidateAllInput}
                />
            </View>

            <View style={{
                paddingHorizontal: 48
            }}>
                <Input
                    ref={passwordRef}
                    inputValue={formData.password}
                    setInputValue={(password) => onChangeFormData('password', password)}
                    label='비밀번호'
                    isEncryption={true}
                    validationCondition={formValidation.password}
                    onBlur={onBlurValidateAllInput}
                />
            </View>

            {LoginError &&
                <Text style={{
                    color: Color['red500'],
                    fontFamily: 'NanumSquareNeo-Bold',
                    paddingVertical: 8,
                    paddingHorizontal: 4,
                    fontSize: 12
                }}>{LoginError?.message}</Text>
            }

            <View style={{
                display: 'flex',
                paddingHorizontal: 48,
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 84
            }}>
                <Checkbox
                    innerText={'ID 저장'}
                    isChecked={options.saveID}
                    onCheck={setSaveID}
                />
                <Checkbox
                    innerText={'자동 로그인'}
                    isChecked={options.autoLogin}
                    onCheck={setAutoLogin}
                />
            </View>
            <View style={{ marginHorizontal: 12 }}>
                <LongButton
                    color={'blue'}
                    innerContent={isLoading ? <ActivityIndicator color={'#FFF'} size={'small'} /> : '로그인'}
                    isAble={isLoading ? false : true}
                    onPress={onLogin}
                />
            </View>
        </View>
    )
}

export default LoginForm

const styles = StyleSheet.create({})