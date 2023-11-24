import React, { useState, useMemo, useEffect } from 'react';
import { StripedDataGrid } from 'utils/StripedDataGrid';
import formatDate from 'utils/formatDate';
import { GridColDef } from '@mui/x-data-grid';

import { useAppContext } from 'features/AppContext';
import { useNavigate } from 'react-router-dom';

const PatientRecords = () => {
  const navigate = useNavigate();
  const { patients, setPatients, currClinic, setCurrPatient, clinics } =
    useAppContext() as ContextType;
  const rows = useMemo(() => {
    let rowsArr: PatientTableData[] = [];
    if (patients && patients.length > 0 && !patients.includes(undefined!)) {
      patients.map(
        ({
          id,
          patientNumber,
          fullName,
          createdOn,
          treatments,
          contactNumber,
        }) => {
          const formattedDate = formatDate(new Date(createdOn.seconds * 1000))[0];

          rowsArr.push({
            number: patientNumber,
            contactNumber,
            id,
            fullName,
            createdOn: formattedDate,
            treatments: treatments || [],
          });
        }
      );
    }
    return rowsArr;
  }, [patients.length, currClinic?.id!, currClinic?.uid!]);

  // useEffect(() => {

  //     setRows(rowsArr);
  //   }
  // }, [patients, currClinic, clinics]);

  const columns: GridColDef[] = [
    { field: 'number', headerName: 'Number', width: 150 },
    { field: 'id', headerName: 'id', width: 0 },
    { field: 'fullName', headerName: 'Name', width: 400 },
    { field: 'contactNumber', headerName: 'Phone number', width: 400 },
    {
      field: 'createdOn',
      headerName: 'Created on',
      type: 'string',
      width: 400,
    },
    {
      field: 'treatments',
      headerName: 'Treatments',
      width: 400,
    },
  ];

  const handleRowClick = (rowId: number) => {
    patients.map((patient) => {
      if (rowId.toString() === patient.id) {
        setCurrPatient(patient);
        navigate(`/${currClinic}/records/${patient.id}`);
      }
    });
  };
  return (
    <div className="text-3xl">
      <StripedDataGrid
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        }
        rows={rows || []}
        columns={columns}
        hideFooterPagination={true}
        hideFooter
        onRowClick={(rowDetails) => {
          handleRowClick(rowDetails.row.id);
        }}
        initialState={{
          columns: {
            columnVisibilityModel: {
              id: false,
            },
          },
        }}
      />
    </div>
  );
};

export default PatientRecords;
