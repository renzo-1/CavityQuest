import React, { Dispatch, SetStateAction, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from 'features/AppContext';
import { PatientDataContextType } from 'Interfaces';

interface Props {
  handleDeletionState: () => void;
}

const DeleteRecord = ({ handleDeletionState }: Props) => {
  const { id: idParam } = useParams();
  const navigate = useNavigate();
  const { setIsNewData } = useAppContext() as PatientDataContextType;
  
  const handleConfirmedDeletion = () => {
    axios
      .delete(`http://localhost:8000/api/patients/${idParam}/`)
      .then((res) => {
        setIsNewData((prev) => !prev);
        navigate(-1);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="absolute h-1/4 w-1/2 z-40 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 rounded-lg shadow-md bg-myGray flex justify-center items-center flex-col space-y-10">
        <p className="text-2xl">Are you sure you want to delete this record?</p>
        <div className="space-x-8 ">
          <button
            onClick={handleDeletionState}
            className="border py-2 px-4  rounded-md border-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmedDeletion}
            className="bg-red-500 py-2 px-4 rounded-md font-bold text-myGray"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="absolute h-full w-full z-30 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 rounded-lg shadow-md bg-black opacity-30"></div>
    </>
  );
};

export default DeleteRecord;
