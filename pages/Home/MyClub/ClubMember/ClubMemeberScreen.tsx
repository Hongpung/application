import React, { useEffect, useState } from "react";
import { View, ScrollView, Modal, Pressable } from "react-native";
import ProfileMiniCard from "../../../../components/cards/ProfileMiniCard";
import ProfileBoxCard from "../../../../components/cards/ProfileBoxCard";
import { User } from "../../../../UserType";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import useFetchUsingToken from "@hongpung/src/common/hooks/useFetchUsingToken";
import { Icons } from "@hongpung/src/common/components/Icons/Icon";
import { MyClubStackStackParamList } from "@hongpung/nav/MyClubStack";

type ClubMembersProps = NativeStackScreenProps<MyClubStackStackParamList, 'ClubMembers'>

const ClubMemeberScreen: React.FC<ClubMembersProps> = () => {

    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, selectUser] = useState<User | null>(null);

    const { data, loading, error } = useFetchUsingToken<User[]>(
        `${process.env.EXPO_PUBLIC_BASE_URL}/club/my-club/members`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }, 2000, []
    )

    useEffect(() => {
        console.log(data);
        if (!!data)
            setUsers(data)
    }, [data])


    return (
        <View style={{
            flexGrow: 1,
            backgroundColor: '#fff',
        }}>
            <ScrollView contentContainerStyle={{
                backgroundColor: '#fff',
            }}>
                <View style={{ flex: 1 }}>
                    {users?.map((member) => (
                        <View key={member.name} style={{ marginVertical: 8, marginHorizontal: 24 }}>
                            <ProfileMiniCard user={member} isPicked={false} onPick={user => { selectUser(user); }} view={'inClubView'} />
                        </View>
                    ))}
                </View>
            </ScrollView>
            <UserModal selectedUser={selectedUser} selectUser={selectUser} />
        </View>
    )
}

export const UserModal: React.FC<{ selectUser: (user: User | null) => void, selectedUser: User | null }> = ({ selectUser, selectedUser }) => {

    return (
        <Modal transparent visible={!!selectedUser}>
            <Pressable style={{
                height: '100%',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
                onPress={() => selectUser(null)}
            >
                <Pressable
                    style={{
                        height: 256,
                        backgroundColor: '#FFF',
                        marginHorizontal: 16,
                        paddingVertical: 12,
                        borderRadius: 10,
                    }}
                    onPress={(event) => event.stopPropagation()}
                >
                    <ProfileBoxCard
                        user={selectedUser!}
                    />
                    <Pressable
                        style={{
                            position: 'absolute',
                            top: 12, right: 16, width: 36, height: 36, justifyContent: 'center', alignItems: 'center'
                        }}
                        onPress={() => selectUser(null)}
                    >
                        <Icons name="close" color={'#000'} size={32} />
                    </Pressable>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

export default ClubMemeberScreen;