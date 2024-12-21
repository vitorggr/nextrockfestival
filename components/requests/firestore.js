"use server";

import { db } from '../auth/firebase';
import { collection, addDoc, updateDoc, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";

export async function post(data) {
  try {
    await addDoc(collection(db, "inscricao"), data);
  } catch (error) {
    console.error(error);
  }
};

export async function put(id, data) {
  try {
    debugger;
    const docRef = doc(db, "inscricao", id); 
    await updateDoc(docRef, data); 
  } catch (error) {
    console.error(error);
  }
}

export async function getList(uidUsuario) {
  try {
    const q = query(
      collection(db, "inscricao"),
      where("uidUsuario", "==", uidUsuario)
    );

    const querySnapshot = await getDocs(q);

    const response = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    return response;
  } catch (error) {
    console.error("Erro ao buscar a lista:", error);
    return [];
  }
}

export async function deleteInscricao(id) {
  try {
    const docRef = doc(db, "inscricao", id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Erro ao excluir inscrição:", error);
    return false;
  }
}