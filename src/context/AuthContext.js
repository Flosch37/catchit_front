// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Tente de récupérer le token et les données utilisateur au démarrage de l'application
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
            setCurrentUser(JSON.parse(user));
        }
    }, []);

    const login = (token, userData) => {
        localStorage.setItem('token', token); // Stockage du token JWT dans localStorage
        localStorage.setItem('user', JSON.stringify(userData)); // Stockage des données utilisateur
        setCurrentUser(userData); // Mise à jour de l'état de l'utilisateur actuel
    };

    const logout = () => {
        localStorage.removeItem('token'); // Suppression du token JWT de localStorage
        localStorage.removeItem('user'); // Suppression des données utilisateur
        setCurrentUser(null); // Réinitialisation de l'état de l'utilisateur actuel
    };

    const value = {
        currentUser,
        login,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
