import { FormattedPatientData, PatientData } from './Interfaces';
export const formatPatientData = (
  data: PatientData,
  // dentist: string,
  id: string,
  patientNumber: number,
  currClinic: string
) => {
  const mName = data?.middleName ? data?.middleName!.charAt(0) + '.' : '';
  const fullName = data.lastName + ', ' + data.firstName + ' ' + mName;
  const treatments = data.history?.map((h) => ` ${h.treatment}`);
  console.log('treatments', treatments);
  const formattedData = {
    id,
    patientNumber,
    fullName,
    firstName: data.firstName,
    middleName: data.middleName,
    lastName: data.lastName,
    clinic: currClinic,
    // dentist,
    history: data.history || [],
    dateOfBirth: data.dateOfBirth,
    address: data.address,
    contactNumber: data.contactNumber,
    gender: data.gender,
    imageUploads: data.imageUploads,
    note: data.note,
    treatments,
    createdOn: data.createdOn,
  };
  return formattedData;
};
