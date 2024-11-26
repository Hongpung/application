import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useMemo } from 'react'
import { Color } from '../../../ColorSet'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ProfileMiniCard from '../../../components/cards/ProfileMiniCard'
import { UserProvider } from '../../../context/UserContext';
import { UserModal } from './ClubMember/ClubMemeberScreen';
import { throttle } from 'lodash';
import { Icons } from '@hongpung/components/Icon';
import { MyClubStackStackParamList } from '@hongpung/nav/MyClubStack';


type MyClubProps = NativeStackScreenProps<MyClubStackStackParamList, 'MyClubHome'>;

const MyClubScreen: React.FC<MyClubProps> = ({ navigation }) => {

    const throttledNavigation = useMemo(
        () =>
            throttle((ScreenName: any) => {
                navigation.push(ScreenName);  // 원하는 화면으로 navigation
            }, 2000,
                { leading: true, trailing: false }),
        [navigation]
    );
    interface subMenu {
        name: string,
        link: string
    }

    const manageClubMenu: subMenu[] = [{ name: '부원 관리', link: 'ClubMembers' }, { name: '악기 관리', link: 'Instruments' }, { name: '연습 기록 보기', link: 'ClubCalendar' },]


    return (
        <UserProvider>
            <ScrollView style={styles.container}>
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <View style={{ width: 96, height: 96, marginTop: 24, borderRadius: 25, backgroundColor: `grey` }} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ height: 10 }} />
                        <View style={styles.info}>
                            <Text style={{ fontSize: 16, color: Color['grey400'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'left' }}>상쇠</Text>
                            <Text style={{ fontSize: 16, color: Color['grey700'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'right' }}>홍길동(길동색시)</Text>
                        </View>
                        <View style={styles.info}>
                            <Text style={{ fontSize: 16, color: Color['grey400'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'left' }}>패짱</Text>
                            <Text style={{ fontSize: 16, color: Color['grey700'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'right' }}>임꺽정</Text>
                        </View>
                        <View style={{ marginHorizontal: 24, flexDirection: 'row', height: 20, alignSelf: 'flex-start', alignItems: 'flex-end', justifyContent: 'flex-start', marginTop: 20, marginBottom: 16 }}>
                            <Text style={{ fontSize: 18, color: Color['grey700'], fontFamily: "NanumSquareNeo-Bold", textAlign: 'left' }}>동아리 관리</Text>
                        </View>

                        {manageClubMenu.map((subMenu: subMenu, index: number) => {
                            return (<Pressable key={subMenu.name + index} style={styles.subMenu} onPress={() => { throttledNavigation(subMenu.link) }}>
                                <Text style={styles.subMenuTitle}>{subMenu.name}</Text>
                                <Icons size={20} name='chevron-forward' color={Color['grey400']} />
                            </Pressable>)
                        })}
                        
                    </View>

                </View>
                <View style={styles.footer}>
                    <Pressable style={{ paddingBottom: 1, borderBottomWidth: 1, borderBottomColor: Color['grey300'], alignItems: 'center' }}>
                        <Text style={{ fontFamily: "NanumSquareNeo-Regular", color: Color['grey400'], textAlign: 'center' }}>동아리 정보 변경을 원하시나요?</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </UserProvider>
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
    info: { marginHorizontal: 40, flexDirection: 'row', justifyContent: 'space-between', marginVertical: 12 },
    subMenu: { marginHorizontal: 40, flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4, paddingVertical: 8, },
    subMenuTitle: { fontSize: 16, color: Color['grey500'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'left' },
    subMenuArrow: { fontSize: 16, color: Color['grey500'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'right' }
})