"use client";

import { motion, useAnimation, PanInfo } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
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

type WordCardProps = {
  id: string;
  from: string;
  to: string;
  index: number;
};

const pastelColors = [
  { border: "border-pink-400", text: "text-pink-400" },
  { border: "border-purple-400", text: "text-purple-400" },
  { border: "border-blue-300", text: "text-blue-300" },
  { border: "border-green-400", text: "text-green-400" },
  { border: "border-yellow-400", text: "text-yellow-400" },
  { border: "border-orange-400", text: "text-orange-400" },
];

function getHash(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export default function WordCard({ id, from, to, index }: WordCardProps) {
  const controls = useAnimation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editWord, setEditWord] = useState({ from, to });

  const hash = getHash(from + to);
  const colorIndex = (hash + index) % pastelColors.length;
  const color = pastelColors[colorIndex];

  const dragThreshold = -50;
  const openPosition = -108;

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (info.offset.x < dragThreshold || info.velocity.x < -500) {
      controls.start({
        x: openPosition,
        transition: { type: "spring", stiffness: 300, damping: 30 },
      });
    } else {
      controls.start({
        x: 0,
        transition: { type: "spring", stiffness: 300, damping: 30 },
      });
    }
  };

  const closeCard = () => {
    controls.start({ x: 0 });
  };

  const handleEdit = async () => {
    if (!editWord.from || !editWord.to)
      return toast.error("Isi semua kolom!", { position: "top-center" });
    try {
      await updateDoc(doc(db, "words", id), {
        toddler: editWord.from,
        meaning: editWord.to,
      });
      toast.success(`Kata berhasil diperbarui`, { position: "top-center" });
      setEditDialogOpen(false);
      closeCard();
    } catch (error) {
      console.error("Error editing word:", error);
      toast.error("Gagal memperbarui kata", { position: "top-center" });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "words", id));
      toast.success(`Kata "${from}" berhasil dihapus`, {
        position: "top-center",
      });
      setDeleteDialogOpen(false);
      closeCard();
    } catch (error) {
      console.error("Error deleting word:", error);
      toast.error("Oops! Gagal menghapus kata, silahkan coba lagi", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="px-4 relative mb-4">
      <div className="absolute inset-y-0 right-4 flex items-center space-x-2 z-0">
        <div className="flex flex-col items-center space-y-1">
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogTrigger asChild>
              <button className="w-11 h-11 cursor-pointer bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                <i className="ri-pencil-fill text-lg" />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xs">
              <DialogHeader>
                <DialogTitle>Edit Kata</DialogTitle>
                <DialogDescription>
                  Ubah kata dan maknanya di sini.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col space-y-2 mt-4">
                <input
                  type="text"
                  placeholder="Kata Upay"
                  value={editWord.from}
                  onChange={(e) =>
                    setEditWord({ ...editWord, from: e.target.value })
                  }
                  className="border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                />
                <input
                  type="text"
                  placeholder="Artinya"
                  value={editWord.to}
                  onChange={(e) =>
                    setEditWord({ ...editWord, to: e.target.value })
                  }
                  className="border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <DialogClose asChild>
                  <Button variant="outline">Batal</Button>
                </DialogClose>
                <Button
                  onClick={handleEdit}
                  className="bg-blue-400 hover:bg-blue-500 text-white"
                >
                  Simpan
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
            Edit
          </span>
        </div>
        <div className="flex flex-col items-center space-y-1">
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <button className="w-11 h-11 cursor-pointer bg-red-400 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors">
                <i className="ri-delete-bin-fill text-lg" />
              </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-xs">
              <DialogHeader>
                <DialogTitle>Hapus Kata</DialogTitle>
                <DialogDescription>
                  Apakah kamu yakin ingin menghapus kata &quot;{from}&quot;?
                  Tindakan ini tidak bisa dibatalkan.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 flex justify-end space-x-2">
                <DialogClose asChild>
                  <Button variant="outline">Batal</Button>
                </DialogClose>
                <Button
                  onClick={handleDelete}
                  className="bg-red-400 hover:bg-red-500 text-white"
                >
                  Hapus
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
            Hapus
          </span>
        </div>
      </div>

      <motion.div
        drag="x"
        animate={controls}
        dragConstraints={{ left: openPosition, right: 0 }}
        dragElastic={0.03}
        onDragEnd={handleDragEnd}
        className="bg-white rounded-xl shadow-md p-2 relative z-10 cursor-grab active:cursor-grabbing"
      >
        <div
          className={`border-2 ${color.border} rounded-lg border-dashed px-4 py-3`}
        >
          <div className={`flex items-center space-x-4 ${color.text}`}>
            <p className="font-medium text-2xl">{from}</p>
            <i className="ri-arrow-right-long-line text-2xl" />
            <p className="font-medium text-2xl">{to}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
