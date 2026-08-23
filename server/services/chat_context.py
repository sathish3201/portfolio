"""Builds a compact, keyword-relevant context block from portfolio
content for the chat model. Ported 1:1 from the Node backend's
portfolio-chat.js -- same lesson learned there: a small local model
(Gemma 3 1B, quantized) falls apart on a long, dense system prompt, so
only the entries relevant to what the visitor actually asked are
injected, instead of the entire portfolio every time. This module has
no HTTP or LLM-client concerns (Single Responsibility) -- it only
turns (portfolio data, user message) into a context string.
"""
import re
from typing import Any

STOPWORDS = {
    "the", "a", "an", "and", "or", "but", "is", "are", "was", "were", "be",
    "been", "being", "to", "of", "in", "on", "at", "for", "with", "about",
    "as", "by", "from", "into", "like", "through", "after", "over",
    "between", "out", "against", "during", "without", "before", "under",
    "around", "among", "i", "you", "he", "she", "it", "we", "they", "what",
    "which", "who", "whom", "this", "that", "these", "those", "am", "do",
    "does", "did", "doing", "will", "would", "should", "could", "can",
    "may", "might", "must", "shall", "not", "your", "my", "our", "their",
    "his", "her", "its", "me", "us", "them", "how", "if", "just", "want",
    "sathish", "he's",
}

_NON_ALNUM = re.compile(r"[^a-z0-9\s]")


def extract_keywords(text: str) -> set[str]:
    cleaned = _NON_ALNUM.sub(" ", str(text).lower())
    return {w for w in cleaned.split() if len(w) > 2 and w not in STOPWORDS}


def score_text(text: str, keywords: set[str]) -> int:
    words = extract_keywords(text)
    return sum(1 for w in words if w in keywords)


def build_knowledge_summary(d: dict[str, Any], user_message: str) -> str:
    keywords = extract_keywords(user_message)

    scored_projects = sorted(
        (
            {"item": p, "score": score_text(f"{p['title']} {p['description']} {' '.join(p['tech'])}", keywords)}
            for p in d["projects"]
        ),
        key=lambda x: x["score"],
        reverse=True,
    )
    scored_skills = sorted(
        (
            {"item": s, "score": score_text(f"{s['category']} {' '.join(s['items'])}", keywords)}
            for s in d["skills"]
        ),
        key=lambda x: x["score"],
        reverse=True,
    )
    scored_faq = sorted(
        (
            {"item": f, "score": score_text(f"{f['question']} {f['answer']}", keywords)}
            for f in d["faq"]
        ),
        key=lambda x: x["score"],
        reverse=True,
    )

    first_job = d["experience"][0]
    exp_summary = " ".join(first_job["achievements"])
    cert_score = max(
        [0] + [score_text(f"{c['name']} {c.get('issuer', '')}", keywords) for c in d["certifications"]]
    )
    edu_score = max([0] + [score_text(f"{e['degree']} {e['school']}", keywords) for e in d["education"]])

    relevant_projects = [p["item"] for p in scored_projects if p["score"] > 0][:2]
    relevant_skills = [s["item"] for s in scored_skills if s["score"] > 0][:2]
    relevant_faq = [f["item"] for f in scored_faq if f["score"] > 0][:2]

    projects_text = (
        "\n".join(f"- {p['title']}: {p['description']} Tech: {', '.join(p['tech'])}." for p in relevant_projects)
        if relevant_projects
        else f"- Projects: {', '.join(p['title'] for p in d['projects'])}."
    )

    skills_text = (
        "\n".join(f"- {s['category']}: {', '.join(s['items'])}" for s in relevant_skills)
        if relevant_skills
        else f"- Skill areas: {', '.join(s['category'] for s in d['skills'])}."
    )

    faq_text = (
        "\n".join(f"- Q: {f['question']}\n  A: {f['answer']}" for f in relevant_faq)
        if relevant_faq
        else "- (Ask about projects, skills, experience, or how to get in touch.)"
    )

    # Experience is always included in full -- small enough on its own,
    # and skipping it entirely on a keyword miss would make the
    # assistant unable to answer "where did you work" etc.
    experience_text = f"- {first_job['role']} at {first_job['company']} ({first_job['period']}): {exp_summary}"

    education_text = (
        "\n".join(
            f"- {e['degree']}, {e['school']}" + (f" ({e['period']})" if e.get("period") else "")
            for e in d["education"]
        )
        if edu_score > 0
        else f"- {d['education'][0]['degree']}, {d['education'][0]['school']}"
    )

    certs_text = (
        "\n".join(
            f"- {c['name']}" + (f" ({c['issuer']})" if c.get("issuer") else "") + f", {c['year']}"
            for c in d["certifications"]
        )
        if cert_score > 0
        else f"- {len(d['certifications'])} certifications — ask for specifics."
    )

    return f"""SUMMARY: {d['hero']['summary']}
CONTACT: {d['meta']['email']} | GitHub: {d['meta']['social']['github']} | LinkedIn: {d['meta']['social']['linkedin']} | Location: {d['meta']['location']}

EXPERIENCE:
{experience_text}

PROJECTS:
{projects_text}

SKILLS:
{skills_text}

EDUCATION:
{education_text}

CERTIFICATIONS:
{certs_text}

FREQUENTLY ASKED QUESTIONS:
{faq_text}"""


def build_system_prompt(d: dict[str, Any], user_message: str) -> str:
    return f"""You are the chat assistant on {d['meta']['name']}'s portfolio website. Answer visitor questions using ONLY the information below. Be concise (2-4 sentences unless more detail is clearly needed). Refer to him in the third person. If a question isn't covered by this information, say you don't have that specific detail and point the visitor to his email or LinkedIn. Never invent experience, skills, or projects that aren't listed here.

{build_knowledge_summary(d, user_message)}"""
