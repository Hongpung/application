import Dropdown from "./dropdown";

interface SelectProps<T extends string> {
  label: string;
  value?: T | null;
  setValue: (value: T) => void;
  visible: boolean;
  setVisible: (newValue: boolean) => void;
  onBlur?: () => void;
  trigger: React.ElementType;
  options: readonly T[];
  children: React.ReactNode;
  color?: "blue" | "green";
  align?: "left" | "right";
}

export const Selector = <T extends string>({
  label,
  trigger,
  visible,
  setVisible,
  value,
  setValue,
  onBlur,
  options,
  children,
  color = "blue",
  align = "left",
}: SelectProps<T>) => {
  return (
    <Dropdown
      label={label}
      value={value}
      setValue={setValue}
      visible={visible}
      setVisible={setVisible}
      onBlur={onBlur}
    >
      <Dropdown.Trigger as={trigger}>{children}</Dropdown.Trigger>
      <Dropdown.Menu>
        {options.map((option) => (
          <Dropdown.Item
            key={option}
            optionValue={option}
            color={color}
            align={align}
          />
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};
