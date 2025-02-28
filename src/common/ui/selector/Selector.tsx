import { useEffect, useRef } from "react";
import { Animated, Pressable, Text, View, StyleSheet } from "react-native";
import { Icons } from "@hongpung/src/common";
import { Color } from "@hongpung/ColorSet";
import Dropdown from "./dropdown";

interface ClubSelectorProps {
    label: string
    value: string | null
    onChange: (newValue: string) => void,
    isErrored: boolean
    errorText: string
    dropDownVisible: boolean
    setDropDownVisible: (value: boolean) => void,
    options: string[]
}

interface SelectorLabelProps {
    label: string;
    value: string | null;
    isErrored: boolean;
    errorText: string;
    children: React.ReactNode
    onPress?: () => void
}

const ClubSelectorLabel: React.FC<SelectorLabelProps> = ({ label, value, isErrored, errorText, onPress, children }) => {
    const labelAnimation = useRef(new Animated.Value(value ? 1 : 0)).current; // 초기 값 설정
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

    useEffect(() => {
        Animated.timing(labelAnimation, {
            toValue: value ? 1 : 0,
            duration: 100,
            useNativeDriver: false,
        }).start();
    }, [value]);

    return (
        <Pressable style={{ width: '100%' }} onPress={onPress}>
            {label.length > 0 && <Animated.Text style={[styles.labelText, labelStyle]}>
                {label}
                <Text style={{ color: 'red' }}>*</Text>
            </Animated.Text>}

            <View style={[styles.inputBox]}>
                <Text style={[styles.inputText, !value && styles.placeholderText]}>
                    {children}
                </Text>
                <Icons name='caret-down' color={Color['green500']} size={20} />
            </View>
            <View style={[styles.underline, { borderBottomColor: !isErrored ? Color["green500"] : Color["red500"] }]} />
            {isErrored && <Text style={styles.errorText}>{errorText}</Text>}
        </Pressable>
    );
};

interface SelectProps {
    label: string;
    value: string | null;
    onChange: (value: string) => void;
    visible: boolean;
    setVisible: (newValue: boolean) => void;
    trigger: React.ElementType;
    options: string[];
    children: React.ReactNode

    color?: 'blue' | 'green'
    align?: 'left' | 'right'
}

export const Selector: React.FC<SelectProps> = ({ label, trigger, visible, setVisible, value, onChange, options, children, color = 'blue', align = 'left' }) => {
    return (
        <Dropdown label={label} value={value} onChange={onChange} visible={visible} setVisible={setVisible}>
            <Dropdown.Trigger as={trigger} >
                {children}
            </Dropdown.Trigger>
            <Dropdown.Menu>
                {options.map((option) => (
                    <Dropdown.Item key={option} optionValue={option} color={color} align={align} />
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};


export const ClubSelector: React.FC<ClubSelectorProps> = ({
    label,
    value,
    onChange,
    isErrored,
    options,
    dropDownVisible,
    errorText,
    setDropDownVisible
}) => {

    const handleSelect = (newValue: string) => {
        onChange(newValue);
        setDropDownVisible(false);
    };

    return (
        <View style={styles.container}>
            <Selector
                label={label}
                onChange={handleSelect}
                value={value}
                options={options}
                visible={dropDownVisible}
                setVisible={setDropDownVisible}
                trigger={Pressable}
                color="green"
            >
                <ClubSelectorLabel
                    label={label}
                    value={value}
                    isErrored={isErrored}
                    errorText={errorText}
                    onPress={() => setDropDownVisible(!dropDownVisible)}
                >
                    {value || label}
                </ClubSelectorLabel>
            </Selector>
        </View>
    );
};


const styles = StyleSheet.create({
    inputGroup: {
        width: '100%',
        height: 'auto'
    },
    underline: {
        width: '100%',
        borderBottomWidth: 1,
        marginTop: 1,
    },
    InputBox: {
        color: Color['grey500'],
        fontSize: 16,
        height: 36,
        fontFamily: 'NanumSquareNeo-Regular',
        paddingTop: 8,
        marginLeft: 8,
    },
    InputText: {
        color: Color['grey800'],
        fontSize: 16,
        fontFamily: 'NanumSquareNeo-Bold',
    },
    inputBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    placeholderText: {
        color: Color['grey300'],
    },
    inputText: {
        fontFamily: "NanumSquareNeo-Regular",
        fontSize: 16,
        color: '#000',
    },
    dropdown: {
        position: 'absolute',
        top: 56, // SelectorLabel의 높이에 맞춰 조정
        zIndex: 2,
        width: 142,
        backgroundColor: '#FFF',
        alignItems: 'flex-start',
        paddingHorizontal: 16,
        borderRadius: 5,
        shadowColor: Color['grey700'],
        shadowOffset: { width: -2, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        maxHeight: 180,
    },
    scrollContainer: {
        alignItems: 'flex-start',
    },
    option: {
        paddingVertical: 8,
        marginVertical: 4,
        width: 142 - 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    optionText: {
        fontFamily: "NanumSquareNeo-Regular",
        fontSize: 16,
        color: Color['grey400'],
    },
    selectedText: {
        color: Color['green600'],
    },
    container: {
        flex: 1,
        position: 'relative',
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
        marginLeft: 10,
        fontSize: 12
    },
})
