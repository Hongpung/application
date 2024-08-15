import { StyleSheet, Text, View, ScrollView, Image, Modal } from 'react-native'
import React from 'react'
import { Color } from '../ColorSet';
import { Instrument } from '../UserType';
import { useInstrument } from '../context/InstrumentContext';


const InstrumentEditScreen: React.FC<{ navigation: any }> = ({ navigation }) => {

    const { selectedInstrument } = useInstrument();

    const instrument = selectedInstrument!;


    return (
        <View style={{ flex: 1, backgroundColor: `#FFF`,  }}>
            <ScrollView contentContainerStyle={{ alignItems: 'center',flex:1 }}>
                <View style={{ height: 12 }} />
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: instrument?.imgURL }}
                        style={styles.image}
                    />
                </View>
                <View style={{ height: 28 }} />
                <View style={styles.Row}>
                    <Text style={styles.RowLeft}>{`악기`}</Text>
                    <Text style={styles.RowRight}>{instrument.name}</Text>
                    <Modal>
                    <View style={{
                        display: 'flex', position: 'absolute', right: 12, top: 0, zIndex: 10, backgroundColor: '#FFF', alignItems: 'flex-end',paddingHorizontal: 14, borderRadius: 5, shadowColor: Color['grey700'],
                        shadowOffset: { width: -2, height: 2 }, // 그림자 오프셋 (x, y)
                        shadowOpacity: 0.1,         // 그림자 투명도 (0에서 1)
                        shadowRadius: 5,          // 그림자 반경
                        elevation: 5,
                    }}>
                        <View style={{ width: 96, marginVertical: 6, paddingTop: 6 }}>
                            <Text style={{ fontFamily: "NanumSquareNeo-Regular", fontSize: 16, textAlign: 'right', color: Color['grey400'] }}>{`악기 유형`}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: 96, paddingVertical: 4, marginVertical: 2, alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ color: Color['blue500'], textAlignVertical:'center' }}>✅</Text><Text style={{ fontFamily: "NanumSquareNeo-Regular", fontSize: 16, textAlign: 'right', color: Color['blue500'] }}>{`꽹과리`}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: 96, paddingVertical: 4, marginVertical: 2, alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text></Text><Text style={{ fontFamily: "NanumSquareNeo-Regular", fontSize: 16, textAlign: 'right', color: Color['grey700'] }}>{`징`}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: 96, paddingVertical: 4, marginVertical: 2, alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text></Text><Text style={{ fontFamily: "NanumSquareNeo-Regular", fontSize: 16, textAlign: 'right', color: Color['grey700'] }}>{`장구`}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: 96, paddingVertical: 4, marginVertical: 2, alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text></Text><Text style={{ fontFamily: "NanumSquareNeo-Regular", fontSize: 16, textAlign: 'right', color: Color['grey700'] }}>{`북`}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: 96, paddingVertical: 4, marginVertical: 2, alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text></Text><Text style={{ fontFamily: "NanumSquareNeo-Regular", fontSize: 16, textAlign: 'right', color: Color['grey700'] }}>{`소고`}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: 96, paddingVertical: 4, marginVertical: 2, alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text></Text><Text style={{ fontFamily: "NanumSquareNeo-Regular", fontSize: 16, textAlign: 'right', color: Color['grey700'] }}>{`기타장비`}</Text>
                        </View>
                    </View>
                    </Modal>
                    
                </View>

                <View style={[styles.Row, { zIndex: -1 }]}>

                    <Text style={styles.RowLeft}>{`악기 타입`}</Text>
                    <Text style={styles.RowRight}>{instrument.type}</Text>

                </View>

                <View style={[styles.Row, { zIndex: -1 }]}>

                    <Text style={styles.RowLeft}>{`할당 치배`}</Text>
                    <Text style={styles.RowRight}>{instrument.owner ?? '-'}</Text>

                </View>
                <View style={[styles.Row, { zIndex: -1 }]}>

                    <Text style={styles.RowLeft}>{`별명`}</Text>
                    <Text style={styles.RowRight}>{instrument?.nickname}</Text>

                </View>
            </ScrollView>
        </View>
    )
}

export default InstrumentEditScreen

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

