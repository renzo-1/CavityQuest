interface Patient {
  id: string;
  name: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  contactNumber: string;
  dateAdded: string;
  dateModified: string;
  numberOfRecords: number;
  doctorsNote: string;
  filesArrUrl?: string;
}

const patientData: Patient[] = [
  {
    id: '1',
    name: 'John Smith',
    gender: 'Male',
    dateOfBirth: 'September 1, 2023',
    address: 'San Pedro, San Fernando, Pampanga',
    contactNumber: '09195094033',
    dateAdded: '1/23/23',
    dateModified: '2/25/25',
    numberOfRecords: 3,
    doctorsNote: 'Plan of treatment is lorem ipsum and lorem ipsum dolor',
  },
  {
    id: '2',
    name: 'Emily Johnson',
    gender: 'Female',
    dateOfBirth: 'September 1, 2023',
    address: 'San Pedro, San Fernando, Pampanga',
    contactNumber: '09195094033',
    dateAdded: '1/23/23',
    dateModified: '2/25/25',
    numberOfRecords: 3,
    doctorsNote: 'Plan of treatment is lorem ipsum and lorem ipsum dolor',
  },
  {
    id: '3',
    name: 'Michael Williams',
    gender: 'Male',
    dateOfBirth: 'September 1, 2023',
    address: 'San Pedro, San Fernando, Pampanga',
    contactNumber: '09195094033',
    dateAdded: '1/23/23',
    dateModified: '2/25/25',
    numberOfRecords: 3,
    doctorsNote: 'Plan of treatment is lorem ipsum and lorem ipsum dolor',
  },
  {
    id: '4',
    name: 'Sophia Davis',
    gender: 'Female',
    dateOfBirth: 'September 1, 2023',
    address: 'San Pedro, San Fernando, Pampanga',
    contactNumber: '09195094033',
    dateAdded: '1/23/23',
    dateModified: '2/25/25',
    numberOfRecords: 3,
    doctorsNote: 'Plan of treatment is lorem ipsum and lorem ipsum dolor',
  },
  {
    id: '5',
    name: 'Daniel Martinez',
    gender: 'Male',
    dateOfBirth: 'September 1, 2023',
    address: 'San Pedro, San Fernando, Pampanga',
    contactNumber: '09195094033',
    dateAdded: '1/23/23',
    dateModified: '2/25/25',
    numberOfRecords: 3,
    doctorsNote: 'Plan of treatment is lorem ipsum and lorem ipsum dolor',
  },
  {
    id: '6',
    name: 'Olivia Thompson',
    gender: 'Female',
    dateOfBirth: 'September 1, 2023',
    address: 'San Pedro, San Fernando, Pampanga',
    contactNumber: '09195094033',
    dateAdded: '1/23/23',
    dateModified: '2/25/25',
    numberOfRecords: 3,
    doctorsNote: 'Plan of treatment is lorem ipsum and lorem ipsum dolor',
  },
  {
    id: '7',
    name: 'William Rodriguez',
    gender: 'Male',
    dateOfBirth: 'September 1, 2023',
    address: 'San Pedro, San Fernando, Pampanga',
    contactNumber: '09195094033',
    dateAdded: '1/23/23',
    dateModified: '2/25/25',
    numberOfRecords: 3,
    doctorsNote: 'Plan of treatment is lorem ipsum and lorem ipsum dolor',
  },
];

export default patientData;
