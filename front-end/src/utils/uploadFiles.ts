import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
  uploadString,
} from 'firebase/storage';
import { v4 } from 'uuid';
import { Timestamp } from 'firebase/firestore';

import { storage } from './firebase-config';

export const uploadFile = async (
  imageUpload: File | string,
  fileName?: string
) => {
  if (imageUpload == null) return;
  const dateNow = new Date(Date.now());

  // FILE UPLOAD
  if (!fileName && typeof imageUpload != 'string') {
    const name = imageUpload.name + v4();
    const imageRef = ref(storage, `images/${name}`);
    const uploadedFile = {
      name: name,
      url: '',
      createdOn: Timestamp.now(),
    };
    const snapshot = await uploadBytes(imageRef, imageUpload);
    const URL = await getDownloadURL(snapshot.ref);
    uploadedFile.url = URL;
    return uploadedFile;
  }

  // DAT URL UPLOAD
  if (typeof imageUpload == 'string') {
    const name = fileName + v4();
    const imageRef = ref(storage, `images/${name}`);
    const uploadedFile = {
      name,
      url: '',
      createdOn: Timestamp.now(),
    };
    const snapshot = await uploadString(imageRef, imageUpload, 'data_url');
    const URL = await getDownloadURL(snapshot.ref);
    uploadedFile.url = URL;
    return uploadedFile;
  }
};
