import React, { useEffect, useState } from 'react';
// import patientData from '../../seeds';
import { searchBtn, filterBtn, cloudBtn } from '../../assets';
import { useNavigate } from 'react-router-dom';
import { BackButton, PatientSearch } from 'components';
import { useAppContext } from 'features/AppContext';
import { PatientDataContextType } from 'utils/Interfaces';
import { PatientRowInfo } from 'components';

const Records = () => {
  const [searchedName, setSearchedName] = useState<string>('');
  const navigate = useNavigate();
  const { patientData, currClinic, setCurrPatient } =
    useAppContext() as PatientDataContextType;
  const [localData, setLocalData] = useState<any>();

  if (patientData)
    return (
      <div className="p-10 w-full space-y-8">
        <div className="grid grid-cols-2">
          <div className="flex items-center space-x-10 font-bold">
            <BackButton />
            <div className="space-x-4 flex items-center">
              <button>
                <img className="h-8" src={cloudBtn} alt="search button" />
              </button>
              <p>Sync Records on Cloud</p>
            </div>
          </div>
          <div className="flex justify-end space-x-6">
            <PatientSearch
              searchedName={searchedName}
              setSearchedName={setSearchedName}
            />
            <button>
              <img className="w-8 h-6" src={filterBtn} alt="search button" />
            </button>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-3 border-b-4 border-black">
            <div className="flex">
              <h3 className="font-bold w-[50px]">ID</h3>
              <h3 className="font-bold">Name</h3>
            </div>
            <h3 className="font-bold">Date Added</h3>
            <h3 className="font-bold">Treatment</h3>
          </div>
          {patientData &&
            patientData.length > 0 &&
            patientData.map((patient) => (
              <div
                key={patient.id}
                className="grid grid-cols-3 border-b mt-8 cursor-pointer"
                onClick={() => {
                  setCurrPatient(patient);
                  navigate(`/${currClinic}/records/${patient.id}`);
                }}
              >
                {searchedName.length > 1 ? (
                  patient.fullName?.match(new RegExp(searchedName, 'gi')) && (
                    <PatientRowInfo
                      id={Number(patient.id)}
                      fullName={patient.fullName}
                      dateAdded={patient.dateAdded}
                      treatments={patient.treatments}
                    />
                  )
                ) : (
                  <PatientRowInfo
                    id={Number(patient.id)}
                    fullName={patient.fullName}
                    dateAdded={patient.dateAdded}
                    treatments={patient.treatments}
                  />
                )}
              </div>
            ))}
        </div>
      </div>
    );
  else {
    return <></>;
  }
};

export default Records;
