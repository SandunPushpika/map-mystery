import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import db from "../configs/firebase";

export type CollectionTypes =
  | "rooms"
  | "users"
  | "games"
  | "roomSessions"
  | "gameSettings";

/**
 * Get a collection reference
 */
export const getCollection = (
  collectionName: CollectionTypes,
): CollectionReference<DocumentData> => {
  return collection(db, collectionName);
};

/**
 * Save new document
 */
export const saveData = async (collectionName: CollectionTypes, data: any) => {
  return await addDoc(collection(db, collectionName), data);
};

/**
 * Get document by ID field (using where clause)
 */
export const getData = async (
  collectionName: CollectionTypes,
  docId: string,
) => {
  const q = query(collection(db, collectionName), where("id", "==", docId));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    console.log(`No document found in ${collectionName} with id: ${docId}`);
    return null;
  }

  const data = querySnapshot.docs[0].data();
  console.log(`Fetched data from ${collectionName} with id ${docId}:`, data);
  return data;
};

/**
 * Update document
 */
export const updateData = async (
  collectionName: CollectionTypes,
  docId: string,
  data: any,
) => {
  return await updateDoc(doc(db, collectionName, docId), data);
};

/**
 * Delete document
 */
export const deleteData = async (
  collectionName: CollectionTypes,
  docId: string,
) => {
  return await deleteDoc(doc(db, collectionName, docId));
};

export default {
  getCollection,
  saveData,
  getData,
  updateData,
  deleteData,
};
