// Dropdown/DropdownTrigger.tsx
import React, { FC } from 'react';
import { useDropdown } from './Dropdown.context';

export interface DropdownTriggerProps {
    as: React.ElementType;
    children: React.FC<{ value: string | null }>
}

const DropdownTrigger: FC<DropdownTriggerProps> = ({ as: Component, children, ...props }) => {
    const { toggle, value } = useDropdown();

    return (
        <Component onPress={toggle} {...props}>
            {children({ value: value })}
        </Component>
    );
};

export default DropdownTrigger;
