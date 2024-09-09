// AlertContext.js
import { createContext, useContext } from 'react';
import { Toaster, toast } from 'sonner';

const AlertContext = createContext();

export const useAlert = () => {
  return useContext(AlertContext);
};

export const AlertProvider = ({ children }) => {
  const showAlert = (message, options = {}) => {
    toast(message, options);
  };

  return (
    <AlertContext.Provider value={showAlert}>
      {children}
      <Toaster position="top-right" richColors />
    </AlertContext.Provider>
  );
};
