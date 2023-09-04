import React, {
  FormEvent,
  useEffect,
  useState,
  ChangeEvent,
  MouseEventHandler,
} from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  PatientData,
  PatientDataContextType,
  PatientDataKind,
} from 'utils/Interfaces';
import { useAppContext } from 'features/AppContext';
import { treatments } from 'data/treatments';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { doc, collection, getDoc, updateDoc } from 'firebase/firestore';
import { db } from 'utils/firebase-config';
import { formatPatientData } from 'utils/formatPatientData';
interface EditProps {
  note: string;
  treatments: string[] | null;
}
const EditRecord = () => {
  const { id: idParam } = useParams();

  const {
    currPatient,
    currClinic,
    dentists,
    setCurrPatient,
    setPatientData,
    clinics,
    patientData,
  } = useAppContext() as PatientDataContextType;

  const [checkboxValues, setCheckboxValues] = useState<string[]>(
    currPatient?.treatments! || []
  );
  const [isEdit, setIsEdit] = useState<Boolean>();
  const [dentist, setDentist] = useState<string>();
  const {
    register,
    formState: { errors, isDirty, touchedFields },
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm<EditProps>({
    defaultValues: {
      note: currPatient?.note,
      treatments: currPatient?.treatments,
    },
  });

  useEffect(() => {
    // setCheckboxValues(currPatient?.treatments! || []);
    setValue('note', currPatient?.note || '');
    setValue('treatments', currPatient?.treatments || []);

    const setDentistField = async () => {
      if (currPatient?.dentist) {
        const dentistSnap = await getDoc(currPatient?.dentist);
        setDentist(dentistSnap.data()?.name || '');
      }
    };

    setDentistField();
  }, [currPatient?.treatments, currPatient?.note]);

  const { id } = useParams();

  const onSubmit = async (data: EditProps) => {
    const toastId = toast.loading('Saving changes...');

    try {
      if (isDirty && id) {
        const patientRef = doc(db, 'patients', id);
        const patientSnap = await getDoc(patientRef);

        await updateDoc(patientRef, {
          note: data.note,
          treatments: data.treatments,
        });

        setPatientData((prevData) => {
          const newArr = prevData.filter(
            (patient) => patient?.id !== currPatient?.id
          );
          return [
            ...newArr,
            {
              ...currPatient!,
              note: data.note,
              treatments: data.treatments || [],
            },
          ];
        });

        setCurrPatient((patient) => {
          return {
            ...patient!,
            note: data.note,
            treatments: data.treatments || [],
          };
        });

        toast.update(toastId, {
          render: 'Update successfully',
          type: 'success',
          autoClose: 1000,
          isLoading: false,
        });
        setIsEdit(false);
      } else {
        setIsEdit(false);
      }
    } catch (e) {
      toast.update(toastId, {
        render: 'An error occured saving your changes. Try reloading.',
        type: 'error',
        autoClose: 2000,
        isLoading: false,
      });
    }
  };

  const handleCheckboxChange = (e: FormEvent<HTMLInputElement>) => {
    const { value, checked } = e.target as HTMLInputElement;
    if (checked) {
      setCheckboxValues((prevValues) => {
        console.log('prev', prevValues);
        const newArr = [...prevValues, value];
        setValue('treatments', newArr, { shouldDirty: true });
        return newArr;
      });
    } else {
      setCheckboxValues((prevValues) => {
        const newArr = prevValues.filter((item) => item !== value);
        setValue('treatments', newArr, { shouldDirty: true });
        return newArr;
      });
    }
  };

  const handleEdit = () => {
    setIsEdit(true);
  };

  return (
    <>
      <form
        className="bg-white shadow-lg rounded-lg px-12 py-6 w-1/2 space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mb-2 justify-between flex">
          <div>
            <h3 className="text-sm">Dentist</h3>
            <p className="font-bold text-xl rounded-lg">{dentist}</p>
          </div>
          <div>
            <h3 className="text-sm">Clinic</h3>
            {clinics.map(
              (clinic) =>
                clinic.id == currPatient?.clinic && (
                  <p key={clinic.id} className="font-bold text-xl rounded-lg">
                    {clinic.name}
                  </p>
                )
            )}
          </div>
        </div>

        <div className="flex justify-between mb-2">
          <h1 className="text-sm">Treatment</h1>
          {isEdit ? (
            <button
              type="submit"
              className="font-bold transition-all duration-500 ease-out"
            >
              Save
            </button>
          ) : (
            <div className="cursor-pointer" onClick={handleEdit}>
              Edit
            </div>
          )}
        </div>
        {isEdit ? (
          <div className="space-y-3 mb-5">
            {treatments.map((treatment) => (
              <div className="flex items-center space-x-3" key={treatment}>
                <input
                  className="h-3 w-3 m-0"
                  type="checkbox"
                  value={treatment}
                  id={treatment}
                  placeholder={treatment}
                  checked={checkboxValues?.includes(treatment)}
                  disabled={!isEdit}
                  {...register('treatments', {
                    onChange: handleCheckboxChange,
                  })}
                />
                <label className="leading-3" htmlFor={treatment}>
                  {treatment}
                </label>
              </div>
            ))}
          </div>
        ) : (
          <ul className="min-h-14 border rounded-lg mb-5 flex space-x-3 p-2 flex-wrap">
            {checkboxValues &&
              checkboxValues.length > 0 &&
              checkboxValues.map((savedTreatment) => (
                <li key={savedTreatment}>
                  <p className="font-bold">&#x2022;{savedTreatment}</p>
                </li>
              ))}
          </ul>
        )}

        <div className="space-y-2">
          <h1 className="text-sm">Note</h1>
          <textarea
            {...register('note')}
            disabled={!isEdit}
            className="w-full bg-myGray rounded-lg h-14 border p-2"
            placeholder="Write notes here"
          ></textarea>
        </div>
      </form>
    </>
  );
};

export default EditRecord;
