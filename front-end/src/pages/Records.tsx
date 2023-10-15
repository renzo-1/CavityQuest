import React, { useState, useMemo, useEffect } from 'react';
// import patientData from '../../seeds';
import { cloudBtn } from '../../assets';
import { useNavigate } from 'react-router-dom';
import { BackButton } from 'components';
import { useAppContext } from 'features/AppContext';
import formatDate from 'utils/formatDate';
import { GridColDef } from '@mui/x-data-grid';
import { StripedDataGrid } from 'utils/StripedDataGrid';
import { ContextType, tableData } from 'utils/Interfaces';

const Records = () => {
  const [searchedName, setSearchedName] = useState<string>('');
  const navigate = useNavigate();
  const { patientData, setPatientData, currClinic, setCurrPatient, clinics } =
    useAppContext() as ContextType;

  const [rows, setRows] = useState<tableData[] | undefined>();

  useEffect(() => {
    const rowsArr: tableData[] = [];
    if (
      patientData &&
      patientData.length > 0 &&
      !patientData.includes(undefined!)
    ) {
      patientData.map(
        ({
          id,
          patientNumber,
          fullName,
          createdOn,
          treatments,
          contactNumber,
        }) => {
          const formattedDate = formatDate(new Date(createdOn.seconds * 1000));

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
      setRows(rowsArr);
    }
  }, [patientData, currClinic, clinics]);

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
    patientData.map((patient) => {
      if (rowId.toString() === patient.id) {
        setCurrPatient(patient);
        navigate(`/${currClinic}/records/${patient.id}`);
      }
    });
  };

  if (patientData) {
    return (
      <>
        <div className="p-10 w-full space-y-8 drop-shadow-md">
          <div className="flex items-center justify-between">
            <BackButton />
            <h1 className="text-primary text-xl font-bold">
              {currClinic?.name}
            </h1>
          </div>
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
        </div>
      </>
    );
  } else {
    return <p>No patient data!</p>;
  }
};
export default Records;
