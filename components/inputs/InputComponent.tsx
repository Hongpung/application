import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Animated, Pressable } from 'react-native';
import { Color } from '../../ColorSet';
import { josa } from 'es-hangul';

type InputProps = {
    label: string,
    isEncryption?: boolean,
    validationCondition?: { validation: RegExp, errorText: string },
    checkValid?: (valid: boolean) => void,
    value?: string
    color?: string
    isEditible?: boolean
    isRequired?: boolean
    isRequiredMark?: boolean
}

const InputComponent: React.FC<InputProps> = ({ label, isEncryption, validationCondition, value, checkValid, color, isEditible = true, isRequired = true, isRequiredMark = false }) => {

    const [inputValue, setInputValue] = useState(value||'');
    const [isTyped, setIsTyped] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const [errorText, setErrorText] = useState(``)
    const labelAnimation = useRef(new Animated.Value(0)).current; // 애니메이션 초기 값

    const [isVisible, setIsVisible] = useState(isEncryption || false);

    const underlineColor = color ? Color[color + "500"] : Color[`blue500`];

    useEffect(() => {
        Animated.timing(labelAnimation, {
            toValue: isTyped ? 1 : 0,
            duration: 100,
            useNativeDriver: false,
        }).start();
    }, [isTyped]);

    const handleTextChange = (text: string) => {
        setInputValue(text);
    };

    const handleFocus = () => {
        setIsTyped(true);
    }

    const handleBlur = () => {
        if (inputValue.length == 0 && isRequired) {
            setIsTyped(false);
            setIsValid(false);
            setErrorText(josa(label, '을/를') + ' 입력해야해요')
        } else if (validationCondition?.validation) {
            const regex: RegExp = validationCondition!.validation;
            const newCondition = regex.test(inputValue);
            setIsValid(newCondition);
            if (!newCondition) setErrorText(validationCondition!.errorText)

            if (checkValid) checkValid(newCondition);
        }
    }

    const labelStyle = {
        fontSize: labelAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [12, 10],
        }),
        top: labelAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [5, 3],
        }),
    };
    return (
        <View style={styles.inputGroup}>
            <View style={[styles.underline, { borderBottomColor: isValid ? underlineColor : Color["red500"] }]} />
            {isEncryption ? <TextInput
                style={styles.InputBox}
                placeholder={`${josa(label, '을/를')} 입력하세요`+`${!isRequired ? +'(공백시 본명 적용)' : ''}`}
                value={inputValue}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChangeText={handleTextChange}
                secureTextEntry={isVisible} />
                :
                <TextInput
                    style={styles.InputBox}
                    placeholder={`${josa(label, '을/를')} 입력하세요`+`${!isRequired ? ' (공백시 본명 적용)' : ''}`}
                    value={inputValue}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChangeText={handleTextChange}
                    editable={isEditible}
                />
            }
            <Animated.Text style={[styles.labelText, labelStyle]}>{label}
                {isRequiredMark && !isTyped && <Text style={{ color: 'red' }}>*</Text>}</Animated.Text>
            {isEncryption ?
                <Pressable style={{ position: 'absolute', left: 273, top: 26, width: 18, height: 18, borderWidth: 1, borderColor: "#000", backgroundColor: isVisible ? "#000" : "#FFF" }}
                    onPress={() => { setIsVisible(!isVisible) }} />
                : null}
            {!isValid ? <Text style={styles.errorText}>{errorText}</Text> : null}
        </View>
    );
}
const styles = StyleSheet.create({
    inputGroup: {
        width: 300,
        height: 54,
        position: 'relative',
    },
    underline: {
        width: 300,
        height: 35,
        position: 'absolute',
        borderBottomWidth: 1,
        top: 19,
    },
    InputBox: {
        width: 284,
        height: 28,
        position: 'absolute',
        color: Color['grey800'],
        fontSize: 16,
        fontFamily: 'NanumSquareNeo-Bold',
        lineHeight: 22,
        top: 22,
        left: 8,
        placeholderTextColor: Color['grey500'],
        outline: 0,
    },
    labelText: {
        width: 150,
        height: 22,
        position: 'absolute',
        color: Color['grey800'],
        fontSize: 10,
        fontFamily: 'NanumSquareNeo-Bold',
        lineHeight: 22,
        top: 0,
        left: 4,
    },
    errorText: {
        position: 'absolute',
        color: Color['red500'],
        fontFamily: 'NanumSquareNeo-Bold',
        top: 60,
        left: 8,
        fontSize: 14
    },
});

export default InputComponent;