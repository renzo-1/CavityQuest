import React, {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useMemo,
} from 'react';
import {
  PatientDataContextType,
  PatientData,
  ImageUpload,
} from 'utils/Interfaces';
import formatDate from 'utils/formatDate';
import { useAppContext } from 'features/AppContext';
// array to set to array (function: get unique dates)
const getUniqueDateRecords = (arr: PatientData | undefined) => {
  try {
    if (arr) {
      return Array.from(
        new Set(
          Array.from(arr.imageUploads).map((file) => {
            return file.date_created.toString();
          })
        )
      );
    }
  } catch {
    return [];
  }
};

interface Props {
  id?: string;
}



const ShowImageRecords = ({ id }: Props) => {
  const { patientData, setCurrPatient, currPatient } =
    useAppContext() as PatientDataContextType;
  const [dateStamps, setDateStamps] = useState<string[]>([]);

  // const dateStamps = useMemo(() => {
  //   console.log(patientData);
  //   if (currPatient) return getUniqueDateRecords(currPatient);
  // }, [patientData]);
  // setCurrPatient(patient);

  useEffect(() => {
    patientData.map((patient) => {
      if (patient.id?.toString() === id) {
        setCurrPatient(patient);
        setDateStamps(getUniqueDateRecords(patient) || []);
      }
    }),
      [];
  }, [patientData]);

  return (
    <>
      {/*NOTE: make images clickable and zoomable*/}
      {dateStamps && (
        <div
          className={`shadow-lg rounded-lg px-14 ${
            dateStamps?.length != 0 && 'pb-10'
          } mx-auto relative bg-white`}
        >
          {dateStamps?.reverse().map((date) => {
            return (
              <div className="space-y-4 z-20 pt-10" key={date}>
                <div className="flex items-center justify-center space-x-8">
                  <h1 className="relative text-xl font-bold inline-block w-fit whitespace-nowrap ">
                    {formatDate(date)}
                  </h1>
                  <hr className="inline-block w-full border-0 border-t border-black"></hr>
                </div>
                <div className="grid grid-cols-3 gap-8">
                  {Array.from(currPatient?.imageUploads!).map((file, index) => {
                    if (file.date_created.toString() === date)
                      return (
                        <img
                          key={index}
                          className="rounded-lg z-20"
                          src={file.image}
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
