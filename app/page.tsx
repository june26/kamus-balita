import PastelText from "@/helper/pastelText";
import WordCard from "./components/WordCard";
import AddWord from "./components/AddWord";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[#b7d2ed] font-sans">
      <h1 className="text-5xl font-bold mb-6">
        <PastelText text="Kamus Upay" />
      </h1>

      <main className="flex w-full max-w-3xl shadow-lg flex-col items-center justify-between rounded-xl bg-white sm:items-start">
        <div className="w-full bg-[#eef3f8] rounded-t-xl">
          <div className="px-4 rounded-t-xl bg-white flex justify-between py-3 shadow-[0_4px_10px_rgba(0,0,0,0.1)] relative z-10">
            <div className="relative w-[250px]">
              <i className="ri-search-2-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari kata..."
                className="w-full text-gray-500 bg-gray-100 border border-gray-300 rounded-full pl-9 pr-3 py-1 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <AddWord />
          </div>
          <div className="py-5 space-y-4 max-h-[calc(100vh-180px)] md:max-h-[60vh] overflow-y-auto">
            <WordCard index={1} from="Apai" to="Aufar" />
            <WordCard index={2} from="Weshwesh" to="Let's Race" />
            <WordCard index={3} from="Aiah" to="Ayah" />
            <WordCard index={4} from="Mih" to="Minum" />
            <WordCard index={5} from="Mama" to="Mamah" />
            <WordCard index={6} from="brmah" to="Rumah" />
            <WordCard index={7} from="Aih" to="Air" />
            <WordCard index={8} from="Amm" to="Makan/Aemm" />
          </div>
        </div>
        <div className="py-3 z-10 flex justify-center w-full text-gray-400 shadow-[0_-4px_10px_rgba(0,0,0,0.2)]">
          from Dad with <i className="text-pink-400 ri-heart-3-fill ml-2" />
        </div>
      </main>
    </div>
  );
}
