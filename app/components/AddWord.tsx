"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { toast } from "sonner";

export default function AddWord() {
  const [toddlerWord, setToddlerWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddWord = async () => {
    if (!toddlerWord || !meaning)
      return toast.error("Isi semua kolom dulu!", { position: "top-center" });

    setLoading(true);
    try {
      await addDoc(collection(db, "words"), {
        toddler: toddlerWord,
        meaning: meaning,
        createdAt: serverTimestamp(),
      });
      setToddlerWord("");
      setMeaning("");
      toast.success("Kata berhasil ditambahkan", { position: "top-center" });
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
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer bg-[#fcd267] border border-[#9d740c] rounded-full px-4 py-4 w-auto text-center text-[#9d740c] font-medium hover:bg-[#e6b538]/90 transition">
          <i className="ri-add-line mr-1" />
          Tambah Kata
        </Button>
      </DialogTrigger>

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
            placeholder="Apa Kata Upay?"
            className="border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
            value={toddlerWord}
            onChange={(e) => setToddlerWord(e.target.value)}
          />
          <input
            type="text"
            placeholder="Artinya"
            className="border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
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
