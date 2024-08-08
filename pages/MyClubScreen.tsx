import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Color } from '../ColorSet'
import { HomeStackParamList } from './pageTypes';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ProfileMiniCard from '../components/cards/ProfileMiniCard'


type MyClubProps = NativeStackScreenProps<HomeStackParamList, 'MyClub'>;

const MyClubScreen: React.FC<MyClubProps> = ({ navigation }) => {
    type subMenu = {
        name: string,
        link: string
    }
    const manageClubMenu: subMenu[] = [{ name: '부원 관리', link: 'MySchedules' }, { name: '악기 관리', link: '' }, { name: '연습 기록 보기', link: 'MyBadges' },]

    return (
        <ScrollView style={styles.container}>
            <View style={{ flex: 1, alignItems: 'center' }}>
                <View style={{ width: 96, height: 96, marginTop: 24, borderRadius: 25, backgroundColor: `grey` }} />
                <View style={{ flex: 1 }}>
                    <View style={{ paddingVertical: 10 }} />
                    <View style={styles.info}>
                        <Text style={{ fontSize: 16, color: Color['grey400'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'left' }}>상쇠</Text><Text style={{ fontSize: 16, color: Color['grey700'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'right' }}>홍길동(길동색시)</Text>
                    </View>
                    <View style={styles.info}>
                        <Text style={{ fontSize: 16, color: Color['grey400'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'left' }}>패짱</Text><Text style={{ fontSize: 16, color: Color['grey700'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'right' }}>임꺽정</Text>
                    </View>
                    <View style={{ flexDirection: 'row', height: 20, justifyContent: 'flex-start', marginLeft: -8, marginTop: 20, marginBottom: 16 }}>
                        <Text style={{ fontSize: 18, color: Color['grey700'], fontFamily: "NanumSquareNeo-Bold", textAlign: 'left' }}>동아리 관리</Text>
                    </View>
                    {manageClubMenu.map((subMenu: subMenu, index: number) => {
                        return (<Pressable key={subMenu.name + index} style={styles.subMenu} onPress={() => { navigation.push(subMenu.link) }}>
                            <Text style={styles.subMenuTitle}>{subMenu.name}</Text><Text style={styles.subMenuArrow}>{'>'}</Text>
                        </Pressable>)
                    })}
                    <View style={{ justifyContent: 'space-between', height: 36, marginLeft: -8, marginTop: 20, marginBottom: 4 }}>
                        <Text style={{ fontSize: 18, color: Color['grey700'], fontFamily: "NanumSquareNeo-Bold", textAlign: 'left' }}>활동 우수자</Text>
                        <Text style={{ fontSize: 12, color: Color['grey400'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'left' }}>최근 30일의 기록으로 선정해요.</Text>
                    </View>
                    <View style={{ marginVertical: 12 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                            <Text style={{ fontSize: 18, color: Color['grey500'], fontFamily: "NanumSquareNeo-Bold", textAlign: 'left' }}>출석 1위</Text>
                            <Text style={{ fontSize: 14, color: Color['grey400'], fontFamily: "NanumSquareNeo-Light", textAlign: 'left', marginLeft: 8 }}>{`자세히 보기 >`}</Text>
                        </View>
                        <View style={{height:12}}/>
                        <ProfileMiniCard
                            name='홍길동'
                            NickName='길동색시'
                            isPicked={false}
                            view='inClubView'
                            addtionalRole='상장구'
                        />
                    </View>
                    <View style={{ marginVertical: 12 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                            <Text style={{ fontSize: 18, color: Color['grey500'], fontFamily: "NanumSquareNeo-Bold", textAlign: 'left' }}>예약 1위</Text>
                            <Text style={{ fontSize: 14, color: Color['grey400'], fontFamily: "NanumSquareNeo-Light", textAlign: 'left', marginLeft: 8 }}>{`자세히 보기 >`}</Text>
                        </View>
                        <View style={{height:12}}/>
                        <ProfileMiniCard
                            name='임꺽정'
                            isCapt={true}
                            NickName='길동색시'
                            isPicked={false}
                            view='inClubView'
                            addtionalRole='상쇠'
                        />
                    </View>
                </View>

            </View>
            <View style={styles.footer}>
                <Pressable style={{ paddingBottom: 1, borderBottomWidth: 1, borderBottomColor: Color['grey300'], alignItems: 'center' }}>
                    <Text style={{ fontFamily: "NanumSquareNeo-Regular", color: Color['grey400'], textAlign: 'center' }}>동아리 정보 변경을 원하시나요?</Text>
                </Pressable>
            </View>
        </ScrollView>
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
        height: 156,
        paddingTop: 32,
        marginTop: 32
    },
    info: { width: 314, flexDirection: 'row', justifyContent: 'space-between', marginVertical: 12 },
    subMenu: { width: 312, flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4, paddingVertical: 8, },
    subMenuTitle: { fontSize: 16, color: Color['grey400'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'left' },
    subMenuArrow: { fontSize: 16, color: Color['grey500'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'right' }
})