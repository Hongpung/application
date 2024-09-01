import { FlatList, StyleSheet, Text, View, Dimensions, Pressable, NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import React, { useRef } from 'react'
import { Color } from '../../ColorSet'


const { width } = Dimensions.get('window');

const ReserveMainScreen: React.FC<{ navigation: any }> = ({ navigation }) => {

    const flatListRef = useRef<FlatList>(null);

    const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / (width - 100));

        flatListRef.current?.scrollToIndex({ index, animated: true });
    };


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
                    ref={flatListRef}
                    contentContainerStyle={{ alignItems: 'center' }}
                    data={[{ id: '22', title: '222' }, { id: '32', title: '222222222222222222222' }, { id: '222', title: '2222' }]}
                    horizontal
                    pagingEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => item.id}
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
                            <Text numberOfLines={1} ellipsizeMode='tail' style={{ fontFamily: 'NanumSquareNeo-Bold', marginHorizontal: 64, top: 72, textAlign: 'center', fontSize: 20 }}>{item.title}</Text>
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
                    onPress={() => navigation.push('ReserveCalendar')}>
                    <Text style={{ position: 'absolute', left: 8, bottom: 8, fontSize: 16, fontFamily: 'NanumSquareNeo-Heavy', color: Color['grey700'] }}>연습실 예약 조회</Text>
                </Pressable>
                <Pressable style={{ width: (width - 48) / 2 - 4, backgroundColor: Color['grey400'], borderRadius: 10 }}>
                    <Text style={{ position: 'absolute', right: 8, top: 8, fontSize: 16, fontFamily: 'NanumSquareNeo-Heavy', color: '#FFF' }}>활동 조회</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default ReserveMainScreen

const styles = StyleSheet.create({})