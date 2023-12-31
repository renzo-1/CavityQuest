import { useAppContext } from 'features/AppContext';
import React, { useState, ChangeEvent } from 'react';
import formatDate from 'utils/formatDate';
import { Timestamp } from 'firebase/firestore';
import { treatments } from 'data/treatments';
import { useForm } from 'react-hook-form';
import { updateDoc, getDoc, doc, arrayUnion } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from 'utils/firebase-config';
import { pencilSqaure } from '../../../assets';
import { toothNames, toothLocations } from 'data/teeth';
const History = () => {
  const { currPatient, dentists, setPatients, setCurrPatient } =
    useAppContext() as ContextType;
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm<HistoryData>({
    defaultValues: {
      dentist: dentists![0]?.name,
      treatment: treatments[0],
      toothName: toothNames[0],
      toothLocation: toothLocations[0],
      createdOn: formatDate(new Date(Timestamp.now().seconds * 1000))[1],
    },
  });

  const handleInputChanges = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = event.target;
    const newName = name as
      | 'treatment'
      | 'createdOn'
      | 'dentist'
      | 'toothName'
      | 'toothLocation';

    setValue(newName, value);
  };

  const onSubmit = async (newHistory: HistoryData) => {
    const toastId = toast.loading('Saving changes...');
    console.log(newHistory);

    try {
      const patientRef = doc(db, 'patients', currPatient?.id!);

      if (navigator.onLine) {
        await updateDoc(patientRef, {
          history: arrayUnion(newHistory),
        });
      } else {
        updateDoc(patientRef, {
          history: arrayUnion(newHistory),
        });
      }

      setPatients((prevData) => {
        const newArr = prevData.filter(
          (patient) => patient?.id !== currPatient?.id
        );
        return [
          ...newArr,
          {
            ...currPatient!,
            history: [...currPatient?.history!, newHistory],
          },
        ];
      });

      setCurrPatient((patient) => ({
        ...patient!,
        history: [...currPatient?.history!, newHistory],
      }));

      toast.update(toastId, {
        render: 'Update successfully',
        type: 'success',
        autoClose: 1000,
        isLoading: false,
      });
      setIsAdding(false);
    } catch (e) {
      toast.update(toastId, {
        render: 'An error occured saving your changes. Try reloading.',
        type: 'error',
        autoClose: 2000,
        isLoading: false,
      });
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg px-12 py-6 w-1/2 overflow-y-auto overflow-x-hidden">
      <div className="w-full flex justify-between border-b border-gray-700">
        <h1 className="font-bold place-content-between">History</h1>
        <div className="space-x-4">
          {isAdding ? (
            <>
              <button
                className=" text-gray-600"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </button>
              <button
                className="font-bold text-primary"
                onClick={handleSubmit(onSubmit)}
              >
                Save
              </button>
            </>
          ) : (
            <button className="font-bold" onClick={() => setIsAdding(true)}>
              <img src={pencilSqaure} alt="edit"></img>
            </button>
          )}
        </div>
      </div>
      <ul className="grid grid-cols-5 justify-between mt-0">
        <li className="font-medium">Date</li>
        <li className="font-medium">Treatment</li>
        <li className="font-medium">Tooth Name</li>
        <li className="font-medium">Tooth Location</li>
        <li className="font-medium">Dentist</li>
      </ul>
      {currPatient && currPatient?.history ? (
        currPatient?.history.map((history, index) => {
          return (
            <ul className="grid grid-cols-5 justify-between  mt-0" key={index}>
              <li className="w-full">{history.createdOn}</li>
              <li className="w-full">{history.treatment}</li>
              <li className="w-full">{history.toothName}</li>
              <li className="w-full">{history.toothLocation}</li>
              <li className="w-full">{history.dentist}</li>
            </ul>
          );
        })
      ) : (
        <>
          {!isAdding && (
            <div className="w-full grid place-items-center">
              <p>No history found</p>
            </div>
          )}
        </>
      )}

      {isAdding && (
        <form className="flex justify-between space-x-4">
          <input
            className="border border-gray-400"
            defaultValue={formatDate(new Date(Timestamp.now().seconds * 1000))}
          ></input>
          <select
            name="treatment"
            className="border border-gray-400"
            {...(register('treatment'),
            { required: true, onChange: handleInputChanges })}
            aria-invalid={errors.treatment ? 'true' : 'false'}
          >
            {treatments.map((treatment) => (
              <option value={treatment}>{treatment}</option>
            ))}
          </select>
          <select
            name="toothName"
            className="border border-gray-400"
            {...(register('toothName'),
            { required: true, onChange: handleInputChanges })}
            aria-invalid={errors.toothName ? 'true' : 'false'}
          >
            {toothNames.map((toothName) => (
              <option value={toothName}>{toothName}</option>
            ))}
          </select>
          <select
            name="toothLocation"
            className="border border-gray-400"
            {...(register('toothLocation'),
            { required: true, onChange: handleInputChanges })}
            aria-invalid={errors.toothLocation ? 'true' : 'false'}
          >
            {toothLocations.map((treatment) => (
              <option value={treatment}>{treatment}</option>
            ))}
          </select>

          <select
            className="border border-gray-400"
            name="dentist"
            {...(register('dentist'),
            { required: true, onChange: handleInputChanges })}
            aria-invalid={errors.dentist ? 'true' : 'false'}
          >
            {dentists &&
              dentists.length > 0 &&
              dentists.map((dentist) => (
                <option key={dentist.id} value={dentist.name}>
                  {dentist.name}
                </option>
              ))}
          </select>
        </form>
      )}
    </div>
  );
};

export default History;
