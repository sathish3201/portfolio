import { useRef, useState, lazy, Suspense } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { sendChatMessage } from "../lib/chatApi.js";

const ChatLoadingOrb = lazy(() => import("./3d/ChatLoadingOrb"));
const MessageOrb = lazy(() => import("./3d/MessageOrb"));

const GREETING = {
  role: "assistant",
  content: "Hi! Ask me about Sathish's projects, skills, experience, or how to get in touch.",
};

const MAX_TILT_DEG = 6;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [dragging, setDragging] = useState(false);

  const panelRef = useRef(null);

  // Header-driven tilt: rotating the whole message list would make text
  // unreadable, so the 3D pointer-tilt is scoped to the header strip only
  // (the same surface used to drag the window), while the window's
  // position is moved via Framer Motion's native `drag` on the outer
  // container.
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springConfig = { stiffness: 200, damping: 20, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [MAX_TILT_DEG, -MAX_TILT_DEG]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-MAX_TILT_DEG, MAX_TILT_DEG]), springConfig);

  function handleHeaderMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }

  function handleHeaderMouseLeave() {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || thinking) return;

    // GREETING is a canned UI bubble, not a real conversation turn — the
    // model's chat template (Gemma) requires the turn sequence to start
    // with "user" and strictly alternate user/assistant from there.
    // Sending GREETING as history makes every first message start with
    // "assistant", which the template hard-rejects with a 400. Exclude
    // it from what gets sent as history (by reference — it's a stable
    // module-level constant, so this reliably matches only the greeting
    // bubble and nothing else).
    const history = messages
      .filter((m) => m !== GREETING)
      .map(({ role, content }) => ({ role, content }));
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
        <motion.div
          ref={panelRef}
          drag
          dragMomentum={false}
          dragElastic={0.08}
          onDragStart={() => setDragging(true)}
          onDragEnd={() => setDragging(false)}
          style={{ perspective: 800 }}
          className={`glass-panel flex h-[440px] w-[320px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl shadow-2xl ${
            dragging ? "cursor-grabbing" : ""
          }`}
        >
          <motion.div
            onMouseMove={handleHeaderMouseMove}
            onMouseLeave={handleHeaderMouseLeave}
            style={{ rotateX, rotateY, transformPerspective: 800 }}
            className={`flex items-center justify-between border-b border-white/10 px-4 py-3 ${
              dragging ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            <span className="text-gradient font-semibold">Ask about Sathish</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="cursor-pointer text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </motion.div>

          <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
            {messages.map((m, i) => {
              // Each orb is its own WebGL context — browsers cap how many
              // can be alive at once (~8-16 depending on browser). Only
              // the most recent messages get a live 3D orb; older ones
              // fall back to a flat dot so a long conversation can't
              // exhaust the context limit or silently break.
              const isRecent = i >= messages.length - 6;
              const accent = m.role === "user" ? "cyan" : "purple";
              return (
                <div
                  key={i}
                  className={`flex items-end gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full">
                    {isRecent ? (
                      <Suspense fallback={null}>
                        <MessageOrb accent={accent} />
                      </Suspense>
                    ) : (
                      <div
                        className={`h-full w-full rounded-full ${
                          accent === "cyan" ? "bg-cyan-400/60" : "bg-purple-400/60"
                        }`}
                      />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-cyan-500/20 text-slate-100"
                        : "border border-white/10 bg-white/5 text-slate-300"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              );
            })}
            {thinking && (
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-400">
                <div className="h-6 w-6 shrink-0">
                  <Suspense fallback={null}>
                    <ChatLoadingOrb />
                  </Suspense>
                </div>
                <span>Thinking</span>
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
        </motion.div>
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
