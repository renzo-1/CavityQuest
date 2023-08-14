import React, { useEffect, useState } from 'react';

const Landing = () => {
  const [showBrand, setShowBrand] = useState(true);

  useEffect(() => {
    let timer = setTimeout(() => setShowBrand((prev) => !prev), 2 * 1000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {showBrand && (
        <main className="absolute z-50 grid items-center h-full w-full bg-gradient-to-r from-cyan-500 to-blue-500 fade-animate">
          <div className="text-center">
            <h1 className="text-7xl font-bold mb-4 text-white">Cavity Quest</h1>
            <p className="text-xl  text-white">
              Your AI-powered dental detective
            </p>
          </div>
        </main>
      )}
    </>
  );
};

export default Landing;
