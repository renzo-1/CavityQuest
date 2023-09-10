import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from 'features/AppContext';
import { ContextType } from 'utils/Interfaces';
import { toast } from 'react-toastify';
import { doc, deleteDoc } from '@firebase/firestore';
import { db } from 'utils/firebase-config';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { newError } from 'builder-util-runtime';

const DeleteRecord = ({
  handleDeletionState,
}: {
  handleDeletionState: () => void;
}) => {
  const navigate = useNavigate();
  const { clinic } = useParams();
  const { currPatient, deletePatientOnClinic } = useAppContext() as ContextType;
  const storage = getStorage();

  const handleConfirmedDeletion = async () => {
    const toastId = toast.loading('Deleting record...');
    try {
      // 1. Delete images saved on the patient record
      const imageUploads = currPatient?.imageUploads!;

      // if (imageUploads && imageUploads.length > 0) {
      //   toast.update(toastId, {
      //     render: 'Deleting dectection images',
      //     type: 'info',
      //     isLoading: true,
      //   });
      //   for (let img of imageUploads!) {
      //     const imgRef = ref(storage, `images/${img.name}`);

      //     // Delete the file
      //     await deleteObject(imgRef);
      //   }
      // }

      const recordRef = doc(db, 'patients', currPatient?.id!);
      // 2. Delete the patient on clinic records.
      deletePatientOnClinic(recordRef);
      // 3. Delete the actual patient record
      await deleteDoc(recordRef);

      // getPatients();
      toast.update(toastId, {
        render: 'Deleted successfully',
        type: 'success',
        autoClose: 1000,
        isLoading: false,
      });
      if (clinic) {
        navigate(`/${clinic}/records`);
      }
    } catch (e) {
      toast.update(toastId, {
        render: 'An error occured while deleting the record. Try reloading.',
        type: 'error',
        autoClose: 2000,
        isLoading: false,
      });
    }
  };

  return (
    <>
      <div className="fixed h-1/4 text-center z-40 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 rounded-lg shadow-md bg-myGray flex justify-center items-center flex-col space-y-10 px-10">
        <p className="text-2xl">Are you sure you want to delete this record?</p>
        <div className="space-x-8 ">
          <button
            onClick={handleDeletionState}
            className="border py-2 px-4  rounded-md border-gray-400 transition-all duration-500 ease-out"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmedDeletion}
            className="bg-red-500 py-2 px-4 rounded-md font-bold text-myGray transition-all duration-500 ease-out"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="fixed min-h-screen w-full z-30  bg-black opacity-30"></div>
    </>
  );
};

export default DeleteRecord;
