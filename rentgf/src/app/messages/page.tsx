"use client";

import { useState, useEffect } from "react";
import { Loader2, MessageSquare, Send, User } from "lucide-react";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "other", content: "Hello! How can I help you today?", time: "10:00 AM", read: true },
    { id: 2, sender: "me", content: "Hi! I'm interested in booking.", time: "10:05 AM", read: true },
    { id: 3, sender: "other", content: "Great! I'd love to hear more. What are you looking for?", time: "10:06 AM", read: false },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: messages.length + 1,
      sender: "me",
      content: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: true,
    };
    setMessages([...messages, newMsg]);
    setInput("");

    // Simulate reply
    setLoading(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, sender: "other", content: "Thank you for your message! I'll get back to you shortly.", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), read: true },
      ]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>

      <div className="bg-white rounded-2xl border overflow-hidden flex flex-col h-[600px]">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${msg.sender === "me" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-900"}`}>
                <p className="text-sm">{msg.content}</p>
                <p className={`text-xs mt-1 ${msg.sender === "me" ? "text-indigo-200" : "text-gray-400"}`}>{msg.time}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-4 py-2.5">
                <div className="flex gap-1"><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" /><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} /><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} /></div>
              </div>
            </div>
          )}
        </div>
        <div className="border-t p-4">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <button onClick={sendMessage} className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
