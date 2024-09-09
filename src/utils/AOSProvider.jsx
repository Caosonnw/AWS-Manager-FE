import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AOSProvider = ({ children }) => {
  useEffect(() => {
    AOS.init({
      easing: 'ease',
      duration: 400,
      delay: 0,
    });
  }, []);

  return <>{children}</>;
};

export default AOSProvider;
