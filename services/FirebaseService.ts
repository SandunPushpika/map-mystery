import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import db from "../configs/firebase";

export type CollectionTypes = "rooms" | "users" | "games";

/**
 * Get a collection reference
 */
export const getCollection = (
  collectionName: CollectionTypes
): CollectionReference<DocumentData> => {
  return collection(db, collectionName);
};

/**
 * Save new document
 */
export const saveData = async (
  collectionName: CollectionTypes,
  data: any
) => {
  return await addDoc(collection(db, collectionName), data);
};

/**
 * Get document by ID
 */
export const getData = async (
  collectionName: CollectionTypes,
  docId: string
) => {
  const snapshot = await getDoc(doc(db, collectionName, docId));
  return snapshot.exists() ? snapshot.data() : null;
};

/**
 * Update document
 */
export const updateData = async (
  collectionName: CollectionTypes,
  docId: string,
  data: any
) => {
  return await updateDoc(doc(db, collectionName, docId), data);
};

/**
 * Delete document
 */
export const deleteData = async (
  collectionName: CollectionTypes,
  docId: string
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