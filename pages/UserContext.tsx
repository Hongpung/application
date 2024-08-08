import React, { createContext, useContext, useState } from 'react';
import { User } from '../userInterface';

interface UserContextProps {
    selectedUser: User | null;
    setSelectedUser: (user: User | null) => void;
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
}

//유저 컨텍스트
const UserContext = createContext<UserContextProps | undefined>(undefined);

//유저 프로바이더
const UserProvider: React.FC<{children:any}> = ({ children }) => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <UserContext.Provider value={{ selectedUser, setSelectedUser, modalVisible, setModalVisible }}>
            {children}
        </UserContext.Provider>
    );
};

//유스 유저 hoc
const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export { UserProvider, useUser };