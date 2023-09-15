import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { backBtn } from '../../assets';

const BackButton = () => {
  const navigate = useNavigate();
  const { clinic, id } = useParams();

  return (
    <div className="flex items-center space-x-5">
      <button className="w-7" onClick={() => navigate(-1)}>
        <img src={backBtn} alt="back button"></img>
      </button>
      <button
        className="text-xl font-bold"
        onClick={() => navigate(`/${clinic}`)}
      >
        Home
      </button>
      <button
        className="text-xl font-bold"
        onClick={() => navigate(`/${clinic}/records`)}
      >
        Records
      </button>
    </div>
  );
};

export default BackButton;
