import React, { useState, useEffect, useRef } from 'react';
import { WebcamOps } from '../utils/webcam';
import '../styles/App.css';
import { BackButton, Carousel, Detection as Detect } from 'components';
import { useAppContext } from 'features/AppContext';
import { PatientDataContextType, ImageUpload } from 'utils/Interfaces';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { json } from 'stream/consumers';

const Detection = () => {
  const { id } = useParams();
  const { currPatient, setIsNewData } =
    useAppContext() as PatientDataContextType;
  const videoRef = useRef<HTMLVideoElement>(null);
  const webcamOps = new WebcamOps();
  const [captures, setCaptures] = useState<string[]>([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const handleSubmit = () => {
    // const dateNow = Date.now();

    // let newFiles: File[] = [];

    // captures.map((image, index) => {
    //   fetch(image)
    //     .then((res) => res.blob())
    //     .then((blob) => {
    //       const newFile = new File([blob], `detection${index}`, {
    //         type: 'image/jpeg',
    //       });
    //       newFiles.push(newFile);
    //     });
    // });
    const formData = { new_image_uploads: captures };

    console.log(formData);

    // formData.append('image_uploads', [...currPatient!.imageUploads, 'asd']);

    axios
      .patch(`http://localhost:8000/api/patients/${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => {
        console.log(res);
        setIsNewData((prev) => !prev);
        // navigate();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="p-10 h-screen relative w-full">
      <div
        className="flex z-30"
        onClick={() => {
          webcamOps.close(videoRef);
          setCaptures([]);
        }}
      >
        <BackButton />
      </div>
      <Detect
        videoRef={videoRef}
        captures={captures}
        handleSubmit={handleSubmit}
        setCaptures={setCaptures}
        setIsGalleryOpen={setIsGalleryOpen}
      />

      {isGalleryOpen && (
        <Carousel
          images={captures}
          setImages={setCaptures}
          setIsGalleryOpen={setIsGalleryOpen}
        />
      )}
    </div>
  );
};

export default Detection;
