import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { GameStatus } from "@/models/models";
import db from "../configs/firebase";

export type CollectionTypes =
  | "rooms"
  | "users"
  | "games"
  | "roomSessions"
  | "gameSettings"
  | "gameStatus"
  | "gameResults";

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
  console.log(`Saving data to ${collectionName}:`, data);
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
 * Get document by ID field (using where clause)
 */
export const getDocumentReference = async (
  collectionName: CollectionTypes,
  docId: string,
) => {
  const q = query(collection(db, collectionName), where("id", "==", docId));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    console.log(`No document found in ${collectionName} with id: ${docId}`);
    return null;
  }

  const data = querySnapshot.docs[0].ref;
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

export const listenToGameSettings = (
  roomId: string,
  onChange: (data: any) => void,
) => {
  const q = query(collection(db, "gameSettings"), where("id", "==", roomId));

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      if (querySnapshot.empty) {
        console.log(`No gameSettings found for roomId: ${roomId}`);
        onChange(null);
        return;
      }

      const data = querySnapshot.docs[0].data();
      onChange(data);
    },
    (error) => {
      console.error("Error listening to game settings:", error);
    },
  );

  return unsubscribe;
};

export const listenToGameStatus = (
  roomId: string,
  onGameStatus: (data: any) => void,
) => {
  const q = query(collection(db, "gameStatus"), where("roomId", "==", roomId));
  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      if (querySnapshot.empty) {
        console.log(`No gameStatus found for roomId: ${roomId}`);
        onGameStatus(null);
        return;
      }

      const data = querySnapshot.docs[0].data();
      onGameStatus(data);
    },
    (error) => {
      console.error("Error listening to game status:", error);
    },
  );

  return unsubscribe;
};

export const saveGameStatus = async (data: GameStatus) => {
  const q = query(
    collection(db, "gameStatus"),
    where("roomId", "==", data.roomId),
  );
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return await addDoc(collection(db, "gameStatus"), data);
  } else {
    const docRef = querySnapshot.docs[0].ref;
    return await updateDoc(docRef, data as any);
  }
};

export const getGameResultsByUser = async (
  roomId: string,
  round: number,
  userId: string,
) => {
  const q = query(
    collection(db, "gameResults"),
    where("roomId", "==", roomId),
    where("round", "==", round),
    where("userId", "==", userId),
  );
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    console.log(`No gameResults found for roomId: ${roomId}, round: ${round}`);
    return [];
  }
  return querySnapshot.docs[0].data();
};

export const getGameResultsByRoom = async (
  roomId: string,
  round: number,
  userId: string,
) => {
  const q = query(
    collection(db, "gameResults"),
    where("roomId", "==", roomId),
    where("round", "==", round),
  );
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    console.log(`No gameResults found for roomId: ${roomId}, round: ${round}`);
    return [];
  }
  return querySnapshot.docs.map((doc) => doc.data());
};

export const listenGameResultsByRoom = (
  roomId: string,
  round: number,
  onUpdate: (results: any[]) => void,
) => {
  const q = query(
    collection(db, "gameResults"),
    where("roomId", "==", roomId),
    where("round", "==", round),
  );
  const unsubscribe = onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      onUpdate([]);
      return;
    }

    const results = snapshot.docs.map((doc) => ({
      ...doc.data(),
    }));

    onUpdate(results);
  });

  return unsubscribe;
};

export default {
  getCollection,
  saveData,
  getData,
  updateData,
  deleteData,
};
