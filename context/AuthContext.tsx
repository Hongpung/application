import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../UserType';

interface AuthContextType {
    token: string | null;
    loginUser: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: any }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
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

            if (result.token) {
                const { token } = result;
                setToken(token);
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
        await AsyncStorage.removeItem('token');
        setToken(null);
        setLoginUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, loginUser, login, logout }}>
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