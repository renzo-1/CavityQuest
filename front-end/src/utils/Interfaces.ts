import { Data } from 'electron';
import { Url } from 'url';
import React, { Dispatch, SetStateAction } from 'react';
import { DocumentReference } from 'firebase/firestore';
enum GenderEnum {
  female = 'Female',
  male = 'Male',
  other = 'other',
}
declare global {
  interface File {
    createdOn: Date;
    url: string;
  }
}

interface ImageUpload extends File {
  createdOn: any;
  name: string;
  url: string;
}
type Timestamp = {
  nanoseconds: number;
  seconds: number;
};

interface PatientData {
  id: string | number;
  fullName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  clinic: number;
  dentist?: string;
  dateOfBirth: string;
  address: string;
  contactNumber: string;
  gender: GenderEnum;
  imageUploads: ImageUpload[];
  note?: string;
  treatments?: string[];
  createdOn: Timestamp;
}
interface FormattedPatientData {
  id: string;
  fullName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  clinic: string;
  dentist: DocumentReference;
  dateOfBirth: string;
  address: string;
  contactNumber: string;
  gender: string;
  imageUploads: ImageUpload[];
  note: string;
  treatments: string[];
  createdOn: Timestamp;
}
interface CreatePatientData extends Omit<PatientData, 'imageUploads'> {
  imageUploads: FileList | ImageUpload[];
}

interface PatientResponseData {
  id: string | number;
  last_name: string;
  first_name: string;
  middle_name: string;
  clinic: number;
  address: string;
  gender: GenderEnum;
  date_of_birth: Date;
  contact_number: string;
  image_uploads: FileList | ImageUpload[];
  doctors_note?: string;
  treatments?: string[];
  dentist: number;
  date_added: Date;
  date_modified: Date;
}
interface DentistProps {
  id: string;
  name: string;
}
interface ClinicProps {
  id: string;
  name: string;
  patients: string[];
  dentists: string[];
}

enum PatientDataKind {
  READ = 'READ',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

interface PatientDataAction {
  type: PatientDataKind;
  payload: {
    patientData: PatientResponseData[];
    currPatient?: number | string;
  };
}

interface PatientDataContextType {
  patientData: FormattedPatientData[];
  setPatientData: Dispatch<SetStateAction<FormattedPatientData[]>>;
  // dispatchPatientData: Dispatch<PatientDataAction>;
  setShowClinics: Dispatch<SetStateAction<boolean>>;
  showClinics: boolean;
  currPatient: FormattedPatientData | undefined;
  setCurrPatient: Dispatch<SetStateAction<FormattedPatientData | undefined>>;
  setCurrClinic: Dispatch<SetStateAction<any>>;
  currClinic: any;
  dentists?: DentistProps[];
  setDentists?: Dispatch<SetStateAction<DentistProps[] | undefined>>;
  clinics: ClinicProps[];
  updateClinic: (newDataRef: any, field: string) => {};
  getClinics: () => void;
  getPatients: () => void;
  getDentists: () => void;
  deletePatientOnClinic: (newDataRef: DocumentReference) => void;
}

type tableData = {
  number: number | string;
  id: number | string;
  fullName: string;
  createdOn: string;
  treatments: string[];
};
interface columns {
  accessor: string;
  sortbyOrder?: 'asc' | 'desc';
  label: string;
  sortable: boolean;
}

export {
  CreatePatientData,
  PatientData,
  PatientResponseData,
  PatientDataContextType,
  ImageUpload,
  DentistProps,
  ClinicProps,
  PatientDataKind,
  PatientDataAction,
  tableData,
  columns,
  Timestamp,
  FormattedPatientData,
};
