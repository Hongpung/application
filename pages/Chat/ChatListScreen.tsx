import { StyleSheet, Text, ScrollView, View, Pressable, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import useFetchUsingToken from '@hongpung/hoc/useFetchUsingToken'
import { Color } from '@hongpung/ColorSet'
import { getToken } from '@hongpung/utils/TokenHandler'
import { useIsFocused } from '@react-navigation/native'
import { useRecoilValue } from 'recoil'
import { loginUserState } from '@hongpung/recoil/authState'
import { Icons } from '@hongpung/components/Icon'


const ChatListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {

    const isFocusing = useIsFocused();
    const loginUser = useRecoilValue(loginUserState);
    const [roomName, setName] = useState<string>('');
    const [chatMember, setMember] = useState<number[]>([loginUser?.memberId]);

    const { data, loading, error } = useFetchUsingToken<any[]>(
        `${process.env.BASE_URL}/chat`,
        {},
        5000
        , [isFocusing]
    )
    console.log(data)

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

                navigation.navigate('ChatRoom', { roomId: answer.chatroomId, roomName: answer.roomName })
                console.log(answer)
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
                onPress={createRoom}>
                <View style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <View style={{ position: 'absolute' }}>
                        <Icons name='chatbox' size={48} color={Color['blue500']}></Icons>
                    </View>
                    <View style={{ position: 'absolute', left: 12, top: 8 }}>
                        <Icons name='add' size={24} color={'#FFF'}></Icons>
                    </View>
                </View>
            </Pressable>
            <ScrollView contentContainerStyle={{ flex: 1, backgroundColor: '#FFF' }}>
                {data?.map(data =>
                (<TouchableOpacity
                    style={{ height: 64, backgroundColor:'#FFF', alignItems: 'center', paddingHorizontal: 24, display: 'flex', flexDirection: 'row' }}
                    onPress={() => navigation.navigate('ChatRoom', { roomId: data.chatroomId, roomName: data.roomName ?? 'test' })}
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

const styles = StyleSheet.create({})