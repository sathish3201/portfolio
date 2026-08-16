// Calls the Nexoria backend's portfolio-chat endpoint, which forwards to
// the local LLM (Gemma 3 1B via llama.cpp on a phone, tunneled through
// ngrok) server-to-server. This site is static (GitHub Pages) and can't
// hold a secret or call the ngrok tunnel directly from the browser — a
// direct browser call would need HTTP Basic Auth on a cross-origin
// request, which fails the CORS preflight before it even gets sent (the
// preflight itself gets 401'd by ngrok's basic-auth wall, since browsers
// never send credentials on a preflight). Routing through this existing
// backend avoids all of that: normal CORS, no exposed API key.
const API_BASE = import.meta.env.VITE_API_BASE || "https://nexoria-backend-og2p.onrender.com/api";

const UNAVAILABLE_ANSWER =
  "I couldn't reach the AI model right now — it may be offline at the moment. Please try again shortly, or reach out via email/LinkedIn.";

export async function sendChatMessage(message, history) {
  try {
    const res = await fetch(`${API_BASE}/portfolio-chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("Portfolio chat request failed:", res.status, data);
      return UNAVAILABLE_ANSWER;
    }
    return data.reply || UNAVAILABLE_ANSWER;
  } catch (err) {
    console.error("Error calling portfolio chat backend:", err.message);
    return UNAVAILABLE_ANSWER;
  }
}
