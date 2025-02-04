import { Keyboard, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import { Color } from '@hongpung/ColorSet';
import { InputBaseComponent } from '@hongpung/components/common/inputs/InputBaseComponent';
import LongButton from '@hongpung/components/buttons/LongButton';
import { TextInput } from 'react-native-gesture-handler';
import ShortButton from '@hongpung/components/buttons/ShortButton';
import { deleteToken, getToken } from '@hongpung/utils/TokenHandler';
import Toast from 'react-native-toast-message';
import { loginUserState } from '@hongpung/recoil/authState';
import { useRecoilState } from 'recoil';
import { StackActions, useNavigation } from '@react-navigation/native';

type ValidationCondition = | { state: 'PENDING' | 'BEFORE' | 'VALID' } | { state: 'ERROR', errorText: string }
const WithdrawalAuthScreen: React.FC = () => {

    const navigation = useNavigation();

    const [loginUser, setLoginUser] = useRecoilState(loginUserState);
    const [password, setPassword] = useState('');
    const [passwordValidation, setPasswordValidation] = useState<ValidationCondition>({ state: 'BEFORE' })
    const [modalVisible, setModalVisible] = useState(false);

    const validatePassword = useCallback((password: string) => {
        const regex: RegExp = /^[A-Za-z\d@$!%*?&]{8,12}$/;
        if (regex.test(password)) {
            setPasswordValidation({ state: 'VALID' })
            return;
        }
        setPasswordValidation({ state: 'ERROR', errorText: '비밀번호는 8~12자 입니다.' })
    }, [])

    const [confirmword, setConfirmword] = useState('');

    const [confirmwordValidation, setConfirmwordValidation] = useState<ValidationCondition>({ state: 'BEFORE' })

    const passwordRef = useRef<TextInput>(null)
    const checkwordRef = useRef<TextInput>(null)

    const onPasswordChange = useCallback((password: string) => {
        setPasswordValidation({ state: 'PENDING' })
        setPassword(password)
    }, [])
    const onConfirmwordChange = useCallback((confirmword: string) => {
        setConfirmwordValidation({ state: 'PENDING' })
        setConfirmword(confirmword)
    }, [])

    const withdrawAuth = useCallback(() => {
        const withdraw = async () => {

            try {
                const token = await getToken('token');

                console.log(JSON.stringify({ password }))
                const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/auth`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'Application/json'
                    },
                    body: JSON.stringify({ password })
                })

                if (!response.ok) throw Error('Request Failed')

                Toast.show({
                    type: 'success',
                    text1: '회원 탈퇴에 성공했어요\n다음에 꼭 다시 만나요',
                    position: 'bottom',
                    bottomOffset: 60,
                    visibilityTime: 2000
                });
                await deleteToken('token');

                setLoginUser(null);

                navigation.dispatch(StackActions.replace('Login'));
            } catch {
                Toast.show({
                    type: 'error',
                    text1: '회원 탈퇴에 실패했어요\n다시 시도해주세요',
                    position: 'bottom',
                    bottomOffset: 60,
                    visibilityTime: 2000
                });
            }
        }

        withdraw()
    }, [password])

    return (
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); }} >
            <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#FFF" }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}>
                <View style={{ flex: 1, flexGrow: 1, backgroundColor: `#FFF` }}>
                    <Text style={{
                        alignSelf: 'flex-start',
                        height: 40,
                        left: 40,
                        marginTop: 28,
                        fontSize: 24,
                        lineHeight: 26,
                        fontFamily: "NanumSquareNeo-Bold",
                    }}>
                        회원 탈퇴
                    </Text>
                    <View style={{
                        marginVertical: 8, paddingHorizontal: 16, marginHorizontal: 36, backgroundColor: Color['grey100'], paddingVertical: 16, borderRadius: 5, gap: 6
                    }}>
                        <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Light', color: Color['grey500'] }}>
                            {loginUser?.name + ' 님의 계정을 홍풍에서 삭제해요.'}
                        </Text>
                        <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Light', color: Color['grey500'], lineHeight: 16 }}>
                            {'기존 비밀번호를 입력해주세요.'}
                        </Text>
                        <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Light', color: Color['grey500'], lineHeight: 16 }}>
                            {'\'회원탈퇴\'를 입력해주세요.'}
                        </Text>
                    </View>
                    <View style={{ marginHorizontal: 48, marginTop: 12 }}>
                        <InputBaseComponent
                            ref={passwordRef}
                            label='비밀번호'
                            color={'red'}
                            isEncryption
                            inputValue={password}
                            setInputValue={onPasswordChange}
                            onBlur={() => { validatePassword(password) }}
                            validationCondition={passwordValidation}
                        />
                    </View>
                    <View style={{ marginHorizontal: 48, marginTop: 24 }}>
                        <InputBaseComponent
                            ref={checkwordRef}
                            label='회원탈퇴'
                            color={'red'}
                            inputValue={confirmword}
                            setInputValue={onConfirmwordChange}
                            onBlur={() => {
                                if (confirmword.length == 0) {
                                    setConfirmwordValidation({ state: 'ERROR', errorText: '회원탈퇴 문구를 입력해주세요.' })
                                    return;
                                }
                                if (confirmword != '회원탈퇴') {
                                    setConfirmwordValidation({ state: 'ERROR', errorText: '회원탈퇴 문구를 정확히 기입해주세요.' })
                                    return;
                                }
                                setConfirmwordValidation({ state: 'VALID' })
                            }}
                            validationCondition={confirmwordValidation}
                        />
                    </View>
                </View>
                <View style={[{ paddingHorizontal: 12, marginTop: 24 }]}>
                    <LongButton
                        color={'red'}
                        innerText='회원 탈퇴하기'
                        isAble={passwordValidation.state == 'VALID' && confirmwordValidation.state == 'VALID'}
                        onPress={() => { setModalVisible(true) }}
                    />
                </View>
                <Modal transparent visible={modalVisible}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center' }}>
                        <View style={{ marginHorizontal: 24, backgroundColor: '#FFF', paddingVertical: 24, paddingHorizontal: 16, borderRadius: 10, gap: 24 }}>
                            <View>
                                <Text style={{
                                    fontFamily: "NanumSquareNeo-Bold",
                                    fontSize: 16,
                                    paddingHorizontal: 8
                                }}>회원 탈퇴</Text>
                            </View>
                            <View>
                                <Text style={{
                                    fontFamily: "NanumSquareNeo-Regular",
                                    fontSize: 14,
                                    paddingHorizontal: 16,
                                    lineHeight: 20
                                }}>
                                    {`홍풍에서 정말로 탈퇴하시겠어요?\n탈퇴즉시 서버에서 정보가 삭제됩니다.\n(복구 불가)`}
                                </Text>

                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <ShortButton
                                    color='blue'
                                    innerText='취소'
                                    isFilled={false}
                                    onPress={() => { setModalVisible(false) }}
                                />
                                <ShortButton
                                    color='blue'
                                    innerText='확인'
                                    isFilled={true}
                                    onPress={withdrawAuth}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}

export default WithdrawalAuthScreen

const styles = StyleSheet.create({})