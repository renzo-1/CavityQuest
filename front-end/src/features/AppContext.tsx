import axios from 'axios';
import Spinner from 'components/Spinner';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useReducer,
} from 'react';
import { useParams } from 'react-router-dom';
import {
  PatientData,
  PatientResponseData,
  DentistProps,
  ClinicProps,
  PatientDataContextType,
  PatientDataKind,
  PatientDataAction,
} from 'utils/Interfaces';

const AppContext = createContext<PatientDataContextType | null>(null);

export const useAppContext = () => {
  return useContext(AppContext);
};

interface AppProps {
  children?: React.ReactNode;
}

function reducer(state: PatientData[], action: PatientDataAction) {
  const { type, payload } = action;
  const { patientData, currPatient } = payload;

  switch (type) {
    case PatientDataKind.READ:
      return patientData.map((patient) => formatPatientData(patient))!;

    case PatientDataKind.CREATE:
      return [...state, formatPatientData(patientData[0])];

    case PatientDataKind.UPDATE:
      const newArr = state.filter((patient) => patient.id !== currPatient);
      console.log('haha',[...newArr, formatPatientData(patientData[0])]);
      return [...newArr, formatPatientData(patientData[0])];

    case PatientDataKind.DELETE:
      const newState = state.filter((patient) => patient.id !== currPatient);
      return [...newState];

    default:
      throw Error('Unknown action.');
  }
}

const formatPatientData = (data: PatientResponseData) => {
  const fullName =
    data.last_name +
    ', ' +
    data.first_name +
    ' ' +
    data.middle_name.charAt(0) +
    '.';

  const formattedData = {
    id: data.id,
    fullName,
    firstName: data.first_name,
    lastName: data.last_name,
    middleName: data.middle_name,
    gender: data.gender,
    clinic: data.clinic,
    dentist: data.dentist,
    address: data.address,
    dateOfBirth: data.date_of_birth,
    contact: data.contact_number,
    imageUploads: data.image_uploads,
    doctorsNote: data.doctors_note,
    dateAdded: data.date_added,
    dateModified: data.date_modified,
    treatments:
      typeof data.treatments == 'string' ? JSON.parse(data.treatments) : [],
  };
  return formattedData;
};
const AppProvider: React.FC<AppProps> = ({ children }) => {
  const [patientData, dispatchPatientData] = useReducer(reducer, []);
  const [d, setPatientData] = useState<PatientData[]>([]);
  const [isNewData, setIsNewData] = useState<Boolean>(false);
  const [currPatient, setCurrPatient] = useState<PatientData | undefined>();
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [currClinic, setCurrClinic] = useState<number | undefined>();
  const [dentists, setDentists] = useState<DentistProps[]>([]);
  const [clinics, setClinics] = useState<ClinicProps[]>([]);

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/clinics/')
      .then((res) => {
        setClinics([]);
        res.data.map((clinic: any) =>
          setClinics((prev) => [...prev, { id: clinic.id, name: clinic.name }])
        );
        res.data.map((clinic: any) => {
          // render the data from current clinic
          if (currClinic && clinic.id === currClinic) {
            setDentists(clinic.dentist_clinic);
            console.log('dentist', clinic.dentist_clinic);
            // setPatientData(formatPatientData(clinic.patient_clinic));
            dispatchPatientData({
              type: PatientDataKind.READ,
              payload: { patientData: clinic.patient_clinic },
            });
            setIsLoading(false);
          } else {
            setCurrClinic(res.data[0].id);
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [currClinic]);

  return (
    <>
      {patientData && (
        <AppContext.Provider
          value={{
            patientData,
            setPatientData,
            dispatchPatientData,
            setIsNewData,
            currPatient,
            setCurrPatient,
            clinics,
            currClinic,
            setCurrClinic,
            dentists,
            setDentists,
          }}
        >
          {isLoading && (
            <div className="absolute top-0 left-0 h-screen w-full bg-black bg-opacity-50 flex items-center justify-center">
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
