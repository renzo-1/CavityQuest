import React, { SetStateAction, Dispatch, useState } from 'react';
import { sendEmailVerification, User } from 'firebase/auth';

const SendVerification = ({ user }: { user: User }) => {
  const [isSent, setIsSent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendEmail = async () => {
    setIsLoading(true);
    try {
      await sendEmailVerification(user);
      setIsSent(true);
    } catch (e) {
      console.log(e);
      setIsSent(true);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <p className='mb-3'>
        Please, verify your email. Click the button to send a verification
        email.
      </p>
      {isSent ? (
        <div className="bg-green-500 rounded-md px-4 py-2 text-white font-bold w-fit">
          Email sent!
        </div>
      ) : (
        <button
          className="bg-primary rounded-md px-4 py-2 text-white font-bold"
          onClick={handleSendEmail}
          disabled={isLoading}
        >
          Send verification
        </button>
      )}
    </div>
  );
};
export default SendVerification;
