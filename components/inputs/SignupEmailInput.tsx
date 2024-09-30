import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Animated, Pressable, Modal, ActivityIndicator } from 'react-native';
import { Color } from '../../ColorSet';
import { josa } from 'es-hangul';
import Toast from 'react-native-toast-message';

type InputProps = {
    label: string,
    isEncryption?: boolean,
    checkValid?: (valid: boolean) => void,
    color?: string
    isEditible?: boolean
    inputValue: string,
    setInputValue: (email: string) => void,
}

const isValidEmail = async (email: string, callbackFn?: () => void) => {
    const controller = new AbortController();
    const signal = controller.signal;
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃

    let result = false;

    try {
        const response = await fetch(`${process.env.BASE_URL}/auth/email`, {
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

            const { valid } = data;
            console.log(valid)
            result = valid;
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
        const response = await fetch(`${process.env.WEB_API}/verificationCode/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email }),
            signal
        });

        if (response.ok) {
            result = 200;
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


const SignUpEmailInput: React.FC<InputProps> = ({ label, isEncryption, checkValid, isEditible = true, inputValue, setInputValue }) => {

    const [isTyped, setIsTyped] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const [isSend, setIsSend] = useState(false);
    const [errorText, setErrorText] = useState(``)
    const labelAnimation = useRef(new Animated.Value(0)).current; // 애니메이션 초기 값
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(isEncryption || false);

    const underlineColor = Color[`green500`];

    const SendCodeHandler = async () => {
        const regex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const newCondition = regex.test(inputValue);
        setIsValid(newCondition);
        if (!newCondition) setErrorText("이메일 주소가 유효하지 않습니다")
        else {
            const duplication = await isValidEmail(inputValue) || false
            if (!duplication) {
                setIsValid(false);
                setErrorText("이미 가입된 이메일 입니다.")
            }
            else {
                try {
                    setLoading(true);
                    const sendResult = await sendVerificationCode(inputValue);
                    if (sendResult == 200) {
                        setIsSend(true);
                        if (checkValid) checkValid(true);
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

    useEffect(() => {
        Animated.timing(labelAnimation, {
            toValue: isTyped ? 1 : 0,
            duration: 100,
            useNativeDriver: false,
        }).start();
    }, [isTyped]);

    const handleTextChange = (text: string) => {
        setInputValue(text);
    };

    const handleFocus = () => {
        setIsTyped(true);
    }

    const handleBlur = () => {
        if (inputValue.length == 0) {
            setIsTyped(false);
            setIsValid(false);

            if (checkValid) checkValid(false);

            setErrorText(josa(label, '을/를') + ' 입력해야해요')
        } else {
            const regex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const newCondition = regex.test(inputValue);
            setIsValid(newCondition);
            if (!newCondition) setErrorText("이메일 주소가 유효하지 않습니다")

            if (checkValid) checkValid(false);
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
    return (
        <View style={styles.inputGroup}>
            <View style={[styles.underline, { borderBottomColor: isValid ? underlineColor : Color["red500"] }]} />
            {isEncryption ? <TextInput
                style={styles.InputBox}
                placeholder={josa(label, '을/를') + ' 입력하세요'}
                value={inputValue}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChangeText={handleTextChange}
                secureTextEntry={isVisible} />
                :
                <TextInput
                    style={styles.InputBox}
                    placeholder={josa(label, '을/를') + ' 입력하세요'}
                    value={inputValue}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChangeText={handleTextChange}
                    editable={isEditible}
                />
            }
            <Animated.Text style={[styles.labelText, labelStyle]}>{label}</Animated.Text>
            {isEncryption ?
                <Pressable style={{ position: 'absolute', left: 273, top: 26, width: 18, height: 18, borderWidth: 1, borderColor: "#000", backgroundColor: isVisible ? "#000" : "#FFF" }}
                    onPress={() => { setIsVisible(!isVisible) }} />
                : null}
            {!isValid ? <Text style={styles.errorText}>{errorText}</Text> : null}
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
        width: 300,
        height: 54,
        position: 'relative',
    },
    underline: {
        width: 232,
        height: 35,
        position: 'absolute',
        borderBottomWidth: 1,
        top: 19,
    },
    InputBox: {
        width: 220,
        height: 28,
        position: 'absolute',
        color: Color['grey800'],
        fontSize: 16,
        fontFamily: 'NanumSquareNeo-Bold',
        lineHeight: 22,
        top: 22,
        left: 8,
        placeholderTextColor: Color['grey500'],
        outline: 0,
    },
    labelText: {
        width: 150,
        height: 22,
        position: 'absolute',
        color: Color['grey800'],
        fontSize: 10,
        fontFamily: 'NanumSquareNeo-Bold',
        lineHeight: 22,
        top: 0,
        left: 4,
    },
    errorText: {
        position: 'absolute',
        color: Color['red500'],
        fontFamily: 'NanumSquareNeo-Bold',
        top: 60,
        left: 8,
        fontSize: 14
    },
    button: {
        width: 60,
        height: 40,
        position: 'absolute',
        left: 240,
        top: 14,
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