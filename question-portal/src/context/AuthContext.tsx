import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { getCurrentUser } from '../services/authService';

interface User {
    id: number;
    email: string;
    role: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => { },
    loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const user = await getCurrentUser(token);
                setUser(user);
            } catch (error: any) {
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    setUser(null);
                } else {
                    console.warn('Error fetching user:', error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
