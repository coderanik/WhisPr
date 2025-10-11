"use client";
import { useState } from "react";
import { useAuth } from "@/components/AuthContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [regNo, setRegNo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(regNo, password);
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="glass-card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Join WhisPr</h1>
          
          <div className="mb-6 text-center text-sm text-gray-300">
            <p>Create your anonymous account with just your registration number and password.</p>
            <p className="mt-1">Your unique anonymous name will be automatically generated.</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="regNo" className="block text-sm font-medium text-gray-200 mb-2">
              Registration Number
            </label>
            <input
              id="regNo"
              type="text"
              placeholder="e.g., 2411033010001"
              className="w-full bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl p-3 focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all duration-300 placeholder-gray-400 text-gray-200"
              value={regNo}
              onChange={e => setRegNo(e.target.value)}
              required
            />
            <p className="text-xs text-gray-400 mt-2 glass-subtle px-2 py-1 rounded-full inline-block">
              Must be within the allowed registration range
            </p>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Choose a secure password"
              className="w-full bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl p-3 focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all duration-300 placeholder-gray-400 text-gray-200"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <p className="text-xs text-gray-400 mt-2 glass-subtle px-2 py-1 rounded-full inline-block">
              Use a strong password for security
            </p>
          </div>
          
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl group mt-2"
            disabled={loading}
          >
            <span className="flex items-center justify-center space-x-2">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </>
              )}
            </span>
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-300">
          <p>Already have an account?</p>
          <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">Login here</a>
        </div>
        
        <div className="mt-6 space-y-3">
          <div className="glass-subtle p-4 rounded-xl text-xs text-gray-300">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
              <p className="font-medium">🆔 Anonymous Identity</p>
            </div>
            <p>Your anonymous name will be generated from your registration number and displayed after registration.</p>
          </div>
          
          <div className="glass-subtle p-4 rounded-xl text-xs text-gray-300">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
              <p className="font-medium">🔒 Privacy First</p>
            </div>
            <p>No personal names are collected. Your identity is completely protected.</p>
          </div>
        </div>
      </div>
    </main>
  );
} 