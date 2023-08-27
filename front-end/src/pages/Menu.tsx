import React, {
  MouseEvent,
  useState,
  ChangeEvent,
  useEffect,
  memo,
} from 'react';
import { detection, records, closeBtn } from '../../assets';
import { PatientForm } from 'components';
import { useNavigate } from 'react-router-dom';
import { ClinicForm } from 'components';
import { useAppContext } from 'features/AppContext';
import { PatientDataContextType } from 'utils/Interfaces';

const Menu = () => {
  const [showPatientForm, setShowPatientForm] = useState<boolean>(false);
  const { currClinic, setCurrClinic, clinics, dentists } =
    useAppContext() as PatientDataContextType;
  const navigate = useNavigate();

  const handleClick = (e: MouseEvent): void => {
    setShowPatientForm((prev) => !prev);
  };

  return (
    <>
      {/* {showClinicForm && <ClinicForm setShowClinicForm={setShowClinicForm} />} */}

      {showPatientForm && <PatientForm setShow={setShowPatientForm} />}

      <div className="w-full h-1/2 absolute top-0 left-0 bg-[url('../../assets/bg2.jpg')] bg-[0rem_-55rem] brightness-50 shadow-lg bg-cover bg-no-repeat z-20"></div>
      <ClinicForm />
      {/* <div className="absolute top-0 left-0 w-full z-20 flex justify-end p-10 space-x-8 text-lg font-bold">
        <select
          onChange={handleClinicChange}
          className="rounded-lg px-4 py-2 bg-black bg-opacity-50 shadow-md text-white bg-[right_1rem_center]"
        >
          {clinics.map((clinic) => {
            if (currClinic == clinic.id) {
              return (
                <option
                  selected
                  className="text-white  text-lg"
                  value={clinic.id}
                >
                  {clinic.name}
                </option>
              );
            } else {
              return (
                <option className="text-white  text-lg" value={clinic.id}>
                  {clinic.name}
                </option>
              );
            }
          })}
        </select>
      </div> */}
      {showPatientForm && (
        <div className="bg-black absolute top-0 left-0 w-full opacity-50 h-screen z-20"></div>
      )}
      <div className="h-full w-full flex justify-center items-center space-x-20 z-40">
        <button
          className="px-14 h-full max-h-[250px] bg-primary rounded-lg space-y-8 shadow-lg z-20"
          onClick={handleClick}
        >
          <img className="w-24" src={detection} alt="detection" />
          <h2 className="text-white font-bold tracking-wider">Detect</h2>
        </button>
        <button className="px-14 h-full max-h-[250px] bg-blue-500 rounded-lg space-y-8 shadow-lg z-20">
          <img
            className="w-24"
            src={records}
            alt="records"
            onClick={() => navigate(`/${currClinic}/records`)}
          />
          <h2 className="text-white font-bold tracking-wider">Records</h2>
        </button>
      </div>
    </>
  );
};

export default Menu;
