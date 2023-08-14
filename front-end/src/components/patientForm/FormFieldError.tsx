import React from 'react';

interface Descs {
  maxLength?: string;
  minLength?: string;
  pattern?: string;
  required: string;
}

interface Props {
  errField: string | undefined;
  descs: Descs;
}

const FormFieldError = ({ errField, descs }: Props) => {
  return (
    <>
      {errField && (
        <p className="text-red-400" role="alert">
          {descs[errField as keyof typeof descs]}
        </p>
      )}
    </>
  );
};

export default FormFieldError;
