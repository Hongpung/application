
import { StyleSheet, Text, View, Pressable } from 'react-native'
import React, { ComponentProps } from 'react'
import { useNavigation } from "@react-navigation/native";
import { Color } from '../../ColorSet';
import { Ionicons } from '@expo/vector-icons';
import { Icons } from './Icon';

interface HeaderProps {
    leftButton: ComponentProps<typeof Ionicons>['name'] | null
    HeaderName?: string
    RightButton?: string | React.ReactNode
    RightAction?: () => void
    addLeftAction?: () => void
    LeftAction?: () => void
}

const Header: React.FC<HeaderProps> = ({ leftButton, HeaderName, RightButton, RightAction, addLeftAction, LeftAction }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.HeadrContainer}>
            <Pressable onPress={() => {
                if (!LeftAction) {
                    navigation.goBack();
                } else {
                    LeftAction();
                }
                if (addLeftAction)
                    addLeftAction();
            }}
                style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 11, left: 22, width: 28, height: 28 }}
            >
                {leftButton != null && < Icons size={24} name={leftButton ?? 'close'} color={Color['blue500']} />}
            </Pressable>
            <Text style={styles.Title}>{HeaderName}</Text>
            {RightButton && <Pressable onPress={RightAction} style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 11, right: 22, height: 28 }}>
                {!!RightButton && typeof RightButton == 'string' ? <Text style={styles.Text}>{RightButton}</Text> : RightButton}
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