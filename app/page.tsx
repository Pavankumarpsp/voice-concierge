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

  // Mic, speaking & UI state
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [language, setLanguage] = useState("en-US");
  const [darkMode, setDarkMode] = useState(false);

  // Auto-scroll reference
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTranscript = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { role: "user", text };
    const botText = getBotResponse(text);
    const botMsg: Message = { role: "assistant", text: botText };

    setMessages((prev) => [...prev, userMsg, botMsg]);

    // Prevent STT → TTS feedback loop
    if (!listening) {
      speak(botText);
    }
  };

  function speak(text: string) {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }

  return (
    <main
      className={`min-h-screen flex items-center justify-center p-4 transition ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 to-black"
          : "bg-gradient-to-br from-slate-100 to-slate-200"
      }`}
    >
      {/* Glassmorphism Card */}
      <div
        className={`w-full max-w-md rounded-2xl shadow-2xl p-5 backdrop-blur-md transition ${
          darkMode ? "bg-slate-900/90 text-white" : "bg-white"
        }`}
      >
        {/* Header */}
        <h1
          className={`text-xl font-bold text-center mb-3 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Voice Concierge
        </h1>

        {/* Top Controls */}
        <div className="flex justify-between items-center mb-3 gap-2">
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={`text-sm px-3 py-1 rounded border shadow-sm transition ${
              darkMode
                ? "bg-gray-800 text-white border-gray-600"
                : "bg-white text-black border-gray-300"
            }`}
          >
            <option value="en-US">English</option>
            <option value="hi-IN">Hindi</option>
            <option value="kn-IN">Kannada</option>
          </select>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`text-sm px-3 py-1 rounded border shadow-sm transition ${
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

        {/* Chat Container (FIXED VISIBILITY) */}
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

        {/* Microphone Controls */}
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
    </main>
  );
}
