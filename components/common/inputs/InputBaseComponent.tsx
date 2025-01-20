import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, Ref } from 'react';
import { View, Text, StyleSheet, TextInput, Animated, Pressable, KeyboardTypeOptions, Dimensions } from 'react-native';
import { Color } from '@hongpung/ColorSet';
import { josa } from 'es-hangul';
import { Icons } from '@hongpung/components/common/Icon';

// 입력 상태 입력전, 입력 중, 입력 완료, 오류
// 오류 판별은 외부에 일임해야함
const { width } = Dimensions.get('window')

type InputProps = {
    ref?: Ref<TextInput>
    label: string,
    inputValue: string
    setInputValue: (text: string) => void
    validationCondition: { state: 'PENDING' | 'BEFORE' | 'VALID' } | { state: 'ERROR', errorText: string }
    onBlur?: () => void;
    onFocus?: () => void;
    isEditible?: boolean
    isRequired?: boolean
    isEncryption?: boolean,
    keyboardType?: KeyboardTypeOptions
    color?: "red" | "blue" | "green";
    maxLength?: number
}

export const InputBaseComponent = forwardRef<TextInput, InputProps>(({ label, isEncryption = false, color = "blue", isEditible = true, isRequired = true, inputValue, setInputValue, keyboardType = 'default', maxLength = undefined, validationCondition, onBlur, onFocus }, ref) => {
    // 암호화 상태일때 보이는지 안보이는지 판별
    const [isVisible, setIsVisible] = useState(!isEncryption);

    const labelAnimation = useRef(new Animated.Value(0)).current; // 애니메이션 초기 값
    //언더라인 색상 - 기본은 파란색
    const underlineColor = Color[color + "500"];

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
    //유저가 값을 기입하면 레이블 축소 됨
    useEffect(() => {
        Animated.timing(labelAnimation, {
            toValue: inputValue.length > 0 ? 1 : 0,
            duration: 100,
            useNativeDriver: false,
        }).start();
    }, [inputValue]);

    return (
        <View style={[styles.inputGroup]}>
            <Animated.Text style={[styles.labelText, labelStyle]}>
                {label}
                {isRequired && <Text style={{ color: 'red' }}>*</Text>}
            </Animated.Text>
            <TextInput
                key={label}
                ref={ref}
                style={[styles.InputBox]}
                placeholder={`${josa(label, '을/를')} 입력하세요` + `${!isRequired ? ' (없으면 빈칸)' : ``}`}
                value={inputValue}
                onChangeText={setInputValue}
                secureTextEntry={isEncryption ? !isVisible : false}
                editable={isEditible}
                keyboardType={keyboardType}
                maxLength={maxLength}
                onFocus={onFocus}
                onBlur={onBlur}
                returnKeyType='done'
                multiline={false}
            />
            <View style={[styles.underline, { borderBottomColor: validationCondition?.state != 'ERROR' ? underlineColor : Color["red500"] }]} />
            {isEncryption &&
                <Pressable
                    style={[styles.VisibleBtn]}
                    onPress={() => { setIsVisible(!isVisible) }} >
                    <Icons name={isVisible ? 'eye-outline' : 'eye-off-outline'}></Icons>
                </Pressable>
            }
            {validationCondition?.state == 'ERROR' && <Text style={styles.errorText}>{validationCondition?.errorText}</Text>}
        </View>
    );
});

const styles = StyleSheet.create({
    inputGroup: {
        width: '100%',
        height:'auto'
    },
    underline: {
        borderBottomWidth: 1,
        marginTop: 1,
    },
    InputBox: {
        color: Color['grey800'],
        fontSize: 16,
        height: 36,
        fontFamily: 'NanumSquareNeo-Regular',
        paddingTop: 8,
        marginLeft: 8,
        placeholderTextColor: Color['grey500']
    },
    labelText: {
        color: Color['grey800'],
        fontSize: 10,
        fontFamily: 'NanumSquareNeo-Bold',
        height: 12
    },
    errorText: {
        color: Color['red500'],
        fontFamily: 'NanumSquareNeo-Bold',
        marginTop: 8,
        marginLeft: 10,
        fontSize: 12
    },
    VisibleBtn: {
        position: 'absolute',
        right: 4,
        top: 16,
        width: 32,
        height: 32
    }
});