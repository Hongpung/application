import React, { useCallback, useEffect, useState } from "react";
import { View, ScrollView, Modal, Pressable, Image, Text } from "react-native";
import ProfileMiniCard from "../../../../components/cards/ProfileMiniCard";
import { Color } from "../../../../ColorSet";
import ProfileBoxCard from "../../../../components/cards/PrifileBoxCard";
import { instrumentOrder, User } from "../../../../UserType";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { UserProvider, useUser } from "../../../../context/UserContext";
import useFetchUsingToken from "@hongpung/hoc/useFetchUsingToken";
import { useRecoilValue } from "recoil";
import { loginUserState } from "@hongpung/recoil/authState";
import { Icons } from "@hongpung/components/Icon";
import { MyClubStackStackParamList } from "@hongpung/nav/MyClubStack";

type ClubMembersProps = NativeStackScreenProps<MyClubStackStackParamList, 'ClubMembers'>





const ClubMemeberScreen: React.FC<ClubMembersProps> = ({ navigation }) => {

    const [users, setUsers] = useState<User[]>([]);

    const loginUser = useRecoilValue(loginUserState);
    const [selectedUser, selectUser] = useState<User | null>(null);

    const { data, loading, error } = useFetchUsingToken<User[]>(
        `${process.env.BASE_URL}/member`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }, 2000, []
    )

    useEffect(() => {
        const clubUser = data?.filter(user => user.club == loginUser?.club);
        clubUser?.sort((a, b) => instrumentOrder(a.instrument) - instrumentOrder(b.instrument)) // 악기 순으로 정렬
        setUsers(clubUser ?? [])
    }, [data])



    return (
        <View style={{
            flexGrow: 1,
            backgroundColor: '#fff',
        }}>
            <ScrollView contentContainerStyle={{
                backgroundColor: '#fff',
            }}>
                {users && <View style={{ flex: 1 }}>
                    {users.map((member) => (
                        <View key={member.name} style={{ marginVertical: 8, marginHorizontal: 24 }}>
                            <ProfileMiniCard user={member} isPicked={false} onPick={user => { selectUser(user); }} view={'inClubView'} />
                        </View>
                    ))}
                </View>}
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
                        isCard={true}
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