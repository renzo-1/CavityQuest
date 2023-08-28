import { Data } from 'electron';
import { Url } from 'url';
import React, { Dispatch, SetStateAction } from 'react';
enum GenderEnum {
  female = 'Female',
  male = 'Male',
  other = 'other',
}
declare global {
  interface File {
    image: string;
    date_created: Date;
    patient: string;
  }
}

interface ImageUpload extends File {
  date_created: Date;
  patient: string;
  image: string;
}

interface PatientData {
  id: string | number;
  fullName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  clinic: number;
  dentist: number;
  dateOfBirth: Date;
  address: string;
  contact: string;
  gender: GenderEnum;
  imageUploads: FileList | ImageUpload[];
  doctorsNote?: string;
  treatments?: string[];
  dateAdded: Date;
  dateModified?: Date;
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

interface ClinicProps {
  id: number;
  name: string;
}

interface ClinicProps {
  id: number;
  name: string;
}
interface DentistProps {
  id: number;
  name: string;
  clinic: number;
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
  patientData: PatientData[];
  setPatientData: Dispatch<SetStateAction<PatientData[]>>;
  dispatchPatientData: Dispatch<PatientDataAction>;
  setIsNewData: Dispatch<SetStateAction<Boolean>>;
  currPatient: PatientData | undefined;
  setCurrPatient: Dispatch<SetStateAction<PatientData | undefined>>;
  setCurrClinic: Dispatch<SetStateAction<number | undefined>>;
  currClinic?: number;
  dentists: DentistProps[];
  setDentists: Dispatch<SetStateAction<DentistProps[]>>;
  clinics: ClinicProps[];
}
interface accessor {
  [accessor: string]: string | number | string[];
}
type tableData = {
  id: number | string;
  fullName: string;
  dateAdded: string;
  treatments: string[];
};
interface columns {
  accessor: string;
  sortbyOrder?: 'asc' | 'desc';
  label: string;
  sortable: boolean;
}

export {
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
};
