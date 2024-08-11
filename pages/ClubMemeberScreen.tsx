import React, { useState } from "react";
import { View, ScrollView, Modal, Pressable, Image, Text } from "react-native";
import ProfileMiniCard from "../components/cards/ProfileMiniCard";
import { Color } from "../ColorSet";
import ProfileBoxCard from "../components/cards/PrifileBoxCard";
import { instrumentOrder, User } from "../UserType";
import { HomeStackParamList } from "./pageTypes";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { UserProvider, useUser } from "./UserContext";

type ClubMembersProps = NativeStackScreenProps<HomeStackParamList, 'ClubMembers'>



const MemeberList: React.FC<{ memberList: User[] }> = ({ memberList }) => {

    return (
        <View>
            {memberList.map((member) => (
                <View style={{ marginVertical: 8 }}>
                    <ProfileMiniCard key={member.name} user={member} isPicked={false} view={'inClubView'} />
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
        grade: 18,
        instrument: '소고',
        isCapt: true
    }, {
        name: "임꺽정",
        badge: "https://image.genie.co.kr/Y/IMAGE/IMG_ARTIST/042/307/533/42307533_1683708946356_31_600x600.JPG",
        club: "산틀",
        grade: 18,
        instrument: "장구",
        isCapt: false,
        addRole: '상장구'
    }, {
        name: "북꺽정",
        badge: "https://image.genie.co.kr/Y/IMAGE/IMG_ARTIST/042/307/533/42307533_1683708946356_31_600x600.JPG",
        club: "산틀",
        grade: 18,
        instrument: '북',
        isCapt: false,
        addRole: '수북'
    }, {
        name: "임꺽정",
        club: "산틀",
        grade: 18,
        instrument: '쇠',
        addRole: '상쇠'
    }
    ]

    users.sort((a, b) => instrumentOrder(a.instrument) - instrumentOrder(b.instrument))

    return (
        <UserProvider>
            <View style={{
                flexGrow: 1,
                backgroundColor: '#fff',
            }}>
                <ScrollView contentContainerStyle={{
                    flexGrow: 1,
                    alignItems: 'center',
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
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
                onPress={CloseHandler}
            >
                <Pressable style={{ width: 352, height: 326, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }} onPress={(event) => event.stopPropagation()}>
                    <ProfileBoxCard
                        user={selectedUser!}
                        isCard={true}
                    />

                    <Pressable
                        style={{
                            position: 'absolute',
                            top: 8, right: 4, width: 36, height: 36, justifyContent: 'center', alignItems: 'center'
                        }}
                        onPress={CloseHandler}
                    >
                        <Text style={{ color: Color['grey700'], textAlign: 'center', fontFamily: 'NanumSquareNeo-Bold', fontSize: 18 }}>X</Text>
                    </Pressable>

                </Pressable>
            </Pressable>
        </Modal>
    );
};

export default ClubMemeberScreen;