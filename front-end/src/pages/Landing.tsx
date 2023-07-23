import React, { useEffect, useState } from 'react';

const Landing = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    let timer = setTimeout(() => setShow((prev) => !prev), 2 * 1000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {show && (
        <main className="grid items-center h-full w-full bg-gradient-to-r from-cyan-500 to-blue-500">
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
