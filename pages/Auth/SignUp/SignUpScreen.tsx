import { FlatList, Pressable, StyleSheet, Text, View, Animated, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView, Modal, Dimensions, ScrollView, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../pageTypes';
import { Color } from '../../../ColorSet'
import InputComponent from '../../../components/inputs/InputComponent';
import LongButton from '../../../components/buttons/LongButton';
import SignUpEmailInput from '../../../components/inputs/SignupEmailInput';
import { club, clubs } from '../../../UserType';
import Toast from 'react-native-toast-message';
import ShortButton from '../../../components/buttons/ShortButton';
import { vaildatePassword, verifyingEmail } from './Utils';
import EmailConfirmComponent from './components/EmailConfirmComponent';
import PWInputComponent from './components/PWInputComponent';
import { useSignUp } from './context/SignUpContext';


const { width } = Dimensions.get('window')
type SignUpProps = NativeStackScreenProps<RootStackParamList, "SignUp">;

const SignUpScreen: React.FC<SignUpProps> = ({ navigation }) => {

    const {
        signUpInfo,
        setEmail,
        setPassword,
        setClub,
        setEnrollmentNumber,
        setName,
        setNickName,
    } = useSignUp();

    const [onStep, setStep] = useState<"이메일 검증" | "이메일 인증" | "비밀번호 설정" | "개인 정보 입력">("이메일 검증");
    const [loading, setLoading] = useState(false);

    const [alertVisible, setAlertVisible] = useState(false);

    const [verificationCode, setVerificationCode] = useState('');
    const verificationCodeRef = useRef<any | null>(null)

    const [isVerifiedEmail, setVerifiedEmail] = useState(false);

    const passwordRef = useRef<any | null>(null)

    const [confirmPassword, setConfirmPassword] = useState('');
    const confirmPasswordRef = useRef<any | null>(null)


    const gradeRef = useRef<any | null>(null)

    const nameRef = useRef<any | null>(null)

    const [onSelectClub, setSelectClubVisible] = useState(false);

    const [isValidClub, setClubisValid] = useState(true)

    const [buttonAble, setButtonAble] = useState(false)

    const labelAnimation = useRef(new Animated.Value(0)).current; // 애니메이션 초기 값

    const labelStyle = {
        fontSize: labelAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [12, 10],
        }),
        top: labelAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [5, 3],
        }),
    };
    useEffect(() => {
        Animated.timing(labelAnimation, {
            toValue: signUpInfo.club ? 1 : 0,
            duration: 100,
            useNativeDriver: false,
        }).start();
    }, [signUpInfo.club]);

    const checkVerifiedCode = useCallback(() => {
        const regex: RegExp = /^\d{6}$/;
        console.log(regex.test(verificationCode))
        return regex.test(verificationCode);
    }, [verificationCode])

    const dropdownCloseHandler = () => {
        if (onSelectClub) signUpInfo.club ? setClubisValid(true) : setClubisValid(false)
        setSelectClubVisible(false)
    }

    const ButtonHandler = useCallback(async () => {
        if (onStep == '이메일 인증') {
            if (verificationCodeRef.current?.validate()) {

                const verified = await verifyingEmail(signUpInfo.email, verificationCode);

                if (verified == 200) {
                    setStep('비밀번호 설정')
                    showEmailVirificationCompleteToast()
                }
                else if (verified == 405) {
                    showUncorrectCodeToast();
                } else if (verified == 403) {
                    showExpiredCodeToast()
                } else {
                    showProblemToast()
                }
            }
        } if (onStep == '비밀번호 설정') {
            if (passwordRef.current?.validate() && confirmPasswordRef.current?.validate())
                setStep('개인 정보 입력')
            else if (!passwordRef.current?.validate()) passwordRef.current?.focus()
            else if (!confirmPasswordRef.current?.validate()) confirmPasswordRef.current?.focus();
        }
        if (onStep == '개인 정보 입력') {
            if (!signUpInfo.club) setClubisValid(false);
            else if (!gradeRef.current?.validate()) gradeRef.current?.focus();
            else if (!nameRef.current?.validate()) nameRef.current?.focus();
            else if (!signUpInfo.nickname) setAlertVisible(true);
            else { SignUp() }
        }
    }, [signUpInfo, verificationCode])


    useEffect(() => {
        if (onStep == '이메일 인증') {
            setButtonAble(verificationCode.length == 6);
        }
        else if (onStep == '비밀번호 설정') {
            if (signUpInfo.password.length > 0 && confirmPassword.length > 0) { setButtonAble(true) }
        }
        else if (onStep == '개인 정보 입력') {
            if (isValidClub && signUpInfo.enrollmentNumber.length == 2 && signUpInfo.name.length > 1) { setButtonAble(true) }
        } else
            setButtonAble(false);
    }, [onStep, verificationCode, signUpInfo.password, confirmPassword, isValidClub, signUpInfo.enrollmentNumber, signUpInfo.name])


    const ButtonText = () => {
        switch (onStep) {
            case '비밀번호 설정':
                return '비밀번호 설정'
            case '개인 정보 입력':
                return '회원가입 신청'
            default: return '이메일 인증'
        }
    }
    const showSignUpCompleteToast = () => {
        Toast.show({
            type: 'success',
            text1: '회원 가입 신청을 완료했어요!',
            position: 'bottom',
            bottomOffset: 60,
            visibilityTime: 2000
        });
    };
    const showUncorrectCodeToast = () => {
        Toast.show({
            type: 'error',
            text1: '인증번호가 틀렸어요.',
            position: 'bottom',
            bottomOffset: 60,
            visibilityTime: 2000
        });
    };
    const showExpiredCodeToast = () => {
        Toast.show({
            type: 'error',
            text1: '만료된 인증번호에요!',
            position: 'bottom',
            bottomOffset: 60,
            visibilityTime: 2000
        });
    }; const showEmailVirificationCompleteToast = () => {
        Toast.show({
            type: 'success',
            text1: '이메일이 인증됐어요!',
            position: 'bottom',
            bottomOffset: 60,
            visibilityTime: 2000
        });
    }; const showProblemToast = () => {
        Toast.show({
            type: 'error',
            text1: '문제가 발생했어요. 잠시후에 시도해주세요',
            position: 'bottom',
            bottomOffset: 60,
            visibilityTime: 2000
        });
    };

    const SignUp = async () => {
        const controller = new AbortController();
        const signal = controller.signal;
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃
        setLoading(true);

        try {
            const response = await fetch(`${process.env.BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    { ...signUpInfo, enrollmentNumber: Number(signUpInfo.enrollmentNumber), club: "HWARANG", nickname: 'nullableCheck' }
                ),
                // 이거 넣어야함 {clubsEng[clubs.indexOf(signUpInfo.club??'기타')]}
                signal
            });

            if (response.ok) {
                showSignUpCompleteToast();
                navigation.goBack();
            } else {
                console.error('서버에서 데이터 가져오기 실패: ', response.status);
            }
        } catch (error: unknown) {
            // 에러가 Error 객체인지 확인
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    console.error('요청이 타임아웃으로 인해 중단되었습니다.');
                } else {
                    console.error('요청 중 에러 발생: ', error.message);
                }
            } else {
                console.error('알 수 없는 에러 발생: ', error);
            }
        } finally {

            clearTimeout(timeoutId); // 타임아웃 취소
            setLoading(false)
        }

    };

    const explain = () => {
        switch (onStep) {
            case '비밀번호 설정':
                return '로그인에 사용할 비밀번호를 정해요.'
            case '개인 정보 입력':
                return '앱 이용에 사용될 정보를 등록해요'
            default:
                return '로그인에 사용할 이메일을 등록하고 인증해요.'
        }
    }

    return (
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); dropdownCloseHandler(); }} >
            <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#FFF" }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

                    <Text style={{
                        alignSelf: 'flex-start',
                        height: 40,
                        left: 40,
                        marginTop: 28,
                        fontSize: 24,
                        lineHeight: 26,
                        fontFamily: "NanumSquareNeo-Bold",
                    }}>회원가입</Text>
                    <View style={{
                        marginVertical: 8, paddingHorizontal: 16, marginHorizontal: 36, backgroundColor: Color['grey100'], paddingVertical: 16, borderRadius: 5
                    }}>
                        <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Light', color: Color['grey500'] }}>
                            {explain()}</Text>
                    </View>
                    <View style={{ alignSelf: 'center' }}>
                        {onStep == '이메일 검증' ?
                            <EmailConfirmComponent
                                setStep={setStep}
                                isEditible
                            />
                            : onStep == '이메일 인증' ?
                                <EmailConfirmComponent
                                    setStep={setStep}
                                    isEditible={false}
                                /> : onStep != '비밀번호 설정' &&
                                <InputComponent
                                    label='이메일'
                                    color={'green'}
                                    inputValue={signUpInfo.email}
                                    setInputValue={setEmail}
                                    isEditible={false}
                                />
                        }
                    </View>

                    <View style={{ marginTop: 20, alignSelf: 'center' }}>
                        {onStep == '이메일 인증' &&
                            <InputComponent
                                ref={verificationCodeRef}
                                inputValue={verificationCode}
                                setInputValue={setVerificationCode}
                                keyboardType='number-pad'
                                isRequired={true}
                                label='인증번호'
                                color={'green'}
                                checkValid={setVerifiedEmail}
                                validationCondition={
                                    [{
                                        validation: checkVerifiedCode,
                                        errorText: "인증번호는 6자리 숫자에요"
                                    }]
                                }
                            />}
                        {(onStep == '비밀번호 설정' || onStep == '개인 정보 입력') &&
                            <View>
                                <InputComponent
                                    ref={passwordRef}
                                    label='비밀번호'
                                    color={'green'}
                                    isEncryption
                                    inputValue={signUpInfo.password}
                                    setInputValue={setPassword}
                                    isEditible={onStep == '비밀번호 설정'}
                                    validationCondition={
                                        [{
                                            validation: vaildatePassword,
                                            errorText: "영문, 숫자, 특수문자(!,@,#,$,%,^,&,+,=)를\n포함한 8~12자로 구성되어야 합니다."
                                        }]}
                                />
                            </View>}
                        {onStep == '비밀번호 설정' &&
                            <View style={{ marginTop: 24 }}>
                                <InputComponent
                                    ref={confirmPasswordRef}
                                    label='비밀번호 확인'
                                    color={'green'}
                                    isEncryption
                                    inputValue={confirmPassword}
                                    setInputValue={setConfirmPassword}
                                    validationCondition={[
                                        {
                                            validation: () => {
                                                const newCondition = signUpInfo.password == confirmPassword

                                                console.log(confirmPassword, newCondition)
                                                return newCondition;
                                            },
                                            errorText: "비밀번호가 일치하지 않습니다."
                                        }]}
                                />
                            </View>}
                        {onStep == '개인 정보 입력' &&
                            <View>
                                <View style={{ marginTop: 20 }} />
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', zIndex: 1 }}>

                                    <Pressable style={[styles.inputGroup, { width: 142, zIndex: 0 }]}
                                        onPress={() => { Keyboard.dismiss(); setSelectClubVisible(true); }}>

                                        <Animated.Text style={[styles.labelText, labelStyle]}>{'동아리'}
                                            {!signUpInfo.club && <Text style={{ color: 'red' }}>*</Text>}</Animated.Text>

                                        <View style={[styles.InputBox, { flexDirection: 'row', justifyContent: 'space-between', width: 126, alignItems: 'center' }]}>
                                            <Text style={[styles.InputText, signUpInfo.club == null && { color: Color['grey300'] }]}>{signUpInfo.club ?? '동아리 선택'}</Text>
                                            <View style={{ width: 24, height: 12, backgroundColor: Color["green500"] }} />
                                        </View>

                                        <View style={[styles.underline, { borderBottomColor: isValidClub ? Color["green500"] : Color["red500"], width: 142 }]} />
                                        {!isValidClub ? <Text style={styles.errorText}>{'동아리를 선택해주세요'}</Text> : null}
                                    </Pressable>
                                    {onSelectClub && <View style={{
                                        position: 'absolute', top: 24, zIndex: 2, width: 142, backgroundColor: '#FFF', alignItems: 'flex-start', paddingHorizontal: 16, borderRadius: 5, shadowColor: Color['grey700'],
                                        shadowOffset: { width: -2, height: 2 }, // 그림자 오프셋 (x, y)
                                        shadowOpacity: 0.1,         // 그림자 투명도 (0에서 1)
                                        shadowRadius: 5,          // 그림자 반경
                                        elevation: 5,
                                        height: 180,
                                    }}>
                                        <ScrollView
                                            contentContainerStyle={{ alignItems: 'flex-start' }}
                                            showsVerticalScrollIndicator={false}
                                        >{clubs.map((item) => {
                                            return (
                                                <Pressable
                                                    key={item + 'seletor'}
                                                    style={{ paddingVertical: 8, marginVertical: 4, width: 142 - 32, alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row' }}
                                                    onPress={() => { setClub(item); setSelectClubVisible(false); setClubisValid(true); }}>
                                                    <Text style={[{ fontFamily: "NanumSquareNeo-Regular", fontSize: 16, color: signUpInfo.club == item ? Color['green600'] : Color['grey400'] }]}>{item}</Text>
                                                    {signUpInfo.club == item && <View style={{ width: 16, height: 16, backgroundColor: Color['green500'] }} />}
                                                </Pressable>
                                            )
                                        })}</ScrollView>
                                    </View>}

                                    <InputComponent
                                        ref={gradeRef}
                                        label='학번'
                                        length={126}
                                        inputValue={signUpInfo.enrollmentNumber}
                                        setInputValue={setEnrollmentNumber}
                                        color={'green'}
                                        isRequiredMark={true}
                                        isRequired
                                        onFocus={dropdownCloseHandler}
                                        keyboardType='number-pad'
                                        maxLength={2}
                                        validationCondition={
                                            [{
                                                validation: () => {
                                                    const regex: RegExp = /^[\d@]{2}$/;
                                                    const newCondition = regex.test(signUpInfo.enrollmentNumber);
                                                    return newCondition;
                                                },
                                                errorText: "두 자리가 필요해요"
                                            }]}
                                    />
                                </View>
                                <View style={{ marginTop: 20 }} />
                                <InputComponent
                                    ref={nameRef}
                                    label='이름(본명)'
                                    color={'green'}
                                    inputValue={signUpInfo.name}
                                    setInputValue={setName}
                                    isEditible={true}
                                    isRequiredMark={true}
                                    onFocus={dropdownCloseHandler}
                                />
                                <View style={{ marginTop: 20 }} />
                                <InputComponent
                                    label='패명'
                                    color={'green'}
                                    inputValue={signUpInfo.nickname ?? ''}
                                    setInputValue={setNickName}
                                    isEditible={true}
                                    isRequired={false}
                                    onFocus={dropdownCloseHandler}
                                />
                            </View>
                        }

                    </View>
                    <View style={[{ width: '100%', paddingHorizontal: 12, marginTop: 32, zIndex: -1 }]}>
                        <LongButton
                            color={'green'}
                            innerText={ButtonText()}
                            isAble={buttonAble}
                            onPress={() => {
                                ButtonHandler();
                            }}
                        />
                    </View>
                    <Modal visible={alertVisible} transparent>
                        <Pressable style={{ backgroundColor: 'rgba(0,0,0,0.4)', flex: 1, justifyContent: 'center' }} onPress={() => setAlertVisible(false)}>
                            <Pressable style={{ marginHorizontal: 28, height: 200, backgroundColor: '#FFF', borderRadius: 15 }} onPress={(e) => e.stopPropagation()} >
                                <Text style={alertStyle.Header}>패명 없음</Text>
                                <Text style={alertStyle.Script}>{`패명이 존재 하지 않는게 맞나요?`}</Text>
                                <View style={{ position: 'absolute', flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 8, width: width - 56 - 16, bottom: 16 }}>
                                    <ShortButton color='red' innerText='취소' isFilled={true} onPress={() => { setAlertVisible(false) }} />
                                    <ShortButton color='blue' innerText='네' isFilled={true} onPress={() => {
                                        setAlertVisible(false);
                                        SignUp();
                                    }} />
                                </View>
                            </Pressable>
                        </Pressable>
                    </Modal>
                    <Modal transparent visible={loading}>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}></View>
                        <ActivityIndicator size={'large'} color={'#FFF'} />
                    </Modal>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}

export default SignUpScreen

const styles = StyleSheet.create({
    inputGroup: {
        width: 300,
    },
    underline: {
        width: 300,
        borderBottomWidth: 1,
        marginTop: 1,
    },
    InputBox: {
        height: 36,
        paddingTop: 8,
        marginLeft: 8,
    },
    InputText: {
        color: Color['grey800'],
        fontSize: 16,
        fontFamily: 'NanumSquareNeo-Bold',
    },
    labelText: {
        width: 150,
        color: Color['grey800'],
        fontSize: 10,
        fontFamily: 'NanumSquareNeo-Bold',
        height: 12
    },
    errorText: {
        color: Color['red500'],
        fontFamily: 'NanumSquareNeo-Bold',
        marginTop: 8,
        marginLeft: 8,
        fontSize: 14
    },
})
const alertStyle = StyleSheet.create({
    Header: {
        fontFamily: 'NanumSquareNeo-Bold',
        fontSize: 22,
        left: 20,
        top: 20
    },
    Script: {
        fontFamily: 'NanumSquareNeo-Regular',
        fontSize: 16,
        left: 24,
        top: 52,
        lineHeight: 22,
        width: width - 108
    }
})