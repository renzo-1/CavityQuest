import React, { createContext, useContext, useState, useEffect } from 'react';

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
  deleteDoc,
  where,
  documentId,
} from '@firebase/firestore';
import { formatPatientData } from 'utils/formatPatientData';
import AuthProvider, { useAuthContext } from './AuthContext';
// import { checkDir, deleteFile, readFile } from 'utils/offlineImageUploads';
interface AppProps {
  children?: React.ReactNode;
}

const AppContext = createContext<ContextType | null>(null);

export const useAppContext = () => {
  return useContext(AppContext);
};

const AppProvider: React.FC<AppProps> = ({ children }) => {
  const { auth } = useAuthContext() as AuthContextType;
  const [patients, setPatients] = useState<Patient[]>([]);
  const [showClinicsMenu, setShowClinicsMenu] = useState<boolean>(true);
  const [currPatient, setCurrPatient] = useState<Patient | undefined>();
  const [currClinic, setCurrClinic] = useState<Clinic | undefined>();
  const [dentists, setDentists] = useState<DentistProps[] | undefined>();
  const [clinics, setClinics] = useState<Clinic[]>([]);

  const clinicCollection = collection(db, 'clinics');
  const patientCollection = collection(db, 'patients');
  const imageCollection = collection(db, 'images');
  const dentistCollection = collection(db, 'dentists');
  const deletedPatientCollection = collection(db, 'deletedPatients');
  const contactNumberCollection = collection(db, 'contactNumbers');
  // GET PATIENTS OF THE CLINIC
  const getPatients = async (clinics: Clinic[]) => {
    let patientsArr: Patient[] = [];
    try {
      if (currClinic) {
        const clinic: Clinic = clinics.filter(
          (clinic) => clinic.id == currClinic.id
        )[0];

        await Promise.all(
          clinic.patients.map(
            async (patientRef: DocumentReference, index: number) => {
              const docSnap = await getDoc(patientRef);
              // await updateDoc(patientRef, {isActive: true})

              if (docSnap.exists()) {
                const data: Patient = docSnap.data() as Patient;
                if (data.isActive)
                  patientsArr.push(
                    formatPatientData(
                      data,
                      docSnap.id,
                      index + 1,
                      currClinic?.id
                    )
                  );
              }
            }
          )
        );
      }
    } catch (e) {
      console.log(e);
    }
    setPatients(patientsArr);
  };

  const getDentists = async (clinics: Clinic[]) => {
    try {
      let dentistsArr: any = [];
      if (currClinic && clinics.length > 0) {
        const clinic: Clinic = clinics.filter(
          (clinic) => clinic.id == currClinic.id
        )[0];
        await Promise.all(
          clinic.dentists.map(async (dentist: any) => {
            const docSnap = await getDoc(dentist);
            if (docSnap.exists()) {
              const data: DentistProps = docSnap.data() as DentistProps;
              dentistsArr.push({ id: docSnap.id, name: data.name });
            } else {
              console.log('dentist does not exist :', docSnap);
            }
          })
        );
      }
      setDentists(dentistsArr);
    } catch (e) {
      console.log(e);
    }
  };

  const getClinics = () => {
    const q = query(clinicCollection, where('uid', '==', auth?.uid));

    onSnapshot(q, { includeMetadataChanges: true }, (querySnapshot) => {
      const clinicSnap: Clinic[] = querySnapshot.docs.map((doc) => ({
        patients: doc.data().patients,
        dentists: doc.data().dentists,
        name: doc.data().name,
        uid: doc.data().uid,
        id: doc.id,
        auditTrails: doc.data().auditTrails,
      }));
      console.log('first', clinicSnap);
      setClinics([...clinicSnap]);
      getPatients([...clinicSnap]);
      getDentists([...clinicSnap]);
    });
  };

  useEffect(() => {
    if (auth) {
      getClinics();
    }
  }, [currClinic?.id, auth, auth?.uid]);

  useEffect(() => {
    setCurrClinic(undefined);
    setShowClinicsMenu(true);
  }, [auth?.uid]);

  // ONLINE: Clinic updates for patients and dentists
  const updateClinic = async (newDataRef: DocumentReference, field: string) => {
    if (currClinic) {
      const clinicRef = doc(clinicCollection, currClinic?.id);
      const clinicSnap = await getDoc(clinicRef);

      if (clinicSnap.exists()) {
        await updateDoc(clinicRef, { [field]: arrayUnion(newDataRef) });
      }
    }
  };

  const addPatientOffline = (fName: string, lName: string, mName?: string) => {
    if (!navigator.onLine) {
      const q = query(patientCollection);
      onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
        for (let docChange of snapshot.docChanges()) {
          const { firstName, middleName, lastName } = docChange.doc.data();
          if (
            docChange.type === 'added' &&
            currClinic &&
            firstName == fName &&
            middleName == mName &&
            lastName == lName
          ) {
            const clinicRef = doc(clinicCollection, currClinic?.id);
            updateDoc(clinicRef, {
              patients: arrayUnion(docChange.doc.ref),
            });
            break;
          }
        }
      });
    }
  };
  // OFFLINE: listens for dentists creations, and append it to current clinic
  const addDentistOffline = (dentistName: string) => {
    if (!navigator.onLine) {
      const q = query(dentistCollection);
      onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
        snapshot.docChanges().forEach(async (change, index) => {
          // console.log(change.doc.data().name == dentistName);
          if (
            change.type === 'added' &&
            currClinic &&
            change.doc.data().name == dentistName
          ) {
            const clinicRef = doc(clinicCollection, currClinic?.id);
            updateDoc(clinicRef, {
              dentists: arrayUnion(change.doc.ref),
            });
            getClinics();
          }
        });
      });
    }
  };

  // // OFFLINE: listen for image creations, and append it to current patient
  const addImageOffline = (name: string) => {
    if (!navigator.onLine) {
      const q = query(imageCollection);
      onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (
            change.type === 'added' &&
            currPatient &&
            currPatient.id &&
            change.doc.data().name == name
          ) {
            const patientRef = doc(patientCollection, currPatient.id);
            updateDoc(patientRef, {
              imageUploads: arrayUnion(change.doc.ref),
            });
          } else {
            console.log('no image upload changes');
          }
        });
      });
    }
  };

  const deletePatientOnClinic = async (
    deletedPatientRef: DocumentReference
  ) => {
    if (currClinic) {
      const clinicRef = doc(clinicCollection, currClinic?.id);

      await updateDoc(clinicRef, {
        patients: arrayRemove(deletedPatientRef),
      });
    }
  };

  return (
    <AppContext.Provider
      value={{
        patients,
        setPatients,
        // getDentists,
        getPatients,
        showClinicsMenu,
        setShowClinicsMenu,
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
        addImageOffline,
        addDentistOffline,
        addPatientOffline,
        clinicCollection,
        patientCollection,
        imageCollection,
        dentistCollection,
        deletedPatientCollection,
        contactNumberCollection,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
