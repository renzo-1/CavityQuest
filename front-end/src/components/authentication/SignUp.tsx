import React, { useState } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from 'firebase/auth';
import FormFieldError from 'components/patient/FormFieldError';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from 'features/AuthContext';

interface FormType {
  email: string;
  password: string;
  passwordConfirmation: string;
}

const SignUp = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
  } = useForm<FormType>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setAuth } = useAuthContext() as AuthContextType;
  const navigate = useNavigate();

  const onSubmit = async (data: FormType) => {
    console.log('data.email', data.email);
    console.log('data.password', data.password);
    setIsLoading(true);
    const toastId = toast.loading('Checking credentials...');
    const auth = getAuth();
    setIsLoading;
    try {
      // await setPersistence(auth, browserLocalPersistence);
      // SIGN UP
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      await sendEmailVerification(auth.currentUser!);
      toast.update(toastId, {
        render: 'Please check your email for verification',
        type: 'info',
        autoClose: 2000,
        isLoading: false,
      });
      await signOut(auth);
      setAuth(undefined);

      setIsLoading(false);
      navigate('/auth');
    } catch (error: any) {
      const errorCode = error.code.split('/')[1].split('-').join(' ');
      setIsLoading(false);
      toast.update(toastId, {
        render: errorCode,
        type: 'error',
        autoClose: 2000,
        isLoading: false,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 flex flex-col px-10 py-7 authShadow bg-myGray w-[300px] md:w-[400px]  rounded-lg border border-black"
    >
      <div>
        <h2 className="text-black font-bold border-b-2 border-black pb-2 mb-2">
          Create your account
        </h2>
      </div>
      <label>
        <p className="font-medium">Email</p>
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
      </label>
      <label>
        <p className="font-medium">Password</p>
        <input
          type="password"
          placeholder="Your password"
          {...register('password', { required: true, minLength: 8 })}
          aria-invalid={errors.password ? 'true' : 'false'}
        />
        <FormFieldError
          errField={errors.password?.type}
          descs={{
            required: 'Password is required',
            minLength: 'Password must have at least 8 characters',
          }}
        />
      </label>

      <label>
        <p className="font-medium">Confirm password</p>
        <input
          type="password"
          placeholder="Confirm password"
          {...register('passwordConfirmation', {
            required: true,
            minLength: 8,
            validate: (value) => {
              const { password } = getValues();
              return password === value || 'Passwords should match!';
            },
          })}
          aria-invalid={errors.passwordConfirmation ? 'true' : 'false'}
        />
        <FormFieldError
          errField={errors.passwordConfirmation?.type}
          descs={{
            required: 'Password confirmation is required',
            minLength: 'Password must have at least 8 characters',
            validate: 'Passwords should match',
          }}
        />
      </label>
      <button
        disabled={isLoading}
        type="submit"
        className="bg-primary text-xl font-bold rounded-lg px-5 py-2 text-white mt-2 transition-all duration-500 ease-out"
      >
        Sign Up
      </button>
    </form>
  );
};

export default SignUp;
