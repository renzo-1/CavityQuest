import React from 'react';
import { useNavigate } from 'react-router-dom';
import { backBtn } from '../assets';

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <button className="w-8 " onClick={handleBack} >
      <img src={backBtn} alt="back button"></img>
    </button>
  );
};

export default BackButton;
