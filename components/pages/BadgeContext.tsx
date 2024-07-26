import React, { createContext, useContext, useState } from 'react';

// Badge 타입 정의
export type Badge = {
    name: string;
    imgUrl: string;
    descript: string;
    isHave:boolean;
}

interface BadgeContextProps {
    selectedBadge: Badge | null;
    setSelectedBadge: (badge: Badge | null) => void;
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
}

const BadgeContext = createContext<BadgeContextProps | undefined>(undefined);

const BadgeProvider: React.FC<{children:any}> = ({ children }) => {
    const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <BadgeContext.Provider value={{ selectedBadge, setSelectedBadge, modalVisible, setModalVisible }}>
            {children}
        </BadgeContext.Provider>
    );
};

const useBadge = () => {
    const context = useContext(BadgeContext);
    if (context === undefined) {
        throw new Error('useBadge must be used within a BadgeProvider');
    }
    return context;
};

export { BadgeProvider, useBadge };