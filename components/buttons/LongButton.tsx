import { StyleSheet, Text, Pressable } from 'react-native'
import React from 'react';
import { Color } from '../../ColorSet';

type LongButtonProps = {
    innerText: string,
    onPress: () => void,
    isAble: boolean,
    color: string
}

const LongButton: React.FC<LongButtonProps> = React.memo(({ innerText, onPress, isAble, color }) => {
    return (
        <Pressable
            style={[styles.basic, { backgroundColor: isAble ? Color[color + "500"] : Color[color + "300"] }]}
            onPress={() => {
                isAble && onPress();
            }}
        >
            <Text style={[styles.basicText, { color: !isAble ? Color[color + "100"] : 'white' }]}>{innerText}</Text>
        </Pressable>
    )
})

export default LongButton

const styles = StyleSheet.create({
    basic: {
        marginHorizontal: 24,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    }, basicText: {
        fontSize: 16,
        fontWeight: 500,
        textAlign: 'center'
    }
})