import { StyleSheet, Text, View, ScrollView, Image, ActivityIndicator } from 'react-native'
import React, { useMemo } from 'react'
import { useIsFocused, useRoute } from '@react-navigation/native';
import { Color } from '../../../../ColorSet';
import { Instrument } from '../../../../UserType';
import { useInstrument } from '@hongpung/context/InstrumentContext';
import useFetch from '@hongpung/hoc/useFetch';
import Header from '@hongpung/components/Header';



const InstrumentSpecificScreen: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
    const { instrumentId } = route?.params;

    const daysOfWeek = useMemo(() => ['일', '월', '화', '수', '목', '금', '토'], [])

    const isFocusing = useIsFocused();
    const { data, loading, error } = useFetch<Instrument>(
        `${process.env.BASE_URL}/instrument/${instrumentId}`
        , {}, 5000, [instrumentId,isFocusing]
    )

    

    const reservesList = () => {
        const Cards = []
        data?.borrowHistory.sort((a, b) => new Date(a.borrowDate).getTime() - new Date(b.borrowDate).getTime())
        for (const reserve of data!.borrowHistory) {
            const borrowDate = new Date(reserve.borrowDate);
            Cards.push(
                <View key={reserve.borrowerName + reserve.borrowDate} style={{ width: 320, height: 76, borderRadius: 5, borderWidth: 1, borderColor: Color['grey200'], marginVertical: 6 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end', position: 'absolute', left: 14, top: 12 }}>
                        <Text style={{
                            fontSize: 16,
                            fontFamily: "NanumSquareNeo-Regular",
                            color: Color['grey700'],
                            marginRight: 2
                        }}>{reserve.borrowerName}</Text>
                        {reserve?.borrowerNickname && <Text style={{
                            fontSize: 14,
                            fontFamily: "NanumSquareNeo-Regular",
                            color: Color['grey400']
                        }}>{reserve.borrowerNickname}</Text>}
                    </View>
                    <View style={{ position: 'absolute', left: 14, bottom: 12 }}>
                        <Text style={{
                            fontSize: 16,
                            fontFamily: "NanumSquareNeo-Regular",
                            color: Color['grey400']
                        }}>{reserve.borrowerName}</Text>
                    </View>
                    <View style={{ position: 'absolute', right: 12, bottom: 12 }}>
                        <Text style={{
                            textAlign: 'right',
                            fontSize: 14,
                            fontFamily: "NanumSquareNeo-Regular",
                            color: Color['grey400']
                        }}>{borrowDate.getFullYear() + '.' + (borrowDate.getMonth() + 1 < 9 ? '0' : '') + (borrowDate.getMonth() + 1) + '.' + (borrowDate.getDate() < 9 ? '0' : '') + '(' + (daysOfWeek[borrowDate.getDay()]) + ')'}</Text>
                    </View>
                </View>
            )
        }
        return Cards;
    }

    if (loading)
        return (<View style={{ flex: 1, backgroundColor: `#FFF` }}>
            <ActivityIndicator size={'large'} color={Color['blue500']}/>
            </View>)

    if (!data)
        return (<View><Text>Error:Can't find the instrument</Text></View>)
    return (
        <View style={{ flex: 1, backgroundColor: `#FFF` }}>
            <Header
                leftButton='close'
                HeaderName='악기 상세'
                RightButton='수정'
                RightAction={() => navigation.push('InstrumentEdit',{instrumentInform:JSON.stringify(data)})}
            />
            <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
                <View style={{ height: 12 }} />
                <View style={styles.imageContainer}>
                    {data.imgURL ? <Image
                        source={{ uri: data?.imgURL }}
                        style={styles.image}
                    /> :
                        <View
                            style={[styles.image, { backgroundColor: Color['grey200'] }]}
                        />
                    }
                </View>
                <View style={{ height: 28 }} />
                <View style={styles.Row}>

                    <Text style={styles.RowLeft}>{`악기 이름`}</Text>
                    <Text style={styles.RowRight}>{data.name}</Text>

                </View>

                <View style={{ height: 14 }} />

                <View style={styles.Row}>

                    <Text style={styles.RowLeft}>{`악기 타입`}</Text>
                    <Text style={styles.RowRight}>{data.type}</Text>

                </View>

                {/* <View style={styles.Row}>

                    <Text style={styles.RowLeft}>{`할당 치배`}</Text>
                    <Text style={styles.RowRight}>{data.owner ?? '-'}</Text>

                </View>
                {data.nickname && <View style={styles.Row}>

                    <Text style={styles.RowLeft}>{`별명`}</Text>
                    <Text style={styles.RowRight}>{data.nickname}</Text>

                </View>} */}

                <View style={{ height: 20 }} />
                <View style={{ alignSelf: 'flex-start', paddingHorizontal: 28 }}>
                    <View>
                        <Text style={{ fontSize: 18, fontFamily: "NanumSquareNeo-Bold", }}>대여 내역</Text>
                    </View>
                </View>
                <View style={{ paddingVertical: 6 }}>
                    {data.borrowHistory.length > 0 && reservesList()}
                </View>
                <View style={{ height: 18 }} />
            </ScrollView>
        </View>
    )
}

export default InstrumentSpecificScreen

const styles = StyleSheet.create({
    card: {
        width: 154,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: Color['grey200'],
    },
    imageContainer: {
        overflow: 'hidden',
        width: 308,
        height: 204,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 308,
        height: 204,
    },
    Row: {
        flexDirection: 'row',
        height: 40,
        width: 342,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12
    },
    RowLeft: {
        fontFamily: "NanumSquareNeo-Regular",
        fontSize: 16,
        color: Color['grey400']
    },
    RowRight: {
        fontFamily: "NanumSquareNeo-Regular",
        fontSize: 16,
        color: Color['grey700']
    }
})

