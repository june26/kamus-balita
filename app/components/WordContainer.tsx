"use client";
import { useState, useEffect } from "react";
import WordCard from "./WordCard";
import AddWord from "./AddWord";
import { subscribeWords } from "@/helper/subscribeWords";
import { Skeleton } from "./ui/skeleton";

export default function WordContainer() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [words, setWords] = useState<
    { id: string; toddler: string; meaning: string }[]
  >([]);

  // subscribe realtime dari Firebase
  useEffect(() => {
    const unsubscribe = subscribeWords((data) => {
      setWords(data);
      setLoading(false); // data sudah diterima
    });
    return () => unsubscribe();
  }, []);

  const filteredWords = words.filter(
    (w) =>
      w.toddler.toLowerCase().includes(search.toLowerCase()) ||
      w.meaning.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main className="flex w-full max-w-3xl shadow-lg flex-col items-center justify-between md:rounded-xl bg-white sm:items-start">
      <div className="w-full bg-[#eef3f8] rounded-t-xl">
        <div className="px-4 space-x-4 rounded-t-xl bg-white flex justify-between py-3 shadow-[0_4px_10px_rgba(0,0,0,0.1)] relative z-12">
          <div className="relative w-[250px]">
            <i className="ri-search-2-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari kata..."
              className="w-full text-gray-500 bg-gray-100 border border-gray-300 rounded-full pl-9 pr-3 py-1 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <AddWord />
        </div>

        <div className="py-5 space-y-4 min-h-[calc(100dvh-190px)] max-h-[calc(100dvh-180px)] md:max-h-[60vh] md:min-h-auto overflow-y-auto">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-[70px] w-auto rounded-md bg-gray-500 mx-4 animate-pulse"
                />
              ))
            : filteredWords.map((word, i) => (
                <WordCard
                  key={word.id}
                  id={word.id}
                  index={i + 1}
                  from={word.toddler}
                  to={word.meaning}
                />
              ))}
        </div>
      </div>
      <div className="py-3 z-10 flex justify-center w-full text-gray-400 shadow-[0_-4px_10px_rgba(0,0,0,0.2)]">
        from Dad with <i className="text-pink-400 ri-heart-3-fill ml-2" />
      </div>
    </main>
  );
}
