import { FlatList, StyleSheet, Text, View, Dimensions, Pressable, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BlurView } from 'expo-blur';

import { Color } from '@hongpung//ColorSet'
import useFetch from '@hongpung//hoc/useFetch';
import { Icons } from '@hongpung/components/Icon';

import { parseToReservation, Reservation, ReservationDTO } from './ReserveInterface';
import { useIsFocused } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const ReserveMainScreen: React.FC<{ navigation: any }> = ({ navigation }) => {

    const today = new Date();
    const isFocusing = useIsFocused();
    const [loadData, setData] = useState<Reservation[]>([]);
    const [isOnAir, setOnAir] = useState(false);
    const [isParticipatible, setParticipatible] = useState(false);
    const { data, loading, error } = useFetch<ReservationDTO[]>(
        `${process.env.BASE_URL}/reservation/day?date=${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${(today.getDate()).toString().padStart(2, '0')}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }, 2000, [isFocusing]
    );

    useEffect(() => {
        
        if (data && data?.length > 0) {
            const parsedData = data.map(reservationDTO => parseToReservation(reservationDTO))
            parsedData.sort((a, b) => Number(a.Time.startTime.slice(5, 7)) - Number(b.Time.startTime.slice(5, 7)))
            setData(parsedData);
        }

    }, [data])

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
            <View style={{ marginTop: 224 }}>
                <View style={{ flexDirection: 'row', marginHorizontal: 32, justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 20 }}>연습실 이용상태</Text>
                    <View style={{ flexDirection: 'row' }}>
                        {isOnAir && isParticipatible && <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 12, color: Color['green500'], backgroundColor: Color['green200'], borderRadius: 5, padding: 6 }}>참여가능</Text>}
                        {isOnAir ? <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 12, color: Color['red500'], backgroundColor: Color['red100'], borderRadius: 5, padding: 6, marginLeft: 4 }}>사용중</Text> : <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 12, color: Color['blue500'], backgroundColor: Color['blue100'], borderRadius: 5, padding: 6, marginLeft: 4 }}>사용 가능</Text>}
                    </View>
                </View>
                <View style={{ height: 12 }} />
                {data?.length == 0 ?
                    <Pressable style={{ alignSelf: 'center', height: 200, borderWidth: 1, borderColor: Color['grey200'], borderRadius: 10, marginHorizontal: 6, width: width - 48, gap: 8, justifyContent: 'center' }}>
                        <Text style={{ textAlign: 'center', fontFamily: 'NanumSquareNeo-ExtraBold', fontSize: 38 }}>무주공산</Text>
                        <Text style={{ fontFamily: 'NanumSquareNeo-Bold', marginHorizontal: 64, color: Color['grey700'], textAlign: 'center', fontSize: 16 }}>
                            {`일정이 없어요`}
                        </Text>
                        <Text style={{ fontFamily: 'NanumSquareNeo-Light', color: Color['grey500'], textAlign: 'center' }}>
                            {`지금 연습실에 가면 바로 이용이 가능해요!`}</Text>
                    </Pressable>
                    :
                    <FlatList
                        contentContainerStyle={{ position: 'relative', alignItems: 'center' }}
                        data={loadData}
                        horizontal
                        pagingEnabled={true}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => item && ((item?.reservationName || 'false') + index)}
                        snapToInterval={width - 28}
                        snapToAlignment="center"
                        decelerationRate="fast"
                        renderItem={({ item, index }) => {
                            const startTime = Number(`${item.Time.startTime.slice(5, 7)}${item.Time.startTime.slice(7)}`)
                            const endTime = Number(`${item.Time.endTime.slice(5, 7)}${item.Time.endTime.slice(7)}`)

                            const now = new Date();
                            const currentTime = Number(`${now.getHours()}${now.getMinutes().toString().padStart(2, '0')}`);

                            const isPlayed = currentTime <= endTime && currentTime >= startTime

                            const color = item.isRegular ? 'blue' : item.isParticipatible ? 'green' : 'red';

                            if (isPlayed) {
                                setOnAir(true);
                                setParticipatible(item.isParticipatible);
                            }
                            return (
                                <>
                                    {isPlayed &&
                                        <View style={{ position: 'absolute', borderRadius: 10, height: '100%', width: width - 32, overflow: 'hidden' }}>
                                            <View style={{ position: 'absolute', borderRadius: 10, height: '100%', width: width - 32, overflow: 'hidden', backgroundColor: Color[`${color}100`] }} />
                                            <View style={{ position: 'absolute', left: 6, top: 6, borderRadius: 10, height: 204, width: width - 44, overflow: 'hidden', backgroundColor: Color[`${color}500`] }} />
                                            <BlurView intensity={10} tint='default' style={{ borderRadius: 10, height: '100%', width: width - 32, overflow: 'hidden', }} />
                                        </View>}
                                    <View key={item.reservationName + index} style={[{ marginVertical: 8, height: 200, borderWidth: 1, backgroundColor: '#FFF', borderColor: Color['grey200'], borderRadius: 10, marginHorizontal: 8 }, { width: width - 48 }]}>
                                        {item.isRegular ? <View style={{ position: 'absolute', height: 56, width: 48, right: 20, top: -4, }} >
                                            <Icons size={52} name={'bookmark-sharp'} color={Color['blue500']} />
                                        </View>
                                            : <View style={{ position: 'absolute', right: 20, top: 12, alignItems: 'flex-end' }}>
                                                <Text style={{ textAlign: 'right', fontFamily: 'NanumSquareNeo-Regular', fontSize: 16, color: Color['grey700'] }}>{item?.userName}</Text>
                                                <Text style={{ textAlign: 'right', fontFamily: 'NanumSquareNeo-Regular', fontSize: 12, color: Color['grey400'] }}>길동색시</Text>
                                            </View>}
                                        <Text numberOfLines={1} ellipsizeMode='tail' style={{ fontFamily: 'NanumSquareNeo-Bold', marginHorizontal: 64, top: 72, textAlign: 'center', fontSize: 20 }}>{item?.reservationName}</Text>
                                        <View style={{ position: 'absolute', right: 24, bottom: 24, alignItems: 'flex-end', gap: 2 }}>
                                            <Text style={{ textAlign: 'right', fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, color: Color['grey400'] }}>{`${item.Time.startTime.slice(5, 7)}:${item.Time.startTime.slice(7)}~${item.Time.endTime.slice(5, 7)}:${item.Time.endTime.slice(7)}`}</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}><Icons size={24} name={'people'} color={Color['grey300']} />
                                                <Text style={{ textAlign: 'right', fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, color: Color['grey400'] }}>
                                                    50
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </>
                            )
                        }}
                        ListHeaderComponent={() => {
                            return (<View style={{ width: 12 }} />)
                        }}
                        ListFooterComponent={() => {
                            return (<View style={{ width: 12 }} />)
                        }}
                    />}
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
            {loading && <View style={{ position: 'absolute', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)' }}>
                <ActivityIndicator size={'large'} color={'#FFF'} />
            </View>}
        </View>
    )
}

export default ReserveMainScreen

const styles = StyleSheet.create({})