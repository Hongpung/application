import { StyleSheet, Text, Pressable } from 'react-native'
import React from 'react';
import { Color } from '../../ColorSet';

type ShortButtonProps = {
    innerText: string,
    onPress: () => void,
    isFilled: boolean,
    color: string
}

const ShortButton: React.FC<ShortButtonProps> = React.memo(({ innerText, onPress, isFilled, color }) => {
    const colorKey: string = `${color}500`;
    const subColor: string = `${color}100`
    return (
        <Pressable
            style={[styles.basic, { backgroundColor: isFilled ? Color[colorKey] : Color[subColor], borderColor: Color[colorKey] }]}
            onPress={() => onPress()}
        >
            <Text style={[styles.basicText, { color: !isFilled ? Color[colorKey] : 'white' }]}>{innerText}</Text>
        </Pressable>
    )
})

export default ShortButton

const styles = StyleSheet.create({
    basic: {
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        width: 148
    }, basicText: {
        fontSize: 16,
        fontWeight: 500,
        textAlign: 'center'
    }
})