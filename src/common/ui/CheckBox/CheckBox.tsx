import { StyleSheet, Text, View, Pressable, StyleProp, TextStyle } from 'react-native'
import React from 'react'
import { Color } from '../../constant/color';


interface CheckBoxProps {
    innerText?: string,
    onCheck: (check: boolean) => void,
    isChecked: boolean
}

const CheckBox: React.FC<{ isChecked: boolean }> = ({ isChecked }) => {

    if (!isChecked)
        return (
            <View style={styles.checkboxBorder} />
        )

    return (
        <View style={styles.checkboxBorder}>
            <View style={styles.checkboxFill} />
        </View>
    )
}

const CheckBoxComment: React.FC<{ innerText: string, style?: StyleProp<TextStyle> }> = ({ innerText, style }) => {
    return (<Text style={style} > {innerText}</Text >)
}

const CheckboxComponent: React.FC<CheckBoxProps> = ({ isChecked, onCheck, innerText }) => {

    const toggleCheck = () => { onCheck(!isChecked) }
    return (
        <Pressable
            style={styles.container}
            onPress={toggleCheck}
        >
            <CheckBox isChecked={isChecked} />
            {innerText && <CheckBoxComment style={[styles.innerText, { color: isChecked ? Color['grey800'] : Color['grey400'] }]} innerText={innerText} />}
        </Pressable>
    )
}

export { CheckboxComponent }

const styles = StyleSheet.create({
    container: {
        display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8
    },
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
        color: Color['blue800']
    }
})