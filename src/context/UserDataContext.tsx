'use client';
import React, { createContext, useState, useContext } from 'react';

export const UserDataContext = createContext<any>(null);

export const UserDataProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState({
        email: '',
        fullname: {
            firstname: '',
            lastname: ''
        }
    });

    return (
        <UserDataContext.Provider value={{ user, setUser }}>
            {children}
        </UserDataContext.Provider>
    );
};

export const useUser = () => useContext(UserDataContext);
