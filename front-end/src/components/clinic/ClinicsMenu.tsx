import React, { Dispatch, SetStateAction, useState } from 'react';
import { useAppContext } from 'features/AppContext';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { collection, addDoc, FieldValue } from 'firebase/firestore';
import { db } from 'utils/firebase-config';
import { check, closeBtn, closeWhite, plusWhite } from '../../../assets';

import { useAuthContext } from 'features/AuthContext';

const ClinicsMenu = ({
  setShowClinics,
}: {
  setShowClinics: Dispatch<SetStateAction<boolean>>;
}) => {
  const [isAddingClinic, setIsAddingClinic] = useState<boolean>(false);
  const { clinics, setCurrClinic, currClinic, clinicCollection } =
    useAppContext() as ContextType;
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<{ name: string }>();
  const { auth } = useAuthContext() as AuthContextType;

  const onSubmit = async (data: { name: string }) => {
    const toastId = toast.loading('Saving clinic...');

    console.log(data);
    try {
      let newClinicRef;
      let newClinicID;

      if (navigator.onLine) {
        newClinicRef = await addDoc(clinicCollection, {
          uid: auth?.uid,
          name: data.name,
          patients: [],
          dentists: [],
        });
        newClinicID = newClinicRef.id;
        // setCurrClinic(newClinicRef.id);
      } else {
        newClinicRef = addDoc(clinicCollection, {
          uid: auth?.uid,
          name: data.name,
          patients: [],
          dentists: [],
        });
      }
      toast.update(toastId, {
        render: 'Clinic saved',
        type: 'success',
        autoClose: 1000,
        isLoading: false,
      });
      setIsAddingClinic(false);
      reset();
    } catch (e) {
      toast.update(toastId, {
        render: 'An error occured saving clinic. Try reloading.',
        type: 'error',
        autoClose: 2000,
        isLoading: false,
      });
    }
  };
  return (
    <div className="absolute top-0 left-0 z-[100] h-screen w-full flex justify-center items-center">
      <div className=" bg-myGray min-h-[250px] min-w-[500px] rounded-lg shadow-md flex justify-center items-center flex-col px-10 py-7 space-y-5">
        {clinics && clinics.length > 0 ? (
          clinics.map((clinic) => (
            <button
              key={clinic.id}
              onClick={() => {
                setCurrClinic(clinic), setShowClinics(false);
              }}
              className={`shadow-md rounded-lg w-full py-3 text-xl ${
                currClinic?.id == clinic.id && 'font-bold'
              }`}
            >
              {clinic.name}
            </button>
          ))
        ) : (
          <p>Click the + button to add a clinic</p>
        )}

        {isAddingClinic ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-x-4 w-full flex  justify-center items-center"
          >
            <input
              placeholder="New clinic name"
              className="w-full"
              {...register('name', { required: true })}
              aria-invalid={errors.name ? 'true' : 'false'}
            ></input>
            <span
              role="button"
              onClick={() => {
                setIsAddingClinic(false);
              }}
              className="rounded-lg w-[90px] h-[45px] shadow-md cursor-pointer buttonSpan flex justify-center items-center my-auto text-center"
            >
              <img
                src={closeBtn}
                alt="close add clinic"
                className="h-4 w-4 buttonSpan "
              ></img>
            </span>
            <button
              type="submit"
              className="rounded-lg w-[90px] h-[45px] shadow-md bg-primary cursor-pointer buttonSpan flex justify-center items-center my-auto text-center"
            >
              <img
                src={check}
                alt="add clinic"
                className="h-7 w-7 buttonSpan "
              ></img>
            </button>
          </form>
        ) : (
          <button
            role="button"
            onClick={() => setIsAddingClinic(true)}
            className=" w-full bg-primary rounded-lg py-3 shadow-md text-black flex justify-center items-center buttonSpan"
          >
            <img
              src={plusWhite}
              alt="add clinic"
              className="h-6 w-6 buttonSpan"
            ></img>
          </button>
        )}
      </div>
    </div>
  );
};

export default ClinicsMenu;
