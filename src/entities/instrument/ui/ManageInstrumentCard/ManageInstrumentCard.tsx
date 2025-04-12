import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Image } from 'expo-image'

import { Color } from '@hongpung/src/common'

import { Instrument } from '../../model/type'
import { InstrumentTag } from '../InstrumentTag/InstrumentTag'

interface ManageInstrumentCardProps {
    instrument: Instrument
    onClickInstrument: (instrument: Instrument) => void
}

export const ManageInstrumentCard: React.FC<ManageInstrumentCardProps> = (props) => {

    const { instrument, onClickInstrument } = props

    return (
        <Pressable
            onPress={() => onClickInstrument(instrument)}
            style={[styles.card, { height: 156 }]}>
            <View>
                <View style={styles.imageContainer}>
                    {instrument.imageUrl ?
                        <Image
                            source={instrument.imageUrl}
                            style={styles.image}
                            contentFit="cover"
                            contentPosition="center"
                        /> :
                        <View style={{ backgroundColor: Color['grey100'], flex: 1, height: 200, width: 300 }}>
                        </View>}
                </View>

                <View style={styles.tagContainer}>
                    <InstrumentTag borrowAvailable={instrument.borrowAvailable} />
                </View>
                <View style={styles.nameContainer}>
                    <Text style={styles.nameText}>
                        {instrument.name}
                    </Text>
                </View>
            </View>
        </Pressable>
    )
}


const styles = StyleSheet.create({
    card: {
        width: 154,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: Color['grey200'],
    },
    imageContainer: {
        overflow: 'hidden',
        width: 132,
        height: 88,
        borderRadius: 5,
        marginLeft: 10,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        height: 132,
        width: 132,
    },
    tagContainer: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginTop: 8,
        height: 18,
    },
    nameText: {
        fontSize: 16,
        fontFamily: "NanumSquareNeo-Bold",
        color: Color['gre700'],
        textAlignVertical: 'center'
    },
    nameContainer: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginTop: 4,
        height: 18,
    },
})