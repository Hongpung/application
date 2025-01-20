import React, { useCallback } from 'react'
import { Color } from "@hongpung/ColorSet";

import { Club, clubIds, clubs } from "@hongpung/UserType";
import { useRef, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableWithoutFeedback, View, Text, Pressable, ScrollView, Modal, ActivityIndicator, Dimensions, TextInput } from "react-native";
import { useSignUp } from "../context/SignUpContext";
import LongButton from "@hongpung/components/buttons/LongButton";
import ShortButton from "@hongpung/components/buttons/ShortButton";
import { showSignUpCompleteToast } from "../toasts/sign-up-toast";
import { useNavigation } from "@react-navigation/native";
import { InputBaseComponent } from '@hongpung/components/common/inputs/InputBaseComponent';
import { ClubSelector } from '@hongpung/components/common/Selector';

const { width } = Dimensions.get('window');
type validationCondition = | { state: 'PENDING' | 'BEFORE' | 'VALID' } | { state: 'ERROR', errorText: string }


interface ClubSeletorProps {
    club: Club | null
    setClub: (club: string) => void
    dropDownVisible: boolean
    setDropDownVisible: (value: boolean) => void,
    isErrored: boolean
    errorText: string

}

const useClub = () => {
    const { signUpInfo, setClub } = useSignUp();
    const { club } = signUpInfo;

    const [clubValidation, setClubValidation] = useState<validationCondition>({ state: 'BEFORE' })

    const validateClub = useCallback((club: Club | null) => {
        if (!club) { setClubValidation({ state: 'ERROR', errorText: '동아리를 선택해주세요.' }); return }
        setClubValidation({ state: 'VALID' })
    }, [])

    return { club, setClub, clubValidation, setClubValidation, validateClub }
}

const ClubSeletor: React.FC<ClubSeletorProps> = ({ club, setClub, dropDownVisible, setDropDownVisible, isErrored, errorText }) => {

    return (
        <ClubSelector
            label='동아리'
            value={club}
            onChange={setClub}
            options={clubs}
            dropDownVisible={dropDownVisible}
            setDropDownVisible={setDropDownVisible}
            isErrored={isErrored}
            errorText={errorText}
        />
    )
}

const useEnollmentNumber = () => {
    const { signUpInfo, setEnrollmentNumber } = useSignUp();
    const { enrollmentNumber } = signUpInfo;

    const [enrollmentNumberValidation, setEnrollmentNumberValidation] = useState<validationCondition>({ state: 'BEFORE' })

    const validateEnrollmentNumber = useCallback((enrollmentNumber: string) => {
        if (enrollmentNumber.length < 2) {
            setEnrollmentNumberValidation({ state: 'ERROR', errorText: '학번은 두자리수 입니다.' })
            return
        }
        setEnrollmentNumberValidation({ state: 'VALID' })
    }, [])

    return { enrollmentNumber, setEnrollmentNumber, enrollmentNumberValidation, setEnrollmentNumberValidation, validateEnrollmentNumber }
}

const useName = () => {
    const { signUpInfo, setName } = useSignUp();
    const { name } = signUpInfo;

    const [nameValidation, setNameValidation] = useState<validationCondition>({ state: 'BEFORE' })

    const validateName = useCallback((name: string) => {
        const koreanRegex = /^[가-힣]+$/;

        if (name.length == 0) {
            setNameValidation({ state: 'ERROR', errorText: '이름을 입력하세요' })
            return
        }
        if (!koreanRegex.test(name)) {
            setNameValidation({ state: 'ERROR', errorText: '이름은 한글로만 입력 가능해요' })
            return
        }
        setNameValidation({ state: 'VALID' })
    }, [])

    return { name, setName, nameValidation, setNameValidation, validateName }
}

const useNickName = () => {
    const { signUpInfo, setNickName } = useSignUp();
    const { nickname } = signUpInfo;

    const [nickNameValidation, setNickNameValidation] = useState<validationCondition>({ state: 'VALID' })

    const validateNickName = useCallback((nickname: string) => {

        const koreanRegex = /^[가-힣]+$/;

        console.log(nickname)
        if (nickname.length > 0 && !koreanRegex.test(nickname)) {
            setNickNameValidation({ state: 'ERROR', errorText: '패명 한글로만 입력 가능해요' })
            return
        }

        setNickNameValidation({ state: 'VALID' })
    }, [])

    return { nickname, setNickName, nickNameValidation, setNickNameValidation, validateNickName }
}


const usePersonalInformation = () => {


    const navigation = useNavigation();

    const { signUpInfo } = useSignUp();

    const [isLoading, setLoading] = useState(false);

    const SignUp = async () => {
        const controller = new AbortController();
        const signal = controller.signal;
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃
        setLoading(true);

        try {
            const response = await fetch(`${process.env.SUB_API}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        email: signUpInfo.email,
                        password: signUpInfo.password,
                        name: signUpInfo.name,
                        nickname: signUpInfo.nickname,
                        enrollmentNumber: signUpInfo.enrollmentNumber,
                        clubId: signUpInfo.club ? clubIds[signUpInfo.club] : null
                    }
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

    return { isLoading, SignUp }
}

const NoNicknameAlretModal: React.FC<{ visible: boolean, onClose: () => void, onSignUp: () => void }> = ({ visible, onClose, onSignUp }) => {

    return (<Modal visible={visible} transparent>
        <Pressable style={{ backgroundColor: 'rgba(0,0,0,0.4)', flex: 1, justifyContent: 'center' }} onPress={onClose}>
            <Pressable style={{ marginHorizontal: 28, height: 200, backgroundColor: '#FFF', borderRadius: 15 }} onPress={(e) => e.stopPropagation()} >
                <Text style={alertStyle.Header}>패명 없음</Text>
                <Text style={alertStyle.Script}>{`패명이 존재 하지 않는게 맞나요?`}</Text>
                <View style={{ position: 'absolute', flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 8, width: width - 56 - 16, bottom: 16 }}>
                    <ShortButton color='red' innerText='취소' isFilled={true} onPress={onClose} />
                    <ShortButton color='blue' innerText='네' isFilled={true} onPress={onSignUp} />
                </View>
            </Pressable>
        </Pressable>
    </Modal>)
}


export const PersonalInformationCheck: React.FC = () => {


    const { isLoading, SignUp } = usePersonalInformation();

    const { club, setClub, clubValidation, validateClub } = useClub();
    const { enrollmentNumber, setEnrollmentNumber, enrollmentNumberValidation, validateEnrollmentNumber } = useEnollmentNumber()
    const { name, setName, nameValidation, validateName } = useName()
    const { nickname, setNickName, nickNameValidation, validateNickName } = useNickName();

    const handleSignUpButton = () => {
        if (clubValidation.state == 'BEFORE' || clubValidation.state == 'ERROR') { validateClub(club); return; }
        else if (enrollmentNumberValidation.state == 'ERROR') { enrollmentNumberRef.current?.focus(); return; }
        else if (nameValidation.state == 'ERROR') { nameRef.current?.focus(); return }
        else if (nickNameValidation.state == 'ERROR') { nickNameRef.current?.focus(); return; }
        else if (nickname?.length == 0 || !nickname) { setAlertVisible(true); return; }
        else { SignUp() }
    }

    const [alertVisible, setAlertVisible] = useState(false);
    const [onSelectClub, setSelectClubVisible] = useState(false);

    const enrollmentNumberRef = useRef<TextInput>(null);
    const nameRef = useRef<TextInput>(null);
    const nickNameRef = useRef<TextInput>(null);

    const dropdownCloseHandler = () => {
        setSelectClubVisible(false)
        validateClub(club)
    }

    return (
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); dropdownCloseHandler() }} >
            <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#FFF" }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}>
                <ScrollView 
                alwaysBounceVertical={false}
                contentContainerStyle={{ flex: 1, flexGrow: 1, backgroundColor: "#FFF" }}>
                    <View style={{ flex: 1, flexGrow: 1 }}>
                        <Text style={{
                            alignSelf: 'flex-start',
                            height: 40,
                            left: 40,
                            marginTop: 28,
                            fontSize: 24,
                            lineHeight: 26,
                            fontFamily: "NanumSquareNeo-Bold",
                        }}>
                            회원가입
                        </Text>
                        <View style={{
                            marginVertical: 8, paddingHorizontal: 16, marginHorizontal: 36, backgroundColor: Color['grey100'], paddingVertical: 16, borderRadius: 5
                        }}>
                            <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Light', color: Color['grey500'] }}>
                                {'앱 이용에 사용될 정보를 등록해요.'}
                            </Text>
                        </View>
                        <View style={{ marginTop: 20 }} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', zIndex: 1, width: '100%', gap: 12, paddingHorizontal: 48, alignSelf: 'center' }}>
                            <View style={{ flex: 1 }}>
                                <ClubSeletor
                                    club={club}
                                    setClub={(club:string) => { setClub(club as Club); validateClub(club as Club); }}
                                    setDropDownVisible={setSelectClubVisible}
                                    dropDownVisible={onSelectClub}
                                    isErrored={clubValidation.state == 'ERROR'}
                                    errorText={clubValidation.state == 'ERROR' ? clubValidation.errorText : ''}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <InputBaseComponent
                                    ref={enrollmentNumberRef}
                                    label='학번'
                                    inputValue={enrollmentNumber ?? ''}
                                    setInputValue={setEnrollmentNumber}
                                    color={'green'}
                                    isRequired
                                    onFocus={dropdownCloseHandler}
                                    onBlur={() => validateEnrollmentNumber(enrollmentNumber)}
                                    keyboardType='number-pad'
                                    maxLength={2}
                                    validationCondition={enrollmentNumberValidation}
                                />
                            </View>
                        </View>
                        <View style={{ marginTop: 24, width: 300, alignSelf: 'center' }}>
                            <InputBaseComponent
                                ref={nameRef}
                                label='이름(본명)'
                                color={'green'}
                                inputValue={name}
                                setInputValue={setName}
                                validationCondition={nameValidation}
                                onBlur={() => validateName(name)}
                            />
                        </View>

                        <View style={{ marginTop: 24, width: 300, alignSelf: 'center' }}>
                            <InputBaseComponent
                                ref={nickNameRef}
                                label='패명'
                                color={'green'}
                                inputValue={nickname ?? ''}
                                setInputValue={setNickName}
                                isEditible={true}
                                isRequired={false}
                                onFocus={dropdownCloseHandler}
                                onBlur={() => validateNickName(nickname || '')}
                                validationCondition={nickNameValidation}
                            />
                        </View>
                    </View>
                    <View style={[{ paddingHorizontal: 12, marginTop: 24 }]}>
                        <LongButton
                            color={'green'}
                            innerText='회원가입 신청'
                            isAble={club != null && name.length > 0 && enrollmentNumber.length > 0}
                            onPress={handleSignUpButton}
                        />
                    </View>

                    <Modal visible={isLoading} transparent>
                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' }}>
                            <ActivityIndicator color={'#FFFFF'} size={'large'} />
                        </View>
                    </Modal>

                    <NoNicknameAlretModal
                        visible={alertVisible}
                        onClose={() => setAlertVisible(false)}
                        onSignUp={() => {
                            SignUp();
                            setAlertVisible(false);
                        }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}

export default PersonalInformationCheck;

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