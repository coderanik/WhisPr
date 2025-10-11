"use client";
import { useState } from "react";
import { useAuth } from "@/components/AuthContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [regNo, setRegNo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(regNo, password);
      router.push("/forum");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="glass-card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Login to WhisPr</h1>
          
          <div className="mb-6 text-center text-sm text-gray-300">
            <p>Welcome back! Login with your registration number and password.</p>
            <p className="mt-1">Your anonymous name will be automatically displayed.</p>
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
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl p-3 focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all duration-300 placeholder-gray-400 text-gray-200"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
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
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </>
              )}
            </span>
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-300">
          <p>Don't have an account?</p>
          <a href="/register" className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">Register here</a>
        </div>
        
        <div className="mt-6 glass-subtle p-4 rounded-xl text-xs text-gray-300">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
            <p className="font-medium">🔒 Privacy First</p>
          </div>
          <p>Your identity is protected with anonymous names. No personal information is ever stored.</p>
        </div>
      </div>
    </main>
  );
} 