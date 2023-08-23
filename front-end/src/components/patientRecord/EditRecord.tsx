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
import { PatientData, PatientDataContextType } from 'utils/Interfaces';
import { useAppContext } from 'features/AppContext';
import { treatments } from 'data/treatments';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface EditProps {
  doctorsNote?: string;
  treatments?: string[];
}
const EditRecord = () => {
  const { id: idParam } = useParams();
  const { setIsNewData, currPatient } =
    useAppContext() as PatientDataContextType;
  const [checkboxValues, setCheckboxValues] = useState<string[]>(
    currPatient?.treatments! || []
  );
  const [isEdit, setIsEdit] = useState<Boolean>();

  const {
    register,
    formState: { errors, isDirty, touchedFields },
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm<EditProps>({
    defaultValues: {
      doctorsNote: currPatient?.doctorsNote,
      treatments: currPatient?.treatments,
    },
  });

  useEffect(() => {
    setCheckboxValues(currPatient?.treatments! || []);
    setValue('doctorsNote', currPatient?.doctorsNote);
    setValue('treatments', currPatient?.treatments);
  }, [currPatient?.treatments, currPatient?.doctorsNote]);

  const onSubmit = (data: EditProps) => {
    if (isDirty) {
      console.log('changed');
      axios
        .patch(`http://localhost:8000/api/patients/${idParam}/`, {
          doctors_note: data.doctorsNote,
          treatments: JSON.stringify(data.treatments),
        })
        .then((res) => {
          setIsNewData((prev) => !prev);
          setIsEdit(false);
          toast.success('Record successfully updated', {
            autoClose: 5000,
          });
        })
        .catch((err) =>
          toast.error(
            'There was an error editing the record. Please try again',
            {
              autoClose: 5000,
            }
          )
        );
    } else {
      console.log('no change');
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
        className="bg-white shadow-lg rounded-lg px-12 py-6 w-1/2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex justify-between mb-2">
          <h1 className="text-sm">Treatment</h1>
          {isEdit ? (
            <button type="submit" className="font-bold">
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
          <ul className="h-14 border rounded-lg mb-5 flex space-x-3 p-2 flex-wrap">
            {checkboxValues &&
              checkboxValues.length > 0 &&
              checkboxValues.map((savedTreatment) => (
                <li key={savedTreatment}>
                  <p className="font-bold">&#x2022; {savedTreatment}</p>
                </li>
              ))}
          </ul>
        )}

        <div className="space-y-2">
          <h1 className="text-sm">Note</h1>
          <textarea
            {...register('doctorsNote')}
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
