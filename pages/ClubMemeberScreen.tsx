import React, { useState } from "react";
import { View, ScrollView, Modal, Pressable, Image, Text } from "react-native";
import ProfileMiniCard, { MiniCardType } from "../components/cards/ProfileMiniCard";
import { Color } from "../ColorSet";
import { ProfileBox } from "./ProfileScreen";

interface user {
    user: MiniCardType
}

const MemeberList: React.FC<{ userList: user[] }> = ({ userList }) => {
    const renderBadges = () => {
        const rows = [];
        for (let i = 0; i < userList.length; i += 3) {
            const group = userList.slice(i, i + 3);
            rows.push(
                <View key={i} style={{ height: 84, width: 288, flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8, }}>
                    {group.map((user, index) => (
                        <ProfileMiniCard key={index} badge={user} />
                    ))}
                    {group.length % 3 == 2 && <View style={{ height: 84, width: 72 }} />}
                </View>
            );
        }
        return rows;
    };
    return (
        <View>
            {renderBadges()}
        </View>
    )
}

const ClubMemeberScreen: React.FC<MyBadgeProps> = ({ navigation }) => {

    const users = [{
        name: "홍길동",
        nickName: '길동색시',
        descript: "그냥 랜덤 배지",
        badge: "https://image.genie.co.kr/Y/IMAGE/IMG_ARTIST/042/307/533/42307533_1683708946356_31_600x600.JPG",
        club: "산틀",
        grade: 18
    },
    {
        name: "테스트 배지",
        imgUrl: 'https://image.genie.co.kr/Y/IMAGE/IMG_ARTIST/042/307/533/42307533_1683708946356_31_600x600.JPG',
        descript: "그냥 테스트 배지",
        isHave: true
    },
    ]

    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View style={{
            flexGrow: 1,
            backgroundColor: '#fff',
        }}>
            <ScrollView contentContainerStyle={{
                flexGrow: 1,
                alignItems: 'center',
                backgroundColor: '#fff',
            }}>
                {users && <MemeberList userList={users} />}
            </ScrollView>
            {modalVisible&&<UserModal onClose={() => setModalVisible(false)} />}
        </View>
    )
}

const UserModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <Modal transparent={true} visible={true}>
            <Pressable style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
                onPress={onClose}
            >
                <Pressable style={{ width: 340, height: 200, backgroundColor: '#FFF', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }} onPress={(event) => event.stopPropagation()}>
                    <ProfileBox
                        isCard={true}
                    />

                    <Pressable
                        style={{
                            position: 'absolute',
                            top: 6, right: 2, width: 36, height: 36, justifyContent: 'center', alignItems: 'center'
                        }}
                        onPress={onClose}
                    >
                        <Text style={{ color: Color['grey700'], textAlign: 'center' }}>X</Text>
                    </Pressable>

                </Pressable>
            </Pressable>
        </Modal>
    );
};

export default ClubMemeberScreen;