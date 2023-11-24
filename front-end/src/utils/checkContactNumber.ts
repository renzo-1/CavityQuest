import { collection, query, where, getDocs, addDoc } from '@firebase/firestore';
import { db } from './firebase-config';
export const checkContactNumber = async (contactNumber: string) => {
  const contactNumberCollection = collection(db, 'contactNumbers');
  const contactNumQuery = query(
    contactNumberCollection,
    where('contactNumber', '==', contactNumber)
  );
  const querySnapshot = await getDocs(contactNumQuery);
  const isNumUnique = querySnapshot.empty;
  if (navigator.onLine && isNumUnique) {
    await addDoc(contactNumberCollection, { contactNumber });
  }
  if (!navigator.onLine && isNumUnique) {
    addDoc(contactNumberCollection, { contactNumber });
  }
  return isNumUnique;
};
