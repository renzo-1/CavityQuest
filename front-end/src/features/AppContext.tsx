import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DentistProps,
  Clinic,
  ContextType,
  FormattedPatientData,
  ImageUpload,
  AuthContextType,
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
  const [patientData, setPatientData] = useState<FormattedPatientData[]>([]);
  const [showClinicsMenu, setShowClinicsMenu] = useState<boolean>(true);
  const [currPatient, setCurrPatient] = useState<
    FormattedPatientData | undefined
  >();
  const [currClinic, setCurrClinic] = useState<Clinic>();
  const [dentists, setDentists] = useState<DentistProps[] | undefined>();
  const [clinics, setClinics] = useState<Clinic[]>([]);

  const clinicsCollection = collection(db, 'clinics');
  const patientsCollection = collection(db, 'patients');
  const imagesCollection = collection(db, 'images');
  const dentistsCollection = collection(db, 'dentists');

  // GET PATIENTS OF THE CLINIC
  const getPatients = async (clinics: Clinic[]) => {
    try {
      let patientsArr: FormattedPatientData[] = [];
      if (currClinic) {
        const clinic: Clinic = clinics.filter(
          (clinic) => clinic.id == currClinic.id
        )[0];

        await Promise.all(
          clinic.patients.map(
            async (patientRef: DocumentReference, index: number) => {
              const docSnap = await getDoc(patientRef);

              if (docSnap.exists()) {
                const data: any = docSnap.data();
                const dentist = await getDoc(data.dentist);
                const dentistData = dentist.data() as DentistProps;
                if (dentist.exists()) {
                  patientsArr.push(
                    formatPatientData(
                      data,
                      dentistData.name!,
                      docSnap.id,
                      index + 1,
                      currClinic?.id
                    )
                  );
                }
              }
            }
          )
        );
      }
      console.log('patientsArr', patientsArr);
      setPatientData(patientsArr);
    } catch (e) {
      console.log(e);
    }
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
      console.log('dentistarr,', dentistsArr);
      setDentists([...dentistsArr]);
    } catch (e) {
      console.log(e);
    }
  };

  const getClinics = () => {
    // const q = query(
    //   clinicsCollection,
    //   where(documentId(), '==', currClinic?.name)
    // );
    // const q = query(clinicsCollection, where("name", '==', currClinic?.name));
    const q = query(clinicsCollection, where('uid', '==', auth?.uid));
    onSnapshot(q, { includeMetadataChanges: true }, (querySnapshot) => {
      const clinicSnap: Clinic[] = querySnapshot.docs.map((doc) => ({
        patients: doc.data().patients,
        dentists: doc.data().dentists,
        name: doc.data().name,
        uid: doc.data().uid,
        id: doc.id,
      }));
      setClinics(clinicSnap);
      getPatients(clinicSnap);
      getDentists(clinicSnap);
    });
    // cleanSnapShot();
  };

  useEffect(() => {
    if (auth) {
      getClinics();
    }
  }, [currClinic, auth, auth?.uid]);

  // ONLINE: Clinic updates for patients and dentists
  const updateClinic = async (newDataRef: DocumentReference, field: string) => {
    if (currClinic) {
      const clinicRef = doc(clinicsCollection, currClinic?.id);
      const clinicSnap = await getDoc(clinicRef);

      if (clinicSnap.exists()) {
        await updateDoc(clinicRef, { [field]: arrayUnion(newDataRef) });
      }
    }
  };

  const addPatientOffline = (fName: string, lName: string, mName?: string) => {
    if (!navigator.onLine) {
      const q = query(patientsCollection);
      onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          const { firstName, middleName, lastName } = change.doc.data();
          if (
            change.type === 'added' &&
            currClinic &&
            firstName == fName &&
            middleName == mName &&
            lastName == lName
          ) {
            const clinicRef = doc(clinicsCollection, currClinic?.id);
            updateDoc(clinicRef, {
              patients: arrayUnion(change.doc.ref),
            });
            // saveImage(change.doc.id);
            // getClinics();
          }
        });
      });
    }
  };
  // OFFLINE: listens for dentists creations, and append it to current clinic
  const addDentistOffline = (dentistName: string) => {
    if (!navigator.onLine) {
      const q = query(dentistsCollection);
      onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
        snapshot.docChanges().forEach(async (change, index) => {
          console.log(change.doc.data().name == dentistName);
          if (
            change.type === 'added' &&
            currClinic &&
            change.doc.data().name == dentistName
          ) {
            const clinicRef = doc(clinicsCollection, currClinic?.id);
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
      const q = query(imagesCollection);
      onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (
            change.type === 'added' &&
            currPatient &&
            currPatient.id &&
            change.doc.data().name == name
          ) {
            const patientRef = doc(patientsCollection, currPatient.id);
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
      const clinicRef = doc(clinicsCollection, currClinic?.id);

      await updateDoc(clinicRef, {
        patients: arrayRemove(deletedPatientRef),
      });
    }
  };

  return (
    <AppContext.Provider
      value={{
        patientData,
        setPatientData,
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
