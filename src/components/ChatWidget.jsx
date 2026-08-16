import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { sendChatMessage } from "../lib/chatApi.js";

const GREETING = {
  role: "assistant",
  content: "Hi! Ask me about Sathish's projects, skills, experience, or how to get in touch.",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || thinking) return;

    const history = messages.map(({ role, content }) => ({ role, content }));
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setThinking(true);

    const reply = await sendChatMessage(text, history);
    setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    setThinking(false);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="glass-panel flex h-[440px] w-[320px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <span className="text-gradient font-semibold">Ask about Sathish</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "ml-auto bg-cyan-500/20 text-slate-100"
                    : "border border-white/10 bg-white/5 text-slate-300"
                }`}
              >
                {m.content}
              </div>
            ))}
            {thinking && (
              <div className="max-w-[85%] rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-400">
                Thinking…
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="flex gap-2 border-t border-white/10 p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
              disabled={thinking}
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={thinking || !input.trim()}
              aria-label="Send"
              className="flex items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 px-3 text-white disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 px-5 py-3 font-semibold text-white shadow-xl transition-transform hover:scale-105"
        >
          <MessageCircle size={18} />
          Chat
        </button>
      )}
    </div>
  );
}
