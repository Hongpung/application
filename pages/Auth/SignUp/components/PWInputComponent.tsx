import { StyleSheet, Text, View } from 'react-native'
import React, { useRef } from 'react'
import InputComponent from '../../../../components/inputs/InputComponent'
import { useSignUp } from '../context/SignUpContext';
import { vaildatePassword } from '../Utils';

const PWInputComponent: React.FC<{ isEditible?: boolean }> = ({ isEditible = false }) => {
    const { signUpInfo, setPassword } = useSignUp();
    const passwordRef = useRef<any>(null)
    return (
        <View>
            <InputComponent
                ref={passwordRef}
                label='비밀번호'
                color={'green'}
                isEncryption
                inputValue={signUpInfo.password}
                setInputValue={setPassword}
                isEditible={isEditible}
                validationCondition={
                    [{
                        validation: vaildatePassword,
                        errorText: "영문, 숫자, 특수문자(!,@,#,$,%,^,&,+,=)를\n포함한 8~12자로 구성되어야 합니다."
                    }]}
            />
        </View>
    )
}

export default PWInputComponent

const styles = StyleSheet.create({})