import {
  collection,
  getDocs,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export function subscribeWords(callback: (data: any[]) => void) {
  const q = query(collection(db, "words"), orderBy("toddler"));
  return onSnapshot(q, (snapshot) => {
    const words = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(words);
  });
}
