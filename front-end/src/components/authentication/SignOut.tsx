import React, { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useAppContext } from 'features/AppContext';
const SignOut = () => {
  const navigate = useNavigate();
  const { setCurrClinic, setPatients, setCurrPatient } =
    useAppContext() as ContextType;
  const handleSignOut = () => {
    const auth = getAuth();
    const toastId = toast.loading('Signing out...');

    signOut(auth)
      .then(() => {
        setCurrClinic(undefined);
        setPatients([]);
        setCurrPatient(undefined);
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
    <>
      <button
        onClick={handleSignOut}
        className="bg-blackpy-1 px-2  rounded-md text-white font-bold text-md flex-nowrap whitespace-nowrap"
      >
        Sign out
      </button>
    </>
  );
};

export default SignOut;
