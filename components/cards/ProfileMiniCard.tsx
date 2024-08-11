import React, { useState } from "react"
import { View, StyleSheet, Text, Pressable, Image } from "react-native"

import { Color } from "../../ColorSet"
import { User } from "../../UserType"
import { useUser } from "../../pages/UserContext"

export interface MiniCardType {
    user: User
    view: "inClubView" | "inReserveView"
    isPicked: boolean
}

const ProfileMiniCard: React.FC<MiniCardType> = ({ user, view, isPicked }) => {

    const { setSelectedUser, setModalVisible } = useUser();
    const [loading, setLoading] = useState(false);


    const RoleTag = () => {
        switch (user.addRole) {
            case '상쇠':
                return (
                    <View>
                        <View style={{ height: 16, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4, backgroundColor: Color['red100'], borderRadius: 5, marginRight: 4 }}>
                            <Text style={{ fontSize: 12, fontFamily: "NanumSquareNeo-Bold", color: Color['red600'], }}>
                                {'상쇠'}
                            </Text>
                        </View>
                    </View>
                )
            default:
                return (
                    <View>
                        <View style={{ height: 16, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4, backgroundColor: Color['blue100'], borderRadius: 5, marginRight: 4 }}>
                            <Text style={{ fontSize: 12, fontFamily: "NanumSquareNeo-Bold", color: Color['blue600'], }}>
                                {String(user.addRole)}
                            </Text>
                        </View>
                    </View>
                )
        }
    }

    return (
        <View style={[styles.ProfileContainer, isPicked ? styles.PickedProfile : null,]}>
            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                <View style={styles.ProfilePhoto} />
                <View style={{ height: 42, justifyContent: 'space-evenly' }}>
                    <View style={[{ flexDirection: 'row', flex: 1, alignItems: 'center', }, user.nickname ? { marginTop: 3 } : null]}>
                        <View style={styles.instrumnetMark} />
                        <Text style={styles.UserName}>{user.name}</Text>
                    </View>
                    {user.nickname && <Text style={styles.UserNickName}>{user.nickname}</Text>}
                </View>
            </View>
            <View style={{ position: 'absolute', flexDirection: 'row', left: 104, bottom: 16, alignItems: 'center', justifyContent: 'flex-start' }}>
                {user.isCapt && <View>
                    <View style={{ height: 16, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4, backgroundColor: Color['blue100'], borderRadius: 5, marginRight: 4 }}>
                        <Text style={{ fontSize: 12, fontFamily: "NanumSquareNeo-Bold", color: Color['blue600'], }}>
                            {'패짱'}
                        </Text>
                    </View>
                </View>}
                {user.addRole && RoleTag()}
            </View>
            <View style={{ position: 'absolute', width: 56, height: 56, borderRadius: 200, overflow: 'hidden', borderWidth: loading?1:0, borderColor: Color['grey500'], justifyContent: 'center', alignItems: 'center', right: 16, top: 24 }}>
                {user.badge &&
                    <Image
                        source={{ uri: user.badge }}
                        style={{ height: 56, width: 56, borderRadius: 200, }}
                        onLoadEnd={() => { setLoading(false) }}
                    />}
            </View>
            {view == 'inClubView' ?
                <Pressable style={{ position: 'absolute', borderRadius: 200, right: 16, bottom: 8 }}
                    onPress={() => { setSelectedUser(user); setModalVisible(true) }}>
                    <Text style={styles.moreBtn}>{`더 알아보기 >`}</Text>
                </Pressable> :
                <View style={{ position: 'absolute', borderRadius: 200, right: 16, bottom: 8, flexDirection: 'row', alignItems: 'flex-end' }}>
                    <Text style={[{ marginRight: 1 }, styles.clubInfo]}>{`@ ` + user.grade}</Text>
                    <Text style={styles.clubInfo}>{user.club}</Text>
                </View>}
        </View>
    )
}

export default ProfileMiniCard;



const styles = StyleSheet.create({
    ProfileContainer: {
        position: 'relative',
        height: 112,
        width: 320,
        borderRadius: 15,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: Color['grey200']
    },
    PickedProfile: {
        backgroundColor: Color['blue100'],
        borderColor: Color['blue600'],
        borderWidth: 2,
    },
    ProfilePhoto: {
        marginLeft: 20,
        width: 60,
        height: 80,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: Color['grey300'],
        backgroundColor: Color['grey200'],
        marginRight: 24
    },
    instrumnetMark: {
        width: 24,
        height: 24,
        backgroundColor: Color['grey200'],
        marginRight: 4
    },
    UserName: {
        fontSize: 16, color: Color['grey700'], fontFamily: "NanumSquareNeo-Bold", textAlign: 'left'
    },
    UserNickName: {
        fontSize: 14, color: Color['grey500'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'left', marginTop: 4
    },
    moreBtn: {
        fontSize: 12, color: Color['grey500'], fontFamily: "NanumSquareNeo-Light", textAlign: 'right', marginTop: 4
    },
    clubInfo: {
        fontSize: 12, color: Color['grey400'], fontFamily: "NanumSquareNeo-Bold", textAlign: 'right', marginTop: 4
    }
})