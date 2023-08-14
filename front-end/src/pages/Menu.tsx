import React, { MouseEvent, useState } from 'react';
import { detection, records, closeBtn } from '../../assets';
import { PatientForm } from 'components';
import { useNavigate } from 'react-router-dom';
const Menu = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const handleClick = (e: MouseEvent): void => {
    setShow((prev) => !prev);
  };

  return (
    <>
      {show && (
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

          <PatientForm />
        </div>
      )}

      {show && (
        <div className="bg-black absolute w-full opacity-50 min-h-screen h-full z-1"></div>
      )}

      <div className="h-full w-full border flex justify-center items-center space-x-20 relative">
        <div className="w-full h-1/2 absolute top-0 left-0 bg-[url('../../assets/bg2.jpg')] bg-[0rem_-55rem] brightness-50 shadow-lg bg-cover bg-no-repeat "></div>
        <button
          className="h-full px-14 max-h-60 bg-primary rounded-lg space-y-8 shadow-lg z-20"
          onClick={handleClick}
        >
          <img className="w-24" src={detection} alt="detection" />
          <h2 className="text-white font-bold tracking-wider">Detect</h2>
        </button>
        <button className="h-full px-14 max-h-60 bg-blue-500 rounded-lg space-y-8 shadow-lg z-20">
          <img
            className="w-24"
            src={records}
            alt="records"
            onClick={() => navigate('/records')}
          />
          <h2 className="text-white font-bold tracking-wider">Records</h2>
        </button>
      </div>
    </>
  );
};

export default Menu;
