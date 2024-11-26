import React, { useEffect, useState } from "react";
import { View, ScrollView, Modal, Pressable } from "react-native";
import ProfileMiniCard from "@hongpung/components/cards/ProfileMiniCard";
import ProfileBoxCard from "@hongpung/components/cards/PrifileBoxCard";
import { User } from "@hongpung/UserType";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Icons } from "@hongpung/components/Icon";
import { ReservationStackParamList } from "@hongpung/nav/ReservationStack";


type ReservationParticipatorsViewProps = NativeStackScreenProps<ReservationStackParamList, 'ReservationParticipatorsView'>




const ReservationParticipatorsViewScreen: React.FC<ReservationParticipatorsViewProps> = ({ navigation, route }) => {

    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        const { participators: jsonData } = route.params
        const data = JSON.parse(jsonData) as User[];
        console.log(data)
        data?.sort((a, b) => (a.enrollmentNumber) - (b.enrollmentNumber)) // 악기 순으로 정렬
        setUsers(data ?? [])
    }, [route])

    return (
        <View style={{
            flexGrow: 1,
            backgroundColor: '#fff',
        }}>
            <ScrollView contentContainerStyle={{
                backgroundColor: '#fff',
            }}>
                {users && <ParticipatorList participatorList={users} />}
            </ScrollView>
        </View>
    )
}

const ParticipatorList: React.FC<{ participatorList: User[] }> = ({ participatorList }) => {
    const CloseHandler = () => {
        setSelectedUser(null);
        setModalVisible(false)
    }

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    return (
        <>
            <View style={{ flex: 1 }}>
                {participatorList.map((member) => (
                    <View key={member.name} style={{ marginVertical: 8, marginHorizontal: 24 }}>
                        <ProfileMiniCard user={member} isPicked={false} onPick={user => { setSelectedUser(user); setModalVisible(true) }} view={'inClubView'} />
                    </View>
                ))}
            </View>
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
        </>


    )
}


export default ReservationParticipatorsViewScreen;