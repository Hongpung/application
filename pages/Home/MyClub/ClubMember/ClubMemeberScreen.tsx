import React, { useEffect, useState } from "react";
import { View, ScrollView, Modal, Pressable, Image, Text } from "react-native";
import ProfileMiniCard from "../../../../components/cards/ProfileMiniCard";
import { Color } from "../../../../ColorSet";
import ProfileBoxCard from "../../../../components/cards/PrifileBoxCard";
import { instrumentOrder, User } from "../../../../UserType";
import { HomeStackParamList } from "../../../../pageTypes";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { UserProvider, useUser } from "../../../../context/UserContext";
import useFetch from "@hongpung/hoc/useFetch";
import { useRecoilValue } from "recoil";
import { loginUserState } from "@hongpung/recoil/authState";
import { Icons } from "@hongpung/components/Icon";

type ClubMembersProps = NativeStackScreenProps<HomeStackParamList, 'ClubMembersHome'>



const MemeberList: React.FC<{ memberList: User[] }> = ({ memberList }) => {

    const { setModalVisible, setSelectedUser } = useUser();

    return (
        <View style={{ flex: 1 }}>
            {memberList.map((member) => (
                <View key={member.name} style={{ marginVertical: 8, marginHorizontal: 24 }}>
                    <ProfileMiniCard user={member} isPicked={false} onPick={user => { setSelectedUser(user); setModalVisible(true) }} view={'inClubView'} />
                </View>
            ))}
        </View>
    )
}

const ClubMemeberScreen: React.FC<ClubMembersProps> = ({ navigation }) => {

    const [users, setUsers] = useState<User[]>([])
    const loginUser = useRecoilValue(loginUserState)

    const { data, loading, error } = useFetch<User[]>(
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
        <UserProvider>
            <View style={{
                flexGrow: 1,
                backgroundColor: '#fff',
            }}>
                <ScrollView contentContainerStyle={{
                    backgroundColor: '#fff',
                }}>
                    {users && <MemeberList memberList={users} />}
                </ScrollView>
                <UserModal />
            </View>
        </UserProvider>
    )
}

export const UserModal: React.FC = () => {
    const { setModalVisible, modalVisible, selectedUser, setSelectedUser } = useUser();

    const CloseHandler = () => {
        setSelectedUser(null);
        setModalVisible(false)
    }

    return (
        <Modal transparent={true} visible={modalVisible}>
            <Pressable style={{
                height: '100%',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
                onPress={CloseHandler}
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
                        onPress={CloseHandler}
                    >
                        <Icons name="close" color={'#000'} size={32} />
                    </Pressable>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

export default ClubMemeberScreen;