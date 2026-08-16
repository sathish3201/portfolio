// Calls a local LLM (Gemma 3 1B / Phi-3-mini via Ollama) directly from the
// browser, through an ngrok tunnel exposing your laptop/phone's FastAPI
// wrapper. There's no backend on this static (GitHub Pages) site, so this
// request goes straight from the visitor's browser to your ngrok URL —
// see README notes on the tradeoffs of that (API key visible in the
// browser, CORS required on the server side, only works while your
// tunnel is up).
import PORTFOLIO_DATA from "../data.js";

const MODEL_URL = import.meta.env.VITE_LOCAL_MODEL_URL;
const MODEL_API_KEY = import.meta.env.VITE_LOCAL_MODEL_API_KEY;
const MODEL_NAME = import.meta.env.VITE_LOCAL_MODEL_NAME || "gemma3:1b";

function buildKnowledgeSummary() {
  const d = PORTFOLIO_DATA;

  const experienceText = d.experience
    .map((e) => `- ${e.role} at ${e.company} (${e.period}): ${e.achievements.join(" ")}`)
    .join("\n");

  const projectsText = d.projects
    .map((p) => `- ${p.title}: ${p.description} Tech: ${p.tech.join(", ")}. GitHub: ${p.github || "N/A"}`)
    .join("\n");

  const skillsText = d.skills.map((s) => `- ${s.category}: ${s.items.join(", ")}`).join("\n");

  const certsText = d.certifications
    .map((c) => `- ${c.name}${c.issuer ? ` (${c.issuer})` : ""}, ${c.year}`)
    .join("\n");

  const educationText = d.education.map((e) => `- ${e.degree}, ${e.school} (${e.period})`).join("\n");

  return `NAME: ${d.meta.name}
ROLE: ${d.meta.role}
SUMMARY: ${d.hero.summary}
CONTACT: ${d.meta.email} | GitHub: ${d.meta.social.github} | LinkedIn: ${d.meta.social.linkedin}
LOCATION: ${d.meta.location}

ABOUT:
${d.about.paragraphs.join("\n")}

EXPERIENCE:
${experienceText}

PROJECTS:
${projectsText}

SKILLS:
${skillsText}

EDUCATION:
${educationText}

CERTIFICATIONS:
${certsText}`;
}

function buildSystemPrompt() {
  return `You are the chat assistant on ${PORTFOLIO_DATA.meta.name}'s portfolio website. Answer visitor questions using ONLY the information below. Be concise (2-4 sentences unless more detail is clearly needed). Refer to him in the third person. If a question isn't covered by this information, say you don't have that specific detail and point the visitor to his email or LinkedIn. Never invent experience, skills, or projects that aren't listed here.

${buildKnowledgeSummary()}`;
}

const UNCONFIGURED_ANSWER =
  "The AI chat isn't configured on this deployment yet. Feel free to reach out directly via email or LinkedIn (see the top of this site).";

const UNAVAILABLE_ANSWER =
  "I couldn't reach the AI model right now — it may be offline at the moment. Please try again shortly, or reach out via email/LinkedIn.";

export async function sendChatMessage(message, history) {
  if (!MODEL_URL || !MODEL_API_KEY) {
    console.warn("VITE_LOCAL_MODEL_URL / VITE_LOCAL_MODEL_API_KEY not set — chat is disabled.");
    return UNCONFIGURED_ANSWER;
  }

  const priorTurns = Array.isArray(history)
    ? history.filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    : [];

  const messages = [
    { role: "system", content: buildSystemPrompt() },
    ...priorTurns,
    { role: "user", content: message },
  ];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);

    const res = await fetch(`${MODEL_URL.replace(/\/$/, "")}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MODEL_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages,
        temperature: 0.4,
        max_tokens: 300,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.error("Local model request failed:", res.status);
      return UNAVAILABLE_ANSWER;
    }

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();
    return reply || UNAVAILABLE_ANSWER;
  } catch (err) {
    console.error("Error calling local model:", err.message);
    return UNAVAILABLE_ANSWER;
  }
}
