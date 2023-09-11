import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DentistProps,
  Clinic,
  ContextType,
  FormattedPatientData,
  PatientData,
  ImageUpload,
} from 'utils/Interfaces';
import { db } from 'utils/firebase-config';
// import { offlineImageUpload } from 'utils/offlineImageUploads';
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
} from '@firebase/firestore';
import { toast } from 'react-toastify';
import { formatPatientData } from 'utils/formatPatientData';
import { checkDir, deleteFile, readFile } from 'utils/offlineImageUploads';
import { uploadFile } from 'utils/uploadFiles';
import { useParams } from 'react-router-dom';

const AppContext = createContext<ContextType | null>(null);

export const useAppContext = () => {
  return useContext(AppContext);
};

interface AppProps {
  children?: React.ReactNode;
}

const AppProvider: React.FC<AppProps> = ({ children }) => {
  const [patientData, setPatientData] = useState<FormattedPatientData[]>([]);
  const [showClinicsMenu, setShowClinicsMenu] = useState<boolean>(true);
  const [currPatient, setCurrPatient] = useState<
    FormattedPatientData | undefined
  >();
  const [currClinic, setCurrClinic] = useState<Clinic>();
  const [dentists, setDentists] = useState<DentistProps[] | undefined>();
  const [clinics, setClinics] = useState<Clinic[]>([]);

  const [isLoading, setIsloading] = useState<boolean>(false);
  const clinicsCollection = collection(db, 'clinics');
  const patientsCollection = collection(db, 'patients');
  const imagesCollection = collection(db, 'images');
  const dentistsCollection = collection(db, 'dentists');
  const [images, setImages] = useState<ImageUpload[]>([]);

  // upload local images

  // const uploadOfflineImages = async (patients: FormattedPatientData[]) => {
  //   const toastId = toast.loading('Uploading offline images...');
  //   try {
  //     setIsloading(true);
  //     // interate over clinics
  //     if (patients && patients.length > 0) {
  //       for (let patient of patients) {
  //         const docRef = await doc(patientCollection, patient.id);
  //         const docSnap = await getDoc(docRef);
  //         // interate over patient image uploads
  //         for (let img of docSnap.data()?.imageUploads) {
  //           if (img.local) {
  //             // 1.) get file from file system (base64)
  //             const res = await readFile(img.url);
  //             const data = 'data:image/jpg;base64,' + res;
  //             // 2.) upload file to firestore
  //             const uploadedFile = await uploadFile(data, 'offlineUpload');
  //             // 3.) delete file from file system
  //             await deleteFile(img.url);
  //             // 4.) remove image object from patient doc
  //             await updateDoc(docRef, {
  //               imageUploads: arrayRemove(img),
  //             });
  //             // 5.) insert new object with firestore url and timestamp from when the upload was online
  //             await updateDoc(docRef, {
  //               imageUploads: arrayUnion({
  //                 url: uploadedFile?.url,
  //                 createdOn: img.createdOn,
  //               }),
  //             });
  //           }
  //         }
  //       }
  //     }
  //     toast.update(toastId, {
  //       render: 'Offline images successfully saved',
  //       type: 'success',
  //       autoClose: 2000,
  //       isLoading: false,
  //     });
  //     setIsloading(false);
  //   } catch (e) {
  //     console.log('offline to online uploads', e);
  //     toast.update(toastId, {
  //       render: 'An error occured offline images. Try reloading.',
  //       type: 'error',
  //       autoClose: 2000,
  //       isLoading: false,
  //     });
  //   }
  // };

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

  // const getOfflineImages = (patient: FormattedPatientData | undefined) => {
  //   if (patient!.imageUploads.length < 1 && !patient && !navigator.onLine)
  //     return;
  //   try {
  //     let imagesArr: ImageUpload[] = [];
  //     patient?.imageUploads.map(async (imgRef) => {
  //       const docSnap = await getDoc(imgRef);

  //       if (docSnap.exists()) {
  //         const data: ImageUpload = docSnap.data() as ImageUpload;
  //         return {
  //           createdOn: data.createdOn,
  //           onlineUrl: data.onlineUrl,
  //           offlineUrl: data.offlineUrl,
  //         };
  //       }
  //     });

  //     setOfflineImages(imagesArr);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(()=> {
  //   getOfflineImages(currPatient);
  // }, [currPatient])

  const getClinics = () => {
    const q = query(clinicsCollection);

    onSnapshot(q, { includeMetadataChanges: true }, (querySnapshot) => {
      const clinicSnap: Clinic[] = querySnapshot.docs.map((doc) => ({
        patients: doc.data().patients,
        dentists: doc.data().dentists,
        name: doc.data().name,
        id: doc.id,
      }));
      setClinics(clinicSnap);
      getPatients(clinicSnap);
      getDentists(clinicSnap);
    });
    // cleanSnapShot();
  };

  useEffect(() => {
    getClinics();
  }, [currClinic]);

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

  // OFFLINE: listen for patients creations, and append it to current clinic
  // useEffect(() => {
  //   const q = query(patientsCollection);
  //   if (!navigator.onLine) {
  //     onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
  //       snapshot.docChanges().forEach(async (change) => {
  //         if (change.type === 'added' && currClinic) {
  //           const clinicRef = doc(clinicsCollection, currClinic?.id);
  //           updateDoc(clinicRef, {
  //             patients: arrayUnion(change.doc.ref),
  //           });
  //           // saveImage(change.doc.id);
  //           // getClinics();
  //         }
  //       });
  //     });
  //   }
  // }, []);
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
    <>
      {patientData && (
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
            images,
            setImages,
            addImageOffline,
            addDentistOffline,
            addPatientOffline,
          }}
        >
          {isLoading && (
            <div className="w-full h-full bg-white absolute top-0 left-0 z-[10000]"></div>
          )}
          {children}
        </AppContext.Provider>
      )}
    </>
  );
};

export default AppProvider;
