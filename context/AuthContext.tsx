import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../UserType';
import { BASBASE_URL } from '@env';

interface AuthContextType {
    token: string | null;
    loginUser: User | null;
    login: (username: string, password: string) => Promise<void>;
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
            const response = await fetch(`${BASBASE_URL}/auth/login`, {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                signal
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
              }
            const result = await response.json();
            if (result.token) {
                setToken(result.token);
                const { name,
                    nickname = null,
                    club,
                    instrument,
                    grade,
                    isCapt = null,
                    addRole = null,
                    badge = null,
                    ProfileUri = null } = result
                setLoginUser({
                    name,
                    nickname,
                    club,
                    instrument,
                    grade,
                    isCapt,
                    addRole,
                    badge, //url임
                    ProfileUri
                })
            }
        } catch (e) {
            console.error(e)
        }finally{
            clearTimeout(timeoutId);
        }

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