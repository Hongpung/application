import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Color } from '../ColorSet'
import { HomeStackParamList } from './pageTypes';
import { NativeStackScreenProps } from '@react-navigation/native-stack';


type MyPageProps = NativeStackScreenProps<HomeStackParamList,'MyPage'>;

const MyClubScreen: React.FC<MyPageProps> = ({navigation}) => {
    type subMenu = {
        name:string,
        link:string
    }
    const myActivities:subMenu[] = [{name:'내 일정', link:'MySchedules'},{name:'내 활동', link:''},{name:'내 배지', link:'MyBadges'},]
    const Settings:subMenu[] = [{name:'알림 설정', link:''},{name:'로그인 설정', link:''},{name:'암호 잠금', link:''}, {name:'앱 설정', link:''},]

    return (
        <ScrollView style={styles.container}>
            <View style={{ flex: 1, alignItems: 'center' }}>
                <ProfileBox isCard={false} />
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', height: 20, justifyContent: 'flex-start', marginLeft: -8, marginTop: 20, marginBottom: 16 }}>
                        <Text style={{ fontSize: 18, color: Color['grey700'], fontFamily: "NanumSquareNeo-Bold", textAlign: 'left' }}>활동 내역</Text>
                    </View>
                    {myActivities.map((subMenu: subMenu, index: number) => {
                        return (<Pressable key={subMenu.name + index} style={{ width: 312, flexDirection: 'row', justifyContent: 'space-between',marginVertical: 6 , padding:6  }} onPress={()=>{navigation.push(subMenu.link)}}>
                            <Text style={{ fontSize: 16, color: Color['grey400'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'left' }}>{subMenu.name}</Text><Text style={{ fontSize: 16, color: Color['grey500'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'right' }}>{'>'}</Text>
                        </Pressable>)
                    })}
                    <View style={{ flexDirection: 'row', height: 20, justifyContent: 'flex-start', marginLeft: -8, marginTop: 20, marginBottom: 16 }}>
                        <Text style={{ fontSize: 18, color: Color['grey700'], fontFamily: "NanumSquareNeo-Bold", textAlign: 'left' }}>내 설정</Text>
                    </View>
                    {Settings.map((submenu: subMenu, index: number) => {
                        return (<Pressable key={submenu.name + index} style={{ width: 312, flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6 , padding:6 }} onPress={()=>{navigation.push(submenu.link)}}>
                            <Text style={{ fontSize: 16, color: Color['grey400'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'left' }}>{submenu.name}</Text><Text style={{ fontSize: 16, color: Color['grey500'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'right' }}>{'>'}</Text>
                        </Pressable>)
                    })}
                </View>

            </View>
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


const ProfileBox: React.FC<ProfileBoxPropsP> = ({ isCard }) => {
    return (
        <View style={[styles.ProfileContainer, isCard ? { borderWidth: 1, borderColor: Color['grey200'] } : null]}>
            <View style={{ width: 304, flex: 1, marginHorizontal: 24, marginTop: 24 }}>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <View style={styles.ProfilePhoto} />
                    <View style={{
                        flex: 1,
                        height: 120,
                    }}>
                        <View style={{ flexDirection: 'row', height: 80, justifyContent: 'space-between' }} >
                            <View style={{ flexDirection: 'row', width: 64, justifyContent: 'space-between' }}>
                                <View style={styles.icons}>
                                </View>
                                <View style={styles.icons}>
                                </View>
                            </View>
                            <View style={styles.Badge} />
                        </View>
                        <View style={{ height: 40 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 20, alignItems: 'flex-end', width: 200, marginBottom: 6 }}>
                                <Text style={{ fontSize: 18, fontFamily: "NanumSquareNeo-Regular", color: Color['grey700'] }}>Lv.1</Text>
                                <Text style={{ fontSize: 10, textAlign: 'right', fontFamily: "NanumSquareNeo-Regular", color: Color['grey400'] }}>12/20</Text>
                            </View>
                            <View style={{ height: 8 }}>
                                <View style={{ position: 'absolute', width: 200, height: 8, borderColor: Color['blue500'], borderWidth: 1, borderRadius: 2 }}></View>
                                <View style={{ position: 'absolute', width: 120, height: 8, backgroundColor: Color['blue500'], borderTopLeftRadius: 2, borderBottomLeftRadius: 2 }}></View>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 1, alignItems: 'center', marginTop: 8 }}>

                    <View style={{ width: 300, flexDirection: 'row', justifyContent: 'space-between', marginVertical: 12 }}>
                        <Text style={{ fontSize: 16, color: Color['grey400'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'left' }}>이름(패명)</Text><Text style={{ fontSize: 16, color: Color['grey700'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'right' }}>홍길동(길동색시)</Text>
                    </View>
                    <View style={{ width: 300, flexDirection: 'row', justifyContent: 'space-between', marginVertical: 12 }}>
                        <Text style={{ fontSize: 16, color: Color['grey400'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'left' }}>동아리(학번)</Text><Text style={{ fontSize: 16, color: Color['grey700'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'right' }}>산틀(18)</Text>
                    </View>
                    <View style={{ width: 300, flexDirection: 'row', justifyContent: 'space-between', marginVertical: 12 }}>
                        <Text style={{ fontSize: 16, color: Color['grey400'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'left' }}>직급</Text><Text style={{ fontSize: 16, color: Color['blue500'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'right', }}>동아리원</Text>
                    </View>

                </View>
            </View>
        </View>
    )
}

export default MyClubScreen

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
    }, ProfilePhoto: {
        width: 90,
        height: 120,
        borderRadius: 5,
        backgroundColor: Color['grey200'],
        marginRight: 16
    }, icons: {
        width: 28,
        height: 28,
        backgroundColor: Color['grey200']
    }, Badge: {
        width: 80,
        height: 80,
        borderRadius: 100,
        borderWidth: 1
    }, footer: {
        flex: 1,
        backgroundColor: Color['grey100'],
        alignItems: 'center',
        height: 200,
        paddingTop: 32,
        marginTop: 32
    }
})