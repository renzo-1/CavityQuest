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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface EditProps {
  dentist: number;
  doctorsNote?: string;
  treatments?: string[] | null;
}
const EditRecord = () => {
  const { id: idParam } = useParams();
  const { currPatient, dispatchPatientData, currClinic, dentists, clinics } =
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
      dentist: currPatient?.dentist,
      doctorsNote: currPatient?.doctorsNote,
      treatments: currPatient?.treatments,
    },
  });
  useEffect(() => {
    // setCheckboxValues(currPatient?.treatments! || []);
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
          // setPatientData((prevData) => {
          //   const newArr = prevData.filter(
          //     (patient) => patient.id !== currPatient?.id
          //   );

          //   const newData = res.data;

          //   const fullName =
          //     newData.last_name +
          //     ', ' +
          //     newData.first_name +
          //     ' ' +
          //     newData.middle_name.charAt(0) +
          //     '.';

          //   const formattedData = {
          //     id: newData.id,
          //     fullName,
          //     firstName: newData.first_name,
          //     lastName: newData.last_name,
          //     middleName: newData.middle_name,
          //     gender: newData.gender,
          //     clinic: newData.clinic,
          //     dentist: newData.dentist,
          //     address: newData.address,
          //     dateOfBirth: newData.date_of_birth,
          //     contact: newData.contact_number,
          //     imageUploads: newData.image_uploads,
          //     doctorsNote: newData.doctors_note,
          //     dateAdded: newData.date_added,
          //     dateModified: newData.date_modified,
          //     treatments: JSON.parse(newData.treatments),
          //   };

          //   return [...newArr, formattedData];
          // });
          dispatchPatientData({
            type: PatientDataKind.UPDATE,
            payload: { patientData: [res.data], currPatient: currPatient?.id },
          });
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
      setIsEdit(false);
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
        className="bg-white shadow-lg rounded-lg px-12 py-6 w-1/2 space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mb-2 justify-between flex">
          <div>
            <h3 className="text-sm">Dentist</h3>
            {dentists.map(
              (dentist) =>
                dentist.id == currPatient?.dentist && (
                  <p className="font-bold text-xl rounded-lg">{dentist.name}</p>
                )
            )}
          </div>
          <div>
            <h3 className="text-sm">Clinic</h3>
            {clinics.map(
              (clinic) =>
                clinic.id == currPatient?.clinic && (
                  <p className="font-bold text-xl rounded-lg">{clinic.name}</p>
                )
            )}
          </div>
        </div>

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
