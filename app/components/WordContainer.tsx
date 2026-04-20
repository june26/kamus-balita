"use client";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import WordCard from "./WordCard";
import AddWord from "./AddWord";
import { subscribeWords, Word } from "@/helper/subscribeWords";
import { Skeleton } from "./ui/skeleton";
import { getAuth, onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";

type Props = {
  childName: string | null;
  onNameChange: (name: string) => void;
};

export default function WordContainer({ childName, onNameChange }: Props) {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [words, setWords] = useState<Word[]>([]);
  const [addWordOpen, setAddWordOpen] = useState(false);
  const [nameDialogOpen, setNameDialogOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [savingName, setSavingName] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const auth = getAuth();
    let unsubscribeFirestore = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) return;
      if (!user.displayName) setNameDialogOpen(true);
      unsubscribeFirestore = subscribeWords(user.uid, (data) => {
        setWords(data);
        setLoading(false);
      });
    });

    return () => {
      unsubscribeAuth();
      unsubscribeFirestore();
    };
  }, []);

  const handleSaveName = async () => {
    if (!nameInput.trim())
      return toast.error("Nama tidak boleh kosong!", { position: "top-center" });

    const auth = getAuth();
    if (!auth.currentUser) return;

    setSavingName(true);
    try {
      await updateProfile(auth.currentUser, { displayName: nameInput.trim() });
      onNameChange(nameInput.trim());
      setNameDialogOpen(false);
      toast.success(`Halo, ${nameInput.trim()}! 👋`, { position: "top-center" });
    } catch {
      toast.error("Gagal menyimpan nama", { position: "top-center" });
    } finally {
      setSavingName(false);
    }
  };

  const filteredWords = words.filter(
    (w) =>
      w.toddler.toLowerCase().includes(search.toLowerCase()) ||
      w.meaning.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <Dialog open={nameDialogOpen} onOpenChange={setNameDialogOpen}>
        <DialogContent className="sm:max-w-xs" onOpenAutoFocus={() => nameInputRef.current?.focus()}>
          <DialogHeader>
            <DialogTitle>
              {childName ? "Ganti nama anak" : "Siapa nama si kecil? 🧸"}
            </DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <div className="mt-4">
            <input
              ref={nameInputRef}
              type="text"
              placeholder="Nama anak..."
              className="w-full border text-base rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); handleSaveName(); }
              }}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSaveName} disabled={savingName}>
              {savingName ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AddWord childName={childName} open={addWordOpen} onOpenChange={setAddWordOpen} />

      {/* main: full-screen flex column on mobile, capped card on desktop */}
      <main className="flex flex-col w-full flex-1 bg-white md:flex-none md:max-w-3xl md:rounded-xl md:shadow-lg md:mb-8 overflow-hidden">

        {/* sticky header */}
        <div className="shrink-0 px-4 bg-white flex justify-between py-3 shadow-[0_4px_10px_rgba(0,0,0,0.1)] relative z-10">
          <div className="relative flex-1 mr-3">
            <i className="ri-search-2-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari kata..."
              className="w-full text-gray-500 bg-gray-100 border border-gray-300 rounded-full pl-9 pr-8 py-1.5 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                <i className="ri-close-line" />
              </button>
            )}
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setAddWordOpen(true)}
              className="hidden md:flex cursor-pointer items-center bg-[#fcd267] border border-[#9d740c] rounded-full px-4 py-2 text-[#9d740c] font-medium hover:bg-[#e6b538]/90 transition"
            >
              <i className="ri-add-line mr-1" />
              Tambah Kata
            </button>
            <button
              onClick={() => setNameDialogOpen(true)}
              className="cursor-pointer w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-100 text-gray-400 hover:text-blue-400 transition"
              title="Ganti nama"
            >
              <i className="ri-user-line text-lg" />
            </button>
            <button
              onClick={() => signOut(getAuth()).then(() => toast.success("Logout berhasil"))}
              className="cursor-pointer w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 text-gray-400 hover:text-red-400 transition"
              title="Logout"
            >
              <i className="ri-logout-box-r-line text-lg" />
            </button>
          </div>
        </div>

        {/* scrollable word list — only this scrolls */}
        <div className="flex-1 overflow-y-auto overscroll-contain bg-[#eef3f8] py-4 space-y-3 pb-24 md:pb-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[70px] w-auto rounded-md bg-gray-300 mx-4 animate-pulse" />
            ))
          ) : filteredWords.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-16 px-4 select-none">
              <div className="text-6xl mb-4 animate-bounce">🧸</div>
              <p className="text-2xl font-bold text-gray-400 mb-1">
                {search ? "Kata tidak ditemukan!" : "Belum ada kata nih~"}
              </p>
              <p className="text-sm text-gray-400 text-center">
                {search
                  ? `"${search}" belum ada di kamus`
                  : `Yuk tambah kata pertama ${childName ?? "si kecil"}! 🌟`}
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredWords.map((word, i) => (
                <WordCard
                  key={word.id}
                  id={word.id}
                  index={i + 1}
                  from={word.toddler}
                  to={word.meaning}
                  createdAt={word.createdAt}
                  childName={childName}
                />
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* footer */}
        <div className="shrink-0 py-3 flex justify-between px-4 w-full text-gray-400 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] bg-white z-10">
          <div>
            Total Kata: <span className="font-medium">{filteredWords.length}</span>
          </div>
          <div>
            from Dad with <i className="text-pink-400 ri-heart-3-fill ml-1" />
          </div>
        </div>
      </main>

      {/* FAB - mobile only */}
      <button
        onClick={() => setAddWordOpen(true)}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-[#fcd267] border border-[#9d740c] text-[#9d740c] rounded-full shadow-xl flex items-center justify-center text-2xl hover:bg-[#e6b538] transition z-50 active:scale-95"
      >
        <i className="ri-add-line" />
      </button>
    </>
  );
}
