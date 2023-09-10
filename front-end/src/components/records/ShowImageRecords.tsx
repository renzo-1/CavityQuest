import React, {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useMemo,
} from 'react';
import {
  ContextType,
  PatientData,
  ImageUpload,
  FormattedPatientData,
} from 'utils/Interfaces';

import formatDate from 'utils/formatDate';
import { useAppContext } from 'features/AppContext';
import { collection, getDoc } from 'firebase/firestore';
import { readFile } from 'utils/offlineImageUploads';
import { db } from 'utils/firebase-config';
// array to set to array (function: get unique dates)
const getUniqueDateRecords = (arr: ImageUpload[]) => {
  try {
    const convertTimestampToDate = arr.map((file) => {
      return formatDate(new Date(file.createdOn.seconds * 1000));
    });

    return Array.from(new Set(convertTimestampToDate));
  } catch (e) {
    console.log(e);
    return [];
  }
};

interface Props {
  id?: string;
}

const ShowImageRecords = ({ id }: Props) => {
  const {
    patientData,
    setCurrPatient,
    currPatient,
    images,
    setImages,
    clinics,
  } = useAppContext() as ContextType;
  const [dateStamps, setDateStamps] = useState<string[]>([]);

  // const dateStamps = useMemo(() => {
  //   console.log(patientData);
  //   if (currPatient) return getUniqueDateRecords(currPatient);
  // }, [patientData]);
  // setCurrPatient(patient);

  // const getFile = async (img: string) => {
  //   // returns base64
  //   console.log('img', img);

  //   try {
  //     const res = await readFile(img);
  //     return 'data:image/jpg;base64,' + res;
  //   } catch (e) {
  //     return;
  //   }
  // };
  const imagesCollection = collection(db, 'images');
  const patientsCollection = collection(db, 'patients');

  // OFFLINE: listen for base64Images creations, and append it to current patient
  // const saveImage = (patientId?: string) => {
  //   if (!navigator.onLine) {
  //     const q = query(imagesCollection);
  //     onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
  //       snapshot.docChanges().forEach(async (change) => {
  //         if (change.type === 'added' && patientId) {
  //           const patientRef = doc(patientsCollection, patientId);
  //           updateDoc(patientRef, {
  //             imageUploads: arrayUnion(change.doc.ref),
  //           });
  //           // getClinics();
  //         } else {
  //           console.log('no image upload changes');
  //         }
  //       });
  //     });
  //   }
  // };

  const getImages = async (patient: FormattedPatientData | undefined) => {
    if (!patient!.imageUploads) {
      return;
    }
    try {
      let imagesArr: ImageUpload[] = [];

      for (let imgRef of patient!.imageUploads) {
        const docSnap = await getDoc(imgRef);
        if (docSnap.exists()) {
          const data: ImageUpload = docSnap.data() as ImageUpload;
          const obj: ImageUpload = {
            createdOn: data.createdOn,
            onlineUrl: data.onlineUrl,
            offlineUrl: data.offlineUrl,
          };
          imagesArr.push(obj);
        } else {
          console.log('image does not exist');
        }
      }
      console.log('imgs', imagesArr);
      setImages([...imagesArr]);
      setDateStamps(getUniqueDateRecords(imagesArr));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // if (!navigator.onLine) { PROD

    for (let patient of patientData) {
      if (patient.id?.toString() === id) {
        setCurrPatient(patient);
        getImages(patient);
        break;
      }
    }
  }, [currPatient, patientData, currPatient?.imageUploads, clinics]);

  return (
    <>
      {/*NOTE: make images clickable and zoomable*/}
      {dateStamps && (
        <div
          className={`shadow-lg rounded-lg px-14 ${
            dateStamps?.length != 0 && 'pb-10'
          } mx-auto relative bg-white w-full h-full`}
        >
          {[...dateStamps]?.reverse().map((date) => {
            return (
              <div className="space-y-4 z-20 pt-10" key={date}>
                <div className="flex items-center justify-center space-x-8">
                  <h1 className="relative text-xl font-bold inline-block w-fit whitespace-nowrap ">
                    {date}
                  </h1>
                  <hr className="inline-block w-full border-0 border-t border-black"></hr>
                </div>
                <div className="grid grid-cols-3 gap-8">
                  {images.map((img, index) => {
                    if (
                      formatDate(new Date(img.createdOn.seconds * 1000)) ===
                      date
                    )
                      return (
                        <img
                          loading="lazy"
                          key={index}
                          className="rounded-lg z-20"
                          src={
                            img.onlineUrl == '' || !navigator.onLine
                              ? img.offlineUrl
                              : img.onlineUrl
                          }
                          alt="detection sample"
                        ></img>
                      );
                  })}
                </div>
              </div>
            );
          })}
          <div className="flex items-center justify-center h-[75px]">
            {dateStamps?.length == 0 && <p>No image records found</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default ShowImageRecords;
