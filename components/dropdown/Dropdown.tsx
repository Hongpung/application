// Dropdown/Dropdown.tsx
import React from 'react';
import { DropdownProvider } from './Dropdown.context';
import { View } from 'react-native';

interface DropdownProps {
    label: string;
    value: string | null;
    visible: boolean
    onChange: (value: string) => void;
    setVisible: (newValue: boolean) => void
    children: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({ label, value, visible, onChange, setVisible, children }) => {
    return (
        <DropdownProvider value={value} visible={visible} setVisible={setVisible} setValue={onChange}>
            <View>
                {children}
            </View>
        </DropdownProvider>
    );
};

export default Dropdown;
