import React, {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useMemo,
} from 'react';


import formatDate from 'utils/formatDate';
import { useAppContext } from 'features/AppContext';
import { getDoc } from 'firebase/firestore';
// array to set to array (function: get unique dates)
const getUniqueDateRecords = (arr: ImageUpload[]) => {
  try {
    const convertTimestampToDate = arr.map((file) => {
      return formatDate(new Date(file.createdOn.seconds * 1000))[0];
    });

    return Array.from(new Set(convertTimestampToDate));
  } catch (e) {
    console.log(e);
    return [];
  }
};

interface Props {
  id?: string;
  dateStamps: string[];
  setDateStamps: Dispatch<SetStateAction<any>>;
  images: ImageUpload[];
  setImages: Dispatch<SetStateAction<ImageUpload[]>>;
}

const ShowImageRecords = ({
  id,
  dateStamps,
  setDateStamps,
  images,
  setImages,
}: Props) => {
  const { patients, setCurrPatient, currPatient, clinics } =
    useAppContext() as ContextType;

  const getImages = async (patient: Patient | undefined) => {
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
            name: data.name,
            createdOn: data.createdOn,
            onlineUrl: data.onlineUrl,
            offlineUrl: data.offlineUrl,
            toothLocation: data.toothLocation,
            toothName: data.toothName,
          };
          imagesArr.push(obj);
        } else {
          console.log('image does not exist');
        }
      }
      setImages([...imagesArr]);
      setDateStamps(getUniqueDateRecords(imagesArr));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // if (!navigator.onLine) { PROD

    for (let patient of patients) {
      if (patient.id?.toString() === id) {
        setCurrPatient(patient);
        getImages(patient);
        break;
      }
    }
  }, [currPatient, patients, currPatient?.imageUploads]);

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
                <div className="grid grid-cols-4 gap-8">
                  {images.map((img, index) => {
                    if (
                      formatDate(new Date(img.createdOn.seconds * 1000))[0] ===
                      date
                    )
                      return (
                        <div>
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
                          {img.toothName && img.toothLocation && (
                            <h2 className="font-bold text-xl">
                              {img.toothName + '-' + img.toothLocation}
                            </h2>
                          )}
                        </div>
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
