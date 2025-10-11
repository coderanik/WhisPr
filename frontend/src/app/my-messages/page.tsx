"use client";
import { useEffect, useState } from "react";
import MessageCard from "@/components/MessageCard";
import { apiGet } from "@/utils/api";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Message {
  displayName: string;
  content: string;
  postedAt: string;
}

export default function MyMessagesPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  useEffect(() => {
    if (!user) return;
    apiGet("/api/messages/my-messages", token || undefined)
      .then(res => setMessages(res.messages))
      .catch(() => toast.error("Failed to load your messages"))
      .finally(() => setLoading(false));
  }, [user, token]);

  // Don't render anything if not authenticated
  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6 tracking-tight">My Anonymous Messages</h1>
          
          <div className="glass-card p-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
              <h2 className="text-lg font-semibold text-gray-200">Your Message History</h2>
            </div>
            <p className="text-gray-300 mb-2">View all messages you've posted anonymously.</p>
            <p className="text-sm text-gray-400">Your messages are encrypted and displayed using your anonymous name.</p>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="glass-card p-8 max-w-sm mx-auto">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-300 font-medium">Loading your messages...</span>
              </div>
            </div>
          </div>
        ) : (
          <div id="my-messages-list" className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="glass-card p-8 max-w-sm mx-auto">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-gray-300 font-medium">No messages yet.</p>
                  <p className="text-sm text-gray-400 mt-1">Start sharing your thoughts on the forum!</p>
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <MessageCard
                  key={i}
                  userDisplayName={msg.displayName}
                  content={msg.content}
                  date={msg.postedAt}
                />
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
} 