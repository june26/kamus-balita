import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type Word = {
  id: string;
  toddler: string;
  meaning: string;
  createdAt: Date | null;
};

export function subscribeWords(uid: string, callback: (data: Word[]) => void) {
  if (!uid) return () => {};

  const q = query(
    collection(db, "words"),
    where("userId", "==", uid),
    orderBy("createdAt", "desc"),
  );

  return onSnapshot(q, (snapshot) => {
    const words = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        toddler: data.toddler as string,
        meaning: data.meaning as string,
        createdAt: (data.createdAt?.toDate?.() as Date) ?? null,
      };
    });
    callback(words);
  });
}
