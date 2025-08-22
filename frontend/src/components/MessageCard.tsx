"use client";
import { useEffect, useRef } from "react";

interface MessageCardProps {
  userDisplayName: string;
  content: string;
  date: string;
}

export default function MessageCard({ userDisplayName, content, date }: MessageCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.classList.add("animate-float-in");
    }
  }, []);
  return (
    <div
      ref={cardRef}
      className="bg-white shadow-lg shadow-blue-100 border border-blue-200 rounded-2xl p-5 mb-6 w-full max-w-lg mx-auto relative transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl animate-float-in"
      style={{
        boxShadow: "0 8px 32px 0 rgba(34, 139, 230, 0.15)",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-blue-700 text-base">{userDisplayName}</span>
        <span className="text-xs text-gray-400">{new Date(date).toLocaleString()}</span>
      </div>
      <div className="text-gray-800 text-lg break-words whitespace-pre-line leading-relaxed">
        {content}
      </div>
    </div>
  );
}

// Add animation to globals.css:
// @keyframes float-in { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: none; } }
// .animate-float-in { animation: float-in 0.7s cubic-bezier(.22,1,.36,1) both; } 