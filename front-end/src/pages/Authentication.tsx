import React, { useState } from 'react';
import { useAuthContext } from 'features/AuthContext';
import { AuthContextType } from 'utils/Interfaces';
import { Navigate } from 'react-router-dom';
import { SignIn, SignUp, AuthButtons, AuthHero } from 'components/';
import { useNavigate } from 'react-router-dom';

const Authentication = () => {
  const { auth } = useAuthContext() as AuthContextType;
  const navigate = useNavigate();
  const [isSignIn, setIsSignIn] = useState<boolean>(true);

  return (
    <div className="grid grid-cols-2 place-items-center h-full ">
      <div className="w-full h-full grid place-items-center relative">
        <AuthHero />
      </div>
      <div className="w-full h-full flex justify-center items-center flex-col ">
        {navigator.onLine ? (
          <>
            {' '}
            <AuthButtons isSignIn={isSignIn} setIsSignIn={setIsSignIn} />
            {isSignIn ? <SignIn /> : <SignUp />}
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
