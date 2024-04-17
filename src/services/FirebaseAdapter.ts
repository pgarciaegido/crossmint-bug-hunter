// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
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

  async saveToDB(data: any) {
    try {
      const docRef = await addDoc(collection(this.db, "bug_report"), data);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  async getFromDB() {
    try {
      const querySnapshot = await getDocs(collection(this.db, "bug_report"));
      let documents: any = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        documents.push({ id: doc.id, ...doc.data() });
      });
      return documents;
    } catch (e) {
      console.error("Error getting documents: ", e);
    }
  }
}
