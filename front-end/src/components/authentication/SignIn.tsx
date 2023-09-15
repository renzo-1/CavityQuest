import React, { SetStateAction, Dispatch } from 'react';
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import FormFieldError from 'components/patientForm/FormFieldError';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from 'features/AuthContext';
import { AuthContextType } from 'utils/Interfaces';
import { toast } from 'react-toastify';
interface FormType {
  email: string;
  password: string;
}

const SignIn = () => {
  const { auth, setAuth } = useAuthContext() as AuthContextType;
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
  } = useForm<FormType>();

  const navigate = useNavigate();
  const onSubmit = async (data: FormType) => {
    const auth = getAuth();
    console.log('data.email', data.email);
    console.log('data.password', data.password);
    const toastId = toast.loading('Signing you in...');
    try {
      await setPersistence(auth, browserLocalPersistence);
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      setAuth({
        uid: userCredentials.user.uid,
        email: userCredentials.user.email || '',
      });
      navigate('/');
      toast.update(toastId, {
        render: '👋 Hello there',
        type: 'success',
        autoClose: 2000,
        isLoading: false,
      });
    } catch (error: any) {
      console.log(error);
      toast.update(toastId, {
        render: error.message,
        type: 'error',
        autoClose: 2000,
        isLoading: false,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="authShadow space-y-5 flex flex-col px-10 py-7 bg-myGray w-[300px] md:w-[400px] rounded-lg border border-black"
    >
      <div>
        <h2 className="text-black font-bold border-b-2 border-black pb-2 mb-2">
          Sign in with your account
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

      <button
        type="submit"
        className="bg-primary text-xl font-bold rounded-lg px-5 py-2 text-white mt-2 transition-all duration-500 ease-out"
      >
        Sign In
      </button>
    </form>
  );
};

export default SignIn;
