import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { list, clockHistory, home } from '../../assets';
interface ButtonStatus {
  home?: boolean;
  records?: boolean;
  auditTrails?: boolean;
}
const HeaderButtons = ({ home, records, auditTrails }: ButtonStatus) => {
  const navigate = useNavigate();
  const { clinic, id } = useParams();
  if (home || records || auditTrails) {
    return (
      <div className="flex items-center gap-x-8">
        <button
          className="text-xl font-bold hover:text-primary"
          onClick={() => navigate(`/${clinic}`)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`bi bi-house-door-fill hover:fill-primary w-7 ${
              home && 'fill-primary'
            }`}
            viewBox="0 0 16 16"
          >
            <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5Z" />
          </svg>
        </button>
        <button
          className="text-xl font-bold hover:text-primary"
          onClick={() => {
            navigate(`/${clinic}/records`);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            // fill="currentColor"
            className={`bi bi-person-lines-fill hover:fill-primary w-7 ${
              records && 'fill-primary'
            }`}
            viewBox="0 0 16 16"
          >
            <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2z" />
          </svg>
        </button>
        <button
          className="text-xl font-bold hover:text-primary"
          onClick={() => {
            navigate(`/${clinic}/auditTrails`);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`bi bi-clock-history hover:fill-primary w-7 ${
              auditTrails && 'fill-primary'
            }`}
            viewBox="0 0 16 16"
          >
            <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z" />
            <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z" />
            <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z" />
          </svg>
        </button>
      </div>
    );
  } else return null;
};

export default HeaderButtons;
