import React, { useEffect, useState } from 'react';
// import patientData from '../../seeds';
import { searchBtn, filterBtn, cloudBtn } from '../../assets';
import { useNavigate } from 'react-router-dom';
import { BackButton, PatientSearch } from 'components';
import { useAppContext } from 'features/AppContext';
import { PatientDataContextType } from 'Interfaces';

const Records = () => {
  const [searchedName, setSearchedName] = useState<string>('');
  const navigate = useNavigate();
  const { patientData } = useAppContext() as PatientDataContextType;

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
          <div className="grid grid-cols-4 border-b-4 border-black">
            <h3 className="font-bold">Name</h3>
            <h3 className="font-bold">Date Added</h3>
            <h3 className="font-bold">Date Modified</h3>
            <h3 className="font-bold">Treatment</h3>
          </div>
          {patientData &&
            patientData.map(({ id, fullName, dateAdded, dateModified }) =>
              searchedName.length > 1 ? (
                fullName?.match(new RegExp(searchedName, 'gi')) && (
                  <div
                    key={`a${id}`}
                    className="grid grid-cols-4  border-b mt-8 cursor-pointer"
                    onClick={() => navigate(`/records/${id}`)}
                  >
                    <p>{fullName}</p>
                    <p>{dateAdded?.toString()}</p>
                    <p>{dateModified?.toString()}</p>
                  </div>
                )
              ) : (
                <div
                  key={`b${id}`}
                  className="grid grid-cols-4  border-b mt-8 cursor-pointer"
                  onClick={() => navigate(`/records/${id}`)}
                >
                  <p>{fullName}</p>
                  <p>{dateAdded?.toString()}</p>
                  <p>{dateModified?.toString()}</p>
                </div>
              )
            )}
        </div>
      </div>
    );
};

export default Records;
