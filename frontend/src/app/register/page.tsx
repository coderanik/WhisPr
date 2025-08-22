"use client";
import { useState } from "react";
import { useAuth } from "@/components/AuthContext";
import { useToast } from "@/components/Toast";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [name, setName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, regNo, password);
      router.push("/login");
    } catch (err: any) {
      showToast(err.message || "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-3">
        <input
          type="text"
          placeholder="Username"
          className="border rounded p-2"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Registration Number"
          className="border rounded p-2"
          value={regNo}
          onChange={e => setRegNo(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border rounded p-2"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </main>
  );
} 