import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from 'features/AppContext';
import { toast } from 'react-toastify';
import { doc, updateDoc, Timestamp, arrayUnion } from '@firebase/firestore';

const DeleteRecord = ({
  handleDeletionState,
}: {
  handleDeletionState: () => void;
}) => {
  const navigate = useNavigate();
  const { clinic } = useParams();
  const { currPatient, clinicCollection, patientCollection, currClinic } =
    useAppContext() as ContextType;

  const handleConfirmedDeletion = async () => {
    const toastId = toast.loading('Deleting record...');
    try {
      const patientRef = doc(patientCollection, currPatient?.id!);
      const clinicRef = doc(clinicCollection, currClinic?.id);

      const newAT: AuditTrail = {
        contactNumber: currPatient?.contactNumber!,
        patientName: currPatient?.fullName!,
        id: currPatient?.id!,
        date: Timestamp.now(),
        type: 'delete',
      };

      await updateDoc(patientRef, { isActive: false });
      await updateDoc(clinicRef, {
        auditTrails: arrayUnion(newAT),
      });

      toast.update(toastId, {
        render: 'Deleted successfully',
        type: 'success',
        autoClose: 1000,
        isLoading: false,
      });
      if (clinic) {
        navigate(`/${currClinic?.id}/records`);
      }
    } catch (e) {
      console.log(e);
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
