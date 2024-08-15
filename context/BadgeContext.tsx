import React, { createContext, useContext, useState } from 'react';

// 배지 타입 정의
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

//배지 컨텍스트
const BadgeContext = createContext<BadgeContextProps | undefined>(undefined);

//배지 프로바이더
const BadgeProvider: React.FC<{children:any}> = ({ children }) => {
    const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <BadgeContext.Provider value={{ selectedBadge, setSelectedBadge, modalVisible, setModalVisible }}>
            {children}
        </BadgeContext.Provider>
    );
};

//유스 배지 hoc
const useBadge = () => {
    const context = useContext(BadgeContext);
    if (context === undefined) {
        throw new Error('useBadge must be used within a BadgeProvider');
    }
    return context;
};

export { BadgeProvider, useBadge };