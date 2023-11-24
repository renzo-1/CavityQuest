import React, { useState } from 'react';
// import patientData from '../../seeds';
import { clockHistory } from '../../assets';
import { HeaderButtons, AuditTrails, PatientRecords } from 'components';
import { useAppContext } from 'features/AppContext';

const Records = () => {
  // AuditTrails
  const { currClinic } = useAppContext() as ContextType;
  return (
    <>
      <div className="p-10 w-full space-y-8 drop-shadow-md">
        <div className="flex items-center justify-between">
          <HeaderButtons records={true} />
          <h1 className="text-primary text-xl font-bold">{currClinic?.name}</h1>
        </div>
        <PatientRecords />
      </div>
    </>
  );
};
export default Records;
