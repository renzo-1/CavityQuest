import React, { useState, Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthContext } from 'features/AuthContext';
import FormFieldError from 'components/patient/FormFieldError';
import { closeBtn } from '../../../assets';
import { toast } from 'react-toastify';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
interface FormType {
  email: string;
}

const ForgotPassword = ({
  setIsForgotPassword,
}: {
  setIsForgotPassword: Dispatch<SetStateAction<boolean>>;
}) => {
  const { setAuth } = useAuthContext() as AuthContextType;
  const [isEmailSent, setIsEmailSent] = useState<boolean>(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormType>();

  const onSubmit = async (data: FormType) => {
    const auth = getAuth();
    const toastId = toast.loading('Signing you in...');

    try {
      await sendPasswordResetEmail(auth, data.email);

      toast.update(toastId, {
        render: 'Password reset email sent!',
        type: 'success',
        autoClose: 2000,
        isLoading: false,
      });
    } catch (error: any) {
      const errorCode = error.code.split('/')[1].split('-').join(' ');
      toast.update(toastId, {
        render: errorCode,
        type: 'error',
        autoClose: 2000,
        isLoading: false,
      });
    }
  };

  return (
    <div className="absolute top-0 left-0 flex justify-center items-center w-full h-screen z-[9999]">
      <form
        className="bg-white z-20 py-5 px-10 rounded-lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex justify-between mb-2">
          <p className="font-medium">Email</p>
          <span
            className=" rounded-lg font-bold cursor-pointer"
            onClick={() => setIsForgotPassword(false)}
          >
            <img src={closeBtn} alt="close"></img>
          </span>
        </div>
        <input
          type="email"
          placeholder="Your email"
          {...register('email', {
            required: true,
          })}
          aria-invalid={errors.email ? 'true' : 'false'}
        />
        <FormFieldError
          errField={errors.email?.type}
          descs={{ required: 'Email is required' }}
        />

        {isEmailSent && <p>Please, check your email to reset your password.</p>}
        <button
          className="bg-primary rounded-lg font-bold text-myGray px-4 py-2 mt-5"
          onClick={() => setIsEmailSent(true)}
        >
          Send email
        </button>
      </form>
      <div className="w-full h-full bg-black opacity-50 absolute"></div>
    </div>
  );
};

export default ForgotPassword;
