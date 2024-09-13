// AlertContext.js
import { createContext, useContext } from 'react';
import { Toaster, toast } from 'sonner';

const AlertContext = createContext();

export const useAlert = () => {
  return useContext(AlertContext);
};

export const AlertProvider = ({ children }) => {
  const showAlert = (message, type = 'default', options = {}) => {
    switch (type) {
      case 'success':
        toast.success(message, options);
        break;
      case 'error':
        toast.error(message, options);
        break;
      case 'info':
        toast(message, { ...options, description: 'This is an info alert!' });
        break;
      case 'warning':
        toast(message, {
          ...options,
          description: 'This is a warning!',
          style: { background: '#ffcc00', color: '#000' },
        });
        break;
      default:
        toast(message, options);
    }
  };

  return (
    <AlertContext.Provider value={showAlert}>
      {children}
      <Toaster position="top-right" richColors />
    </AlertContext.Provider>
  );
};
