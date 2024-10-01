import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Animated, Pressable, KeyboardTypeOptions, Platform } from 'react-native';
import { Color } from '../../ColorSet';
import { josa } from 'es-hangul';

type InputProps = {
    length?: number,
    label: string,
    isEncryption?: boolean,
    validationCondition?: { validation: (value: string) => boolean, errorText: string }[]
    checkValid?: (valid: boolean) => void
    color?: string
    isEditible?: boolean
    isRequired?: boolean
    isRequiredMark?: boolean
    inputValue: string,
    setInputValue?: (text: string) => void,
    onFocus?: () => void
    keyboardType?: KeyboardTypeOptions
    maxLength?: number
}

const InputComponent = forwardRef<TextInput, InputProps>(({ length = 284, label, isEncryption = false, validationCondition, checkValid, color, isEditible = true, isRequired = true, isRequiredMark = false, inputValue, setInputValue, onFocus, keyboardType = 'default', maxLength = undefined }, ref) => {

    const [isTyped, setIsTyped] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const [errorText, setErrorText] = useState(``)
    const labelAnimation = useRef(new Animated.Value(0)).current; // 애니메이션 초기 값
    const inputRef = useRef<TextInput>(null); // 내부적으로 TextInput 참조

    const [isVisible, setIsVisible] = useState(isEncryption);

    const underlineColor = color ? Color[color + "500"] : Color[`blue500`];

    useEffect(() => {
        Animated.timing(labelAnimation, {
            toValue: isTyped ? 1 : 0,
            duration: 100,
            useNativeDriver: false,
        }).start();
    }, [isTyped]);

    const handleTextChange = useCallback((text: string) => {
        if (setInputValue) {
            setInputValue(text);
        }
    }, [setInputValue]);

    const handleFocus = useCallback(() => {
        if (setInputValue) {
            setInputValue(inputValue);
        }
        setIsTyped(true);
        onFocus && onFocus();
    }, [onFocus]);

    const errored = useCallback((text: string) => {
        setIsValid(false);
        setErrorText(text)
    }, [])

    const validateInput = useCallback(() => {
        if (inputValue.length === 0 && isRequired) {
            setIsTyped(false);
            setIsValid(false);
            setErrorText(josa(label, '을/를') + ' 입력해야 해요');
            if (checkValid) checkValid(false);
            return false;
        }
        if (validationCondition && Array.isArray(validationCondition)) {
            for (const { validation, errorText } of validationCondition) {
                if (!validation(inputValue)) {
                    setErrorText(errorText);
                    setIsValid(false);
                    if (checkValid) checkValid(false);
                    return false;
                }
            }
        }

        setIsValid(true);
        if (checkValid) checkValid(true);
        return true;
    }, [inputValue, validationCondition, checkValid, label, isRequired]);


    useImperativeHandle(ref, () => ({
        ...(inputRef.current as any),// TextInput의 기본 메서드와 속성 복사
        validate: validateInput, // 추가 메서드
        errored: (text: string) => { errored(text) },
        focus: () => inputRef.current?.focus(), // 기존 메서드
        blur: () => inputRef.current?.blur(),
    }));

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
        <View style={[styles.inputGroup, { width: length + 16 }]}>
            <Animated.Text style={[styles.labelText, labelStyle]}>{label}
                {isRequiredMark && !isTyped && <Text style={{ color: 'red' }}>*</Text>}</Animated.Text>
            <TextInput
                key={label}
                ref={inputRef}
                style={[styles.InputBox, { width: length }]}
                placeholder={`${josa(label, '을/를')} 입력하세요` + `${!isRequired ? ' (공백시 본명 적용)' : ``}`}
                value={inputValue}
                onFocus={handleFocus}
                onEndEditing={validateInput}
                onChangeText={handleTextChange}
                secureTextEntry={isEncryption ? isVisible : false}
                editable={isEditible}
                keyboardType={keyboardType}
                maxLength={maxLength}
                returnKeyType='done'
                autoCapitalize='none'
                clearTextOnFocus={false}
                autoComplete='off'
                multiline={false}
            />
            <View style={[styles.underline, { borderBottomColor: isValid ? underlineColor : Color["red500"], width: length + 16 }]} />

            {isEncryption &&
                <Pressable
                    style={[styles.VisibleBtn, { backgroundColor: isVisible ? "#000" : "#FFF" }]}
                    onPress={() => { setIsVisible(!isVisible) }} />
            }
            {!isValid && errorText.length > 0 && <Text style={styles.errorText}>{errorText}</Text>}
        </View>
    );
});

const styles = StyleSheet.create({
    inputGroup: {
        width: 300,
    },
    underline: {
        width: 300,
        borderBottomWidth: 1,
        marginTop: 1,
    },
    InputBox: {
        width: 284,
        color: Color['grey800'],
        fontSize: 16,
        height: 36,
        fontFamily: 'NanumSquareNeo-Regular',
        paddingTop: 8,
        marginLeft: 8,
        placeholderTextColor: Color['grey500']
    },
    labelText: {
        width: 150,
        color: Color['grey800'],
        fontSize: 10,
        fontFamily: 'NanumSquareNeo-Bold',
        height: 12
    },
    errorText: {
        color: Color['red500'],
        fontFamily: 'NanumSquareNeo-Bold',
        marginTop: 8,
        marginLeft: 8,
        fontSize: 14
    },
    VisibleBtn: {
        position: 'absolute',
        right: 4,
        top: 16,
        width: 32,
        height: 32,
        borderWidth: 1,
        borderColor: "#000"
    }
});

export default InputComponent;