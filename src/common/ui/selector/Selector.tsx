import Dropdown from "./dropdown";

interface SelectProps<T extends string> {
    label: string;
    value: T | null;
    onChange: (value: T) => void;
    visible: boolean;
    setVisible: (newValue: boolean) => void;
    trigger: React.ElementType;
    options: readonly T[];
    children: React.ReactNode;
    color?: 'blue' | 'green';
    align?: 'left' | 'right';
}

export const Selector = <T extends string>({ 
    label, 
    trigger, 
    visible, 
    setVisible, 
    value, 
    onChange, 
    options, 
    children, 
    color = 'blue', 
    align = 'left' 
}: SelectProps<T>) => {
    return (
        <Dropdown label={label} value={value} onChange={onChange} visible={visible} setVisible={setVisible}>
            <Dropdown.Trigger as={trigger}>
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
