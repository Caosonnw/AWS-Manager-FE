import React from 'react';
import Lottie from 'lottie-react';
import NotFounDAnimation from './../../assets/animation/NotFound-Animation.json';

const NotFoundAnimation = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center fixed top-0 left-0 z-[9999999] bg-[#ffff] ">
      <Lottie
        style={{ width: '600px' }}
        animationData={NotFounDAnimation}
        loop={true}
      />
    </div>
  );
};

export default NotFoundAnimation;
