import React, { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { check } from '../../../assets';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { collection, addDoc } from '@firebase/firestore';
import { capitalize } from 'utils/capitilize';
import { db } from 'utils/firebase-config';
import { useAppContext } from 'features/AppContext';
import { ContextType } from 'utils/Interfaces';


interface Props {}

const DentistForm = ({
  setIsAddingDentist,
}: {
  setIsAddingDentist: Dispatch<SetStateAction<boolean>>;
}) => {
  const [newDentist, setNewDentist] = useState<string>('');
  const dentistsCollection = collection(db, 'dentists');
  const { updateClinic } = useAppContext() as ContextType;

  const handleSubmit = async () => {
    const toastID = toast.loading('Saving dentist...');
    try {
      if (navigator.onLine) {
        const dentistRef = await addDoc(dentistsCollection, {
          name: capitalize(newDentist),
        });
        updateClinic(dentistRef, 'dentists');
      } else {
        addDoc(dentistsCollection, {
          name: capitalize(newDentist),
        });
      }

      setIsAddingDentist(false);

      toast.update(toastID, {
        render: 'Dentist saved',
        type: 'success',
        autoClose: 2000,
        isLoading: false,
      });
    } catch (e) {
      console.log(e);
      toast.update(toastID, {
        render: 'An error occured saving your record. Try reloading.',
        type: 'error',
        autoClose: 2000,
        isLoading: false,
      });
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
