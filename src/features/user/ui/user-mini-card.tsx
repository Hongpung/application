import { Color } from "@hongpung/src/common";
import { User } from "@hongpung/src/entities/user";
import { View, Pressable, Text, Image } from "react-native";


export interface UserMiniCardProps {
    user: User
    isPicked: boolean,
    onPress: (user: User) => void
}


export const UserMiniCard: React.FC<UserMiniCardProps> = ({ user, isPicked, onPress }) => {

    return (
        <Pressable style={[styles.ProfileContainer, isPicked && styles.PickedProfile]} onPress={() => { onPress(user) }}>
            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                {user.profileImageUrl ?
                    <Image
                        source={{ uri: user.profileImageUrl }}
                        style={styles.ProfilePhoto} /> :
                    <View style={[styles.ProfilePhoto, {
                        borderWidth: 1,
                        borderColor: Color['grey300'],
                        backgroundColor: Color['grey200'],
                    }]} />}
                <View style={{ height: 44, display: 'flex', gap: 2 }}>
                    <View style={[{ flexDirection: 'row', flex: 1, alignItems: 'center', }, user.nickname ? { marginTop: 3 } : null]}>
                        {/* <View style={styles.instrumnetMark} /> */}
                        <Text style={styles.UserName}>{user.name}</Text>
                    </View>
                    {user.nickname && <Text style={styles.UserNickName}>{user.nickname}</Text>}
                </View>
            </View>
            <View style={{ position: 'absolute', flexDirection: 'row', left: 104, bottom: 16, alignItems: 'center', justifyContent: 'flex-start' }}>
                {user.role && user.role.map(role => <RoleTag key={role + user.memberId} role={role} />)}
            </View>
            <View style={{ position: 'absolute', width: 56, height: 56, borderRadius: 200, overflow: 'hidden', borderWidth: loading ? 1 : 0, borderColor: Color['grey500'], justifyContent: 'center', alignItems: 'center', right: 16, top: 24 }}>
                {/* {user.badge &&
                        <Image
                            source={{ uri: user.badge }}
                            style={{ height: 56, width: 56, borderRadius: 200, }}
                            onLoadEnd={() => { setLoading(false) }}
                        />} */}
            </View>
            {view == 'inClubView' ?
                <Pressable style={{ position: 'absolute', borderRadius: 200, right: 16, bottom: 8 }}
                    onPress={() => { onPress(user); }}>
                    <Text style={styles.moreBtn}>{`더 알아보기 >`}</Text>
                </Pressable> :
                <View style={{ position: 'absolute', borderRadius: 200, right: 16, bottom: 8, flexDirection: 'row', alignItems: 'flex-end' }}>
                    <Text style={[{ marginRight: 1 }, styles.clubInfo]}>{`@ ` + user.enrollmentNumber}</Text>
                    <Text style={styles.clubInfo}>{user.club}</Text>
                </View>}
        </Pressable>
    )
}