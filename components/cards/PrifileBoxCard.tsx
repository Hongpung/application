import React, { useState } from "react"
import { View, Text, Image, StyleSheet, Pressable, Linking } from "react-native"

import { Color } from "../../ColorSet"
import { User } from "../../UserType"
import { Icons } from "../Icon"
import useFetch from "@hongpung/hoc/useFetch"


interface ProfileBoxProps {
    user: User
}

const ProfileBoxCard: React.FC<ProfileBoxProps> = ({ user }) => {

    const { data: snsData, loading, error } = useFetch<{ instagramUrl: string, blogUrl: string }>(user?`${process.env.SUB_API}/member/sns/${user?.memberId}`:null, {}, 5000, [user])

    const RoleTextRender = () => {
        if (user?.role) { return user.role }
        return "동아리원"
    }

    if (!user) return;

    return (
        <View style={{ position: 'relative', flex: 1, flexDirection: 'column', display: 'flex', marginHorizontal: 36, gap: 24, marginVertical: 16 }}>
            <View style={{ position: 'relative', flexDirection: 'row', flex: 1 }}>
                {user.profileImageUrl ?
                    <Image source={{ uri: user.profileImageUrl }} style={styles.ProfilePhoto} /> :
                    <View style={[styles.ProfilePhoto, { backgroundColor: Color['grey200'], borderWidth: 1, borderColor: Color['grey300'] }]} />}

                <View style={{ flexDirection: 'column', flex: 1, height: 120, justifyContent: 'space-between', paddingVertical: 12 }}>
                    <View style={{ display: 'flex', gap: 4 }}>
                        <Text style={{ fontSize: 16, color: Color['grey700'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'left' }}>{user.name}</Text>
                        {user?.nickname && <Text style={{ fontSize: 14, color: Color['grey400'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'left' }}>{user?.nickname}</Text>}
                    </View>
                    <View style={{ flexDirection: 'row', width: 64, justifyContent: 'flex-start', gap: 4 }}>
                        {snsData && Object.entries(snsData)?.map(([key, value]) => !!value && (
                            <Pressable style={styles.icons}
                                onPress={() => {
                                    Linking.openURL(value)
                                        .catch((err) => { console.error('Failed to open URL:', err); })
                                }}>
                                <Icons name={key == 'instagramUrl' ? "logo-instagram" : 'chatbox-outline'} size={24} color={key == 'instagramUrl' ? Color['grey400'] : Color['green500']} />
                            </Pressable>
                        ))
                        }
                    </View>
                </View>
            </View>
            <View style={styles.info}>
                <Text style={{ fontSize: 16, color: Color['grey400'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'left' }}>동아리(학번)</Text>
                <Text style={{ fontSize: 16, color: Color['grey700'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'right' }}>{`${user.club == '신명화랑' ? '신명화랑' : user.club}` + `(${user.enrollmentNumber})`}</Text>
            </View>
            <View style={styles.info}>
                <Text style={{ fontSize: 16, color: Color['grey400'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'left' }}>역할</Text>
                <Text style={{ fontSize: 16, fontFamily: "NanumSquareNeo-Bold", textAlign: 'right', color: user.role == '상쇠' ? Color['red500'] : Color['blue500'], }}>{RoleTextRender()}</Text>
            </View>
        </View>
    )
}

export default ProfileBoxCard;

const styles = StyleSheet.create({
    ProfileContainer: {
        position: 'relative',
        display: 'flex',
        flex: 1,
        borderRadius: 15,
        backgroundColor: 'white',
        marginHorizontal: 24
    }, ProfilePhoto: {
        width: 90,
        height: 120,
        borderRadius: 5,
        marginRight: 16
    }, icons: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
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
        position: 'relative',
        flexDirection: 'row',
        justifyContent: 'space-between',
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