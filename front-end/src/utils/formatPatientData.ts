import { FormattedPatientData, PatientData } from './Interfaces';
export const formatPatientData = (
  data: PatientData,
  id: string,
  patientNumber: number,
  currClinic: string
) => {
  const fullName =
    data.lastName +
    ', ' +
    data.firstName +
    ' ' +
    data.middleName.charAt(0) +
    '.';

  const formattedData = {
    id,
    patientNumber,
    fullName,
    firstName: data.firstName,
    middleName: data.middleName,
    lastName: data.lastName,
    clinic: currClinic,
    dentist: data.dentist,
    dateOfBirth: data.dateOfBirth,
    address: data.address,
    contactNumber: data.contactNumber,
    gender: data.gender,
    imageUploads: data.imageUploads,
    note: data.note,
    treatments: data.treatments,
    createdOn: data.createdOn,
  };
  return formattedData;
};
