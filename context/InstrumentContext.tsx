import React, { createContext, useContext, useState } from 'react';
import { Instrument } from '../UserType';


interface IndstrumentContextProps {
    selectedInstrument: Instrument | null;
    setSelectedInstrument: (instrument: Instrument | null) => void;
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
}

const InstrumentContext = createContext<IndstrumentContextProps | undefined>(undefined);

const InstrumentProvider: React.FC<{children:any}> = ({ children }) => {
    const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <InstrumentContext.Provider value={{ selectedInstrument, setSelectedInstrument, modalVisible, setModalVisible }}>
            {children}
        </InstrumentContext.Provider>
    );
};

const useInstrument = () => {
    const context = useContext(InstrumentContext);
    if (context === undefined) {
        throw new Error('usInstrument must be used within a InstrumentProvider');
    }
    return context;
};

export { InstrumentProvider, useInstrument };