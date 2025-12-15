"use client";

import { useRef } from "react";

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
      alert("Speech Recognition not supported.");
      return;
    }

    window.speechSynthesis.cancel(); // prevent feedback loop

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript.trim()) {
        onTranscript(finalTranscript.trim());
      }

      recognition.stop();
      setListening(false);
    };

    recognition.onerror = () => setListening(false);

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
      {listening && (
        <span className="text-sm text-green-500 animate-pulse">
          🎙️ Listening...
        </span>
      )}

      <div className="flex gap-4">
        <button
          onClick={startListening}
          disabled={listening}
          className={`px-4 py-2 rounded text-white font-medium ${
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
          className={`px-4 py-2 rounded font-medium ${
            listening
              ? "bg-red-600 text-white"
              : darkMode
              ? "bg-gray-700 text-gray-400"
              : "bg-gray-300 text-gray-500"
          }`}
        >
          Stop
        </button>
      </div>
    </div>
  );
}
