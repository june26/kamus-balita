"use client";

import { useEffect, useState } from "react";
import WordContainer from "./WordContainer";
import LoginModal from "./LoginForm";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Button } from "./ui/button";

export default function MainWrapper() {
  const [user, setUser] = useState<null | object>(null);
  const [loadingAuth, setLoadingAuth] = useState(true); // menunggu auth selesai
  const [showLogin, setShowLogin] = useState(true); // default modal terbuka

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoadingAuth(false); // auth sudah dicek
      if (u)
        setShowLogin(false); // kalau sudah login, tutup modal
      else setShowLogin(true); // kalau belum login, buka modal
    });

    return () => unsub();
  }, []);

  if (loadingAuth) {
    // Sementara menunggu Firebase, bisa tampil spinner atau blank
    return (
      <div className="flex justify-center items-center h-[50vh] text-white">
        Loading...
      </div>
    );
  }

  return (
    <>
      {user ? (
        <WordContainer />
      ) : (
        <div className="flex flex-col items-center space-y-4 mt-4">
          <p className="text-gray-200 text-center">
            Silahkan login untuk melihat daftar kata.
          </p>
          <Button
            onClick={() => setShowLogin(true)}
            className="bg-yellow-400 hover:bg-yellow-500 text-white"
          >
            Login
          </Button>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal open={showLogin} onOpenChange={setShowLogin} />
    </>
  );
}
