import React, { createContext, useContext, ReactNode } from 'react';

interface DropdownContextProps<T extends string> {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  value: T | null;
  setValue: (value: T) => void;
}

const DropdownContext = createContext<DropdownContextProps<any> | undefined>(undefined);

export const useDropdown = <T extends string>() => {
  const context = useContext(DropdownContext) as DropdownContextProps<T> | undefined;
  if (!context) {
    throw new Error('Dropdown 컴포넌트는 DropdownProvider 내에서 사용되어야 합니다.');
  }
  return context;
};

interface DropdownProviderProps<T extends string> {
  children: ReactNode;
  visible: boolean;
  setVisible: (newValue: boolean) => void;
  value: T | null;
  setValue: (newValue: T) => void;
}

export const DropdownProvider = <T extends string>({ 
  children, 
  visible, 
  setVisible, 
  value, 
  setValue 
}: DropdownProviderProps<T>) => {
  const toggle = () => setVisible(!visible);
  const close = () => setVisible(false);

  return (
    <DropdownContext.Provider value={{ isOpen: visible, toggle, close, value, setValue }}>
      {children}
    </DropdownContext.Provider>
  );
};
