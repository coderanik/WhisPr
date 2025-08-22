"use client";
import { useEffect, useState } from "react";
import MessageCard from "@/components/MessageCard";
import MessageForm from "@/components/MessageForm";
import { apiGet } from "@/utils/api";
import { useToast } from "@/components/Toast";

interface Message {
  displayName: string;
  content: string;
  postedAt: string;
}

export default function ForumPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    apiGet("/api/messages/forum")
      .then(res => {
        console.log("Messages loaded:", res);
        setMessages(res.messages || []);
      })
      .catch((err) => {
        console.error("Error loading messages:", err);
        setError(err.message || "Failed to load messages");
        showToast("Failed to load messages", "error");
      })
      .finally(() => setLoading(false));
  }, [showToast]);

  const handleMessageSent = (msg: any) => {
    console.log("Message sent:", msg);
    setMessages([{
      displayName: msg.displayName,
      content: msg.content,
      postedAt: new Date().toISOString(),
    }, ...messages]);
  };

  if (error) {
    return (
      <main>
        <h1 className="text-3xl font-bold mb-6 text-center tracking-tight">Forum</h1>
        <div className="text-center text-red-500 py-8">
          Error: {error}
        </div>
      </main>
    );
  }

  return (
    <main>
      <h1 className="text-3xl font-bold mb-6 text-center tracking-tight">Forum</h1>
      <MessageForm onMessageSent={handleMessageSent} />
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div id="messages-list" className="flex flex-col gap-2">
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