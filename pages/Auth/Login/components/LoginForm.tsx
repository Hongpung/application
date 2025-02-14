import { View } from "react-native"
import { useLoginForm } from "../hooks/useLogin"
import { InputBaseComponent } from "@hongpung/src/common/components/inputs/InputBaseComponent"
import CheckboxComponent from "@hongpung/src/common/components/checkboxs/CheckboxComponent"
import LongButton from "@hongpung/src/common/components/buttons/LongButton"

export const LoginForm: React.FC = () => {

    const {
        formData,
        onChangeFormData,

        emailRef,
        passwordRef,

        formValidation,
        onBlurValidateAllInput,

        options,
        setSaveID,
        setAutoLogin,

        onLogin
    } = useLoginForm()

    return (
        <View style={{ width:'100%', display:'flex', flexDirection:'column', gap:16 }}>
            <View style={{
                paddingHorizontal: 48
            }}>
                <InputBaseComponent
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
                <InputBaseComponent
                    ref={passwordRef}
                    inputValue={formData.password}
                    setInputValue={(password) => onChangeFormData('password', password)}
                    label='비밀번호'
                    isEncryption={true}
                    validationCondition={formValidation.password}
                    onBlur={onBlurValidateAllInput}
                />
            </View>
            
            <View style={{
                display:'flex',
                paddingHorizontal: 48, 
                flexDirection: 'row',
                justifyContent: 'center',
                gap:84
            }}>
                <CheckboxComponent
                    innerText={'ID 저장'}
                    isChecked={options.saveID}
                    onCheck={setSaveID}
                />
                <CheckboxComponent
                    innerText={'자동 로그인'}
                    isChecked={options.autoLogin}
                    onCheck={setAutoLogin}
                />
            </View>
            <View style={{ marginHorizontal: 12 }}>
                <LongButton
                    color={'blue'}
                    innerText={'로그인'}
                    isAble={true}
                    onPress={onLogin}
                />
            </View>
        </View>
    )
}