import React from 'react';
import { tooth3d } from '../../../assets';
const AuthHero = () => {
  return (
    <>
      <img
        src={tooth3d}
        alt="3d tooth"
        className="drop-shadow-2xl z-40 w-[700px]"
      />
      <div className="font-extrabold absolute top-0 left-0 w-full h-full z-20 flex justify-center items-center flex-col">
        <h1 className="text-[7rem] text-primary italic leading-none ">
          CAVITY QUEST
        </h1>
        <h1 className="text-[7rem] text-primary italic leading-none ">
          CAVITY QUEST
        </h1>
        <h1 className="text-[7rem] text-primary italic leading-none ">
          CAVITY QUEST
        </h1>
        <h1 className="text-[7rem] text-primary italic leading-none ">
          CAVITY QUEST
        </h1>
        <h1 className="text-[7rem] text-primary italic leading-none ">
          CAVITY QUEST
        </h1>
        <h1 className="text-[7rem] text-primary italic leading-none ">
          CAVITY QUEST
        </h1>
        <h1 className="text-[7rem] text-primary italic leading-none ">
          CAVITY QUEST
        </h1>
      </div>
    </>
  );
};

export default AuthHero;
