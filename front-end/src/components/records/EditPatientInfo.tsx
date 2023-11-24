import React, { useState, MouseEvent } from 'react';
import { closeBtn, check } from '../../../assets';
import { PatientInfoField } from 'components';
import { useAppContext } from 'features/AppContext';
import { useForm } from 'react-hook-form';
import { FormFieldError } from 'components';
import { toast } from 'react-toastify';
import {
  updateDoc,
  getDoc,
  doc,
  arrayUnion,
  Timestamp,
} from 'firebase/firestore';
import { checkContactNumber } from 'utils/checkContactNumber';
interface EditData {
  contactNumber: string;
  address: string;
}
const EditPatientInfo = () => {
  const {
    currPatient,
    patientCollection,
    setPatients,
    setCurrPatient,
    clinicCollection,
    currClinic,
    setCurrClinic,
  } = useAppContext() as ContextType;

  const [isEditing, setIsEditing] = useState<{
    contactNumber: boolean;
    address: boolean;
  }>();

  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
  } = useForm<EditData>({
    defaultValues: {
      contactNumber: currPatient?.contactNumber,
      address: currPatient?.address,
    },
  });

  const doubleClickHandler = ({
    event,
    contactNumber = false,
    address = false,
  }: {
    event: MouseEvent<HTMLDivElement>;
    contactNumber?: boolean;
    address?: boolean;
  }) => {
    if (event.detail == 2) {
      setIsEditing({ contactNumber, address });
    }
  };

  const onSubmit = async (data: EditData) => {
    if (!isDirty) {
      setIsEditing({ contactNumber: false, address: false });
      return;
    }
    const toastId = toast.loading('Saving changes...');
    const isNumAvailable = await checkContactNumber(data.contactNumber!);

    if (currPatient?.contactNumber != data.contactNumber && !isNumAvailable) {
      toast.update(toastId, {
        render: 'Phone number is taken',
        type: 'error',
        autoClose: 2000,
        isLoading: false,
      });
      return;
    }

    try {
      const patientRef = doc(patientCollection, currPatient?.id!);
      const clinicRef = doc(clinicCollection, currClinic?.id);

      const newAT: AuditTrail = {
        contactNumber: currPatient?.contactNumber!,
        patientName: currPatient?.fullName!,
        id: currPatient?.id!,
        date: Timestamp.now(),
        type: 'update',
        before: {
          contactNumber: currPatient?.contactNumber!,
          address: currPatient?.address!,
        },
        after: data,
      };

      if (navigator.onLine) {
        await updateDoc(patientRef, { ...data });
        await updateDoc(clinicRef, {
          auditTrails: arrayUnion(newAT),
        });
      } else {
        updateDoc(patientRef, { ...data });
        updateDoc(clinicRef, {
          auditTrails: arrayUnion(newAT),
        });
      }

      // setCurrClinic((prevData) => {
      //   const newArr = prevData as Clinic;
      //   const newATArr = [...newArr?.auditTrails!, newAT];
      //   console.log('new', { ...newArr, newATArr });
      //   return { ...newArr, newATArr };
      // });

      setPatients((prevData) => {
        const newArr = prevData.filter(
          (patient) => patient?.id !== currPatient?.id
        );
        return [
          ...newArr,
          {
            ...currPatient!,
            ...data,
          },
        ];
      });

      setCurrPatient((patient) => ({
        ...patient!,
        ...data,
      }));

      toast.update(toastId, {
        render: 'Update successfully',
        type: 'success',
        autoClose: 1000,
        isLoading: false,
      });
      setIsEditing({ contactNumber: false, address: false });
    } catch (e) {
      console.log(e);
      toast.update(toastId, {
        render: 'An error occured saving your changes. Try reloading.',
        type: 'error',
        autoClose: 2000,
        isLoading: false,
      });
    }
  };
  return (
    <>
      {!isEditing?.contactNumber && (
        <div
          onClick={(event) =>
            doubleClickHandler({ event, contactNumber: true })
          }
        >
          <PatientInfoField
            field={'Contact Number'}
            data={currPatient?.contactNumber}
          />
        </div>
      )}
      {isEditing?.contactNumber && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            <h3 className="text-sm">Contact number</h3>
            <input
              id="contactNumber"
              type="number"
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
          <div className="flex mt-3 gap-x-4">
            <span
              role="button"
              onClick={() =>
                setIsEditing({
                  address: false,
                  contactNumber: false,
                })
              }
              className="rounded-lg w-[60px] h-[35px] shadow-md cursor-pointer buttonSpan flex justify-center items-center my-auto text-center"
            >
              <img
                src={closeBtn}
                alt="close add clinic"
                className="h-4 w-4 buttonSpan "
              ></img>
            </span>
            <button
              type="submit"
              className="rounded-lg w-[60px] h-[35px] shadow-md bg-primary cursor-pointer buttonSpan flex justify-center items-center my-auto text-center"
            >
              <img
                src={check}
                alt="add clinic"
                className="h-7 w-7 buttonSpan "
              ></img>
            </button>
          </div>
        </form>
      )}

      {!isEditing?.address && (
        <div onClick={(event) => doubleClickHandler({ event, address: true })}>
          <PatientInfoField field={'Address'} data={currPatient?.address} />
        </div>
      )}
      {isEditing?.address && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            <h3 className="text-sm">Address</h3>
            <input
              className="capitalize font-bold text-xl w-fit"
              placeholder="Address"
              {...register('address')}
              aria-invalid={errors.address ? 'true' : 'false'}
            />
            <FormFieldError errField={errors.address?.type} />
          </label>
          <div className="flex mt-3 gap-x-4">
            <span
              role="button"
              onClick={() =>
                setIsEditing({
                  address: false,
                  contactNumber: false,
                })
              }
              className="rounded-lg w-[60px] h-[35px] shadow-md cursor-pointer buttonSpan flex justify-center items-center my-auto text-center"
            >
              <img
                src={closeBtn}
                alt="close add clinic"
                className="h-4 w-4 buttonSpan "
              ></img>
            </span>
            <button
              type="submit"
              className="rounded-lg w-[60px] h-[35px] shadow-md bg-primary cursor-pointer buttonSpan flex justify-center items-center my-auto text-center"
            >
              <img
                src={check}
                alt="add clinic"
                className="h-7 w-7 buttonSpan "
              ></img>
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default EditPatientInfo;
