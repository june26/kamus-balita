"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { toast } from "sonner";

type LoginModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // monitor auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) onOpenChange(false); // kalau login berhasil, tutup modal
    });
    return () => unsub();
  }, [onOpenChange]);

  const handleLogin = async () => {
    if (!email || !password)
      return toast.error("Isi semua kolom dulu!", { position: "top-center" });
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login berhasil", { position: "top-center" });
    } catch (err) {
      console.error(err);
      toast.error("Email atau password salah", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Logout berhasil");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>Masukkan email & password</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-4 mt-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
          <Button onClick={handleLogin} disabled={loading}>
            {loading ? "Login..." : "Login"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
