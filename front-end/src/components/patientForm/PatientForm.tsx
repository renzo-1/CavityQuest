import {
  useEffect,
  useState,
  ChangeEvent,
  Dispatch,
  SetStateAction,
} from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { closeBtn, check, plus } from '../../../assets';
import FormFieldError from './FormFieldError';
import DentistForm from './DentistForm';
import {
  ContextType,
  PatientData,
  CreatePatientData,
  ImageUpload,
} from 'utils/Interfaces';
import { useAppContext } from 'features/AppContext';
import { toast } from 'react-toastify';
import { capitalize } from 'utils/capitilize';
import {
  collection,
  addDoc,
  // @ts-ignore
  Timestamp,
  doc,
  updateDoc,
  arrayUnion,
  DocumentReference,
  getDoc,
} from '@firebase/firestore';
import { db } from 'utils/firebase-config';
import { uploadFile } from 'utils/uploadFiles';

const PatientForm = ({
  setShow,
}: {
  setShow: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    dentists: availableDentists,
    clinics,
    currClinic,
    updateClinic,
    getPatients,
    addPatientOffline,
  } = useAppContext() as ContextType;
  const [isAddingDentist, setIsAddingDentist] = useState<boolean>(false);
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm<CreatePatientData>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const uploadedFiles: File[] = watch('imageUploads'); // Access the uploaded files using the watch function

  const patientCollection = collection(db, 'patients');
  const imagesCollection = collection(db, 'images');
  const onSubmit = async (data: CreatePatientData) => {
    const toastId = toast.loading('Saving record...');
    setIsLoading(toast.isActive(toastId));
    try {
      const internetStatus = navigator.onLine;
      const imgs = await Promise.all(
        Array.from(data.imageUploads).map((file) => uploadFile(file))
      );
      console.log('imgs', imgs);
      const dateOfBirth = new Date(data.dateOfBirth).toISOString().slice(0, 10);
      const dentist = doc(collection(db, 'dentists'), data.dentist);

      const formData = {
        // clinic: `/clinics/${currClinic}`,
        firstName: capitalize(data.firstName),
        middleName: capitalize(data.middleName),
        lastName: capitalize(data.lastName),
        dateOfBirth,
        gender: data.gender,
        address: data.address,
        dentist,
        contactNumber: data.contactNumber,
        // imageUploads: internetStatus ? imgs : [], // prod
        imageUploads: [],
        createdOn: Timestamp.now(),
      };
      console.log(formData);
      let newPatientRef: DocumentReference;
      let newPatientID;
      // ONLINE
      if (internetStatus) {
        newPatientRef = await addDoc(patientCollection, formData);
        newPatientID = newPatientRef.id;
        updateClinic(newPatientRef, 'patients');
        imgs.map(async (img: any) => {
          const imgRef = await addDoc(imagesCollection, img);
          updateDoc(newPatientRef, {
            imageUploads: arrayUnion(imgRef),
          });
        });
        // await getPatients(clinics);
        navigate(`/${currClinic?.id}/detection/${newPatientID}`);
      }
      // OFFLINE
      else {
        addDoc(patientCollection, formData);
        addPatientOffline(
          formData.firstName!,
          formData.lastName!,
          formData.middleName
        );
        navigate(`/${currClinic?.id}/records`);
      }

      toast.update(toastId, {
        render: 'Record saved',
        type: 'success',
        autoClose: 2000,
        isLoading: false,
      });

      reset();
    } catch (e) {
      console.log(e);
      toast.update(toastId, {
        render: 'An error occured saving your record. Try reloading.',
        type: 'error',
        autoClose: 2000,
        isLoading: false,
      });
    }
  };

  const handleInputChanges = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setValue('dentist', value);
  };

  const handleRemoveFile = (index: number) => {
    const newFilesList = Array.from(uploadedFiles).splice(1, index);
    setValue('imageUploads', newFilesList);
  };

  useEffect(() => {
    if (
      availableDentists &&
      availableDentists[0] &&
      availableDentists.length > 0
    ) {
      setValue('dentist', availableDentists[0].id!);
    }
  }, [availableDentists, clinics]);

  return (
    <>
      <div className="py-8 px-10 absolute w-[50rem] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-myGray rounded-lg z-30">
        <div className="flex justify-between">
          <h1 className='font-bold before:content[""] before:absolute before:w-8 before:border-b-4 before:border-black before:h-7'>
            Patient Form
          </h1>
          <button>
            <img
              src={closeBtn}
              alt="close button transition-all duration-500 ease-out"
              onClick={() => setShow((prev) => !prev)}
            />
          </button>
        </div>

        <form
          className="h-full w-full grid grid-rows-1 grid-cols-2 gap-x-10 mt-8 overflow-hidden"
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
        >
          <div className="h-full flex flex-col space-y-4 overflow-hidden">
            <label>
              <p className="font-medium">First Name</p>
              <input
                className="capitalize"
                placeholder="Your first name"
                {...register('firstName', { required: true })}
                aria-invalid={errors.firstName ? 'true' : 'false'}
              />
              <FormFieldError
                errField={errors.firstName?.type}
                descs={{ required: 'Last name is required' }}
              />
            </label>
            <label>
              <p className="font-medium">Middle Name (Optional)</p>
              <input
                className="capitalize"
                placeholder="Your middle name"
                {...register('middleName')}
              />
            </label>

            <label>
              <p className="font-medium">Last Name</p>
              <input
                className="capitalize"
                placeholder="Your last name"
                {...register('lastName', { required: true })}
                aria-invalid={errors.lastName ? 'true' : 'false'}
              />
              <FormFieldError
                errField={errors.lastName?.type}
                descs={{ required: 'Last name is required' }}
              />
            </label>
            <label>
              <p className="font-medium">Date of birth</p>
              <input
                type="date"
                placeholder="Choose your date of birth"
                {...register('dateOfBirth', { required: true })}
                aria-invalid={errors.dateOfBirth ? 'true' : 'false'}
              />
              <FormFieldError
                errField={errors.dateOfBirth?.type}
                descs={{ required: 'Date of birth is required' }}
              />
            </label>
            <label className="black-select">
              <p className="font-medium">Gender</p>

              <select
                {...register('gender', { required: true })}
                aria-invalid={errors.gender ? 'true' : 'false'}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <FormFieldError
                errField={errors.gender?.type}
                descs={{ required: 'Gender is required' }}
              />
            </label>

            <label>
              <p className="font-medium">Address</p>
              <input
                className="capitalize"
                placeholder="House no., baranggay, city, province"
                {...register('address', { required: true })}
                aria-invalid={errors.address ? 'true' : 'false'}
              />
              <FormFieldError
                errField={errors.address?.type}
                descs={{ required: 'Address is required' }}
              />
            </label>
            <label>
              <p className="font-medium">Contact Number</p>
              <input
                placeholder="Your contact number"
                {...register('contactNumber', {
                  required: true,
                  pattern: /^09\d{9}$/,
                  minLength: 11,
                  maxLength: 11,
                })}
                aria-invalid={errors.contactNumber ? 'true' : 'false'}
              />
              <FormFieldError
                errField={errors.contactNumber?.type}
                descs={{
                  maxLength: 'Contact number can be up to 11 digits',
                  minLength: 'Contact number must be at least 11 digits',
                  pattern:
                    "Please enter a valid contact number starting with '09'",
                  required: 'Contact is required',
                }}
              />
            </label>
          </div>
          <div className="h-full flex justify-center items-center flex-col space-y-10 black-select">
            <label className="w-full">
              <p className="font-medium">Dentist</p>
              <div className="flex space-x-4">
                <select
                  name="dentist"
                  {...(register('dentist'),
                  { required: true, onChange: handleInputChanges })}
                  aria-invalid={errors.dentist ? 'true' : 'false'}
                >
                  {availableDentists &&
                    availableDentists.length > 0 &&
                    availableDentists.map(
                      (dentist) =>
                        dentist && (
                          <option key={dentist.id} value={dentist.id}>
                            {dentist.name}
                          </option>
                        )
                    )}
                </select>
                <span
                  role="button"
                  onClick={() => setIsAddingDentist(true)}
                  className="rounded-lg px-4 py-2 shadow-md text-black flex justify-center items-center buttonSpan"
                >
                  <img
                    src={plus}
                    alt="add clinic"
                    className="h-6 w-6 buttonSpan"
                  ></img>
                </span>
              </div>
              <FormFieldError
                errField={errors.dentist?.type}
                descs={{ required: 'Dentist is required' }}
              />

              {isAddingDentist && (
                <DentistForm setIsAddingDentist={setIsAddingDentist} />
              )}
            </label>

            <div className="file-input">
              <label htmlFor="imageUploads">
                <p className="font-medium text-center">File Upload</p>
              </label>
              <label htmlFor="imageUploads" className="imageUploads">
                <input
                  type="file"
                  {...register('imageUploads')}
                  multiple
                ></input>
                <p className="font-medium text-center text-[#888080]">
                  Upload patient radiograph
                </p>
              </label>
            </div>
            {uploadedFiles && uploadedFiles.length > 0 && (
              <ul className="space-y-4">
                {Array.from(uploadedFiles).map((file, index) => (
                  <li
                    className="flex justify-between shadow-md px-4 py-2 rounded-lg max-w-[200px]"
                    key={index}
                  >
                    <p className="text-sm inline-block text-ellipsis truncate overflow-hidden max-w-[90%]">
                      {file.name}
                    </p>
                    <button
                      className="inline-block font-bold transition-all duration-500 ease-out"
                      onClick={(e) => handleRemoveFile(index)}
                    >
                      x
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex justify-center items-center flex-col space-y-4">
              <p className="text-[0.8rem]">
                By clicking Submit, you agree to the
                <a className="font-bold"> Terms of Service</a> and
                <a className="font-bold"> Privacy Policy</a>
              </p>
              <button
                disabled={isLoading}
                className="text-xl bg-primary py-3 px-6 w-fit font-bold block text-white rounded-lg transition-all duration-500 ease-out"
                type="submit"
              >
                Done
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default PatientForm;
