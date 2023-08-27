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
import axios from 'axios';
import {
  PatientDataContextType,
  PatientData,
  ImageUpload,
  PatientDataKind,
} from 'utils/Interfaces';
import { useAppContext } from 'features/AppContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const PatientForm = ({
  setShow,
}: {
  setShow: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    setIsNewData,
    setPatientData,
    dentists: availableDentists,
    currClinic,
    setDentists,
    dispatchPatientData,
  } = useAppContext() as PatientDataContextType;
  const [isAddingDentist, setIsAddingDentist] = useState<boolean>(false);
  const [newDentist, setNewDentist] = useState<string>('');
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm<PatientData>();

  const uploadedFiles: FileList | ImageUpload[] = watch('imageUploads'); // Access the uploaded files using the watch function

  const onSubmit = (data: PatientData) => {
    // Date format (YYYY-MM-DD)
    const birthDate = new Date(data.dateOfBirth).toISOString().slice(0, 10);
    const formData = {
      clinic: currClinic,
      first_name: data.firstName,
      middle_name: data.middleName,
      last_name: data.lastName,
      date_of_birth: birthDate,
      gender: data.gender,
      address: data.address,
      dentist: data.dentist,
      contact_number: data.contact,
      image_uploads: data.imageUploads,
    };

    console.log(formData);

    axios
      .post('http://127.0.0.1:8000/api/patients/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res: any) => {
        // setIsNewData((prev) => !prev);
        // setPatientData((prev) => [...prev, res.data]);
        dispatchPatientData({
          type: PatientDataKind.CREATE,
          payload: { patientData: [res.data] },
        });
        navigate(`/${currClinic}/detection/${res.data.id}`);
        toast.success('Record successfully saved', {
          autoClose: 5000,
        });
        reset();
      })
      .catch((err) => {
        toast.error('There was an error saving the record. Please try again', {
          autoClose: 5000,
        });
      });
  };

  const handleInputChanges = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setValue('dentist', parseInt(value));
  };

  const handleRemoveFile = (index: number) => {
    const newFilesList = Array.from(uploadedFiles).splice(1, index);
    setValue('imageUploads', newFilesList);
  };

  const handleDentistSubmit = () => {
    axios
      .post('http://127.0.0.1:8000/api/dentists/', {
        clinic: currClinic,
        name: newDentist,
      })
      .then((res) => {
        setDentists((prev) => [...prev, res.data]);
        setIsAddingDentist(false);
        toast.success('New dentist has been saved', {
          autoClose: 5000,
        });
      })
      .catch((e) =>
        toast.error('There was an error saving the record. Please try again', {
          autoClose: 5000,
        })
      );
  };

  useEffect(() => {
    console.log(availableDentists);
    setValue('dentist', availableDentists[0].id!);
  }, []);

  return (
    <>
      <div className="w-full h-screen absolute top-0 left-0 border border-red-500">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
      <div className="py-8 px-10 absolute w-[50rem] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-myGray rounded-lg z-30">
        <div className="flex justify-between">
          <h1 className='font-bold before:content[""] before:absolute before:w-8 before:border-b-4 before:border-black before:h-7'>
            Patient Form
          </h1>
          <button>
            <img
              src={closeBtn}
              alt="close button"
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
                placeholder="Your middle name"
                {...register('middleName')}
              />
            </label>

            <label>
              <p className="font-medium">Last Name</p>
              <input
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
                {...register('contact', {
                  required: true,
                  pattern: /^09\d{9}$/,
                  minLength: 11,
                  maxLength: 11,
                })}
                onChange={(e) => console.log(e.target.value)}
                aria-invalid={errors.contact ? 'true' : 'false'}
              />
              <FormFieldError
                errField={errors.contact?.type}
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
                  {availableDentists.map((dentist) => (
                    <option key={dentist.id} value={dentist.id}>
                      {dentist.name}
                    </option>
                  ))}
                </select>
                <span
                  role="button"
                  onClick={() => setIsAddingDentist(true)}
                  className="rounded-lg px-4 py-2 shadow-md text-black "
                >
                  <img src={plus} alt="add clinic" className="h-6 w-6 "></img>
                </span>
              </div>

              <FormFieldError
                errField={errors.dentist?.type}
                descs={{ required: 'Dentist is required' }}
              />
              {isAddingDentist && (
                <div className="mt-4 flex justify-center items-center space-x-4">
                  <input
                    placeholder="Name of dentist"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      console.log(e.target.value);
                      setNewDentist(e.target.value);
                    }}
                  ></input>
                  <span
                    role="submit"
                    onClick={handleDentistSubmit}
                    className="rounded-lg px-4 py-2 shadow-md bg-primary cursor-pointer"
                  >
                    <img
                      src={check}
                      alt="add dentist"
                      className="h-6 w-6 "
                    ></img>
                  </span>
                </div>
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
                      className="inline-block font-bold"
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
                className="text-xl bg-primary py-3 px-6 w-fit font-bold block text-white rounded-lg"
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
