// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
            setCurrentUser(JSON.parse(user));
        }
    }, []);

    const login = (token, userData) => {
        localStorage.setItem('token', token); 
        localStorage.setItem('user', JSON.stringify(userData)); 
        setCurrentUser(userData); 
    };

    const logout = () => {
        localStorage.removeItem('token'); 
        localStorage.removeItem('user'); 
        setCurrentUser(null); 
    };

    const value = {
        currentUser,
        login,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
