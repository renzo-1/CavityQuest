import SignOut from './authentication/SignOut';
import { threeDots } from '../../assets';
import React, { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';

const MoreMenu = ({
  setIsShowDentistForm,
}: {
  setIsShowDentistForm: Dispatch<SetStateAction<boolean>>;
}) => {
  const [isShowMenu, setIsShowMenu] = useState<boolean>(false);

  return (
    <div className="relative flex justify-center items-center">
      <button
        className="z-[9999]"
        onClick={() => setIsShowMenu((prev) => !prev)}
      >
        <img src={threeDots} alt="clinics menu" className="w-8 h-8"></img>
      </button>
      {isShowMenu && (
        <div className="flex flex-col justify-evenly absolute mt-28 space-y-4 bg-black px-2 py-4 rounded-lg">
          <>
            <button
              className="text-white"
              onClick={() => {
                setIsShowDentistForm(true);
                setIsShowMenu(false);
              }}
            >
              Dentists
            </button>
            <SignOut />
          </>
        </div>
      )}
    </div>
  );
};

export default MoreMenu;
