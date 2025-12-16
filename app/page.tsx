"use client";

import { useState, useRef, useEffect } from "react";
import ChatBubble from "@/components/ChatBubble";
import MicControls from "@/components/MicControls";
import { Message } from "@/types/message";
import { getBotResponse } from "@/utils/qaMatcher";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hello! How can I help you today?" },
  ]);

  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [language, setLanguage] = useState("en-US");
  const [darkMode, setDarkMode] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTranscript = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { role: "user", text };
    const botText = getBotResponse(text);
    const botMsg: Message = { role: "assistant", text: botText };

    setMessages((prev) => [...prev, userMsg, botMsg]);

    if (!listening) speak(botText);
  };

  function speak(text: string) {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">

      {/* 🔵 Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/bg-concierge.png')",
          filter: darkMode
            ? "brightness(0.6)"
            : "brightness(1.2) contrast(1.05)",
        }}
      />

      {/* 🌈 Animated Gradient Overlay */}
      <div
        className={`absolute inset-0 animate-gradient ${
          darkMode
            ? "bg-[linear-gradient(120deg,rgba(0,0,0,0.7),rgba(30,41,59,0.7),rgba(0,0,0,0.7))]"
            : "bg-[linear-gradient(120deg,rgba(255,255,255,0.45),rgba(219,234,254,0.45),rgba(255,255,255,0.45))]"
        }`}
      />

      {/* 🪟 Glass Card */}
      <div
        className={`relative z-10 w-full max-w-md rounded-2xl shadow-2xl p-5 backdrop-blur-xl transition ${
          darkMode ? "bg-slate-900/85 text-white" : "bg-white/90 text-gray-800"
        }`}
      >
        {/* Header */}
        <h1 className="text-xl font-bold text-center mb-3">
          Voice Concierge
        </h1>

        {/* Controls */}
        <div className="flex justify-between items-center mb-3 gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={`px-3 py-1 rounded border shadow-sm text-sm ${
              darkMode
                ? "bg-gray-800 text-white border-gray-600"
                : "bg-white text-black border-gray-300"
            }`}
          >
            <option value="en-US">English</option>
            <option value="hi-IN">Hindi</option>
            <option value="kn-IN">Kannada</option>
          </select>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-3 py-1 rounded border shadow-sm text-sm ${
              darkMode
                ? "bg-gray-800 text-white border-gray-600"
                : "bg-white text-black border-gray-300"
            }`}
          >
            {darkMode ? "🌞 Light" : "🌙 Dark"}
          </button>
        </div>

        {/* Speaking Indicator */}
        {speaking && (
          <div className="text-center text-blue-500 text-sm animate-pulse mb-2">
            🔊 Assistant is speaking...
          </div>
        )}

        {/* Chat Box */}
        <div
          className={`h-[400px] overflow-y-auto rounded-xl p-4 border transition ${
            darkMode
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-gray-300 shadow-inner"
          }`}
        >
          {messages.map((msg, i) => (
            <ChatBubble key={i} message={msg} />
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Mic Controls */}
        <div className="mt-4">
          <MicControls
            onTranscript={handleTranscript}
            listening={listening}
            setListening={setListening}
            language={language}
            darkMode={darkMode}
          />
        </div>
      </div>

      {/* 🎨 Gradient Animation CSS */}
      <style jsx global>{`
        .animate-gradient {
          background-size: 300% 300%;
          animation: gradientMove 12s ease infinite;
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </main>
  );
}
