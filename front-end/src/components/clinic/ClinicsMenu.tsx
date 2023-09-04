import React, { Dispatch, SetStateAction } from 'react';
import { useAppContext } from 'features/AppContext';
import { PatientDataContextType } from 'utils/Interfaces';

const ClinicsMenu = ({
  setShowClinics,
}: {
  setShowClinics: Dispatch<SetStateAction<boolean>>;
}) => {
  const { clinics, setCurrClinic } = useAppContext() as PatientDataContextType;

  return (
    <div className="absolute top-0 left-0 z-[100] h-screen w-full flex justify-center items-center">
      <div className=" bg-myGray min-h-[250px] min-w-[500px] rounded-lg shadow-md flex justify-center items-center flex-col px-10 py-7 space-y-5">
        {clinics &&
          clinics.length > 0 &&
          clinics.map((clinic) => (
            <button
              onClick={() => {
                setCurrClinic(clinic.id), setShowClinics(false);
              }}
              className="shadow-md rounded-lg w-full py-4 px-4 text-xl "
            >
              {clinic.name}
            </button>
          ))}
      </div>
    </div>
  );
};

export default ClinicsMenu;
