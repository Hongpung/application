import { FlatList, StyleSheet, Text, View, Dimensions, Pressable, ActivityIndicator, Modal } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Color } from '../../ColorSet'
import useFetch from '../../hoc/useFetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Reserve } from '../Home/MyClub/ClubCalendar/ClubCalendar';
import { useFocusEffect } from '@react-navigation/native';


const { width } = Dimensions.get('window');

const ReserveMainScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [token, setToken] = useState<string | null>(null);

    const loadToken = useCallback(() => {
        const fetchToken = async () => {
            const storedToken = await AsyncStorage.getItem('token');
            setToken(storedToken);
        };

        fetchToken();
    }, [])

    useFocusEffect(() => {
        loadToken();
    });

    // 토큰을 불러온 후 useFetch 실행
    const { data, loading, error } = useFetch<Reserve[]>(
        token ? `${process.env.BASE_URL}/reservation/search` : ``,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // 토큰을 Authorization 헤더에 추가
            },
            body: JSON.stringify({ date: new Date().toISOString() })
        }, 2000, [token]
    );
    
    // if (loading)
    //     return (<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' }}>
    //         <View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)' }}></View>
    //         <ActivityIndicator size={'large'} color={'#FFF'} />
    //     </View>)

    // if (error) {
    //     return (
    //         <View>
    //             <Text>Error: {error}</Text>
    //         </View>
    //     );
    // }

    return (
        <View style={{ backgroundColor: '#FFF', flex: 1 }}>
            <View style={{ marginTop: 264 }}>
                <View style={{ flexDirection: 'row', marginHorizontal: 32, justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 20 }}>연습실 이용상태</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 12, color: Color['green500'], backgroundColor: Color['green200'], borderRadius: 5, padding: 6 }}>참여가능</Text>
                        <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 12, color: Color['red500'], backgroundColor: Color['red100'], borderRadius: 5, padding: 6, marginLeft: 4 }}>사용중</Text>
                    </View>
                </View>
                <View style={{ height: 12 }} />
                <FlatList
                    contentContainerStyle={{ alignItems: 'center' }}
                    data={[data]}
                    horizontal
                    pagingEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item,index) => item && item[index]?.name || 'false'}
                    snapToInterval={width - 28}
                    snapToAlignment="center"
                    decelerationRate="fast"
                    renderItem={({ item, index }) => (
                        <View style={[{ height: 200, borderWidth: 1, borderColor: Color['grey200'], borderRadius: 10, marginHorizontal: 6 }, { width: width - 48 }]}>
                            {index % 2 == 1 ? <View style={{ position: 'absolute', height: 40, width: 24, right: 32, top: -1, backgroundColor: Color['blue500'] }} />
                                : <View style={{ position: 'absolute', right: 20, top: 12, alignItems: 'flex-end' }}>
                                    <Text style={{ textAlign: 'right', fontFamily: 'NanumSquareNeo-Regular', fontSize: 16, color: Color['grey700'] }}>홍길동</Text>
                                    <Text style={{ textAlign: 'right', fontFamily: 'NanumSquareNeo-Regular', fontSize: 12, color: Color['grey400'] }}>길동색시</Text>
                                </View>}
                            <Text numberOfLines={1} ellipsizeMode='tail' style={{ fontFamily: 'NanumSquareNeo-Bold', marginHorizontal: 64, top: 72, textAlign: 'center', fontSize: 20 }}>{item?.name}</Text>
                            <View style={{ position: 'absolute', right: 24, bottom: 24, alignItems: 'flex-end' }}>
                                <Text style={{ textAlign: 'right', fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, color: Color['grey400'] }}>19:00~20:00</Text>
                                <View style={{ height: 2 }} />
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}><View style={{ width: 24, height: 24, backgroundColor: Color['grey200'], marginRight: 4 }} /><Text style={{ textAlign: 'right', fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, color: Color['grey400'] }}>50</Text></View>
                            </View>
                        </View>
                    )}
                    ListHeaderComponent={() => {
                        return (<View style={{ width: 12 }} />)
                    }}
                    ListFooterComponent={() => {
                        return (<View style={{ width: 12 }} />)
                    }}
                />
            </View>
            <View style={{ position: 'absolute', bottom: 92, marginHorizontal: 24, height: 92, flexDirection: 'row', justifyContent: 'space-between', width: width - 48 }}>
                <Pressable style={{ width: (width - 48) / 2 - 4, borderWidth: 1, borderColor: Color['grey200'], borderRadius: 10 }}
                    onPress={() => navigation.push('Reservation')}>
                    <Text style={{ position: 'absolute', left: 8, bottom: 8, fontSize: 16, fontFamily: 'NanumSquareNeo-Heavy', color: Color['grey700'] }}>연습실 예약 조회</Text>
                </Pressable>
                <Pressable style={{ width: (width - 48) / 2 - 4, backgroundColor: Color['grey400'], borderRadius: 10 }}
                    onPress={() => navigation.push('ExtaraActivities')}>
                    <Text style={{ position: 'absolute', right: 8, top: 8, fontSize: 16, fontFamily: 'NanumSquareNeo-Heavy', color: '#FFF' }}>활동 조회</Text>
                </Pressable>
            </View>
            {!loading&&<View style={{ position: 'absolute', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)' }}>
                <ActivityIndicator size={'large'} color={'#FFF'} />
            </View>}
        </View>
    )
}

export default ReserveMainScreen

const styles = StyleSheet.create({})