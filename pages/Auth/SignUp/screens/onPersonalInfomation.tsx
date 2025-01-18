import React from 'react'
import { Color } from "@hongpung/ColorSet";
import InputComponent from "@hongpung/components/inputs/InputComponent";
import { Club, clubIds, clubs } from "@hongpung/UserType";
import { useEffect, useRef, useState } from "react";
import { Animated, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableWithoutFeedback, View, Text, Pressable, ScrollView, Modal, ActivityIndicator, Dimensions } from "react-native";
import { useSignUp } from "../context/SignUpContext";
import LongButton from "@hongpung/components/buttons/LongButton";
import ShortButton from "@hongpung/components/buttons/ShortButton";
import { showSignUpCompleteToast } from "../toasts/sign-up-toast";
import { useNavigation } from "@react-navigation/native";
import { Icons } from "@hongpung/components/Icon";

const { width } = Dimensions.get('window');

interface ClubSeletorProps {

    club: Club | null,
    setClub: (club: Club) => void,
    isValidClub: boolean,
    setSelectClubVisible: (value: boolean) => void,
    onSelectClub: boolean,
    setClubisValid: (value: boolean) => void,

}

interface SelectorProps<T> {
    label: string
    value: T | null
    onChange: (newValue: T) => void
    trriger: () => void
    options: T[]
}

const SelectorLable: React.FC<{ label: string, value: string | null }> = ({ label, value }) => {
    return (
        <View style={{ width: '100%', paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderRadius: 20 }}>
            {
                value ?
                    <Text>{value}</Text>
                    :
                    <Text>{label}</Text>
            }
        </View>
    )
}

const Selector: React.FC<SelectorProps<string>> = ({ label, value, onChange, trriger, options }) => {
    return (
        <View>
            {/* input */}
            <SelectorLable label={label} value={value}/>
        </View>
    )
}

const ClubSeletor: React.FC<ClubSeletorProps> = ({ club, setClub, isValidClub, setSelectClubVisible, onSelectClub, setClubisValid }) => {
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
            toValue: club ? 1 : 0,
            duration: 100,
            useNativeDriver: false,
        }).start();
    }, [club]);


    return (
        <React.Fragment>
            <Pressable style={[styles.inputGroup, { width: 142, zIndex: 0 }]}
                onPress={() => { Keyboard.dismiss(); setSelectClubVisible(true); }}>

                <Animated.Text style={[styles.labelText, labelStyle]}>{'동아리'}
                    {!club && <Text style={{ color: 'red' }}>*</Text>}</Animated.Text>

                <View style={[styles.InputBox, { flexDirection: 'row', justifyContent: 'space-between', width: 126, alignItems: 'center' }]}>
                    <Text style={[styles.InputText, club == null && { color: Color['grey300'] }]}>{club ?? '동아리 선택'}</Text>
                    <Icons name='caret-down' color={Color['green500']} size={20} />
                </View>

                <View style={[styles.underline, { borderBottomColor: isValidClub ? Color["green500"] : Color["red500"], width: 142 }]} />
                {!isValidClub ? <Text style={styles.errorText}>{'동아리를 선택해주세요'}</Text> : null}
            </Pressable>
            {
                onSelectClub && <View style={{
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
                                <Text style={[{ fontFamily: "NanumSquareNeo-Regular", fontSize: 16, color: club == item ? Color['green600'] : Color['grey400'] }]}>{item}</Text>
                                {club == item && <Icons name='checkmark' color={Color['green500']} size={20} />}
                            </Pressable>
                        )
                    })}</ScrollView>
                </View>
            }
        </React.Fragment>
    )
}

export const PersonalInformationCheck: React.FC = () => {

    const navigation = useNavigation();

    const { signUpInfo, setClub, setEnrollmentNumber, setName, setNickName } = useSignUp();
    const { club, enrollmentNumber, nickname, name } = signUpInfo;

    const [isLoading, setLoading] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [onSelectClub, setSelectClubVisible] = useState(false);
    const [isValidClub, setClubisValid] = useState(true)

    const enrollmentNumberRef = useRef<any | null>(null);
    const nameRef = useRef<any | null>(null);

    const dropdownCloseHandler = () => {
        if (onSelectClub) club ? setClubisValid(true) : setClubisValid(false)
        setSelectClubVisible(false)
    }

    useEffect(() => {

    }, [enrollmentNumber])

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


    return (
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); dropdownCloseHandler() }} >
            <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#FFF" }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}>
                <ScrollView contentContainerStyle={{ flex: 1, flexGrow: 1, backgroundColor: "#FFF" }}>
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
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', zIndex: 1, width: 300, alignSelf: 'center' }}>
                            <ClubSeletor
                                club={club}
                                setClub={setClub}
                                isValidClub={isValidClub}
                                setClubisValid={setClubisValid}
                                onSelectClub={onSelectClub}
                                setSelectClubVisible={setSelectClubVisible}
                            />
                            <InputComponent
                                ref={enrollmentNumberRef}
                                label='학번'
                                length={126}
                                inputValue={enrollmentNumber ?? ''}
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
                                            const newCondition = regex.test(enrollmentNumber ?? '');
                                            return newCondition;
                                        },
                                        errorText: "두 자리가 필요해요"
                                    }]}
                            />
                        </View>
                        <View style={{ marginTop: 24, width: 300, alignSelf: 'center' }}>
                            <InputComponent
                                ref={nameRef}
                                label='이름(본명)'
                                color={'green'}
                                inputValue={name ?? ''}
                                setInputValue={setName}
                                isEditible={true}
                                isRequiredMark={true}
                                onFocus={dropdownCloseHandler}
                            />
                        </View>


                        <View style={{ marginTop: 24, width: 300, alignSelf: 'center' }}>
                            <InputComponent
                                label='패명'
                                color={'green'}
                                inputValue={nickname ?? ''}
                                setInputValue={setNickName}
                                isEditible={true}
                                isRequired={false}
                                onFocus={dropdownCloseHandler}
                            />
                        </View>
                    </View>
                    <View style={[{ paddingHorizontal: 12, marginTop: 24 }]}>
                        <LongButton
                            color={'green'}
                            innerText='회원가입 신청'
                            isAble={club != null && name.length > 0 && enrollmentNumber.length > 0}
                            onPress={() => {
                                if (!signUpInfo.club) setClubisValid(false);
                                else if (!enrollmentNumberRef.current?.validate()) enrollmentNumberRef.current?.focus();
                                else if (!nameRef.current?.validate()) nameRef.current?.focus();
                                else if (!signUpInfo.nickname) setAlertVisible(true);
                                else { SignUp() }
                            }
                            }
                        />
                    </View>
                    <Modal visible={isLoading} transparent>
                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' }}>
                            <ActivityIndicator color={'#FFFFF'} size={'large'} />
                        </View>
                    </Modal>
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
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}

export default PersonalInformationCheck;

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