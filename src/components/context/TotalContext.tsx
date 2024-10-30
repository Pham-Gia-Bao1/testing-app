// src/components/context/TotalContext.tsx
"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TotalContextState {
  total: number;
  setTotal: (total: number) => void;
}

const TotalContext = createContext<TotalContextState | undefined>(undefined);

interface TotalProviderProps {
  children: ReactNode;
}

export const TotalProvider: React.FC<TotalProviderProps> = ({ children }) => {
  const [total, setTotal] = useState<number>(0);

  return (
    <TotalContext.Provider value={{ total, setTotal }}>
      {children}
    </TotalContext.Provider>
  );
};

export const useTotal = (): TotalContextState => {
  const context = useContext(TotalContext);
  if (!context) {
    throw new Error('useTotal must be used within a TotalProvider');
  }
  return context;
};
