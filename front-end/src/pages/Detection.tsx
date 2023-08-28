import React, { useState, useEffect, useRef } from 'react';
import { WebcamOps } from '../utils/webcam';
import '../styles/App.css';
import { BackButton, Carousel, Detection as Detect } from 'components';
import { useAppContext } from 'features/AppContext';
import {
  PatientDataContextType,
  ImageUpload,
  PatientDataKind,
} from 'utils/Interfaces';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Detection = () => {
  const { id } = useParams();
  const { currPatient, setIsNewData, currClinic, dispatchPatientData } =
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

    axios
      .patch(`http://localhost:8000/api/patients/${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => {
        const imageUploads: ImageUpload[] = [];
        const newData = JSON.parse(res.data);

        axios
          .get(`http://localhost:8000/api/image_uploads/`)
          .then((res) => {
            const { data } = res;

            data.map(
              (img: any) =>
                img?.patient == currPatient?.id && imageUploads.push(img)
            );

            dispatchPatientData({
              type: PatientDataKind.UPDATE,
              payload: {
                patientData: [
                  {
                    ...newData[0].fields,
                    id: currPatient?.id,
                    image_uploads: imageUploads,
                  },
                ],
                currPatient: currPatient?.id,
              },
            });

            toast.success('Successfully saved', {
              autoClose: 5000,
            });
            webcamOps.close(videoRef);
            navigate(`/${currClinic}/records/${id}`);
          })
          .then((err) =>
            toast.error(
              'There was an error retreiving the record. Please try again',
              {
                autoClose: 5000,
              }
            )
          );
      })
      .catch((err) => {
        console.log(err);
        toast.error('There was an error saving the record. Please try again', {
          autoClose: 5000,
        });
      });
  };

  return (
    <>
      <ToastContainer />

      <div className="p-10 h-screen relative w-full">
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
    </>
  );
};

export default Detection;
