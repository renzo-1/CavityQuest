import React from 'react';
import { useNavigate } from 'react-router-dom';

const PatientRowInfo = ({
  id,
  patientNumber,
  fullName,
  dateAdded,
  treatments,
}: {
  id: number;
  patientNumber: number;
  fullName?: string;
  dateAdded?: Date;
  treatments?: string[];
}) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex">
        <p className="w-[50px]">{patientNumber}</p>
        <p className="">{fullName}</p>
      </div>

      <p>{dateAdded?.toString()}</p>
      <ul className="flex space-x-3 flex-wrap">
        {treatments &&
          treatments.map((treatments) => (
            <li key={treatments}>
              <p>&#x2022; {treatments}</p>
            </li>
          ))}
      </ul>
    </>
  );
};

export default PatientRowInfo;