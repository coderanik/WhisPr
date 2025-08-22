import { useState } from "react";
import { useAuth } from "@/components/AuthContext";
import { useToast } from "@/components/Toast";
import { apiPost, apiGet } from "@/utils/api";

interface MessageFormProps {
  onMessageSent?: (msg: any) => void;
}

export default function MessageForm({ onMessageSent }: MessageFormProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();
  const { showToast } = useToast();

  // Early return if no user - but render a message instead of null
  if (!user) {
    return (
      <div className="w-full max-w-lg mx-auto mb-8 text-center text-gray-500 bg-white/80 rounded-xl shadow p-4 border border-blue-100">
        Please log in to post messages.
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiPost("/api/messages/create", { content }, token || undefined);
      setContent("");
      showToast("Message sent!", "success");
      // Fetch the latest message from the forum endpoint
      const res = await apiGet("/api/messages/forum");
      if (res.messages && res.messages.length > 0) {
        onMessageSent?.(res.messages[0]);
      }
    } catch (err: any) {
      showToast(err.message || err.error || "Failed to send message", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto mb-8 flex flex-col gap-3 bg-white/80 rounded-xl shadow p-4 border border-blue-100">
      <textarea
        className="border-2 border-blue-200 rounded-lg p-3 w-full resize-none min-h-[60px] text-base focus:outline-none focus:border-blue-400 transition"
        placeholder="Type your message..."
        value={content}
        onChange={e => setContent(e.target.value)}
        required
        disabled={loading}
        maxLength={1000}
      />
      <button
        type="submit"
        className="bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg px-6 py-2 font-semibold text-lg shadow hover:from-blue-500 hover:to-blue-700 transition disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </form>
  );
} 