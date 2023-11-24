import React from 'react';

const PatientInfoField = ({
  field,
  data,
}: {
  field: string;
  data?: string | Date | number;
}) => {
  return (
    <div>
      <h3 className="text-sm">{field}</h3>
      <p className="font-bold text-xl rounded-lg capitalize">
        {data?.toString()}
      </p>
    </div>
  );
};

export default PatientInfoField;
