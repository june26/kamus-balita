import PastelText from "@/helper/pastelText";

import MainWrapper from "./components/MainWrapper";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[#b7d2ed] font-sans">
      <h1 className="text-5xl font-bold my-4">
        <PastelText text="Kamus Upay" />
      </h1>

      <MainWrapper />
    </div>
  );
}
