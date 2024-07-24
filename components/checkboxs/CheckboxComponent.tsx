import { StyleSheet, Text, View, Pressable } from 'react-native'
import React, { useState } from 'react'
import { Color } from '../../ColorSet';


interface CheckBoxProps {
    innerText?: string,
    onCheck?: () => void,
}

const CheckboxComponent: React.FC<CheckBoxProps> = ({ innerText, onCheck }) => {

    const [isChecked, setIsChecked] = useState(false);

    return (
        <Pressable
            style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
            onPress={() => setIsChecked(!isChecked)}>
            <View style={styles.checkboxBorder}>
                {isChecked ? <View style={styles.checkboxFill} /> : null}
            </View>
            {innerText ? <Text style={styles.innerText}>{innerText}</Text> : null}
        </Pressable>
    )
}

export default CheckboxComponent

const styles = StyleSheet.create({
    checkboxBorder: {
        height: 24,
        width: 24,
        borderRadius: 2.5,
        borderWidth: 2,
        borderColor: Color['blue500']
    }, checkboxFill: {
        backgroundColor: Color['blue500'],
        width: 16,
        height: 16,
        top: 2,
        left: 2
    }, innerText: {
        fontFamily: "NanumSquareNeo-Bold",
        fontSize: 14,
        marginLeft: 10,
        color: Color['blue800']
    }
})