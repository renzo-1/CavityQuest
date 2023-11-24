import { Dispatch, SetStateAction } from 'react';
import { CollectionReference, DocumentReference } from 'firebase/firestore';

declare global {
  enum GenderEnum {
    female = 'Female',
    male = 'Male',
    other = 'other',
  }

  interface ImageUpload {
    createdOn: any;
    onlineUrl: string;
    offlineUrl: string;
    name: string;
    toothLocation?: string;
    toothName?: string;
  }
  type Timestamp = {
    nanoseconds: number;
    seconds: number;
  };

  interface HistoryData {
    treatment: string;
    createdOn: string;
    dentist: string;
    toothName: string;
    toothLocation: string;
  }
  interface Capture {
    name: string;
    location: string;
    url: string;
  }

  interface Patient {
    id: string;
    patientNumber: number;
    fullName: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    clinic: string;
    // dentist: string;
    dateOfBirth: string;
    address: string;
    contactNumber: string;
    gender: string;
    imageUploads: DocumentReference[];
    note?: string;
    treatments?: string[];
    history?: HistoryData[];
    createdOn: Timestamp;
    isActive: boolean;
  }

  interface CreatePatient extends Omit<Patient, 'imageUploads'> {
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
  type AuditTrail = {
    contactNumber: string;
    patientName: string;
    id: string;
    date: Timestamp;
    type: 'delete' | 'update';
    before?: { contactNumber: string; address: string };
    after?: { contactNumber: string; address: string };
  };
  interface AuditTrailTableData extends Omit<AuditTrail, 'date'> {
    date: string;
    time: string;
    numberChange: { beforeNumber?: string; afterContact?: string };
    addressChange: { beforeAddress?: string; afterAddress?: string };
  }
  interface Clinic {
    uid: string;
    id: string;
    name: string;
    patients: DocumentReference[];
    dentists: DocumentReference[];
    auditTrails?: AuditTrail[];
  }

  interface ContextType {
    patients: Patient[];
    setPatients: Dispatch<SetStateAction<Patient[]>>;
    // dispatchPatientData: Dispatch<PatientDataAction>;
    setShowClinicsMenu: Dispatch<SetStateAction<boolean>>;
    showClinicsMenu: boolean;
    currPatient: Patient | undefined;
    setCurrPatient: Dispatch<SetStateAction<Patient | undefined>>;
    setCurrClinic: Dispatch<SetStateAction<Clinic | undefined>>;
    currClinic?: Clinic;
    dentists?: DentistProps[];
    setDentists?: Dispatch<SetStateAction<DentistProps[] | undefined>>;
    clinics: Clinic[];
    updateClinic: (newDataRef: DocumentReference, field: string) => {};
    getClinics: () => void;
    getPatients: (clinic: Clinic[]) => Promise<void>;
    // getDentists: () => void;
    deletePatientOnClinic: (newDataRef: DocumentReference) => void;
    addDentistOffline: (dentistName: string) => void;
    addImageOffline: (name: string) => void;
    addPatientOffline: (fName: string, lName: string, mName?: string) => void;
    clinicCollection: CollectionReference;
    patientCollection: CollectionReference;
    imageCollection: CollectionReference;
    dentistCollection: CollectionReference;
    deletedPatientCollection: CollectionReference;
    contactNumberCollection: CollectionReference;
  }

  type PatientTableData = {
    number: number | string;
    id: number | string;
    fullName: string;
    contactNumber: string;
    createdOn: string;
    treatments: string[];
  };

  interface columns {
    accessor: string;
    sortbyOrder?: 'asc' | 'desc';
    label: string;
    sortable: boolean;
  }
  interface Auth {
    uid: string;
    email: string;
  }
  interface AuthContextType {
    auth?: Auth;
    setAuth: Dispatch<SetStateAction<Auth | undefined>>;
  }
}
