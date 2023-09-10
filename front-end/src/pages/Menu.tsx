import React, { MouseEvent, useState, useEffect } from 'react';
import { detection, records, closeBtn, list } from '../../assets';
import { PatientForm } from 'components';
import { useNavigate } from 'react-router-dom';
import { ClinicsMenu } from 'components';
import { useAppContext } from 'features/AppContext';
import { ContextType } from 'utils/Interfaces';

const Menu = () => {
  const [showPatientForm, setShowPatientForm] = useState<boolean>(false);
  const { currClinic, setShowClinicsMenu, showClinicsMenu } =
    useAppContext() as ContextType;
  const navigate = useNavigate();

  const handleClick = (e: MouseEvent): void => {
    setShowPatientForm((prev) => !prev);
  };

  return (
    <>
      <div className="w-full h-1/2 absolute top-0 left-0 bg-[url('../../assets/bg2.jpg')] bg-fixed bg-center	 brightness-50 shadow-lg bg-cover bg-no-repeat z-20"></div>

      {showPatientForm && <PatientForm setShow={setShowPatientForm} />}
      {showClinicsMenu && <ClinicsMenu setShowClinics={setShowClinicsMenu} />}
      {/* BUTTON FOR CLINICS LIST */}
      {!showClinicsMenu && (
        <div className="absolute top-0 left-0 w-full z-20 flex justify-between p-10 space-x-4 text-lg font-bold white-select">
          <div className="flex z-[9999] justify-center items-center space-x-2 ">
            <div
              className={`rounded-full z-[9999] h-3 w-3 ${
                navigator.onLine ? 'bg-green-600' : 'bg-slate-600'
              }`}
            ></div>
            <p className="text-sm text-white">
              {navigator.onLine ? 'Online' : 'Offline'}
            </p>
          </div>
          <div className="space-x-4 flex justify-center items-center">
            <p className="text-white font-bold">{currClinic?.name}</p>
            <button
              className="z-[9999]"
              onClick={() => setShowClinicsMenu(true)}
            >
              <img src={list} alt="clinics menu" className="w-10 h-10"></img>
            </button>
          </div>
        </div>
      )}
      {/* BACKDROP */}
      {(showPatientForm || showClinicsMenu) && (
        <div className="bg-black fixed min-h-screen w-full opacity-50 h-screen z-20"></div>
      )}
      {/* MENU BUTTONS */}
      <div className="h-full w-full flex justify-center items-center space-x-20 z-40">
        <button
          className="px-14 h-full max-h-[250px] bg-primary rounded-lg space-y-5 shadow-lg z-20 transition-all duration-500 ease-out"
          onClick={handleClick}
        >
          <img className="w-24" src={detection} alt="detection" />
          <h2 className="text-white font-bold tracking-wider">Detect</h2>
        </button>
        <button className="px-14 h-full max-h-[250px] bg-blue-500 rounded-lg space-y-5 shadow-lg z-20 transition-all duration-500 ease-out">
          <img
            className="w-24"
            src={records}
            alt="records"
            onClick={() => navigate(`/${currClinic?.id}/records`)}
          />
          <h2 className="text-white font-bold tracking-wider">Records</h2>
        </button>
      </div>
      <div className="h-1/2 absolute bottom-0 left-0 w-screen overflow-hidden flex justify-center items-center flex-nowrap">
        <h1 className="md:text-[8rem] xl:text-[10rem]  2xl:text-[16rem]  text-myGray font-extrabold drop-shadow-banner whitespace-nowrap	">
          Cavity Quest
        </h1>
      </div>
    </>
  );
};

export default Menu;
