"use client";
import { useEffect, useRef, useState } from "react";
import { apiPost } from "@/utils/api";
import { useAuth } from "@/components/AuthContext";
import toast from "react-hot-toast";

interface MessageCardProps {
  messageId?: string;
  userDisplayName: string;
  content: string;
  date: string;
}

export default function MessageCard({ messageId, userDisplayName, content, date }: MessageCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { user, token } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isReported, setIsReported] = useState(false);

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.classList.add("animate-float-in");
    }
  }, []);

  const handleLike = async () => {
    if (!messageId || !user || !token) return;
    
    try {
      const response = await apiPost(`/api/messages/${messageId}/like`, {}, token);
      setIsLiked(response.liked);
      toast.success(response.message);
    } catch (error: any) {
      toast.error(error.message || "Failed to like message");
    }
  };

  const handleReport = async () => {
    if (!messageId || !user || !token) return;
    
    const reason = prompt("Please provide a reason for reporting this message:");
    if (!reason) return;
    
    try {
      await apiPost(`/api/messages/${messageId}/report`, { reason }, token);
      setIsReported(true);
      toast.success("Message reported. Thank you for keeping the community safe!");
    } catch (error: any) {
      toast.error(error.message || "Failed to report message");
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const messageDate = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - messageDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div
      ref={cardRef}
      className="glass-card p-4 relative message-card animate-float-in group hover:shadow-lg transition-shadow duration-200"
    >
      {/* Header with user info and time */}
      <div className="flex items-center space-x-2 mb-3 flex-wrap">
        <div className="w-6 h-6 lg:w-7 lg:h-7 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-white">
            {userDisplayName.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-sm font-medium text-gray-300">u/{userDisplayName}</span>
        <span className="text-gray-500 hidden sm:inline">•</span>
        <span className="text-xs text-gray-400">{formatTimeAgo(date)}</span>
        <span className="text-gray-500 hidden sm:inline">•</span>
        <span className="text-xs text-gray-400 hidden sm:inline">r/WhisPr</span>
      </div>

      {/* Message content */}
      <div className="text-gray-200 text-base break-words whitespace-pre-line leading-relaxed mb-4">
        {content}
      </div>

      {/* Action buttons */}
      <div className="flex items-center space-x-4 lg:space-x-6 text-sm">
        <button className="flex items-center space-x-1 text-gray-400 hover:text-gray-300 transition-colors duration-200 px-2 py-1 rounded-full hover:bg-gray-700/50">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>Comment</span>
        </button>
        
        <button 
          onClick={handleLike}
          className={`flex items-center space-x-1 transition-colors duration-200 px-2 py-1 rounded-full hover:bg-gray-700/50 ${
            isLiked 
              ? 'text-red-500 hover:text-red-400' 
              : 'text-gray-400 hover:text-red-500'
          }`}
        >
          <svg className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>Like</span>
        </button>
        
        <button 
          onClick={handleReport}
          disabled={isReported}
          className={`flex items-center space-x-1 transition-colors duration-200 px-2 py-1 rounded-full hover:bg-gray-700/50 ${
            isReported 
              ? 'text-red-600 cursor-not-allowed' 
              : 'text-gray-400 hover:text-red-400'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span>{isReported ? 'Reported' : 'Report'}</span>
        </button>
      </div>
    </div>
  );
}

// Add animation to globals.css:
// @keyframes float-in { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: none; } }
// .animate-float-in { animation: float-in 0.7s cubic-bezier(.22,1,.36,1) both; } 