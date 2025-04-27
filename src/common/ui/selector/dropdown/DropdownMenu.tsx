// Dropdown/DropdownMenu.tsx
import React, { FC } from 'react';
import { useDropdown } from './Dropdown.context';
import { ScrollView, View } from 'react-native';
import { Color } from '@hongpung/src/common';

export interface DropdownMenuProps {
    children: React.ReactNode;
}

const DropdownMenu: FC<DropdownMenuProps> = ({ children }) => {
    const { isOpen } = useDropdown();

    if (!isOpen) return null;

    return (
        <View style={{
            position: 'absolute', top: '100%', paddingVertical: 8, paddingHorizontal: 12, flexDirection: 'column', gap: 4, backgroundColor: 'white',
            shadowColor: Color['grey700'],
            shadowOffset: { width: -2, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 5,
            maxHeight: 160,
            borderRadius: 10
        }}>
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                {children}
            </ScrollView>
        </View>
    );
};

export default DropdownMenu;
