"use client";

import { useRef } from "react";

/**
 * Browser SpeechRecognition constructor
 * (safe for SSR)
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

  const startListening = () => {
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    // Stop TTS to prevent feedback loop
    window.speechSynthesis.cancel();

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      onTranscript(text);

      recognition.stop();
      recognitionRef.current = null;
      setListening(false);
    };

    recognition.onerror = () => {
      recognitionRef.current = null;
      setListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
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
