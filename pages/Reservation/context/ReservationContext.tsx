import React, { createContext, useContext, useState, ReactNode } from 'react';
import { InstrumentWithOutBorrowHistory, Instrument, User } from "@hongpung/UserType"
import { Reservation } from '../ReservationInterface'

interface ReservationContextProps {
    preReservation: Reservation;
    setPreReservation: (reservation: Reservation) => void;
    reservation: Reservation;
    setReservation: (reservation: Reservation) => void;
    setDate: (date: Date | null) => void;
    setTime: (startTime: string, endTime: string) => void;
    setName: (name: string) => void;
    setIsRegular: (isRegular: boolean) => void;
    setIsParticipatible: (isParticipatible: boolean) => void;
    setParticipants: (participants: User[]) => void;
    setBorrowInstruments: (borrowInstruments: InstrumentWithOutBorrowHistory[]) => void;
    setHasWait: (hasToWait: boolean) => void
}

const ReservationContext = createContext<ReservationContextProps | undefined>(undefined);

const ReservationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [reservation, setReservation] = useState<Reservation>({
        borrowInstruments: [],
        isParticipatible: false,
        participators: [],
        reservationName: '',
        time: { startTime: '', endTime: '' },
        reservationType: 'EXTERNAL'
    });

    const [preReservation, setPreReservation] = useState<Reservation>({
        borrowInstruments: [],
        isParticipatible: false,
        participators: [],
        reservationName: '',
        time: { startTime: '', endTime: '' },
        reservationType: 'EXTERNAL'
    });

    const setDate = (date: Date | null) => {
        if (!date) {
            setReservation(prev => ({ ...prev, date: undefined }));
            return;
        }
        if (date > new Date()) setReservation(prev => ({ ...prev, date }));
    }
    const setTime = (startTime: string, endTime: string) => setReservation(prev => ({ ...prev, time: { startTime, endTime } }));
    const setName = (name: string) => setReservation(prev => ({ ...prev, reservationName: name }));
    const setIsRegular = (isRegular: boolean) => setReservation(prev => ({ ...prev, isRegular }));
    const setIsParticipatible = (isParticipatible: boolean) => setReservation(prev => ({ ...prev, isParticipatible }));
    const setParticipants = (participants: User[]) => setReservation(prev => ({ ...prev, participators: participants }));
    const setBorrowInstruments = (borrowInstruments: InstrumentWithOutBorrowHistory[]) => setReservation(prev => ({ ...prev, borrowInstruments }));
    const setHasWait = (hasToWait: boolean) => setReservation(prev => ({ ...prev, hasToWait }));

    return (
        <ReservationContext.Provider value={{
            preReservation,
            setPreReservation,
            reservation,
            setReservation,
            setDate,
            setTime,
            setName,
            setIsRegular,
            setIsParticipatible,
            setParticipants,
            setBorrowInstruments,
            setHasWait
        }}>
            {children}
        </ReservationContext.Provider>
    );
};

const useReservation = () => {
    const context = useContext(ReservationContext);
    if (context === undefined) {
        throw new Error('useReservation must be used within a ReservationProvider');
    }
    return context;
};

export { ReservationProvider, useReservation };
