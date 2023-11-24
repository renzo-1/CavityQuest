import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useState,
  FormEvent,
} from 'react';
import { check, closeBtn } from '../../../assets';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { collection, addDoc, doc } from '@firebase/firestore';
import { capitalize } from 'utils/capitilize';
import { db } from 'utils/firebase-config';
import { useAppContext } from 'features/AppContext';


const DentistForm = ({
  setIsShowDentistForm,
}: {
  setIsShowDentistForm: Dispatch<SetStateAction<boolean>>;
}) => {
  const [newDentist, setNewDentist] = useState<string>('');
  const {
    updateClinic,
    addDentistOffline,
    getClinics,
    dentists,
    dentistCollection,
  } = useAppContext() as ContextType;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const toastID = toast.loading('Saving dentist...');
    const captDentistName = capitalize(newDentist);
    try {
      // ONLINE
      if (navigator.onLine) {
        const dentistRef = await addDoc(dentistCollection, {
          name: captDentistName,
        });
        updateClinic(dentistRef, 'dentists');
      }
      // OFFLINE
      else {
        addDoc(dentistCollection, {
          name: captDentistName,
        });
        // updateClinic(dentistRef, 'dentists');
        addDentistOffline(captDentistName!);
        getClinics();
      }

      setIsShowDentistForm(false);
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
    <div className="absolute top-0 left-0 w-full min-h-screen flex justify-center items-center z-[9999]">
      <div className="mt-4 flex flex-col items-end space-y-5 bg-myGray  min-w-[500px] px-10 py-7 rounded-lg">
        <button
          className="flex-end"
          onClick={() => setIsShowDentistForm(false)}
        >
          <img src={closeBtn} alt="close"></img>
        </button>
        <form className="flex w-full space-x-4" onSubmit={handleSubmit}>
          <input
            className="capitalize"
            placeholder="Name of dentist"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              console.log(e.target.value);
              setNewDentist(e.target.value);
            }}
            value={newDentist}
          ></input>
          <button
            className="rounded-lg px-4 py-2 bg-primary cursor-pointer flex justify-center items-center my-auto text-center"
            type="submit"
          >
            <img src={check} alt="add dentist" className="h-6 w-6 "></img>
          </button>
        </form>
        <select
          defaultValue={'Dentists'}
          className="w-full border border-gray-700 rounded-lg py-2 text-lg"
        >
          <option hidden>Dentists...</option>
          {dentists &&
            dentists.length > 0 &&
            dentists.map((dentist) => (
              <option disabled key={dentist.id}>
                {dentist.name}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
};

export default DentistForm;
