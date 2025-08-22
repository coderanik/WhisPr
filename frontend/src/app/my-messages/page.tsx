"use client";
import { useEffect, useState } from "react";
import MessageCard from "@/components/MessageCard";
import { apiGet } from "@/utils/api";
import { useAuth } from "@/components/AuthContext";
import { useToast } from "@/components/Toast";

interface Message {
  displayName: string;
  content: string;
  postedAt: string;
}

export default function MyMessagesPage() {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    if (!user) return;
    apiGet("/api/messages/my-messages", token || undefined)
      .then(res => setMessages(res.messages))
      .catch(() => showToast("Failed to load your messages", "error"))
      .finally(() => setLoading(false));
  }, [user, token, showToast]);

  if (!user) {
    return <div className="text-center py-8">Please log in to view your messages.</div>;
  }

  return (
    <main>
      <h1 className="text-3xl font-bold mb-6 text-center tracking-tight">My Messages</h1>
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div id="my-messages-list" className="flex flex-col gap-2">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500">No messages yet.</div>
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
    </main>
  );
} 