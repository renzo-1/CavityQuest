import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useParams } from 'react-router-dom';
import { BackButton, PatientInfoField } from 'components';
import { detectionSample } from '../../assets';
import { PatientDataContextType, PatientData, ImageUpload } from 'Interfaces';
import { useAppContext } from 'features/AppContext';

// array to set to array (function: get unique dates)
const getUniqueDateRecords = (arr: PatientData) => {
  return Array.from(
    new Set(
      Array.from(arr.imageUploads).map((file) => {
        return file.date_created.toString();
      })
    )
  );
};

interface Props {
  id?: string;
  currPatient?: PatientData;
  setCurrPatient: Dispatch<SetStateAction<PatientData | undefined>>;
}

const ShowImageRecords = ({ id, currPatient, setCurrPatient }: Props) => {
  const [dateStamps, setDateStamps] = useState<string[]>([]);
  const { patientData } = useAppContext() as PatientDataContextType;

  useEffect(() => {
    console.log(id);
    patientData.map((patient) => {
      if (patient.id?.toString() === id) {
        setCurrPatient(patient);
        setDateStamps(getUniqueDateRecords(patient));
      }
    }),
      [];
  }, []);
  return (
    <>
      {/*NOTE: make images clickable and zoomable*/}
      <div className="shadow-lg rounded-lg px-14 pb-10 mx-auto relative bg-white">
        {currPatient &&
          dateStamps.map((date) => {
            return (
              <div className="space-y-4 z-20 pt-10" key={date}>
                <div className="flex items-center justify-center space-x-8">
                  <h1 className="relative text-xl font-bold inline-block w-fit whitespace-nowrap ">
                    {date}
                  </h1>
                  <hr className="inline-block w-full border-0 border-t border-black"></hr>
                </div>
                <div className="grid grid-cols-3 gap-8">
                  {Array.from(currPatient.imageUploads).map((file, index) => {
                    if (file.date_created.toString() === date)
                      return (
                        <img
                          key={index}
                          className="rounded-lg w-full z-20 "
                          src={file.image}
                          alt="detection sample"
                        ></img>
                      );
                  })}
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default ShowImageRecords;
