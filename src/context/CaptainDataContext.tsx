'use client';
import React, { createContext, useState, useContext } from 'react';

export const CaptainDataContext = createContext<any>(null);

export const CaptainDataProvider = ({ children }: { children: React.ReactNode }) => {
    const [captain, setCaptain] = useState(null);

    return (
        <CaptainDataContext.Provider value={{ captain, setCaptain }}>
            {children}
        </CaptainDataContext.Provider>
    );
};

export const useCaptain = () => useContext(CaptainDataContext);
