import React, { createContext, useContext, useState, ReactNode } from 'react';
import { club } from '../../../../UserType';


export type SignUpInfo = {
    email: string
    password: string
    confirmPassword: string
    club: club | null
    grade: string
    name: string
    nickname: string | null
};

interface SignUpContextProps {
    signUpInfo: SignUpInfo;
    setSignUpInfo: (info: SignUpInfo) => void;
    setEmail: (email: string) => void;
    setConfirmPassword: (name: string) => void;
    setClub: (club: club) => void;
    setGrade: (grade: string) => void;
    setPassword: (name: string) => void;
    setNickName: (nickname: string) => void;
    setName: (name: string) => void;
}

const SignUpContext = createContext<SignUpContextProps | undefined>(undefined);

const SignUpProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [signUpInfo, setSignUpInfo] = useState<SignUpInfo>({
        email: '',
        password: '',
        confirmPassword: '',
        club: null,
        grade: '',
        name: '',
        nickname: null
    });

    const setEmail = (email: string) => { setSignUpInfo(prev => ({ ...prev, email })) }
    const setConfirmPassword = (name: string) => void;
    const setClub = (club: club) => { setSignUpInfo(prev => ({ ...prev, club })) }
    const setGrade = (grade: string) => { setSignUpInfo(prev => ({ ...prev, grade })) }
    const setPassword = (name: string) => { setSignUpInfo(prev => ({ ...prev, name })) }
    const setNickName = (nickname: string) => { setSignUpInfo(prev => ({ ...prev, nickname })) }
    const setName = (name: string) => { setSignUpInfo(prev => ({ ...prev, name })) }

    return (
        <SignUpContext.Provider value={{
            signUpInfo,
            setSignUpInfo,
            setEmail,
            setPassword,
            setConfirmPassword,
            setClub,
            setGrade,
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
