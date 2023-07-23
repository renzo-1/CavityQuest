import axios from 'axios';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { PatientData, responseData, PatientDataContextType } from 'Interfaces';
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
  useEffect(() => {
    axios
      .get('http://localhost:8000/api/patients/')
      .then((res) => {
        console.log('results', res.data);

        res.data.map(
          ({
            id,
            last_name,
            first_name,
            middle_name,
            address,
            gender,
            date_of_birth,
            contact_number,
            image_uploads,
            doctors_note,
            date_added,
            date_modified,
          }: responseData) => {
            const fullName =
              last_name + ', ' + first_name + ' ' + middle_name.charAt(0) + '.';
            setPatientData((prevData) => [
              ...(prevData as []),
              {
                id,
                fullName,
                lastName: last_name,
                middleName: middle_name,
                gender,
                firstName: first_name,
                address,
                dateOfBirth: date_of_birth,
                contact: contact_number,
                imageUploads: image_uploads,
                doctorsNote: doctors_note,
                dateAdded: date_added,
                dateModified: date_modified,
              },
            ]);
          }
        );
        console.log('results', res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [isNewData]);

  return (
    <>
      {patientData && (
        <AppContext.Provider
          value={{ patientData, setPatientData, setIsNewData }}
        >
          {children}
        </AppContext.Provider>
      )}
    </>
  );
};

export default AppProvider;
