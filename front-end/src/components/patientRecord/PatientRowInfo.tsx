import React from 'react';
import { useNavigate } from 'react-router-dom';

const PatientRowInfo = ({
  id,
  fullName,
  dateAdded,
}: {
  id: number;
  fullName?: string;
  dateAdded?: Date;
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex">
        <p className="w-[50px]">{id}</p>
        <p className="">{fullName}</p>
      </div>

      <p>{dateAdded?.toString()}</p>
    </>
  );
};

export default PatientRowInfo;
