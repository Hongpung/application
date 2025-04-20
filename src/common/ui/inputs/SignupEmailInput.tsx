import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Animated, Pressable, Modal, ActivityIndicator } from 'react-native';
import { Color } from '@hongpung/ColorSet';
import { josa } from 'es-hangul';
import Toast from 'react-native-toast-message';
import { BasicInput } from './BasicInput';

type InputProps = {
    label: string,
    inputValue: string,
    onCodeSend: () => void
    setInputValue: (email: string) => void,
}
type validationCondition = | { state: 'PENDING' | 'BEFORE' | 'VALID' } | { state: 'ERROR', errorText: string }

const useEmailInput = () => {
    const [email, setEmail] = useState('');

    const [emailValidation, setEmailValidation] = useState<validationCondition>({ state: 'BEFORE' })

    const validateEmail = useCallback((email: string) => {
        const emailFormRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailFormRegex.test(email)) {
            setEmailValidation({ state: 'VALID' })
            return;
        }

        setEmailValidation({ state: 'ERROR', errorText: '이메일 형식이 올바르지 않습니다.' })
    }, [])

    return { email, setEmail, setEmailValidation, emailValidation, validateEmail }
}

const isRegisteredEmail = async (email: string, callbackFn?: () => void) => {
    const controller = new AbortController();
    const signal = controller.signal;
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃

    let result = false;

    try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/auth/check-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email }),
            signal
        });

        const data = await response.json();

        console.log(data)
        if (response.ok) {

            const { isRegistered } = data;
            console.log(isRegistered)
            result = isRegistered == false;
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
        clearTimeout(timeoutId);
        callbackFn && callbackFn()
    }

    return result;
};

const sendVerificationCode = async (email: string) => {
    const controller = new AbortController();
    const signal = controller.signal;
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃

    let result = 500;

    try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/verification/send/id`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email }),
            signal
        });

        if (response.ok) {
            result = 200;
            console.log('success')
        } else {
            console.error('서버에서 데이터 가져오기 실패: ', response.status);
            result = response.status;
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
        clearTimeout(timeoutId);
    }

    return result;
}


const SignUpEmailInput: React.FC<InputProps> = ({ onCodeSend, inputValue, setInputValue }) => {

    const { setEmailValidation, emailValidation, validateEmail } = useEmailInput();
    const emailRef = useRef<TextInput>(null);

    const [loading, setLoading] = useState(false);
    const [isSend, setIsSend] = useState(false);

    const SendCodeHandler = async () => {

        if (emailValidation.state === 'ERROR') {
            emailRef.current?.focus();
            return
        }

        else {
            const duplication = await isRegisteredEmail(inputValue) || false
            if (!duplication) {
                setEmailValidation({ state: 'ERROR', errorText: '이미 가입된 이메일 입니다.' });
            }

            else {
                try {
                    setLoading(true);
                    const sendResult = await sendVerificationCode(inputValue);
                    if (sendResult == 200) {
                        onCodeSend();
                        setIsSend(true);
                        showSendToast();
                    }
                    else if (sendResult == 403) {
                        //횟수 최대 도달 알럿
                        showErrorToast(sendResult)
                    } else {
                        showErrorToast(sendResult)
                    }
                } catch (e) {
                    console.error(e)
                } finally {
                    setLoading(false);
                }
            }
        }
    }

    const showSendToast = () => {
        if (!isSend) {
            Toast.show({
                type: 'success',
                text1: '인증번호를 전송했어요',
                position: 'bottom',
                bottomOffset: 60,
                visibilityTime: 2000
            });
        } else {
            Toast.show({
                type: 'success',
                text1: '인증번호를 재전송했어요',
                position: 'bottom',
                bottomOffset: 60,
                visibilityTime: 2000
            });
        }
    }

    const showErrorToast = (errorcode: number) => {
        if (errorcode == 403) {
            Toast.show({
                type: 'error',
                text1: '인증번호 전송제한에 도달했어요\n관리자에게 문의하세요',
                position: 'bottom',
                bottomOffset: 60,
                visibilityTime: 2000
            });
        } else {
            Toast.show({
                type: 'error',
                text1: '문제가 발생했어요. 잠시후에 시도해주세요',
                position: 'bottom',
                bottomOffset: 60,
                visibilityTime: 2000
            });
        }
    }

    return (
        <View style={styles.inputGroup}>
            <View style={{ flex: 1 }}>
                <BasicInput
                    ref={emailRef}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    label='이메일'
                    color='green'
                    isEditible={!isSend}
                    keyboardType={'email-address'}
                    validationCondition={emailValidation}
                    onBlur={() => validateEmail(inputValue)}
                />
            </View>
            <Pressable style={styles.button}
                onPress={SendCodeHandler}>
                <Text style={styles.buttonText}>{isSend ? '인증번호\n재전송' : '인증번호\n전송'}</Text>
            </Pressable>
            <Modal transparent visible={loading}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <ActivityIndicator size={'large'} color={'#FFF'} />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    inputGroup: {
        display: 'flex',
        alignItems: 'flex-start',
        flexDirection: 'row',
        gap: 12,
        width: '100%',
        paddingHorizontal: 48,
        position: 'relative',
    },
    button: {
        marginTop: 12,
        width: 60,
        height: 40,
        backgroundColor: '#3CB371',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#3CB371',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 12,
        fontFamily: 'NanumSquareNeo-Bold',
        textAlign: 'center',
        lineHeight: 14,
    },
});

export default SignUpEmailInput;