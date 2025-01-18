import React from "react"
import { View, StyleSheet, Text, Pressable, Image } from "react-native"

import { Color } from "@hongpung/ColorSet"
import { InstrumentWithOutBorrowHistory } from "@hongpung/UserType"

type ViewMode = "inManage" | "inBorrow";

interface instrumentCardProps {
    instrument: InstrumentWithOutBorrowHistory
    view: ViewMode
    isPicked?: boolean
    onClickInstrument: (instrument: InstrumentWithOutBorrowHistory) => void
}

const InstrumentTag: React.FC<{ borrowAvailable: boolean }> = ({ borrowAvailable }) => {
    return (
        <View style={[styles.tag, {
            backgroundColor: borrowAvailable ? Color['blue100'] : Color['red100']
        }]}>
            <Text style={[styles.tagText, { color: borrowAvailable ? Color['blue500'] : Color['red500'] }]}>
                {borrowAvailable ? '대여 가능' : '분실'}
            </Text>
        </View>
    )
}

const InstrumentCard: React.FC<instrumentCardProps> = ({ instrument, view, isPicked, onClickInstrument }) => {
    return (
        <Pressable
            onPress={() => onClickInstrument(instrument)}
            style={[styles.card, { height: 156 }, isPicked && { borderColor: Color['blue500'], backgroundColor: Color['blue100'], borderWidth: 1, }]}>
            <View>
                <View style={styles.imageContainer}>
                    {instrument.imageUrl ?
                        <Image
                            source={{ uri: instrument.imageUrl }}
                            style={styles.image}
                            resizeMode="cover"
                        /> :
                        <View style={{ backgroundColor: Color['grey100'], flex: 1, height: 200, width: 300 }}>
                        </View>}
                </View>

                <View style={styles.tagContainer}>
                    {view == `inManage` ?
                        <InstrumentTag borrowAvailable={instrument.available} />
                        :
                        <Text style={styles.clubText}>
                            {'@ ' + instrument.club}
                        </Text>}
                </View>
                <View style={styles.nameContainer}>
                    <Text style={[styles.nameText, isPicked && { color: Color['blue500'] }]}>
                        {instrument.name}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
};


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
    tag: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
        paddingVertical: 3,
        borderRadius: 5,
        marginRight: 4,
    },
    tagText: {
        fontSize: 12,
        fontFamily: "NanumSquareNeo-Bold",
        lineHeight: 12,
        textAlignVertical: 'center'
    },
    clubText: {
        alignSelf: 'center',
        color: Color['grey300'],
        fontSize: 12,
        fontFamily: "NanumSquareNeo-Bold",
        textAlignVertical: 'center'
    },
    nameContainer: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginTop: 4,
        height: 18,
    },
    nameText: {
        fontSize: 16,
        fontFamily: "NanumSquareNeo-Bold",
        color: Color['gre700'],
        textAlignVertical: 'center'
    },
    nickNameContainer: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginTop: 4,
    },
    nickNameText: {
        color: Color['grey400'],
        fontSize: 12,
        fontFamily: "NanumSquareNeo-Regular",
    },
});

export default InstrumentCard;


