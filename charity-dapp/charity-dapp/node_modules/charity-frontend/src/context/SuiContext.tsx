import React, { createContext, useContext, ReactNode } from 'react';
import { SuiClient } from '@mysten/sui/client';
import { suiClientConfig } from '../config/suiConfig';

interface SuiContextType {
  client: SuiClient;
}

const SuiContext = createContext<SuiContextType | undefined>(undefined);

export const SuiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const client = new SuiClient(suiClientConfig);

  return (
    <SuiContext.Provider value={{ client }}>
      {children}
    </SuiContext.Provider>
  );
};

export const useSuiClient = () => {
  const context = useContext(SuiContext);
  if (!context) {
    throw new Error('useSuiClient must be used within SuiProvider');
  }
  return context.client;
};
