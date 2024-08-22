import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../pageTypes';
import { Color } from '../../ColorSet'
import InputComponent from '../../components/inputs/InputComponent';
import LongButton from '../../components/buttons/LongButton';
import SignUpEmailInput from '../../components/inputs/SignupEmailInput';

type SignUpProps = NativeStackScreenProps<RootStackParamList, "SignUp">;

const SignUp: React.FC<SignUpProps> = ({ navigation }) => {

    const [onStep, setStep] = useState(0);
    const [isValidEmail, setValidEmail] = useState(false);

    const renderUnderView = () => {
        switch (onStep) {
            case 1:
                return <InputComponent
                    label='인증번호'
                    color={'green'}
                    checkValid={(valid) => setValidEmail(valid)}
                    validationCondition={
                        {
                            validation: /^\d{6}$/,
                            errorText: "인증번호는 6자리 숫자에요"
                        }
                    }
                />
            case 2:
                return <View>
                    <InputComponent
                        label='비밀번호'
                        color={'green'}
                        isEncryption={true}
                        value={'qlalfqjsgh1@'}
                        validationCondition={
                            {
                                validation: /^[A-Za-z\d@$!%*?&]{8,12}$/,
                                errorText: "영문, 숫자, 특수문자(!,@,#,$,%,^,&,+,=)를\n포함한 8~12자로 구성되어야 합니다."
                            }}
                    />
                    <View style={{ marginTop: 40 }} />
                    <InputComponent
                        label='비밀번호 확인'
                        color={'green'}
                        isEncryption={true}
                        value={'qlalfqjsgh1@'}
                        validationCondition={
                            {
                                validation: /^[A-Za-z\d@$!%*?&]{8,12}$/,
                                errorText: "비밀번호는 8~12자 입니다"
                            }}
                    />
                </View>
            case 3:
                return <View>
                    <View style={{ flexDirection:'row', justifyContent:'space-between'}}>
                    <InputComponent
                        label='동아리'
                        length={126}
                        color={'green'}
                        value={'qlalfqjsgh1@'}
                    />
                    <InputComponent
                        label='학번'
                        length={126}
                        color={'green'}
                        isRequiredMark={true}
                    />
                    </View>
                    <View style={{ marginTop: 28 }} />
                    <InputComponent
                        label='이름(본명)'
                        color={'green'}
                        isEditible={true}
                        isRequiredMark={true}
                    />
                    <View style={{ marginTop: 28 }} />
                    <InputComponent
                        label='패명'
                        color={'green'}
                        isEditible={true}
                        isRequired={false}
                    />
                </View>

            default: return null;
        }
    }

    const ButtonText = () => {
        switch (onStep) {
            case 2:
                return '비밀번호 설정'
            case 3:
                return '회원가입 신청'
            default: return '이메일 인증'
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#FFF", alignItems: 'center' }}>
            <Text style={{
                alignSelf: 'flex-start',
                height: 40,
                left: 40,
                marginTop: 28,
                fontSize: 24,
                lineHeight: 26,
                fontFamily: "NanumSquareNeo-Bold",
            }}>회원가입</Text>
            <View style={{ marginTop: 24 }}>
                <SignUpEmailInput
                    label='이메일'
                    color={'green'}
                    isEditible={onStep <= 1}
                    checkValid={() => {
                        setStep(1);
                    }}
                />
            </View>
            <View style={{ marginTop: 24 }}>
                {renderUnderView()}
            </View>
            <View style={onStep<3?{ marginTop: 40 }:{position:'absolute',bottom:120}}>
                <LongButton
                    color={'green'}
                    innerText={ButtonText()}
                    isAble={isValidEmail}
                    onPress={() => { onStep < 3?setStep(onStep + 1):setStep(0) }}
                />
            </View>

        </View>
    )
}

export default SignUp

const styles = StyleSheet.create({})