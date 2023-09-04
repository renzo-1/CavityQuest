import React, { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { check } from '../../assets';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { collection, addDoc } from '@firebase/firestore';
import { capitalize } from 'utils/capitilize';
import { db } from 'utils/firebase-config';
import { useAppContext } from 'features/AppContext';
import { PatientDataContextType } from 'utils/Interfaces';
import { useParams } from 'react-router-dom';

interface Props {}

const DentistForm = ({
  setIsAddingDentist,
}: {
  setIsAddingDentist: Dispatch<SetStateAction<boolean>>;
}) => {
  const [newDentist, setNewDentist] = useState<string>('');
  const dentistsCollection = collection(db, 'dentists');
  const { updateClinic } = useAppContext() as PatientDataContextType;

  const handleSubmit = async () => {
    try {
      const dentistRef = await addDoc(dentistsCollection, {
        name: capitalize(newDentist),
      });

      updateClinic(dentistRef, 'dentists');

      setIsAddingDentist(false);

      toast.success('New dentist has been saved', {
        autoClose: 5000,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="mt-4 flex justify-center items-center space-x-4">
      <input
        className="capitalize"
        placeholder="Name of dentist"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setNewDentist(e.target.value);
        }}
      ></input>
      <span
        role="submit"
        onClick={handleSubmit}
        className="rounded-lg px-4 py-2 shadow-md bg-primary cursor-pointer buttonSpan flex justify-center items-center my-auto text-center"
      >
        <img
          src={check}
          alt="add dentist"
          className="h-6 w-6 buttonSpan "
        ></img>
      </span>
    </div>
  );
};

export default DentistForm;
