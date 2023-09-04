import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import {
  DentistProps,
  ClinicProps,
  PatientDataContextType,
  FormattedPatientData,
} from 'utils/Interfaces';
import { db } from 'utils/firebase-config';
import {
  collection,
  getDocs,
  getDoc,
  query,
  doc,
  onSnapshot,
  updateDoc,
  arrayRemove,
  DocumentReference,
  arrayUnion,
} from '@firebase/firestore';
const AppContext = createContext<PatientDataContextType | null>(null);
import { formatPatientData } from 'utils/formatPatientData';
export const useAppContext = () => {
  return useContext(AppContext);
};

interface AppProps {
  children?: React.ReactNode;
}

const AppProvider: React.FC<AppProps> = ({ children }) => {
  const [patientData, setPatientData] = useState<FormattedPatientData[]>([]);
  const [showClinics, setShowClinics] = useState<boolean>(true);
  const [currPatient, setCurrPatient] = useState<
    FormattedPatientData | undefined
  >();
  const [currClinic, setCurrClinic] = useState<string>('');
  const [dentists, setDentists] = useState<DentistProps[] | undefined>();
  const [clinics, setClinics] = useState<ClinicProps[]>([]);

  const clinicsCollection = collection(db, 'clinics');
  const patientCollection = collection(db, 'patients');
  const dentistCollection = collection(db, 'dentists');

  const getPatients = async () => {
    try {
      let patientsArr: any = [];

      for (let clinic of clinics) {
        if (
          clinic.id === currClinic &&
          clinic.patients &&
          clinic.patients.length > 0
        ) {
          patientsArr = await Promise.all(
            clinic.patients.map(async (patient: any) => {
              const docSnap = await getDoc(patient);
              if (docSnap.exists()) {
                const data: any = docSnap.data();
                return formatPatientData(data, docSnap.id, currClinic);
              } else {
                console.log('patient not exists');
              }
            })
          );
        }
      }
      setPatientData(patientsArr);
    } catch (e) {
      console.log(e);
    }
  };

  const getDentists = async () => {
    try {
      let dentistsArr: any = [];
      for (let clinic of clinics) {
        if (
          clinic.id === currClinic &&
          clinic.dentists &&
          clinic.dentists.length > 0
        ) {
          dentistsArr = await Promise.all(
            clinic.dentists.map(async (dentist: any) => {
              const docSnap = await getDoc(dentist);
              if (docSnap.exists()) {
                const data: any = docSnap.data();
                return {
                  id: docSnap.id,
                  name: data.name,
                };
              }
              return undefined;
            })
          );
        }
      }
      setDentists(dentistsArr);
    } catch (e) {
      console.log(e);
    }
  };

  const getClinics = async () => {
    // const data = await getDocs(clinicsCollectionRef);

    // const res = data.docs.map((doc) => ({
    //   patients: doc.data().patients,
    //   dentists: doc.data().dentists,
    //   name: doc.data().name,
    //   id: doc.id,
    // }));

    const q = query(clinicsCollection);

    onSnapshot(q, { includeMetadataChanges: true }, (querySnapshot) => {
      const clinicSnap = querySnapshot.docs.map((doc) => ({
        patients: doc.data().patients,
        dentists: doc.data().dentists,
        name: doc.data().name,
        id: doc.id,
      }));
      const source = querySnapshot.metadata.fromCache
        ? 'local cache'
        : 'server';
      console.log('Data came from ' + source);
      setClinics(clinicSnap);
      // if (clinicSnap && clinicSnap.length > 0 && currClinic == '') {
      //   setCurrClinic(clinicSnap[0].id);
      // }
    });

    //   // Document was found in the cache. If no cached document exists,
    //   // an error will be returned to the 'catch' block below.
    //   console.log("Cached document data:", doc.data());
    // } catch (e) {
    //   console.log("Error getting cached document:", e);
    // }
  };

  const updateClinic = async (newDataRef: any, field: string) => {
    if (currClinic) {
      const clinicRef = doc(clinicsCollection, currClinic);
      const clinicSnap = await getDoc(clinicRef);

      if (clinicSnap.exists()) {
        let newArr;
        // if patient or dentist records already exists in the current clinic
        if (clinicSnap.data()[field] && clinicSnap.data()[field].length > 0) {
          await updateDoc(clinicRef, { [field]: arrayUnion(newDataRef) });
        }
        // if no records for patient and dentist for the current clinic
        else {
          newArr = [newDataRef];
          await updateDoc(clinicRef, { [field]: newArr });
        }
      }
    }
  };
  const deletePatientOnClinic = async (
    deletedPatientRef: DocumentReference
  ) => {
    if (currClinic) {
      const clinicRef = doc(clinicsCollection, currClinic);

      await updateDoc(clinicRef, {
        patients: arrayRemove(deletedPatientRef),
      });
    }
  };

  useEffect(() => {
    if (clinics.length > 0) {
      getPatients();
      getDentists();
    }
  }, [clinics, currClinic]);

  useEffect(() => {
    if (clinics.length > 0) {
      setCurrClinic(currClinic || clinics[0].id);
    }
  }, [clinics]);

  useEffect(() => {
    getClinics();
  }, [currClinic]);

  return (
    <>
      {patientData && (
        <AppContext.Provider
          value={{
            patientData,
            setPatientData,
            getDentists,
            getPatients,
            setShowClinics,
            showClinics,
            currPatient,
            setCurrPatient,
            clinics,
            currClinic,
            setCurrClinic,
            dentists,
            setDentists,
            getClinics,
            updateClinic,
            deletePatientOnClinic,
          }}
        >
          {children}
        </AppContext.Provider>
      )}
    </>
  );
};

export default AppProvider;
