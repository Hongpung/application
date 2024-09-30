import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import { Color } from '../../../ColorSet'
import { HomeStackParamList } from '../../../pageTypes';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ProfileBoxCard from "../../../components/cards/PrifileBoxCard";
import useFetch from '@hongpung/hoc/useFetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@hongpung/context/AuthContext';


type MyPageProps = NativeStackScreenProps<HomeStackParamList, 'MyPageHome'>;

const MyPageScreen: React.FC<MyPageProps> = ({ navigation }) => {
    type subMenu = {
        name: string,
        link: string
    }
    const myActivities: subMenu[] = [{ name: '내 일정', link: 'MySchedules' }, { name: '내 활동', link: 'MyPractices' }, { name: '내 배지', link: 'MyBadges' },]
    const Settings: subMenu[] = [{ name: '알림 설정', link: 'NotificationSetting' }, { name: '로그인 설정', link: 'LoginSetting' }, { name: '암호 잠금', link: '' }, { name: '앱 설정', link: '' },]
    const { token } = useAuth();

    const { data, loading, error } = useFetch<any>(
        token ? `${process.env.BASE_URL}/member/status` : ``,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // 토큰을 Authorization 헤더에 추가
            }
        }, 2000, [token]
    );

    return (
        <ScrollView style={styles.container}>
            <Modal visible={loading} transparent={true}>
                <View style={{ flex: 1, display: 'flex', backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size={'large'} color={'#FFF'} />
                </View>
            </Modal>
            <ProfileBoxCard
                isCard={false}
                user={{
                    club: data?.club,
                    name: data?.name,
                    grade: data?.enrollmentNumber,
                    nickname: data?.nickname,
                    addRole: data?.role,
                    instrument: '장구'
                }}
            />
            <View style={{ flexDirection: 'row', height: 20, justifyContent: 'flex-start', marginTop: 20, marginBottom: 16, marginHorizontal: 24 }}>
                <Text style={{ fontSize: 18, color: Color['grey700'], fontFamily: "NanumSquareNeo-Bold", textAlign: 'left' }}>활동 내역</Text>
            </View>
            {myActivities.map((subMenu: subMenu, index: number) => {
                return (<Pressable key={subMenu.name + index} style={styles.subMenu} onPress={() => { navigation.push(subMenu.link) }}>
                    <Text style={styles.subMenuTitle}>{subMenu.name}</Text><Text style={styles.subMenuArrow}>{'>'}</Text>
                </Pressable>)
            })}
            <View style={{ flexDirection: 'row', height: 20, justifyContent: 'flex-start', marginTop: 20, marginBottom: 16, marginHorizontal: 24 }}>
                <Text style={{ fontSize: 18, color: Color['grey700'], fontFamily: "NanumSquareNeo-Bold", textAlign: 'left' }}>내 설정</Text>
            </View>
            {Settings.map((submenu: subMenu, index: number) => {
                return (<Pressable key={submenu.name + index} style={styles.subMenu} onPress={() => { navigation.push(submenu.link) }}>
                    <Text style={styles.subMenuTitle}>{submenu.name}</Text><Text style={styles.subMenuArrow}>{'>'}</Text>
                </Pressable>)
            })}
            <View style={styles.footer}>
                <Pressable style={{ paddingBottom: 1, borderBottomWidth: 1, borderBottomColor: Color['grey300'], marginVertical: 14, alignItems: 'center' }}>
                    <Text style={{ fontFamily: "NanumSquareNeo-Regular", color: Color['grey400'], textAlign: 'center' }}>개인 정보 수정</Text>
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