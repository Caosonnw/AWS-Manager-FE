import React from 'react';
import Lottie from 'lottie-react';
import LoadingAnimationAWS from './../../assets/animation/Loading-Animation.json';

const LoadingAnimation = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center fixed top-0 left-0 z-[9999999] bg-[#ffff] ">
      <Lottie
        style={{ width: '600px' }}
        animationData={LoadingAnimationAWS}
        loop={true}
      />
    </div>
  );
};

export default LoadingAnimation;
