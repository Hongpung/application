import { StyleSheet, Text, View, ScrollView, Image, Modal, Pressable } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { Color } from '../../../../ColorSet';
import { Instrument } from '../../../../UserType';
import { useInstrument } from '@hongpung/context/InstrumentContext';
import LongButton from '../../../../components/buttons/LongButton';


const InstrumentEditScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [aspectRatio, setAspectRatio] = useState<number | null>(null);
    const [modalImgWidth, setModalImgWidth] = useState(332);
    useLayoutEffect(() => {
        Image.getSize(instrument?.imgURL, (width, height) => {
            setAspectRatio(width / height);
        }, (error) => {
            console.error(`Couldn't get the image size: ${error.message}`);
        });
        setModalImgWidth(340);
    }, []);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);

    const { selectedInstrument } = useInstrument();

    const instrument = selectedInstrument!;


    return (
        <View style={{ flex: 1, backgroundColor: `#FFF`, }}>
            <ScrollView contentContainerStyle={{ alignItems: 'center', flex: 1 }}>
                <View style={{ height: 12 }} />
                <Pressable style={styles.imageContainer}
                    onPress={() => {
                        setModalVisible2(true);
                    }}>
                    <Image
                        source={{ uri: instrument?.imgURL }}
                        style={styles.image}
                    />
                    <Modal visible={modalVisible2} transparent={true}>
                        <Pressable onPress={() => setModalVisible2(false)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' }}>
                            <Image
                                source={{ uri: instrument?.imgURL }}
                                style={[styles.image, { width: modalImgWidth, height: modalImgWidth / aspectRatio!, borderRadius: 15 }]}
                            />
                        </Pressable>
                    </Modal>
                </Pressable>
                <View style={{ height: 28 }} />
                <View style={styles.Row}>
                    <Text style={styles.RowLeft}>{`악기`}</Text>
                    <Pressable onPress={() => { setModalVisible(true) }}>
                        <Text style={styles.RowRight}>{instrument.name}</Text>
                    </Pressable>
                    <Modal visible={modalVisible} transparent={true}>
                        <Pressable onPress={() => { setModalVisible(false) }} style={{ flex: 1, zIndex: -1 }}>
                            <View style={{
                                display: 'flex', position: 'absolute', right: 24, top: 348, zIndex: 10, backgroundColor: '#FFF', alignItems: 'flex-end', paddingHorizontal: 14, borderRadius: 5, shadowColor: Color['grey700'],
                                shadowOffset: { width: -2, height: 2 }, // 그림자 오프셋 (x, y)
                                shadowOpacity: 0.1,         // 그림자 투명도 (0에서 1)
                                shadowRadius: 5,          // 그림자 반경
                                elevation: 5,
                            }}>
                                <View style={{ width: 96, marginVertical: 6, paddingTop: 6 }}>
                                    <Text style={{ fontFamily: "NanumSquareNeo-Regular", fontSize: 16, textAlign: 'right', color: Color['grey400'] }}>{`악기 유형`}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', width: 96, paddingVertical: 4, marginVertical: 2, alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text style={{ color: Color['blue500'], textAlignVertical: 'center' }}>✅</Text><Text style={{ fontFamily: "NanumSquareNeo-Regular", fontSize: 16, textAlign: 'right', color: Color['blue500'] }}>{`꽹과리`}</Text>
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
                        </Pressable>
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


            <View style={{ height: 8 }} />
            <LongButton color='red' innerText='삭제하기' isAble={true} onPress={() => navigation.goBack()} />
            <View style={{ height: 8 }} />
            <LongButton color='blue' innerText='저장하기' isAble={true} onPress={() => navigation.goBack()} />
            <View style={{ height: 8 }} />
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

