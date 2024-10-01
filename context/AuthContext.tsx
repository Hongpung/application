import React, { createContext, useState, useContext } from 'react';
import { User } from '../UserType';
import { deleteToken, saveToken } from '@hongpung/utils/TokenHandler';

interface AuthContextType {
    loginUser: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: any }> = ({ children }) => {
    const [loginUser, setLoginUser] = useState<User | null>(null)

    const controller = new AbortController();
    const signal = controller.signal;

    const login = async (email: string, password: string) => {
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        try {

            const loginData = { email, password }

            const response = await fetch(`${process.env.BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
                signal
            });

            if (!response.ok) {
                throw new Error('Network response was not ok' + response.status);
            }
            const result = await response.json();

            console.log(result)

            if (result.token) {
                const { token } = result;
                await saveToken('token', token);
                return true;
            }
        } catch (e) {
            console.error(e)
        } finally {
            clearTimeout(timeoutId);
        }
        return false;
    };

    const logout = async () => {
        await deleteToken('token');
        setLoginUser(null);
    };

    return (
        <AuthContext.Provider value={{ loginUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};