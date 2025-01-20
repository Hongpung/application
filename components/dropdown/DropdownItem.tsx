// Dropdown/DropdownItem.tsx
import React from 'react';
import { useDropdown } from './Dropdown.context';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Color } from '@hongpung/ColorSet';
import { Icons } from '@hongpung/components/common/Icon';

interface DropdownItemProps {
    optionValue: string
    color?: 'blue' | 'green'
}

const DropdownItem: React.FC<DropdownItemProps> = ({ optionValue, color = 'blue' }) => {
    const { setValue, close, value } = useDropdown();

    const handleClick = () => {
        setValue(optionValue);
        close();
    };

    return (
        <Pressable
            style={styles.option}
            onPress={handleClick}
            role="button"
        >
            <Text style={[styles.optionText, value === optionValue && styles.selectedText]}>
                {optionValue}
            </Text>
            {value === optionValue && <Icons name='checkmark' color={Color[`${color}500`]} size={20} />}
        </Pressable>
    );
};

export default DropdownItem;

const styles = StyleSheet.create({
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
})