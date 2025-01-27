import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { Color } from '@hongpung/ColorSet'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ProfileBoxCard from "@hongpung/components/cards/ProfileBoxCard";
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Icons } from '@hongpung/components/common/Icon';
import { MyPageParamList } from '@hongpung/nav/MyPageStack';
import { useAuth } from '@hongpung/hoc/useAuth';
import { MainStackParamList, ScreenParams } from '@hongpung/nav/HomeStacks';


type MyPageProps = NativeStackNavigationProp<MainStackParamList, 'BottomTab'>;

const MyPageScreen: React.FC = () => {

    const isFocusing = useIsFocused()
    const navigation = useNavigation<MyPageProps>();

    const { loadUserState, loginUser } = useAuth()
    type subMenu = {
        name: string,
        link: keyof MyPageParamList
    }
    const myActivities: subMenu[] = useMemo(() => [{ name: '내 일정', link: 'MySchedules' }, { name: '내 활동', link: 'MyPractices' },], [])
    const Settings: subMenu[] = useMemo(() => [
        { name: '알림 설정', link: 'NotificationSetting' },
        { name: '로그인 설정', link: 'LoginSetting' },
        // { name: '암호 잠금', link: '' }, { name: '앱 설정', link: '' }, //추후 설정
    ], [])

    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        loadUserState()
        const checkUser = async () => {
            try {
                setLoading(false)
                console.log(loginUser, 'fetch', isLoading)

            }
            catch (e) {
                console.error(e)
            }
        }
        checkUser();
    }, [isFocusing])


    // if (isLoading)
    //     return (
    //         <View style={styles.container}>
    //             <ActivityIndicator size={'large'} color={'#fff'} />
    //         </View>
    //     )
    if (!loginUser) return (<View></View>)

    return (
        <ScrollView style={styles.container}>
            <ProfileBoxCard
                user={{
                    ...loginUser
                }}
            />
            <View style={{ flexDirection: 'row', height: 20, justifyContent: 'flex-start', marginTop: 20, marginBottom: 16, marginHorizontal: 24 }}>
                <Text style={{ fontSize: 18, color: Color['grey700'], fontFamily: "NanumSquareNeo-Bold", textAlign: 'left' }}>활동 내역</Text>
            </View>
            {myActivities.map((subMenu: subMenu, index: number) => {
                return (<Pressable key={subMenu.name + index} style={styles.subMenu} onPress={() => { navigation.push('MyPage', { screen: subMenu.link } as ScreenParams<MyPageParamList>) }}>
                    <Text style={styles.subMenuTitle}>{subMenu.name}</Text>
                    <Icons size={20} name='chevron-forward' color={Color['grey400']} />
                </Pressable>)
            })}
            <View style={{ flexDirection: 'row', height: 20, justifyContent: 'flex-start', marginTop: 20, marginBottom: 16, marginHorizontal: 24 }}>
                <Text style={{ fontSize: 18, color: Color['grey700'], fontFamily: "NanumSquareNeo-Bold", textAlign: 'left' }}>내 설정</Text>
            </View>
            {Settings.map((subMenu: subMenu, index: number) => {
                return (<Pressable key={subMenu.name + index} style={styles.subMenu} onPress={() => { navigation.push('MyPage', { screen: subMenu.link } as ScreenParams<MyPageParamList>) }}>
                    <Text style={styles.subMenuTitle}>{subMenu.name}</Text>
                    <Icons size={20} name='chevron-forward' color={Color['grey400']} />
                </Pressable>)
            })}
            <View style={styles.footer}>
                <Pressable style={{ paddingBottom: 1, borderBottomWidth: 1, borderBottomColor: Color['grey300'], alignItems: 'center' }}
                    onPress={() => { navigation.push('MyPage', { screen: 'ChangeMyInfo' }) }}>
                    <Text style={{ fontFamily: "NanumSquareNeo-Regular", color: Color['grey400'], textAlign: 'center' }}>개인 정보 수정</Text>
                </Pressable>
                <Pressable style={{ paddingBottom: 1, borderBottomWidth: 1, borderBottomColor: Color['grey300'], alignItems: 'center' }}
                    onPress={() => { navigation.push('MyPage', { screen: 'ChangePassword' }) }}>
                    <Text style={{ fontFamily: "NanumSquareNeo-Regular", color: Color['grey400'], textAlign: 'center' }}>비밀 번호 수정</Text>
                </Pressable>
                <Pressable style={{ paddingBottom: 1, borderBottomWidth: 1, borderBottomColor: Color['grey300'], alignItems: 'center' }}>
                    <Text style={{ fontFamily: "NanumSquareNeo-Regular", color: Color['grey400'], textAlign: 'center' }}>회원탈퇴를 원하시나요?</Text>
                </Pressable>
            </View>
        </ScrollView>
    )
}

export default MyPageScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        backgroundColor: 'white',
    },
    ProfileContainer: {
        flex: 1,
        height: 292,
        borderRadius: 15,
        backgroundColor: 'white',
        width: 352,
    },
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
    Badge: {
        width: 80,
        height: 80,
        borderRadius: 100,
    },
    footer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        backgroundColor: Color['grey100'],
        alignItems: 'center',
        height: 200,
        paddingTop: 32,
        marginTop: 32
    },
    info: {
        width: 300,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 12,
    },
    subMenu: {
        marginHorizontal: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 4,
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