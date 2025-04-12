import { View, Pressable, Text, Image, StyleSheet } from "react-native";

import { Color } from "@hongpung/src/common";
import { Member } from "@hongpung/src/entities/member";
import React from "react";

interface PickMemberCardProps {

    member: Member
    isPicked: boolean,
    onPress: (user: Member) => void

}

const PickMemberCard: React.FC<PickMemberCardProps> = ({ member, isPicked, onPress }) => {

    return (
        <Pressable style={[styles.ProfileContainer, isPicked && styles.PickedProfile]} onPress={() => { onPress(member) }}>
            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                {member.profileImageUrl ?
                    <Image
                        source={{ uri: member.profileImageUrl }}
                        style={styles.ProfilePhoto} /> :
                    <View style={[styles.ProfilePhoto, {
                        borderWidth: 1,
                        borderColor: Color['grey300'],
                        backgroundColor: Color['grey200'],
                    }]} />}
                <View style={{ height: 44, display: 'flex', gap: 2 }}>
                    <View style={[{ flexDirection: 'row', flex: 1, alignItems: 'center', }, member.nickname ? { marginTop: 3 } : null]}>
                        {/* <View style={styles.instrumnetMark} /> */}
                        <Text style={styles.UserName}>{member.name}</Text>
                    </View>
                    {member.nickname && <Text style={styles.UserNickName}>{member.nickname}</Text>}
                </View>
            </View>
            <View style={{ position: 'absolute', flexDirection: 'row', left: 104, bottom: 16, alignItems: 'center', justifyContent: 'flex-start' }}>
                {member.role && member.role.map(role => <View key={role + member.memberId} />)}
            </View>
            <View style={{ position: 'absolute', width: 56, height: 56, borderRadius: 200, overflow: 'hidden', borderWidth: 0, borderColor: Color['grey500'], justifyContent: 'center', alignItems: 'center', right: 16, top: 24 }}>

            </View>
            <View style={{ position: 'absolute', borderRadius: 200, right: 16, bottom: 8, flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text style={[{ marginRight: 1 }, styles.clubInfo]}>{`@ ` + member.enrollmentNumber}</Text>
                <Text style={styles.clubInfo}>{member.club}</Text>
            </View>
        </Pressable>
    )
}


export default React.memo(PickMemberCard);

const styles = StyleSheet.create({
    
    ProfileContainer: {
        position: 'relative',
        height: 112,
        borderRadius: 15,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: Color['grey200']
    },

    PickedProfile: {
        backgroundColor: Color['blue100'],
        borderColor: Color['blue600'],
    },
    ProfilePhoto: {
        marginLeft: 20,
        width: 60,
        height: 80,
        borderRadius: 5,
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
        fontSize: 14, color: Color['grey400'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'left', marginTop: 4
    },
    moreBtn: {
        fontSize: 12, color: Color['grey500'], fontFamily: "NanumSquareNeo-Light", textAlign: 'right', marginTop: 4
    },
    clubInfo: {
        fontSize: 12, color: Color['grey400'], fontFamily: "NanumSquareNeo-Bold", textAlign: 'right', marginTop: 4
    }
})