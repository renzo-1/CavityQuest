import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BackButton, PatientInfoField, History } from 'components';
import { ContextType } from 'utils/Interfaces';
import ShowImageRecords from 'components/records/ShowImageRecords';
import DeleteRecord from 'components/records/DeleteRecord';
import EditRecord from 'components/records/EditRecord';
import { useAppContext } from 'features/AppContext';
import formatDate from 'utils/formatDate';
const ShowPatientInfo = () => {
  const navigate = useNavigate();
  const { id: idParam } = useParams();
  const { currClinic, currPatient } = useAppContext() as ContextType;
  const [isDeleting, setIsDeleting] = useState<Boolean>(false);

  const handleDeletionState = () => {
    setIsDeleting((prev) => !prev);
  };

  return (
    <>
      {isDeleting && <DeleteRecord handleDeletionState={handleDeletionState} />}
      <div className="p-10 space-y-8 min-h-screen bg-cover bg-[url('../../assets/bg2.jpg')]">
        <div className="flex justify-between">
          <BackButton />
          <div className="space-x-4">
            <button
              disabled={!navigator.onLine}
              className={`${
                !navigator.onLine && 'bg-slate-400 tooltip'
              }  py-2 px-4 rounded-lg bg-slate-500 font-bold text-white shadow-lg transition-all duration-500 ease-out`}
              onClick={handleDeletionState}
            >
              Delete
              {!navigator.onLine && (
                <span className="tooltiptext text-sm">
                  You're not allowed to delete at this time.
                </span>
              )}
            </button>
            <button
              onClick={() => {
                navigate(`/${currClinic?.id}/detection/${idParam}`);
              }}
              className="py-2 px-4 rounded-lg bg-blue-500 font-bold text-white shadow-lg transition-all duration-500 ease-out "
            >
              New Detection
            </button>
          </div>
        </div>
        {currPatient && (
          <div className="flex space-x-8">
            <div className="bg-white shadow-lg rounded-lg px-12 py-6 w-1/2 ">
              <div className="flex justify-between">
                <div className="space-y-4">
                  <PatientInfoField
                    field={'Patient Number'}
                    data={currPatient?.patientNumber}
                  />
                  <PatientInfoField
                    field={'Name'}
                    data={currPatient?.fullName}
                  />
                  <PatientInfoField
                    field={'Gender'}
                    data={currPatient?.gender}
                  />
                </div>
                <div className="space-y-4">
                  <PatientInfoField
                    field={'Date of Birth'}
                    data={formatDate(new Date(currPatient?.dateOfBirth))}
                  />
                  <PatientInfoField
                    field={'Contact Number'}
                    data={currPatient?.contactNumber}
                  />
                  <PatientInfoField
                    field={'Address'}
                    data={currPatient?.address}
                  />
                </div>
              </div>
            </div>
            <History />
          </div>
        )}
        <ShowImageRecords id={idParam} />
      </div>
    </>
  );
};

export default ShowPatientInfo;
