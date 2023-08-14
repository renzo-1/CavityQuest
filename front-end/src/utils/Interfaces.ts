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
  id?: string | number;
  fullName?: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: Date;
  address: string;
  contact: string;
  gender: GenderEnum;
  imageUploads: FileList | ImageUpload[];
  doctorsNote?: string;
  dateAdded?: Date;
  dateModified?: Date;
}

interface responseData {
  id: string | number;
  last_name: string;
  first_name: string;
  middle_name: string;
  address: string;
  gender: GenderEnum;
  date_of_birth: Date;
  contact_number: string;
  image_uploads: ImageUpload[];
  doctors_note?: string;
  date_added: Date;
  date_modified: Date;
}

type PatientDataContextType = {
  patientData: PatientData[];
  setPatientData: Dispatch<SetStateAction<PatientData[]>>;
  setIsNewData: Dispatch<SetStateAction<Boolean>>;
  currPatient: PatientData | undefined;
  setCurrPatient: Dispatch<SetStateAction<PatientData | undefined>>;
};
export { PatientData, responseData, PatientDataContextType, ImageUpload };
