import React, { useState } from "react"
import { View, Text, Image, StyleSheet, Pressable, Linking } from "react-native"

import { Color } from "../../ColorSet"
import { User } from "../../UserType"


interface ProfileBoxProps {
    isCard: boolean,
    user: User
}

const ProfileBoxCard: React.FC<ProfileBoxProps> = ({ isCard, user }) => {
    const [loading, setLoading] = useState(true);

    const RoleTextRender = () => {
        if (user.isCapt) return "패짱"
        if (user.addRole) { return user.addRole }
        return "동아리원"
    }

    if (!user) return;
    return (
        <View style={[styles.ProfileContainer, isCard ? { marginHorizontal: 0, paddingHorizontal: 8, paddingVertical: 8 } : null]}>
            <View style={{ flex: 1, marginHorizontal: 12, marginTop: 24 }}>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    {user.ProfileUri ?
                        <Image source={{ uri: user.ProfileUri }} style={styles.ProfilePhoto} /> :
                        <View style={[styles.ProfilePhoto, { backgroundColor: Color['grey200'], borderWidth:1, borderColor:Color['grey300']}]} />}
                    <View style={{
                        flex: 1,
                        height: 120,
                    }}>
                        <View style={{ flexDirection: 'row', height: 80, justifyContent: 'space-between' }} >
                            <View style={{ flexDirection: 'row', width: 64, justifyContent: 'space-between' }}>
                                <Pressable style={styles.icons}
                                    onPress={() => {
                                        Linking.openURL('https://www.instagram.com/younho10.3/')
                                            .catch((err) => { console.error('Failed to open URL:', err); })
                                    }}>
                                    <Text>insta</Text>
                                </Pressable>
                            </View>
                            {user?.badge && <View style={styles.Badge}>
                                <Image
                                    source={{ uri: user.badge }}
                                    style={styles.Badge}
                                    onLoadEnd={() => setLoading(false)} />
                            </View>}
                        </View>
                        <View style={{ height: 40 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 20, alignItems: 'flex-end', marginBottom: 6 }}>
                                <Text style={{ fontSize: 18, fontFamily: "NanumSquareNeo-Regular", color: Color['grey700'] }}>Lv.1</Text>
                                <Text style={{ fontSize: 10, textAlign: 'right', fontFamily: "NanumSquareNeo-Regular", color: Color['grey400'] }}>12/20</Text>
                            </View>
                            <View style={{ height: 8, marginHorizontal: 0, borderColor: Color['blue500'], borderWidth: 0.5, borderRadius: 2, overflow: 'hidden' }}>
                                <View style={{ position: "absolute", height: 8, paddingRight: 36, left: 0, backgroundColor: Color['blue500'] }}></View>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ height: 8 }} />
                <View style={styles.info}>
                    <Text style={{ fontSize: 16, color: Color['grey400'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'left' }}>이름(패명)</Text><Text style={{ fontSize: 16, color: Color['grey700'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'right' }}>{user.name}{user.nickname ? `(${user.nickname})` : ''}</Text>
                </View>
                <View style={styles.info}>
                    <Text style={{ fontSize: 16, color: Color['grey400'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'left' }}>동아리(학번)</Text><Text style={{ fontSize: 16, color: Color['grey700'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'right' }}>{user.club + `(${user.grade})`}</Text>
                </View>
                <View style={styles.info}>
                    <Text style={{ fontSize: 16, color: Color['grey400'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'left' }}>역할</Text><Text style={{ fontSize: 16, fontFamily: "NanumSquareNeo-Bold", textAlign: 'right', color: user.addRole == '상쇠' ? Color['red500'] : Color['blue500'], }}>{RoleTextRender()}</Text>
                </View>

            </View>
        </View>
    )
}

export default ProfileBoxCard;

const styles = StyleSheet.create({
    ProfileContainer: {
        flex: 1,
        height: 292,
        borderRadius: 15,
        backgroundColor: 'white',
        marginHorizontal: 24
    }, ProfilePhoto: {
        width: 90,
        height: 120,
        borderRadius: 5,
        marginRight: 16
    }, icons: {
        width: 28,
        height: 28,
        backgroundColor: Color['grey200']
    }, Badge: {
        width: 80,
        height: 80,
        borderRadius: 100,
    }, footer: {
        flex: 1,
        backgroundColor: Color['grey100'],
        alignItems: 'center',
        height: 200,
        paddingTop: 32,
        marginTop: 32
    }, info: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 12
    },
    subMenu: {
        width: 312,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 4,
        paddingVertical: 8,
    },
    subMenuTitle: {
        fontSize: 16,
        color: Color['grey500'],
        fontFamily: "NanumSquareNeo-Regular",
        textAlign: 'left'
    },
    subMenuArrow: {
        fontSize: 16,
        color: Color['grey500'],
        fontFamily: "NanumSquareNeo-Regular",
        textAlign: 'right'
    }
})