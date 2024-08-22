import React, { useState } from "react"
import { View, StyleSheet, Text, Pressable, Image } from "react-native"

import { Color } from "../../ColorSet"
import { Instrument } from "../../UserType"
import { useInstrument } from "../../pages/Home/MyClub/Instruments/context/InstrumentContext";


const InstrumentCard: React.FC<{ instrument: Instrument, view: "inManage" | "inBorrow", navigation?: any }> = ({ instrument, view, navigation }) => {

    const [isPicked, setPicked] = useState(false && view == "inBorrow");
    const { setSelectedInstrument } = useInstrument();
    const ClickHandler = () => {
        if (view == "inBorrow")
            setPicked(isPicked => !isPicked)

        else { navigation.push('InstrumentSpecific'); setSelectedInstrument(instrument) }
    }
    const renderTag = () => {
        return (
            <View style={[styles.tag, {
                backgroundColor: instrument.state == '분실' ? Color['red100'] : Color['blue100']
            }]}>
                <Text style={[styles.tagText, { color: instrument.state == '분실' ? Color['red500'] : Color['blue500'] }]}>
                    {'분실'}
                </Text>
            </View>
        )
    }


    return (
        <Pressable
            onPress={ClickHandler}
            style={[styles.card, { height: instrument?.nickname ? 172 : 156 }, isPicked && { borderColor: Color['blue500'], backgroundColor: Color['blue100'], borderWidth: 1, }]}>
            <View>
                <View style={styles.imageContainer}>
                    {instrument.imgURL?<Image
                        source={{ uri: instrument.imgURL }}
                        style={styles.image}
                    />:
                    <View style={{backgroundColor:Color['grey100'], flex:1,height:200,width:300}}>
                    </View>}
                </View>

                <View style={styles.tagContainer}>
                    {view == `inManage` ?
                        instrument?.state && renderTag()
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
                {instrument.nickname && <View style={styles.nickNameContainer}>
                    <Text style={styles.nickNameText}>
                        {instrument.nickname}
                    </Text>
                </View>}
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
        textAlignVertical:'center'
    },
    clubText: {
        alignSelf: 'center',
        color: Color['grey300'],
        fontSize: 12,
        fontFamily: "NanumSquareNeo-Bold",
        textAlignVertical:'center'
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
        textAlignVertical:'center'
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


