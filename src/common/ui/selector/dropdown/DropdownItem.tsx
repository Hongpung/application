// Dropdown/DropdownItem.tsx
import React from 'react';
import { useDropdown } from './Dropdown.context';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Color } from '../../../constant/color';
import { Icons } from '../../Icons/Icons';

interface DropdownItemProps<T extends string> {
    optionValue: T;
    color?: 'blue' | 'green';
    align?: 'left' | 'right';
}

const DropdownItem = <T extends string>({ 
    optionValue, 
    color = 'blue', 
    align = 'left' 
}: DropdownItemProps<T>) => {
    const { setValue, close, value } = useDropdown<T>();

    const handleClick = () => {
        setValue(optionValue);
        close();
    };

    return (
        <Pressable
            style={[styles.option, { flexDirection: align == 'left' ? 'row' : 'row-reverse' }]}
            onPress={handleClick}
            role="button"
        >
            <Text style={[styles.optionText, value === optionValue && {
                color: Color[`${color}500`],
            }]}>
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
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    optionText: {
        fontFamily: "NanumSquareNeo-Regular",
        fontSize: 16,
        color: Color['grey400'],
    },
});