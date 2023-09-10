import React, { useState, useRef } from 'react';
import { WebcamOps } from '../utils/webcam';
import { Carousel, Detection as Detect } from 'components';
import { useAppContext } from 'features/AppContext';
import { ContextType, ImageUpload } from 'utils/Interfaces';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  getDoc,
  updateDoc,
  doc,
  arrayUnion,
  Timestamp,
  collection,
  addDoc,
} from '@firebase/firestore';
import { db } from 'utils/firebase-config';
import { uploadFile } from 'utils/uploadFiles';

const Detection = () => {
  const { id } = useParams();
  const { currClinic, getPatients, saveImage, getClinics, clinics, setImages } =
    useAppContext() as ContextType;
  const videoRef = useRef<HTMLVideoElement>(null);
  const webcamOps = new WebcamOps();
  const [captures, setCaptures] = useState<string[]>([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const imagesCollection = collection(db, 'images');
  const patientCollection = collection(db, 'patients');

  const handleSubmit = async () => {
    if (captures.length < 1) return;
    const toastId = toast.loading('Saving detection...');
    try {
      const internetStatus = navigator.onLine;
      const imgs = await Promise.all(
        captures.map(async (file, index) => {
          const result = await uploadFile(file, `detection${index}`);
          return result;
        })
      );

      if (id) {
        // OFFLINE
        if (!internetStatus) {
          imgs.map((img: any) => {
            addDoc(imagesCollection, img);
            saveImage(id);
          });
          // await getPatients(clinics);
        }
        // ONLINE
        else {
          const patientRef = doc(patientCollection, id);
          imgs.map(async (img: any) => {
            const imgRef = await addDoc(imagesCollection, img);
            updateDoc(patientRef, {
              imageUploads: arrayUnion(imgRef),
            });
            // await getPatients(clinics);
            getClinics();
          });
        }

        toast.update(toastId, {
          render: 'Detection saved',
          type: 'success',
          autoClose: 1000,
          isLoading: false,
        });

        webcamOps.close(videoRef);

        navigate(`/${currClinic}/records/${id}`);
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
          webcamOps={webcamOps}
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
