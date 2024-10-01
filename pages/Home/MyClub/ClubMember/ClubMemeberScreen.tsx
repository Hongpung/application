import React, { useState } from "react";
import { View, ScrollView, Modal, Pressable, Image, Text } from "react-native";
import ProfileMiniCard from "../../../../components/cards/ProfileMiniCard";
import { Color } from "../../../../ColorSet";
import ProfileBoxCard from "../../../../components/cards/PrifileBoxCard";
import { instrumentOrder, User } from "../../../../UserType";
import { HomeStackParamList } from "../../../../pageTypes";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { UserProvider, useUser } from "../../../../context/UserContext";

type ClubMembersProps = NativeStackScreenProps<HomeStackParamList, 'ClubMembersHome'>



const MemeberList: React.FC<{ memberList: User[] }> = ({ memberList }) => {
    
    const{setModalVisible,setSelectedUser}= useUser();

    return (
        <View style={{flex:1}}>
            {memberList.map((member) => (
                <View style={{ marginVertical: 8, marginHorizontal:24 }}>
                    <ProfileMiniCard key={member.name} user={member} isPicked={false} onPick={user => {setSelectedUser(user); setModalVisible(true)}} view={'inClubView'} />
                </View>
            ))}
        </View>
    )
}

const ClubMemeberScreen: React.FC<ClubMembersProps> = ({ navigation }) => {


    const users: User[] = [{
        name: "홍길동",
        nickname: '길동색시',
        badge: "https://image.genie.co.kr/Y/IMAGE/IMG_ARTIST/042/307/533/42307533_1683708946356_31_600x600.JPG",
        club: "산틀",
        enrollmentNumber: 18,
        instrument: '소고',
        isCapt: true
    }, {
        name: "임꺽정",
        badge: "https://image.genie.co.kr/Y/IMAGE/IMG_ARTIST/042/307/533/42307533_1683708946356_31_600x600.JPG",
        club: "산틀",
        enrollmentNumber: 18,
        instrument: "장구",
        isCapt: false,
        role: '상장구'
    }, {
        name: "북꺽정",
        badge: "https://image.genie.co.kr/Y/IMAGE/IMG_ARTIST/042/307/533/42307533_1683708946356_31_600x600.JPG",
        club: "산틀",
        enrollmentNumber: 18,
        instrument: '북',
        isCapt: false,
        role: '수북'
    }, {
        name: "임꺽정",
        club: "산틀",
        enrollmentNumber: 18,
        instrument: '쇠',
        role: '상쇠'
    }
    ]

    users.sort((a, b) => instrumentOrder(a.instrument) - instrumentOrder(b.instrument)) // 악기 순으로 정렬

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
                flex: 1,
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
                onPress={CloseHandler}
            >
                <Pressable style={{ height: 326, marginHorizontal: 4, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10 }} onPress={(event) => event.stopPropagation()}>
                    <ProfileBoxCard
                        user={selectedUser!}
                        isCard={true}
                    />
                    <Pressable
                        style={{
                            position: 'absolute',
                            top: 12, right: 12, width: 36, height: 36, justifyContent: 'center', alignItems: 'center'
                        }}
                        onPress={CloseHandler}
                    >
                        <Text style={{ color: Color['grey700'], textAlign: 'center', fontFamily: 'NanumSquareNeo-Bold', fontSize: 20 }}>X</Text>
                    </Pressable>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

export default ClubMemeberScreen;