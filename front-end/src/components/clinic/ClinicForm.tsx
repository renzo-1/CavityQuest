import React, { useState, ChangeEvent, useRef } from 'react';
import { closeBtn, plusWhite } from '../../../assets';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from 'features/AppContext';
import { ContextType } from 'utils/Interfaces';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import BackButton from '../BackButton';
import { collection, addDoc, FieldValue } from 'firebase/firestore';
import { db } from 'utils/firebase-config';

const ClinicForm = () => {
  const [show, setShow] = useState<boolean>(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm<{ name: string }>();

  const { currClinic, setCurrClinic, clinics, dentists } =
    useAppContext() as ContextType;
  const clinicCollection = collection(db, 'clinics');

  const handleClinicChange = (e: ChangeEvent<HTMLSelectElement>) => {
    for (let clinic of clinics) {
      if (clinic.id === e.target.value) {
        setCurrClinic(clinic);
      }
    }
  };
  const onSubmit = async (data: { name: string }) => {
    const toastId = toast.loading('Saving clinic...');

    try {
      const internetStatus = navigator.onLine;
      let newClinicRef;
      let newClinicID;

      if (internetStatus) {
        newClinicRef = await addDoc(clinicCollection, {
          name: data.name,
          patients: [],
          dentists: [],
        });
        // newClinicID = newClinicRef.id;
        // setCurrClinic(newClinicRef.id);
      } else {
        newClinicRef = addDoc(clinicCollection, {
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
      setShow(false);

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
    <>
      <div className="absolute top-0 left-0 w-full z-20 flex justify-end p-10 space-x-4 text-lg font-bold white-select">
        <select
          onChange={handleClinicChange}
          value={currClinic?.id}
          className=" rounded-lg px-6 pr-10 py-2 bg-black bg-opacity-50 shadow-md text-white"
        >
          {clinics.map((clinic) => (
            <option
              key={clinic.name}
              className="text-white text-left text-lg pr-6"
              value={clinic.id}
            >
              {clinic.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => setShow(true)}
          className="rounded-lg px-4 py-2 bg-black bg-opacity-50 shadow-md text-white transition-all duration-500 ease-out"
        >
          <img src={plusWhite} alt="add clinic" className="h-5 w-5"></img>
        </button>
      </div>
      {show && (
        <div className="bg-black fixed min-h-screen w-full opacity-50 h-screen z-40 "></div>
      )}
      {show && (
        <div className=" absolute top-0 left-0  flex justify-center items-center w-full h-screen z-50">
          <div className="bg-white max-w-[500px] w-full rounded-lg shadow-md space-y-5 py-8 px-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label htmlFor="newClinic">Clinic name</label>
                <input
                  placeholder="Clinic name"
                  {...register('name', { required: true })}
                  aria-invalid={errors.name ? 'true' : 'false'}
                ></input>
              </div>
              <div className="w-full h-full flex justify-center space-x-5">
                <span
                  onClick={() => setShow(false)}
                  role="cancel"
                  className="bg-myGray font-bold rounded-lg px-4 py-2 cursor-pointer"
                >
                  Cancel
                </span>
                <button
                  type="submit"
                  className="bg-primary font-bold text-white rounded-lg px-4 py-2 transition-all duration-500 ease-out"
                >
                  Done
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ClinicForm;
