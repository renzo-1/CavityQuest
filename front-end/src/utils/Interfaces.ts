import { Data } from 'electron';
import { Url } from 'url';
import React, { Dispatch, SetStateAction } from 'react';
import { DocumentReference } from 'firebase/firestore';
enum GenderEnum {
  female = 'Female',
  male = 'Male',
  other = 'other',
}
// declare global {
//   interface File {
//     createdOn: any;
//     url: string;
//     offlineUrl: string;
//   }
// }

interface ImageUpload {
  createdOn: any;
  onlineUrl: string;
  offlineUrl: string;
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
  dentist: string;
  dateOfBirth: string;
  address: string;
  contactNumber: string;
  gender: GenderEnum;
  imageUploads: DocumentReference[];
  note?: string;
  treatments?: string[];
  createdOn: Timestamp;
}
interface FormattedPatientData {
  id: string;
  patientNumber: number;
  fullName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  clinic: string;
  dentist: string;
  dateOfBirth: string;
  address: string;
  contactNumber: string;
  gender: string;
  imageUploads: DocumentReference[];
  note?: string;
  treatments?: string[];
  createdOn: Timestamp;
}
interface CreatePatientData extends Omit<PatientData, 'imageUploads'> {
  imageUploads: File[];
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
interface Clinic {
  id: string;
  name: string;
  patients: DocumentReference[];
  dentists: DocumentReference[];
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

interface ContextType {
  patientData: FormattedPatientData[];
  setPatientData: Dispatch<SetStateAction<FormattedPatientData[]>>;
  // dispatchPatientData: Dispatch<PatientDataAction>;
  setShowClinicsMenu: Dispatch<SetStateAction<boolean>>;
  showClinicsMenu: boolean;
  currPatient: FormattedPatientData | undefined;
  setCurrPatient: Dispatch<SetStateAction<FormattedPatientData | undefined>>;
  setCurrClinic: Dispatch<SetStateAction<Clinic | undefined>>;
  currClinic?: Clinic;
  dentists?: DentistProps[];
  setDentists?: Dispatch<SetStateAction<DentistProps[] | undefined>>;
  clinics: Clinic[];
  updateClinic: (newDataRef: any, field: string) => {};
  getClinics: () => void;
  getPatients: (clinic: Clinic[]) => Promise<void>;
  // getDentists: () => void;
  deletePatientOnClinic: (newDataRef: DocumentReference) => void;
  saveImage: (patientID?: string) => void;
  images: ImageUpload[];
  setImages: Dispatch<SetStateAction<ImageUpload[]>>;
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
  ContextType,
  ImageUpload,
  DentistProps,
  Clinic,
  PatientDataKind,
  PatientDataAction,
  tableData,
  columns,
  Timestamp,
  FormattedPatientData,
};
