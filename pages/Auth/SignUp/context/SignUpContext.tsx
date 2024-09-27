import React, { createContext, useContext, useState, ReactNode } from 'react';
import { club } from '../../../../UserType';


export type SignUpInfo = {
    email: string
    password: string
    club: club | null
    enrollmentNumber: string
    name: string
    nickname: string | null
};

interface SignUpContextProps {
    signUpInfo: SignUpInfo;
    setSignUpInfo: (info: SignUpInfo) => void;
    setEmail: (email: string) => void;
    setClub: (club: club) => void;
    setEnrollmentNumber: (enrollmentNumber: string) => void;
    setPassword: (password: string) => void;
    setNickName: (nickname: string) => void;
    setName: (name: string) => void;
}

const SignUpContext = createContext<SignUpContextProps | undefined>(undefined);

const SignUpProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [signUpInfo, setSignUpInfo] = useState<SignUpInfo>({
        email: '',
        password: '',
        club: null,
        enrollmentNumber: '',
        name: '',
        nickname: null
    });

    const setEmail = (email: string) => { setSignUpInfo(prev => ({ ...prev, email })) }
    const setClub = (club: club) => { setSignUpInfo(prev => ({ ...prev, club })) }
    const setEnrollmentNumber = (enrollmentNumber: string) => { setSignUpInfo(prev => ({ ...prev, enrollmentNumber: enrollmentNumber })) }
    const setPassword = (password: string) => { setSignUpInfo(prev => ({ ...prev, password })) }
    const setNickName = (nickname: string) => { setSignUpInfo(prev => ({ ...prev, nickname: nickname.length > 0 ? nickname : null })) }
    const setName = (name: string) => { setSignUpInfo(prev => ({ ...prev, name })) }

    return (
        <SignUpContext.Provider value={{
            signUpInfo,
            setSignUpInfo,
            setEmail,
            setPassword,
            setClub,
            setEnrollmentNumber,
            setName,
            setNickName,
        }
        }>
            {children}
        </SignUpContext.Provider>
    );
};

const useSignUp = () => {
    const context = useContext(SignUpContext);
    if (context === undefined) {
        throw new Error('useSignUp must be used within a SignUpProvider');
    }
    return context;
};

export { SignUpProvider, useSignUp };
