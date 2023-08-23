import axios from 'axios';
import Spinner from 'components/Spinner';
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PatientData,
  responseData,
  PatientDataContextType,
} from 'utils/Interfaces';

const AppContext = createContext<PatientDataContextType | null>(null);

export const useAppContext = () => {
  return useContext(AppContext);
};

interface AppProps {
  children?: React.ReactNode;
}

const AppProvider: React.FC<AppProps> = ({ children }) => {
  const [patientData, setPatientData] = useState<PatientData[]>([]);
  const [isNewData, setIsNewData] = useState<Boolean>(false);
  const [currPatient, setCurrPatient] = useState<PatientData | undefined>();
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  useEffect(() => {
    setIsLoading(true);
    axios
      .get('http://localhost:8000/api/patients/')
      .then((res) => {
        setPatientData([]);
        const dataArr: PatientData[] = [];

        res.data.map((data: any) => {
          const fullName =
            data.last_name +
            ', ' +
            data.first_name +
            ' ' +
            data.middle_name.charAt(0) +
            '.';

          dataArr.push({
            id: data.id,
            fullName,
            lastName: data.last_name,
            middleName: data.middle_name,
            gender: data.gender,
            firstName: data.first_name,
            address: data.address,
            dateOfBirth: data.date_of_birth,
            contact: data.contact_number,
            imageUploads: data.image_uploads,
            doctorsNote: data.doctors_note,
            dateAdded: data.date_added,
            dateModified: data.date_modified,
            treatments: JSON.parse(data.treatments),
          });
        });

        setPatientData(dataArr);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [isNewData]);

  return (
    <>
      {patientData && (
        <AppContext.Provider
          value={{
            patientData,
            setPatientData,
            setIsNewData,
            currPatient,
            setCurrPatient,
          }}
        >
          {isLoading && (
            <div className="absolute top-0 left-0 h-screen w-full bg-black bg-opacity-50">
              <Spinner />
            </div>
          )}

          {children}
        </AppContext.Provider>
      )}
    </>
  );
};

export default AppProvider;
