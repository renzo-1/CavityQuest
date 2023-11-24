import React from 'react';
import { useAppContext } from 'features/AppContext';
import { AuditTrails as AuditTrailsComponent } from 'components';
import { HeaderButtons } from 'components';
const AuditTrails = () => {
  const { currClinic } = useAppContext() as ContextType;

  return (
    <div className="p-10 w-full space-y-8 drop-shadow-md">
      <div className="flex items-center justify-between">
        <HeaderButtons auditTrails={true} />
        <h1 className="text-primary text-xl font-bold">{currClinic?.name}</h1>
      </div>
      <AuditTrailsComponent />
    </div>
  );
};

export default AuditTrails;
