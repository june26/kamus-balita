"use client";

import { useEffect, useState } from "react";
import WordContainer from "./WordContainer";
import LoginModal from "./LoginForm";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { Button } from "./ui/button";
import PastelText from "@/helper/pastelText";

export default function MainWrapper() {
  const [user, setUser] = useState<User | null>(null);
  const [childName, setChildName] = useState<string | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setChildName(u?.displayName ?? null);
      setLoadingAuth(false);
      if (u) setShowLogin(false);
      else setShowLogin(true);
    });
    return () => unsub();
  }, []);

  if (loadingAuth) {
    return (
      <div className="flex justify-center items-center h-dvh text-white">
        Loading...
      </div>
    );
  }

  const title = childName ? `Kamus ${childName}` : "Kamus Toddler";

  return (
    <div className="flex flex-col items-center w-full flex-1 min-h-0 md:flex-none md:w-auto md:py-6">
      <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-3 md:my-4 shrink-0">
        <PastelText text={title} />
      </h1>

      {user ? (
        <WordContainer childName={childName} onNameChange={setChildName} />
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

      <LoginModal open={showLogin} onOpenChange={setShowLogin} />
    </div>
  );
}
