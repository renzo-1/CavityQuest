import React from 'react';

const PatientInfoField = ({ field, data }: { field: string; data?: string | Date }) => {
  return (
    <div>
      <h3 className="">{field}</h3>
      <p className="font-bold text-xl rounded-lg">{data?.toString()}</p>
    </div>
  );
};

export default PatientInfoField;
