"use client";
import { useEffect, useState } from "react";
import MessageCard from "@/components/MessageCard";
import MessageForm from "@/components/MessageForm";
import { apiGet } from "@/utils/api";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Message {
  id: string;
  displayName: string;
  content: string;
  postedAt: string;
}

export default function ForumPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalMembers: 0,
    onlineUsers: 0,
    totalMessages: 0,
    messagesToday: 0,
    communityCreated: new Date()
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  useEffect(() => {
    // Fetch messages
    apiGet("/api/messages/forum")
      .then(res => {
        console.log("Messages loaded:", res);
        setMessages(res.messages || []);
      })
      .catch((err) => {
        console.error("Error loading messages:", err);
        setError(err.message || "Failed to load messages");
        toast.error("Failed to load messages");
      })
      .finally(() => setLoading(false));

    // Fetch community stats
    apiGet("/api/messages/stats")
      .then(res => {
        console.log("Stats loaded:", res);
        setStats({
          totalMembers: res.totalMembers || 0,
          onlineUsers: res.onlineUsers || 0,
          totalMessages: res.totalMessages || 0,
          messagesToday: res.messagesToday || 0,
          communityCreated: new Date(res.communityCreated || new Date())
        });
      })
      .catch((err) => {
        console.error("Error loading stats:", err);
        // Don't show error toast for stats as it's not critical
      });
  }, []);

  // Refresh stats every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      apiGet("/api/messages/stats")
        .then(res => {
          setStats({
            totalMembers: res.totalMembers || 0,
            onlineUsers: res.onlineUsers || 0,
            totalMessages: res.totalMessages || 0,
            messagesToday: res.messagesToday || 0,
            communityCreated: new Date(res.communityCreated || new Date())
          });
        })
        .catch((err) => {
          console.error("Error refreshing stats:", err);
        });
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleMessageSent = (msg: any) => {
    console.log("Message sent:", msg);
    setMessages([{
      id: msg.id || msg.messageId,
      displayName: msg.displayName,
      content: msg.content,
      postedAt: new Date().toISOString(),
    }, ...messages]);
    
    // Refresh stats when a new message is posted
    apiGet("/api/messages/stats")
      .then(res => {
        setStats({
          totalMembers: res.totalMembers || 0,
          onlineUsers: res.onlineUsers || 0,
          totalMessages: res.totalMessages || 0,
          messagesToday: res.messagesToday || 0,
          communityCreated: new Date(res.communityCreated || new Date())
        });
      })
      .catch((err) => {
        console.error("Error refreshing stats:", err);
      });
  };

  // Don't render anything if not authenticated
  if (!user) {
    return null;
  }

  if (error) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="glass-card p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold mb-6 tracking-tight">Forum</h1>
          <div className="text-red-500 py-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            Error: {error}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-2 lg:px-4 py-4 lg:py-6">
        {/* Reddit-style layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content area */}
          <div className="flex-1 max-w-4xl order-1 lg:order-1">
            {/* Header */}
            <div className="mb-6">
              <p className="text-gray-400">Anonymous discussions and thoughts</p>
            </div>
            
            {/* Posts feed */}
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="glass-card p-0 animate-pulse">
                    <div className="flex">
                      <div className="w-12 bg-gray-700 rounded-l-2xl"></div>
                      <div className="flex-1 p-4">
                        <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-gray-700 rounded w-2/3 mb-4"></div>
                        <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {messages.length === 0 ? (
                  <div className="glass-card p-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
                    <p className="text-gray-400 mb-4">Be the first to share your thoughts!</p>
                    <button 
                      onClick={() => document.getElementById('floating-post-btn')?.click()}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-medium transition-colors duration-200"
                    >
                      Create Post
                    </button>
                  </div>
                ) : (
                  messages.map((msg, i) => (
                    <MessageCard
                      key={msg.id}
                      messageId={msg.id}
                      userDisplayName={msg.displayName}
                      content={msg.content}
                      date={msg.postedAt}
                    />
                  ))
                )}
              </div>
            )}
          </div>
          
          {/* Right sidebar */}
          <div className="w-full lg:w-80 space-y-4 order-2 lg:order-2">
            {/* Community info */}
            <div className="glass-card p-3 lg:p-4">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs lg:text-sm">W</span>
                </div>
                <h2 className="font-semibold text-white text-base lg:text-lg">r/WhisPr</h2>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                A secure, anonymous platform for sharing thoughts and discussions. 
                Your identity is protected with anonymous names.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs lg:text-sm">
                <div className="flex flex-col">
                  <span className="text-gray-400">Created</span>
                  <span className="text-white font-medium">{stats.communityCreated.toLocaleDateString()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400">Members</span>
                  <span className="text-white font-medium">{stats.totalMembers}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400">Online</span>
                  <span className="text-green-400 font-medium">● {stats.onlineUsers}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400">Posts Today</span>
                  <span className="text-white font-medium">{stats.messagesToday}</span>
                </div>
              </div>
            </div>
            
            {/* Rules */}
            <div className="glass-card p-3 lg:p-4">
              <h3 className="font-semibold text-white mb-3 text-sm lg:text-base">Community Rules</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start space-x-2">
                  <span className="text-gray-500">1.</span>
                  <span>Be respectful and civil</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-gray-500">2.</span>
                  <span>No personal information</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-gray-500">3.</span>
                  <span>Keep discussions relevant</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-gray-500">4.</span>
                  <span>Report inappropriate content</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating + button for creating posts */}
      <button
        id="floating-post-btn"
        onClick={() => {
          const form = document.getElementById('post-form-modal');
          if (form) {
            form.classList.remove('hidden');
            form.classList.add('fixed', 'inset-0', 'z-50', 'flex', 'items-center', 'justify-center');
          }
        }}
        className="fixed bottom-4 right-4 lg:bottom-6 lg:right-6 w-12 h-12 lg:w-14 lg:h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group z-40"
      >
        <svg className="w-5 h-5 lg:w-6 lg:h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
      
      {/* Modal for creating posts */}
      <div id="post-form-modal" className="hidden">
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 lg:p-4 z-50">
          <div className="glass-card p-4 lg:p-6 w-full max-w-2xl max-h-[90vh] lg:max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Create Post</h2>
              <button
                onClick={() => {
                  const form = document.getElementById('post-form-modal');
                  if (form) {
                    form.classList.add('hidden');
                    form.classList.remove('fixed', 'inset-0', 'z-50', 'flex', 'items-center', 'justify-center');
                  }
                }}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <MessageForm onMessageSent={(msg) => {
              handleMessageSent(msg);
              const form = document.getElementById('post-form-modal');
              if (form) {
                form.classList.add('hidden');
                form.classList.remove('fixed', 'inset-0', 'z-50', 'flex', 'items-center', 'justify-center');
              }
            }} />
          </div>
        </div>
      </div>
    </main>
  );
} 