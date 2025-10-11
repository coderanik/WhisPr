import { useState } from "react";
import { useAuth } from "@/components/AuthContext";
import toast from "react-hot-toast";
import { apiPost, apiGet } from "@/utils/api";

interface MessageFormProps {
  onMessageSent?: (msg: any) => void;
}

export default function MessageForm({ onMessageSent }: MessageFormProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();

  // Early return if no user - but render a message instead of null
  if (!user) {
    return (
      <div className="w-full max-w-lg mx-auto mb-8 text-center text-gray-300 glass-card p-6">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
          <span className="font-medium">Please log in to post messages.</span>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiPost("/api/messages/create", { content }, token || undefined);
      setContent("");
      toast.success("Message sent!");
      // Fetch the latest message from the forum endpoint
      const res = await apiGet("/api/messages/forum");
      if (res.messages && res.messages.length > 0) {
        onMessageSent?.(res.messages[0]);
      }
    } catch (err: any) {
      toast.error(err.message || err.error || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      <div className="relative">
        <textarea
          className="w-full resize-none min-h-[100px] lg:min-h-[120px] text-sm lg:text-base bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl p-3 lg:p-4 focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all duration-300 placeholder-gray-400 text-gray-200"
          placeholder="What's on your mind? Share your thoughts anonymously..."
          value={content}
          onChange={e => setContent(e.target.value)}
          required
          disabled={loading}
          maxLength={1000}
        />
        <div className="absolute bottom-2 right-2 text-xs text-gray-300 bg-gray-800/50 px-2 py-1 rounded-full">
          {content.length}/1000
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Posting as u/{user?.anonymousName}</span>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 lg:px-6 py-2 font-semibold rounded-full transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl group w-full sm:w-auto"
          disabled={loading || !content.trim()}
        >
          <span className="flex items-center justify-center space-x-2">
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Posting...</span>
              </>
            ) : (
              <>
                <span>Post</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </>
            )}
          </span>
        </button>
      </div>
    </form>
  );
} 