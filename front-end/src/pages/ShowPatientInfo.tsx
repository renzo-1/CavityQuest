import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { BackButton, PatientInfoField } from 'components';
import { PatientData } from 'Interfaces';
import ShowImageRecords from 'components/ShowImageRecords';
import DeleteRecord from 'components/DeleteRecord';
import EditRecord from 'components/EditRecord';

const ShowPatientInfo = () => {
  const { id: idParam } = useParams();
  const [currPatient, setCurrPatient] = useState<PatientData | undefined>();
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
              className="py-2 px-4 rounded-lg bg-red-500 font-bold text-white shadow-lg"
              onClick={handleDeletionState}
            >
              Delete
            </button>
            <button className="py-2 px-4 rounded-lg bg-blue-500 font-bold text-white shadow-lg">
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
                    field={'Name'}
                    data={currPatient?.fullName}
                  />
                  <PatientInfoField
                    field={'Gender'}
                    data={currPatient?.gender}
                  />
                  <PatientInfoField
                    field={'Date of Birth'}
                    data={currPatient?.dateOfBirth}
                  />
                </div>
                <div className="space-y-4">
                  <PatientInfoField
                    field={'Contact Number'}
                    data={currPatient?.contact}
                  />
                  <PatientInfoField
                    field={'Address'}
                    data={currPatient?.address}
                  />
                </div>
              </div>
            </div>
            <EditRecord currPatient={currPatient}/>
          </div>
        )}
        <ShowImageRecords
          id={idParam}
          currPatient={currPatient}
          setCurrPatient={setCurrPatient}
        />
      </div>
    </>
  );
};

export default ShowPatientInfo;
