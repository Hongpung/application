import React from "react";
import { DropdownProvider } from "./Dropdown.context";
import { View } from "react-native";

interface DropdownProps<T extends string> {
  label: string;
  value: T | null;
  visible: boolean;
  onChange: (value: T) => void;
  setVisible: (newValue: boolean) => void;
  children: React.ReactNode;
}

const DropdownContainer = <T extends string>({
  label,
  value,
  visible,
  onChange,
  setVisible,
  children,
}: DropdownProps<T>) => {
  return (
    <DropdownProvider
      value={value}
      visible={visible}
      setVisible={setVisible}
      setValue={onChange}
    >
      <View>{children}</View>
    </DropdownProvider>
  );
};

export default DropdownContainer;
