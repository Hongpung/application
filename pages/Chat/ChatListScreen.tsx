import { Text, ScrollView, View, Pressable, TouchableOpacity, Modal, TextInput } from 'react-native'
import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'

import { useIsFocused, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainStackParamList } from '@hongpung/nav/HomeStacks'

import useFetchUsingToken from '@hongpung/hoc/useFetchUsingToken'
import { Color } from '@hongpung/ColorSet'
import { getToken } from '@hongpung/utils/TokenHandler'
import { loginUserState } from '@hongpung/recoil/authState'
import { Icons } from '@hongpung/components/Icon'
import LongButton from '@hongpung/components/buttons/LongButton'

interface ChatRoom {
    chatroomId: number
    roomName: string
    memberCount: number
}

type RootNavigationProp = NativeStackNavigationProp<MainStackParamList, 'ChatRoomStack'>;

const ChatListScreen: React.FC = () => {

    const navigation = useNavigation<RootNavigationProp>();

    const isFocusing = useIsFocused();
    const loginUser = useRecoilValue(loginUserState);

    const [madeModal, setMadeState] = useState(false); //chat room 만드는 모달
    const [roomName, setRoomName] = useState<string>('');
    const [chatMember, setMember] = useState<number[]>([loginUser!.memberId]);

    const { data, loading, error } = useFetchUsingToken<ChatRoom[]>(
        `${process.env.BASE_URL}/chat`,
        {},
        5000
        , [isFocusing]
    )

    const createRoom = () => {
        const fetchData = async () => {

            const controller = new AbortController();
            const signal = controller.signal;
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            try {
                const token = await getToken('token');

                if (!token) throw Error('invalid Token');

                console.log('fetching...')
                const response = await fetch(`${process.env.BASE_URL}/chat`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,  // Authorization 헤더에 Bearer 토큰 추가
                    },
                    body: JSON.stringify({ chatroomName: roomName != '' ? roomName : '테스트', memberIds: chatMember }),
                    signal
                })
                if (!response.ok) {
                    console.log(response.status + response.statusText)
                    throw new Error('Network response was not ok');
                }
                const answer = await response.json();

                setMadeState(false);
                setRoomName('')
                setMember([])

                navigation.navigate('ChatRoomStack', { screen: 'ChatRoom', params: { roomId: answer.chatroomId, roomName: answer.roomName } })


            } catch (err: any) {
                if (err.name === 'AbortError') {
                    console.error('Request was canceled' + err.status);
                } else {
                    console.error(err.message + ' ' + err.status);
                }
            } finally {
                clearTimeout(timeoutId);
            }
        };
        fetchData();
    }

    return (
        <View style={{ position: 'relative', flex: 1, backgroundColor: '#FFF' }}>
            <Pressable style={{ position: 'absolute', width: 48, height: 48, bottom: 80, right: 20, zIndex: 2 }}
                onPress={() => setMadeState(true)}>
                <View style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <View style={{ position: 'absolute' }}>
                        <Icons name='chatbox' size={48} color={Color['blue500']}></Icons>
                    </View>
                    <View style={{ position: 'absolute', left: 12, top: 8 }}>
                        <Icons name='add' size={24} color={'#FFF'}></Icons>
                    </View>
                </View>
            </Pressable>

            <Modal visible={madeModal} transparent>
                <Pressable style={{ backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', flex: 1, justifyContent: 'center' }}
                    onPress={() => setMadeState(false)}>
                    <Pressable style={{ display: 'flex', flexDirection: 'column', gap: 24, marginHorizontal: 12, paddingVertical: 32, borderRadius: 24, backgroundColor: 'white' }}
                        onPress={(e) => e.isDefaultPrevented()}>
                        <View style={{ display: 'flex', flexDirection: 'row', marginHorizontal: 36, justifyContent: 'space-between' }}>
                            <Text style={{ fontFamily: 'NanumSquareNeo-Light', color: Color['grey500'], fontSize: 16 }}>채팅방 이름</Text>
                            <TextInput placeholder='제목 입력' value={roomName} onChangeText={(newText) => setRoomName(newText)} textAlign='right' style={{ fontFamily: 'NanumSquareNeo-Bold', color: Color['grey500'], fontSize: 16 }}></TextInput>
                        </View>
                        <LongButton
                            color='blue'
                            isAble
                            innerText='생성하기'
                            onPress={createRoom}>
                        </LongButton>
                    </Pressable>
                </Pressable>

            </Modal>
            <ScrollView contentContainerStyle={{ flex: 1, backgroundColor: '#FFF' }}>
                {data?.map(data =>
                (<TouchableOpacity
                    style={{ height: 64, backgroundColor: '#FFF', alignItems: 'center', paddingHorizontal: 24, display: 'flex', flexDirection: 'row' }}
                    onPress={() => navigation.navigate('ChatRoomStack', { screen: 'ChatRoom', params: { roomId: data.chatroomId, roomName: data.roomName ?? 'test' } })}
                >
                    <View style={{ height: 48, width: 48, backgroundColor: Color['grey200'], borderRadius: 12 }} />
                    <View style={{ justifyContent: 'center', paddingHorizontal: 12, display: 'flex', gap: 4 }}>
                        <View style={{ alignItems: 'center', display: 'flex', flexDirection: 'row', gap: 4 }}>
                            <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14 }}>{data.roomName ?? 'test'}</Text>
                            <Text style={{ fontFamily: 'NanumSquareNeo-Light', color: Color['grey500'], fontSize: 14 }}>{data.memberCount ?? '1'}</Text>
                        </View>
                        <Text style={{ fontFamily: 'NanumSquareNeo-Regular', fontSize: 16 }}>{data.roomName ?? 'test'}</Text>
                    </View>
                </TouchableOpacity>))}
            </ScrollView>
        </View>
    )
}

export default ChatListScreen