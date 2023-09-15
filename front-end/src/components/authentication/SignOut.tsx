import React, { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { threeDots } from '../../../assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SignOut = () => {
  const navigate = useNavigate();
  const [isShowSignOut, SetIsShowSignOut] = useState<boolean>(false);

  const handleSignOut = () => {
    const auth = getAuth();
    const toastId = toast.loading('Signing out...');

    signOut(auth)
      .then(() => {
        navigate('/auth');
        toast.update(toastId, {
          render: 'Signed out',
          type: 'success',
          autoClose: 2000,
          isLoading: false,
        });
      })
      .catch((error) => {
        toast.update(toastId, {
          render: error.message,
          type: 'error',
          autoClose: 2000,
          isLoading: false,
        });
      });
  };
  return (
    <div className="relative flex justify-center items-center">
      <button
        className="z-[9999]"
        onClick={() => SetIsShowSignOut((prev) => !prev)}
      >
        <img src={threeDots} alt="clinics menu" className="w-8 h-8"></img>
      </button>
      {isShowSignOut && (
        <button
          onClick={handleSignOut}
          className="bg-black absolute py-1 px-2 mt-14 rounded-md text-white font-bold text-md flex-nowrap whitespace-nowrap"
        >
          Sign out
        </button>
      )}
    </div>
  );
};

export default SignOut;
