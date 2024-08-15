
import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import { useNavigation } from "@react-navigation/native";
import { Color } from '../ColorSet';

interface HeaderProps {
    leftButton: string, HeaderName?: string, RightButton?: string, RightAction?: () => void, addLeftAction?: () => void
}

const Header: React.FC<HeaderProps> = ({ leftButton, HeaderName, RightButton, RightAction, addLeftAction }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.HeadrContainer}>
            <Pressable onPress={() => { navigation.goBack(); addLeftAction }} style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 11, left: 22, width: 28, height: 28, backgroundColor: Color['grey300'] }}>
                <Text style={styles.Text}>{leftButton}</Text>
            </Pressable>
            <Text style={styles.Title}>{HeaderName}</Text>
            {RightButton && <Pressable onPress={RightAction} style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 11, right: 22, height: 28, backgroundColor: Color['grey300'] }}>
                <Text style={styles.Text}>{RightButton}</Text>
            </Pressable>}
        </View>
    );
};


export default Header;


const styles = StyleSheet.create({
    Text: {
        fontFamily: "NanumSquareNeo-Bold",
        height: 24,
        color: Color['blue500'],
        fontSize: 18,
        textAlign: 'right',
        textAlignVertical: 'center'
    },
    Title: {
        fontFamily: "NanumSquareNeo-Bold",
        color: Color['grey800'],
        fontSize: 20
    },
    HeadrContainer: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        paddingHorizontal: 24
    }
})