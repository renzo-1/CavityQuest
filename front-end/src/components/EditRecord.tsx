import React, { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { PatientData, PatientDataContextType } from 'Interfaces';
import { useAppContext } from 'features/AppContext';

interface Props {
  currPatient: PatientData;
}

const EditRecord = ({ currPatient }: Props) => {
  const { id: idParam } = useParams();
  const [newDoctorsNote, setNewDoctorsNote] = useState<string | undefined>(
    currPatient.doctorsNote
  );
  const { setIsNewData } = useAppContext() as PatientDataContextType;

  const [isEdit, setIsEdit] = useState<Boolean>();
  //   const {
  //     register,
  //     formState: { errors },
  //     handleSubmit,
  //     reset,
  //     watch,
  //     setValue,
  //   } = useForm<PatientData>({
  //     defaultValues: currPatient,
  //   });

  const handleSubmit = () => {
    if (currPatient.doctorsNote !== newDoctorsNote) {
      axios
        .patch(`http://localhost:8000/api/patients/${idParam}/`, {
          doctors_note: newDoctorsNote,
        })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    }
    setIsNewData((prev) => !prev);
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setNewDoctorsNote(event.target.value);
    console.log(newDoctorsNote);
  };

  return (
    <form className="bg-white shadow-lg rounded-lg px-12 py-6 w-1/2">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">Doctors Note</h1>
        {isEdit ? (
          <button
            onClick={(e) => {
              handleSubmit();
              setIsEdit(false);
            }}
          >
            Save
          </button>
        ) : (
          <div className="cursor-pointer" onClick={(e) => setIsEdit(true)}>
            Edit
          </div>
        )}
      </div>

      <textarea
        onChange={handleChange}
        disabled={!isEdit}
        defaultValue={currPatient.doctorsNote}
        className="w-full bg-myGray rounded-lg border p-2"
        placeholder="Write notes here"
      ></textarea>
    </form>
  );
};

export default EditRecord;
