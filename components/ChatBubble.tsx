import { Message } from "@/types/message";

export default function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} my-2`}>
      <div
        className={`px-4 py-2 rounded-2xl max-w-xs text-sm shadow ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-white text-gray-800 border"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}
