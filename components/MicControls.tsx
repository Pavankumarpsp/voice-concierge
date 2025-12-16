"use client";

import { useRef } from "react";

/**
 * Cross-browser SpeechRecognition constructor
 */
const SpeechRecognition =
  typeof window !== "undefined"
    ? window.SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

type MicControlsProps = {
  onTranscript: (text: string) => void;
  listening: boolean;
  setListening: (v: boolean) => void;
  language: string;
  darkMode: boolean;
};

export default function MicControls({
  onTranscript,
  listening,
  setListening,
  language,
  darkMode,
}: MicControlsProps) {
  const recognitionRef = useRef<any>(null);
  const handledRef = useRef(false); // 🔒 prevents duplicate Chrome triggers

  const startListening = () => {
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    // Reset guards
    handledRef.current = false;

    // 🚫 Stop any ongoing TTS (prevents feedback loop)
    window.speechSynthesis.cancel();

    const recognition = new SpeechRecognition();
    recognition.lang = language;          // 🌍 Language support
    recognition.interimResults = false;
    recognition.continuous = false;       // ✅ Listen ONCE
    recognition.maxAlternatives = 1;       // ⚡ Chrome speed optimization

    recognition.onresult = (event: any) => {
      if (handledRef.current) return;

      const result = event.results[event.resultIndex];

      // Only process FINAL result
      if (!result.isFinal) return;

      handledRef.current = true;

      const text = result[0].transcript.trim();

      // 🚀 CRITICAL CHROME FIX
      recognition.abort(); // faster & prevents repeat firing
      recognitionRef.current = null;
      setListening(false);

      onTranscript(text);
    };

    recognition.onerror = () => {
      recognition.abort();
      recognitionRef.current = null;
      setListening(false);
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      setListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    setListening(false);
  };

  return (
    <div className="flex flex-col items-center gap-3 mt-4">
      {/* Listening indicator */}
      {listening && (
        <span className="text-sm text-green-500 animate-pulse">
          🎙️ Listening...
        </span>
      )}

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={startListening}
          disabled={listening}
          className={`px-4 py-2 rounded text-white font-medium transition ${
            listening
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          Start
        </button>

        <button
          onClick={stopListening}
          disabled={!listening}
          className={`px-4 py-2 rounded font-medium transition ${
            listening
              ? "bg-red-600 text-white hover:bg-red-700"
              : darkMode
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Stop
        </button>
      </div>
    </div>
  );
}
