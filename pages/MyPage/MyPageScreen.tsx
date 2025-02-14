import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useMemo } from 'react'
import { Color } from '@hongpung/ColorSet'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ProfileBoxCard from "@hongpung/components/cards/ProfileBoxCard";
import { StackActions, useIsFocused, useNavigation } from '@react-navigation/native';
import { Icons } from '@hongpung/src/common/components/Icons/Icon';
import { MyPageParamList } from '@hongpung/nav/MyPageStack';
import { MainStackParamList, ScreenParams } from '@hongpung/nav/HomeStacks';
import { useRecoilValue } from 'recoil';
import { loginUserState } from '@hongpung/recoil/authState';


type MyPageProps = NativeStackNavigationProp<MainStackParamList, 'BottomTab'>;

const MyPageScreen: React.FC = () => {

    const isFocusing = useIsFocused()
    const navigation = useNavigation<MyPageProps>();

    const loginUser = useRecoilValue(loginUserState)
    type subMenu = {
        name: string,
        link: keyof MyPageParamList
    }

    const myActivities: subMenu[] = useMemo(() => [{ name: '다가오는 일정', link: 'MySchedules' }, { name: '내 활동', link: 'MyPractices' },], [])

    const settings: subMenu[] = useMemo(() => [
        { name: '알림 설정', link: 'NotificationSetting' },
        { name: '로그인 설정', link: 'LoginSetting' },
        // { name: '암호 잠금', link: '' }, { name: '앱 설정', link: '' }, //추후 설정
    ], [])

    if (!loginUser && isFocusing) {
        Alert.alert('오류', '로그인 정보가 존재하지 않습니다.\n다시 로그인 해주세요.')
        navigation.dispatch(StackActions.replace('Login'))
        return (<View></View>)
    }

    if (!loginUser) {
        return (<View></View>)
    }

    return (
        <ScrollView bounces={false}>
            <View style={{ backgroundColor: '#FFF', flexDirection: 'column', gap: 20, paddingTop: 12, paddingBottom: 24 }}>
                <View>
                    <ProfileBoxCard
                        user={{
                            ...loginUser
                        }}
                    />
                </View>

                <View style={{ gap: 16 }}>
                    <View style={{ flexDirection: 'row', height: 20, justifyContent: 'flex-start', marginHorizontal: 24 }}>
                        <Text style={{ fontSize: 18, color: Color['grey700'], fontFamily: "NanumSquareNeo-Bold", textAlign: 'left' }}>활동 내역</Text>
                    </View>
                    <View style={{ gap: 4 }}>
                        {myActivities.map((subMenu, index) => {
                            return (
                                <Pressable key={subMenu.name + index} style={styles.subMenu} onPress={() => { navigation.push('MyPage', { screen: subMenu.link } as ScreenParams<MyPageParamList>) }}>
                                    <Text style={styles.subMenuTitle}>{subMenu.name}</Text>
                                    <Icons size={20} name='chevron-forward' color={Color['grey400']} />
                                </Pressable>)
                        })}
                    </View>
                </View>

                <View style={{ gap: 16 }}>
                    <View style={{ flexDirection: 'row', height: 20, justifyContent: 'flex-start', marginHorizontal: 24 }}>
                        <Text style={{ fontSize: 18, color: Color['grey700'], fontFamily: "NanumSquareNeo-Bold", textAlign: 'left' }}>내 설정</Text>
                    </View>
                    <View style={{ gap: 4 }}>
                        {settings.map((subMenu, index) => {
                            return (
                                <Pressable key={subMenu.name + index} style={styles.subMenu} onPress={() => { navigation.push('MyPage', { screen: subMenu.link } as ScreenParams<MyPageParamList>) }}>
                                    <Text style={styles.subMenuTitle}>{subMenu.name}</Text>
                                    <Icons size={20} name='chevron-forward' color={Color['grey400']} />
                                </Pressable>)
                        })}
                    </View>
                </View>
            </View>


            <View style={styles.footer}>
                <Pressable style={{ paddingBottom: 1, borderBottomWidth: 1, borderBottomColor: Color['grey300'], alignItems: 'center' }}
                    onPress={() => { navigation.push('MyPage', { screen: 'ChangeMyInfo' }) }}>
                    <Text style={{ fontFamily: "NanumSquareNeo-Regular", color: Color['grey400'], textAlign: 'center' }}>개인 정보 수정</Text>
                </Pressable>
                <Pressable style={{ paddingBottom: 1, borderBottomWidth: 1, borderBottomColor: Color['grey300'], alignItems: 'center' }}
                    onPress={() => { navigation.push('MyPage', { screen: 'ChangePassword' }) }}>
                    <Text style={{ fontFamily: "NanumSquareNeo-Regular", color: Color['grey400'], textAlign: 'center' }}>비밀 번호 수정</Text>
                </Pressable>
                <Pressable style={{ paddingBottom: 1, borderBottomWidth: 1, borderBottomColor: Color['grey300'], alignItems: 'center' }}
                    onPress={() => { navigation.push('MyPage', { screen: 'WithdrawalAuth' }) }}>
                    <Text style={{ fontFamily: "NanumSquareNeo-Regular", color: Color['grey400'], textAlign: 'center' }}>회원탈퇴를 원하시나요?</Text>
                </Pressable>
            </View>
        </ScrollView>
    )
}

export default MyPageScreen

const styles = StyleSheet.create({
    ProfilePhoto: {
        width: 90,
        height: 120,
        borderRadius: 5,
        backgroundColor: Color['grey200'],
        marginRight: 16
    },
    icons: {
        width: 28,
        height: 28,
        backgroundColor: Color['grey200']
    },
    footer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        backgroundColor: Color['grey200'],
        alignItems: 'center',
        paddingTop: 32,
        paddingBottom: 84
    },
    info: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 12,
    },
    subMenu: {
        marginHorizontal: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    subMenuTitle: {
        fontSize: 16,
        color: Color['grey500'],
        fontFamily: "NanumSquareNeo-Regular",
        textAlign: 'left',
    },
    subMenuArrow: {
        fontSize: 16,
        color: Color['grey500'],
        fontFamily: "NanumSquareNeo-Regular",
        textAlign: 'right',
    }

})