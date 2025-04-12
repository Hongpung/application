import Dropdown from "./dropdown";


interface SelectProps{
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
