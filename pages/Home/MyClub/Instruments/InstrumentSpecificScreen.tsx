import { StyleSheet, Text, View, ScrollView, Image } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native';
import { Color } from '../../../../ColorSet';
import { Instrument } from '../../../../UserType';
import { useInstrument } from '@hongpung/context/InstrumentContext';

interface Reserve {
    date: Date
    user: string,
    reserveName: string,
    nickname?: string
}

const InstrumentSpecificScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const {selectedInstrument} = useInstrument();
    const instrument:Instrument = selectedInstrument!;
    
    const preReserves: Reserve[] = [
        {
            date: new Date('2023-11-30'),
            user: '김기동',
            reserveName: '따로 연습',
        },
        {
            date: new Date('2023-11-21'),
            user: '이정효',
            nickname: '광주 감독',
            reserveName: '광주 연승',
        },
        {
            date: new Date('2023-11-13'),
            user: '이정효',
            nickname: '광주 감독',
            reserveName: '광주 연승',
        },
        {
            date: new Date('2023-11-22'),
            user: '이정효',
            nickname: '광주 감독',
            reserveName: '광주 연승',
        },
        {
            date: new Date('2023-11-11'),
            user: '이정효',
            nickname: '광주 감독',
            reserveName: '광주 연승',
        }
    ]
    const reservesList = () => {
        const Cards = []
        preReserves.sort((a, b) => a.date.getTime() - b.date.getTime())
        for (const reserve of preReserves) {
            Cards.push(
                <View key={reserve.reserveName+reserve.date} style={{ width: 320, height: 76, borderRadius: 5, borderWidth: 1, borderColor: Color['grey200'], marginVertical: 6 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end', position: 'absolute', left: 14, top: 12 }}>
                        <Text style={{
                            fontSize: 16,
                            fontFamily: "NanumSquareNeo-Regular",
                            color: Color['grey700'],
                            marginRight: 2
                        }}>{reserve.user}</Text>
                        {reserve?.nickname && <Text style={{
                            fontSize: 14,
                            fontFamily: "NanumSquareNeo-Regular",
                            color: Color['grey400']
                        }}>{reserve.nickname}</Text>}
                    </View>
                    <View style={{ position: 'absolute', left: 14, bottom: 12 }}>
                        <Text style={{
                            fontSize: 16,
                            fontFamily: "NanumSquareNeo-Regular",
                            color: Color['grey400']
                        }}>{reserve.reserveName}</Text>
                    </View>
                    <View style={{ position: 'absolute', right: 12, bottom: 12 }}>
                        <Text style={{
                            textAlign: 'right',
                            fontSize: 14,
                            fontFamily: "NanumSquareNeo-Regular",
                            color: Color['grey400']
                        }}>{reserve.date.getFullYear() + '.' + (reserve.date.getMonth() + 1 < 9 ? '0' : '') + (reserve.date.getMonth() + 1) + '.' + (reserve.date.getDate() < 9 ? '0' : '') + (reserve.date.getDate()) + '(금)'}</Text>
                    </View>
                </View>
            )
        }
        return Cards;
    }

    if (instrument == undefined)
        return (<View><Text>Error:Can't find the instrument</Text></View>)
    return (
        <View style={{ flex: 1, backgroundColor:`#FFF`}}>
            <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
                <View style={{height:12}}/>
                <View style={styles.imageContainer}>
                    {instrument.imgURL?<Image
                        source={{ uri: instrument?.imgURL }}
                        style={styles.image}
                    />:
                    <View
                    style={[styles.image, {backgroundColor:Color['grey200']}]}
                    />
                    }
                </View>
                <View style={{ height: 28 }} />
                <View style={styles.Row}>

                    <Text style={styles.RowLeft}>{`악기`}</Text>
                    <Text style={styles.RowRight}>{instrument.name}</Text>

                </View>

                <View style={styles.Row}>

                    <Text style={styles.RowLeft}>{`악기 타입`}</Text>
                    <Text style={styles.RowRight}>{instrument.type}</Text>

                </View>

                <View style={styles.Row}>

                    <Text style={styles.RowLeft}>{`할당 치배`}</Text>
                    <Text style={styles.RowRight}>{instrument.owner ?? '-'}</Text>

                </View>
                {instrument.nickname && <View style={styles.Row}>

                    <Text style={styles.RowLeft}>{`별명`}</Text>
                    <Text style={styles.RowRight}>{instrument.nickname}</Text>

                </View>}

                <View style={{ height: 20 }} />
                <View style={{ alignSelf: 'flex-start', paddingHorizontal: 28 }}>
                    <View>
                        <Text style={{ fontSize: 18, fontFamily: "NanumSquareNeo-Bold", }}>대여 내역</Text>
                    </View>
                </View>
                <View style={{ paddingVertical: 6 }}>
                    {preReserves && reservesList()}
                </View>
                <View style={{height:18}}/>
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

