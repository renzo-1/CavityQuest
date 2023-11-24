import React, { useState, useMemo, useEffect } from 'react';
import { StripedDataGrid } from 'utils/StripedDataGrid';
import { useAppContext } from 'features/AppContext';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import formatDate from 'utils/formatDate';
import { capitalize } from 'lodash';

const AuditTrails = () => {
  const { currClinic, clinics, setCurrClinic } = useAppContext() as ContextType;
  const [rows, setRows] = useState<AuditTrailTableData[]>();
  // AuditTrails
  useEffect(() => {
    const rowsArr: AuditTrailTableData[] = [];

    clinics.map((newClinic) =>
      newClinic.id == currClinic?.id ? setCurrClinic(newClinic) : ''
    );

    const auditTrails = currClinic?.auditTrails;
    if (auditTrails && auditTrails.length > 0) {
      auditTrails.map(
        (
          { contactNumber, patientName, id, date, type, before, after },
          index
        ) => {
          const formattedDate = formatDate(new Date(date.seconds * 1000));

          const numberChange = {
            beforeNumber: before?.contactNumber,
            afterNumber: after?.contactNumber,
          };
          const addressChange = {
            beforeAddress: before?.address,
            afterAddress: after?.address,
          };

          rowsArr.push({
            patientName,
            contactNumber,
            id: index.toString(),
            date: formattedDate[0],
            time: formattedDate[1],
            type,
            numberChange,
            addressChange,
          });
        }
      );
    }
    setRows(rowsArr);
  }, [
    clinics,
    currClinic,
    currClinic?.auditTrails?.length,
    currClinic?.auditTrails!,
  ]);

  // useEffect(() => {

  //     setRows(rowsArr);
  //   }
  // }, [patients, currClinic, clinics]);

  const columns: GridColDef[] = [
    {
      field: 'type',
      headerName: 'Type',
      width: 200,
      valueGetter: (params) => {
        if (!params.value) {
          return params.value;
        }
        // Convert the decimal value to a percentage
        return capitalize(params.value);
      },
    },

    { field: 'patientName', headerName: 'Patient', width: 400 },
    { field: 'contactNumber', headerName: 'Phone number', width: 300 },
    { field: 'date', headerName: 'Date', width: 200 },
    { field: 'time', headerName: 'Time', width: 200 },
    {
      field: 'numberChange',
      headerName: 'Contact Number',
      width: 300,
      valueGetter: (params) => {
        if (
          !params.value.beforeNumber ||
          params.value.beforeNumber === params.value.afterNumber
        ) {
          return '';
        }
        // Convert the decimal value to a percentage
        return `${params.value.beforeNumber} > ${params.value.afterNumber}`;
      },
    },

    {
      field: 'addressChange',
      headerName: 'Address',
      width: 400,
      valueGetter: (params) => {
        if (
          !params.value.beforeAddress ||
          params.value.beforeAddress === params.value.afterAddress
        ) {
          return '';
        }
        // Convert the decimal value to a percentage
        return `Address: ${params.value.beforeAddress} > ${params.value.afterAddress}`;
      },
    },
  ];

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

export default AuditTrails;
