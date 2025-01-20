// Dropdown/DropdownContext.tsx
import React, { createContext, useContext, useState, ReactNode, FC } from 'react';

interface DropdownContextProps {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  value: string | null;
  setValue: (value: string) => void;
}

const DropdownContext = createContext<DropdownContextProps | undefined>(undefined);

export const useDropdown = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('Dropdown 컴포넌트는 DropdownProvider 내에서 사용되어야 합니다.');
  }
  return context;
};

interface DropdownProviderProps {
  children: ReactNode;
  visible: boolean;
  setVisible: (newValue: boolean) => void
  value: string | null;
  setValue: (newValue: string) => void
}

export const DropdownProvider: FC<DropdownProviderProps> = ({ children, visible, setVisible, value, setValue }) => {

  const toggle = () => setVisible(!visible);
  const close = () => setVisible(false);

  return (
    <DropdownContext.Provider value={{ isOpen: visible, toggle, close, value, setValue }}>
      {children}
    </DropdownContext.Provider>
  );
};
