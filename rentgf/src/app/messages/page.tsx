"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Loader2, Send, MessageSquare, ArrowLeft } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  sender: { displayName: string };
}

interface Conversation {
  id: string;
  participants: { userId: string; user: { displayName: string; avatarUrl: string | null } }[];
  messages: Message[];
  updatedAt: string;
}

function getToken() {
  if (typeof window === "undefined") return "";
  return document.cookie.split("; ").find((r) => r.startsWith("token="))?.split("=")[1] || "";
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchConversations = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch("/api/chat/conversations", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setConversations(data.conversations || []);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  const fetchMessages = useCallback(async (convId: string) => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`/api/chat/conversation?id=${convId}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setMessages(data.messages || []);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetchConversations();
    const token = getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserId(payload.id || "");
      } catch { /* ignore */ }
    }
  }, [fetchConversations]);

  useEffect(() => {
    if (!activeConvId) return;
    fetchMessages(activeConvId);
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => fetchMessages(activeConvId), 3000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [activeConvId, fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !activeConvId) return;
    const token = getToken();
    setSending(true);
    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ conversationId: activeConvId, content: input.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, data.message]);
        setInput("");
      }
    } catch { /* ignore */ } finally {
      setSending(false);
    }
  };

  const getOtherParticipant = (conv: Conversation) =>
    conv.participants.find((p) => p.userId !== userId)?.user;

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      <div className="bg-white rounded-2xl border overflow-hidden flex h-[600px]">
        {/* Sidebar */}
        <div className={`w-full md:w-72 border-r flex-shrink-0 flex flex-col ${ activeConvId ? "hidden md:flex" : "flex" }`}>
          <div className="p-4 border-b">
            <p className="font-semibold text-sm text-gray-500">{conversations.length} Conversations</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 p-6 text-center">
                <MessageSquare className="w-10 h-10 mb-3 text-gray-300" />
                <p className="text-sm">No conversations yet.</p>
              </div>
            ) : (
              conversations.map((conv) => {
                const other = getOtherParticipant(conv);
                const last = conv.messages?.[0];
                return (
                  <button key={conv.id} onClick={() => setActiveConvId(conv.id)}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors border-b ${ activeConvId === conv.id ? "bg-indigo-50" : "" }`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center font-semibold text-indigo-600">
                        {other?.displayName?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{other?.displayName || "Unknown"}</p>
                        {last && <p className="text-xs text-gray-400 truncate">{last.content}</p>}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className={`flex-1 flex flex-col ${ !activeConvId ? "hidden md:flex" : "flex" }`}>
          {!activeConvId ? (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Select a conversation</p>
              </div>
            </div>
          ) : (
            <>
              <div className="p-4 border-b flex items-center gap-3">
                <button className="md:hidden" onClick={() => setActiveConvId(null)}>
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center font-semibold text-indigo-600 text-sm">
                  {getOtherParticipant(conversations.find((c) => c.id === activeConvId)!)?.["displayName"]?.[0]?.toUpperCase()}
                </div>
                <p className="font-semibold">{getOtherParticipant(conversations.find((c) => c.id === activeConvId)!)?.["displayName"]}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${ msg.senderId === userId ? "justify-end" : "justify-start" }`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${ msg.senderId === userId ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-900" }`}>
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${ msg.senderId === userId ? "text-indigo-200" : "text-gray-400" }`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <input value={input} onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                  <button onClick={sendMessage} disabled={sending || !input.trim()}
                    className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                    {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
