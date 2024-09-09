import React from 'react';
import Lottie from 'lottie-react';
import LoginSignUpAnimationData from './../../assets/animation/Login-Animation.json';

const LoginSignUpAnimation = () => {
  return (
    <div className="flex justify-center">
      <Lottie
        style={{ width: '600px', height: '600px' }}
        animationData={LoginSignUpAnimationData}
        loop={true}
      />
    </div>
  );
};

export default LoginSignUpAnimation;
