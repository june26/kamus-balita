"use client";
import { useRef } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { useState } from "react";

type Props = {
  childName: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AddWord({ childName, open, onOpenChange }: Props) {
  const [toddlerWord, setToddlerWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [loading, setLoading] = useState(false);
  const meaningRef = useRef<HTMLInputElement>(null);

  const handleAddWord = async () => {
    if (!toddlerWord || !meaning)
      return toast.error("Isi semua kolom dulu!", { position: "top-center" });

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      return toast.error("Harus login dulu!", { position: "top-center" });
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "words"), {
        toddler: toddlerWord,
        meaning: meaning,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      setToddlerWord("");
      setMeaning("");
      onOpenChange(false);
      toast.success("Kata berhasil ditambahkan 🎉", { position: "top-center" });
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.55 },
        colors: ["#fcd267", "#f9a8d4", "#a5b4fc", "#86efac", "#fdba74"],
      });
    } catch (error) {
      console.error("Error adding word:", error);
      toast.error("Oops! Gagal menambahkan kata, silahkan coba lagi", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Kata Baru</DialogTitle>
          <DialogDescription>
            Masukkan kata baru beserta maknanya di sini.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-4 mt-4">
          <input
            type="text"
            placeholder={`Apa kata ${childName ?? "si kecil"}?`}
            className="border text-base rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
            value={toddlerWord}
            onChange={(e) => setToddlerWord(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                meaningRef.current?.focus();
              }
            }}
          />
          <input
            ref={meaningRef}
            type="text"
            placeholder="Artinya"
            className="border text-base rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddWord();
              }
            }}
          />
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <DialogClose asChild>
            <Button variant="outline" className="cursor-pointer">
              Batal
            </Button>
          </DialogClose>
          <Button
            className="cursor-pointer"
            onClick={handleAddWord}
            disabled={loading}
          >
            {loading ? "Menambahkan..." : "Tambah"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
