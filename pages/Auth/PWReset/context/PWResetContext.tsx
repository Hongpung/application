import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';


export interface PasswordResetInfo {
    email: string
    newPassword: string
};

type step = "이메일 인증" | "비밀번호 재설정";

interface PasswordResetContextProps {
    passwordResetInfo: PasswordResetInfo;
    onStep: step;
    setStep: (step: step) => void;
    setPasswordResetInfo: (info: PasswordResetInfo) => void;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
}

const PasswordResetContext = createContext<PasswordResetContextProps | undefined>(undefined);

const PasswordResetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [passwordResetInfo, setPasswordResetInfo] = useState<PasswordResetInfo>({
        email: '',
        newPassword: '',
    });
    const [onStep, setStep] = useState<step>('이메일 인증')

    const setEmail = (email: string) => { setPasswordResetInfo(prev => ({ ...prev, email })) }
    const setPassword = (password: string) => { setPasswordResetInfo(prev => ({ ...prev, password })) }


    return (
        <PasswordResetContext.Provider value={{
            passwordResetInfo,
            onStep,
            setStep,
            setPasswordResetInfo,
            setEmail,
            setPassword,
        }
        }>
            {children}
        </PasswordResetContext.Provider>
    );
};

const usePasswordReset = () => {
    const context = useContext(PasswordResetContext);
    if (context === undefined) {
        throw new Error('useSignUp must be used within a SignUpProvider');
    }
    return context;
};

export { PasswordResetProvider, usePasswordReset };
