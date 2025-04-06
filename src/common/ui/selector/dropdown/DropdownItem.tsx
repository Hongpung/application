// Dropdown/DropdownItem.tsx
import React from 'react';
import { useDropdown } from './Dropdown.context';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Color } from '@hongpung/ColorSet';
import { Icons } from '@hongpung/src/common/ui';

interface DropdownItemProps {
    optionValue: string
    color?: 'blue' | 'green'
    align?: 'left' | 'right'
}

const DropdownItem: React.FC<DropdownItemProps> = ({ optionValue, color = 'blue', align = 'left' }) => {
    const { setValue, close, value } = useDropdown();

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
})