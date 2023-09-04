import React, { useState, useRef } from 'react';
import { WebcamOps } from '../utils/webcam';
import { Carousel, Detection as Detect } from 'components';
import { useAppContext } from 'features/AppContext';
import {
  PatientDataContextType,
  ImageUpload,
  PatientDataKind,
} from 'utils/Interfaces';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { getDoc, updateDoc, doc } from '@firebase/firestore';
import { db } from 'utils/firebase-config';
import { uploadFile } from 'utils/uploadFiles';

const Detection = () => {
  const { id } = useParams();
  const { currClinic, getPatients } = useAppContext() as PatientDataContextType;
  const videoRef = useRef<HTMLVideoElement>(null);
  const webcamOps = new WebcamOps();
  const [captures, setCaptures] = useState<string[]>([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const toastId = toast.loading('Saving detection...');

    try {
      const imgs = await Promise.all(
        captures.map(async (file, index) => {
          const result = await uploadFile(file, `detection${index}`);
          return result;
        })
      );

      if (id) {
        const patientRef = doc(db, 'patients', id);
        const patientSnap = await getDoc(patientRef);

        let newImageUploadsArr;
        if (patientSnap.exists()) {
          newImageUploadsArr = [...patientSnap.data().imageUploads];
          imgs.map((img) => newImageUploadsArr.push(img));
        }

        await updateDoc(patientRef, { imageUploads: newImageUploadsArr });

        webcamOps.close(videoRef);

        getPatients();

        navigate(`/${currClinic}/records/${id}`);

        toast.update(toastId, {
          render: 'Detection saved',
          type: 'success',
          autoClose: 1000,
          isLoading: false,
        });
      }
    } catch (e) {
      console.log(e);
      toast.update(toastId, {
        render: 'An error occured saving your detection. Try reloading.',
        type: 'error',
        autoClose: 2000,
        isLoading: false,
      });
    }
  };

  return (
    <>
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
