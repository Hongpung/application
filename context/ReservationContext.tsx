import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Instrument, User } from "../UserType"

export type Reservation = {
    date: Date;
    Time: { startTime: number, endTime: number };
    name: string;
    isRegular: boolean;
    isParticipatible: boolean;
    participants: User[];
    borrowInstruments: Instrument[];
    hasToWait: boolean;
};

interface ReservationContextProps {
    reservation: Reservation;
    setReservation: (reservation: Reservation) => void;
    setDate: (date: Date) => void;
    setTime: (startTime: number, endTime: number) => void;
    setName: (name: string) => void;
    setIsRegular: (isRegular: boolean) => void;
    setIsParticipatible: (isParticipatible: boolean) => void;
    setParticipants: (participants: User[]) => void;
    setBorrowInstruments: (borrowInstruments: Instrument[]) => void;
    setHasWait: (hasToWait: boolean) => void
}

const ReservationContext = createContext<ReservationContextProps | undefined>(undefined);

const ReservationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [reservation, setReservation] = useState<Reservation>({
        date: new Date(),
        Time: { startTime: 0, endTime: 0 },
        name: '',
        isRegular: false,
        isParticipatible: true,
        participants: [],
        borrowInstruments: [],
        hasToWait: false
    });

    const setDate = (date: Date) => { if (date > new Date()) setReservation(prev => ({ ...prev, date })); }
    const setTime = (startTime: number, endTime: number) => setReservation(prev => ({ ...prev, Time: { startTime, endTime } }));
    const setName = (name: string) => setReservation(prev => ({ ...prev, name }));
    const setIsRegular = (isRegular: boolean) => setReservation(prev => ({ ...prev, isRegular }));
    const setIsParticipatible = (isParticipatible: boolean) => setReservation(prev => ({ ...prev, isParticipatible }));
    const setParticipants = (participants: User[]) => setReservation(prev => ({ ...prev, participants }));
    const setBorrowInstruments = (borrowInstruments: Instrument[]) => setReservation(prev => ({ ...prev, borrowInstruments }));
    const setHasWait = (hasToWait: boolean) => setReservation(prev => ({ ...prev, hasToWait }));

    return (
        <ReservationContext.Provider value={{
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
