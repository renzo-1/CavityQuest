import {
  ref,
  uploadBytes,
  getDownloadURL,
  uploadString,
} from 'firebase/storage';
import { v4 } from 'uuid';
// @ts-ignore
import { Timestamp } from 'firebase/firestore';
// import { sendFile, receiveFile } from './offlineImageUploads';
import { storage } from './firebase-config';

const toBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

export const uploadFile = async (
  imageUpload: File | string,
  fileName?: string
) => {
  // const { currPatient } = useAppContext() as ContextType;
  const internetStatus = navigator.onLine;
  if (imageUpload == null) {
    return;
  }

  // FILE UPLOAD. (File data has natural name field)
  if (!fileName && typeof imageUpload != 'string') {
    const name = v4() + imageUpload.name;
    const offlineUrl = await toBase64(imageUpload);

    // Offline upload
    if (!internetStatus) {
      // const imageArrBuffer = await imageUpload.arrayBuffer();
      // sendFile( name, Buffer.from(imageArrBuffer));
      // // returns file url
      return {
        name,
        offlineUrl,
        onlineUrl: '',
        createdOn: Timestamp.now(),
      };
    }
    // Online upload
    {
      const imageRef = ref(storage, `images/${name}`);
      const uploadedFile = {
        name,
        onlineUrl: '',
        offlineUrl,
        createdOn: Timestamp.now(),
      };
      const snapshot = await uploadBytes(imageRef, imageUpload);
      const URL = await getDownloadURL(snapshot.ref);
      uploadedFile.onlineUrl = URL;
      return uploadedFile;
    }
  }

  // DATA URL UPLOAD
  if (typeof imageUpload == 'string') {
    const name = fileName + v4();
    console.log('hello2');

    // offline upload
    // if (!internetStatus) { PROD
    if (!internetStatus) {
      // const buffer = Buffer.from(imageUpload.split(',')[1], 'base64');
      // sendFile(name, buffer);
      // // returns file url
      // return {
      //   url: await receiveFile(),
      //   createdOn: Timestamp.now(),
      //   local: true,
      // };
      return {
        name,
        onlineUrl: '',
        offlineUrl: imageUpload,
        createdOn: Timestamp.now(),
      };
    }
    // online upload
    else {
      const imageRef = ref(storage, `images/${name}`);
      const uploadedFile = {
        name,
        onlineUrl: '',
        offlineUrl: imageUpload,
        createdOn: Timestamp.now(),
      };
      const snapshot = await uploadString(imageRef, imageUpload, 'data_url');
      const URL = await getDownloadURL(snapshot.ref);
      uploadedFile.onlineUrl = URL;
      return uploadedFile;
    }
  }
};
