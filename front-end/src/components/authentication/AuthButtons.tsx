import React, { SetStateAction, Dispatch } from 'react';

const AuthButtons = ({
  setIsSignIn,
  isSignIn,
}: {
  setIsSignIn: Dispatch<SetStateAction<boolean>>;
  isSignIn: boolean;
}) => {
  return (
    <div className="flex w-[300px] md:w-[400px] mb-7 space-x-7">
      <button
        onClick={() => setIsSignIn(true)}
        className={`w-1/2 font-bold text-xl py-4 transition-all duration-500 hover:scale-[1]   hover:bg-white rounded-lg ${
          isSignIn && 'bg-white authShadow border border-black '
        }`}
      >
        Sign In
      </button>
      <button
        onClick={() => setIsSignIn(false)}
        className={`w-1/2 font-bold text-xl py-4  transition-all duration-500 hover:scale-[1]   hover:bg-white  rounded-lg ${
          !isSignIn && 'bg-white authShadow border border-black '
        }`}
      >
        Sign Up
      </button>
    </div>
  );
};

export default AuthButtons;
