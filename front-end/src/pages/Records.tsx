import React, { useState, useMemo, useEffect } from 'react';
// import patientData from '../../seeds';
import { cloudBtn } from '../assets';
import { useNavigate } from 'react-router-dom';
import { BackButton } from 'components';
import { useAppContext } from 'features/AppContext';
import formatDate from 'utils/formatDate';
import { GridColDef } from '@mui/x-data-grid';
import { StripedDataGrid } from 'utils/StripedDataGrid';
import { PatientDataContextType, tableData } from 'utils/Interfaces';

const Records = () => {
  const [searchedName, setSearchedName] = useState<string>('');
  const navigate = useNavigate();
  const { patientData, currClinic, setCurrPatient, clinics } =
    useAppContext() as PatientDataContextType;
  const [rows, setRows] = useState<tableData[] | undefined>();

  useEffect(() => {
    const rowsArr: tableData[] = [];
    if (
      patientData &&
      patientData.length > 0 &&
      !patientData.includes(undefined!)
    ) {
      patientData.map(({ id, fullName, createdOn, treatments }, index) => {
        const formattedDate = formatDate(new Date(createdOn.seconds * 1000));
        rowsArr.push({
          number: index + 1,
          id,
          fullName,
          createdOn: formattedDate,
          treatments: treatments || [],
        });
      });
      setRows(rowsArr);
    }
  }, [patientData, currClinic, clinics]);

  console.log(patientData);

  const columns: GridColDef[] = [
    { field: 'number', headerName: 'Number', width: 200 },
    { field: 'id', headerName: 'id', width: 0 },
    { field: 'fullName', headerName: 'Name', width: 550 },
    {
      field: 'createdOn',
      headerName: 'Created on',
      type: 'string',
      width: 500,
    },
    {
      field: 'treatments',
      headerName: 'Treatments',
      width: 500,
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
        <div className="p-10 w-full space-y-8">
          <div className="flex items-center space-x-10 font-bold">
            <BackButton />
            <div className="space-x-4 flex items-center">
              <button>
                <img className="h-8" src={cloudBtn} alt="search button" />
              </button>
              <p>Sync Records on Cloud</p>
            </div>
          </div>
          <div className="text-3xl">
            <StripedDataGrid
              sx={{
                '.MuiDataGrid-cellContent': {
                  fontSize: '1.1rem',
                  cursor: 'default',
                },
                '.MuiDataGrid-columnHeaderTitleContainer': {
                  fontSize: '1.4rem',
                  fontStyle: 'bold',
                },
                '.MuiDataGrid-root, .MuiDataGrid-root--densityStandard': {
                  maxWidth: 'fit-content',
                  minWidth: 'fit-content',
                },
              }}
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
