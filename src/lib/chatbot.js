import PORTFOLIO_DATA from "../data.js";

const FAQ_ENTRIES = [
  {
    keywords: ["freelance", "available", "hire", "open to work", "opportunities"],
    answer:
      "Sathish is currently working full-time at Accenture but is open to freelance/collab opportunities and new roles — best way to reach out is via email or LinkedIn.",
  },
  {
    keywords: ["contact", "reach", "email", "linkedin", "get in touch"],
    answer: `You can reach Sathish at ${PORTFOLIO_DATA.meta.email} or on LinkedIn: ${PORTFOLIO_DATA.meta.social.linkedin}`,
  },
  {
    keywords: ["github", "code", "source", "repo"],
    answer: `All of Sathish's project source code is on GitHub: ${PORTFOLIO_DATA.meta.social.github}`,
  },
  {
    keywords: ["resume", "cv"],
    answer: "You can download Sathish's resume from the link at the top of this site.",
  },
  {
    keywords: ["strongest", "best skill", "specialty", "expert"],
    answer:
      "Sathish's core strength is full-stack development (React + Node.js) combined with production Oracle PL/SQL / SQL performance tuning experience from his Accenture role — a mix of app-building and production data-support discipline.",
  },
  {
    keywords: ["experience", "years", "background", "work history"],
    answer: `${PORTFOLIO_DATA.meta.name} has ${PORTFOLIO_DATA.about.stats[0].value} years of experience, currently as a ${PORTFOLIO_DATA.experience[0].role} at ${PORTFOLIO_DATA.experience[0].company}.`,
  },
];

function buildKnowledgeBase() {
  const entries = [];

  entries.push({
    keywords: [PORTFOLIO_DATA.meta.name, PORTFOLIO_DATA.meta.role, PORTFOLIO_DATA.hero.summary].join(" "),
    answer: PORTFOLIO_DATA.hero.summary,
  });

  for (const p of PORTFOLIO_DATA.about.paragraphs) {
    entries.push({ keywords: p, answer: p });
  }

  for (const exp of PORTFOLIO_DATA.experience) {
    entries.push({
      keywords: [exp.role, exp.company, ...exp.achievements].join(" "),
      answer: `${exp.role} at ${exp.company} (${exp.period}): ${exp.achievements[0]}`,
    });
  }

  for (const proj of PORTFOLIO_DATA.projects) {
    entries.push({
      keywords: [proj.title, proj.description, ...proj.tech].join(" "),
      answer: `${proj.title}: ${proj.description} Tech: ${proj.tech.join(", ")}. GitHub: ${proj.github}`,
    });
  }

  for (const skill of PORTFOLIO_DATA.skills) {
    entries.push({
      keywords: [skill.category, ...skill.items].join(" "),
      answer: `${skill.category}: ${skill.items.join(", ")}.`,
    });
  }

  for (const cert of PORTFOLIO_DATA.certifications) {
    entries.push({
      keywords: [cert.name, cert.issuer].join(" "),
      answer: `${cert.name}${cert.issuer ? ` (${cert.issuer})` : ""}, ${cert.year}.`,
    });
  }

  for (const faq of FAQ_ENTRIES) {
    entries.push({ keywords: faq.keywords.join(" "), answer: faq.answer, priority: 2 });
  }

  return entries.map((e) => ({ ...e, priority: e.priority || 1, tokens: tokenize(e.keywords) }));
}

const STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "do", "does", "you", "your", "i", "we", "what",
  "how", "can", "will", "to", "of", "for", "in", "on", "and", "or", "with",
]);

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

const KNOWLEDGE_BASE = buildKnowledgeBase();

// Inverse document frequency: a token that appears in many entries (e.g.
// "skills", the shared word in every skill-category title) is a weak signal
// and contributes less to a match than a rare, distinctive token (e.g.
// "database"). This stops generic overlapping words from beating a more
// specific match.
const DOCUMENT_FREQUENCY = new Map();
for (const entry of KNOWLEDGE_BASE) {
  for (const token of new Set(entry.tokens)) {
    DOCUMENT_FREQUENCY.set(token, (DOCUMENT_FREQUENCY.get(token) || 0) + 1);
  }
}

function tokenWeight(token) {
  const df = DOCUMENT_FREQUENCY.get(token) || 1;
  return 1 / df;
}

const FALLBACK_ANSWER =
  "I don't have a specific answer for that. Try asking about Sathish's projects, skills, experience, or how to get in touch.";

export function findAnswer(message) {
  const messageTokens = tokenize(message);
  if (messageTokens.length === 0) return FALLBACK_ANSWER;

  let best = null;
  let bestScore = 0;

  for (const entry of KNOWLEDGE_BASE) {
    const matched = messageTokens.filter((t) => entry.tokens.includes(t));
    if (matched.length === 0) continue;

    const score = matched.reduce((sum, t) => sum + tokenWeight(t), 0) * entry.priority;
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  return best ? best.answer : FALLBACK_ANSWER;
}
