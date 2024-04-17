// Import the functions you need from the SDKs you need
import { DBNames, ReportStatus } from "@/types";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBkBhRHNDYNBSnBb78JfPSmC727sgOBOi4",
  authDomain: "crossmint-bug-hunter.firebaseapp.com",
  projectId: "crossmint-bug-hunter",
  storageBucket: "crossmint-bug-hunter.appspot.com",
  messagingSenderId: "519011124275",
  appId: "1:519011124275:web:577b5968e8e5d7d63ecf46",
};

export class FirebaseAdapter {
  app: any;
  db: any;

  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore(this.app);
  }

  async saveToDB(dbName: DBNames, data: any) {
    try {
      const docRef = await addDoc(collection(this.db, dbName), data);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  async getFromDB(dbName: DBNames) {
    try {
      const querySnapshot = await getDocs(collection(this.db, dbName));
      let documents: any = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      return documents;
    } catch (e) {
      console.error("Error getting documents: ", e);
    }
  }

  async getFromDBById(dbName: DBNames, id: string): Promise<any> {
    // TODO: Implement get document by ID
    try {
      const docRef = doc(this.db, dbName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        console.log("No such document!");
        return null; // Or handle the absence of the document as needed
      }
    } catch (error) {
      console.error("Error getting document:", error);
      return null; // Or handle the error as needed
    }
  }

  async changeField(
    dbName: DBNames,
    id: string,
    field: string,
    value: ReportStatus
  ) {
    try {
      const docRef = doc(this.db, dbName, id);
      const updateObject: any = {};
      updateObject[field] = value;

      await updateDoc(docRef, updateObject);
      console.log("Document successfully updated!");
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  }
}
