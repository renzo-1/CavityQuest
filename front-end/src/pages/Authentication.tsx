import React, { useState } from 'react';
import { useAuthContext } from 'features/AuthContext';
import { Navigate } from 'react-router-dom';
import {
  SignIn,
  SignUp,
  AuthButtons,
  AuthHero,
  ForgotPassword,
} from 'components/';
import { useNavigate } from 'react-router-dom';

const Authentication = () => {
  const navigate = useNavigate();
  const [isSignIn, setIsSignIn] = useState<boolean>(true);
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);
  return (
    <div className="grid grid-cols-2 place-items-center h-full ">
      {isForgotPassword && (
        <ForgotPassword setIsForgotPassword={setIsForgotPassword} />
      )}
      <div className="w-full h-full grid place-items-center relative">
        <AuthHero />
      </div>
      <div className="w-full h-full flex justify-center items-center flex-col ">
        {navigator.onLine ? (
          <>
            <AuthButtons isSignIn={isSignIn} setIsSignIn={setIsSignIn} />
            {isSignIn ? (
              <SignIn setIsForgotPassword={setIsForgotPassword} />
            ) : (
              <SignUp />
            )}
          </>
        ) : (
          <div>
            <p>
              You have no connection. Please connect to the internet before
              signing in.
            </p>
            <button
              onClick={() => {
                window.location.reload();
              }}
              className="underline font-bold"
            >
              Reload
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Authentication;
