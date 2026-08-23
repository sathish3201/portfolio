"""Generates the one-page resume PDF from portfolio data. Ported from
the Node backend's generateResumePdf.js (pdfkit) to reportlab's
Platypus flowable model, which handles text wrapping and inline links
natively via `<a href="...">` markup in Paragraph text -- a better fit
for this content than replicating pdfkit's imperative draw-and-track-y
calls, while producing the same visual layout (header, contact line,
Professional Summary, Core Skills, Professional Experience, Projects
with a "Code | Live Demo" link line, two-column Education |
Certifications footer).
"""
import io
from typing import Any

from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable

PAGE_MARGIN = 0.69 * inch  # 50pt, matches the Node version's PAGE_MARGIN
HEADING_COLOR = colors.HexColor("#111827")
BODY_COLOR = colors.HexColor("#1f2937")
MUTED_COLOR = colors.HexColor("#4b5563")
RULE_COLOR = colors.HexColor("#9ca3af")
LINK_COLOR = colors.HexColor("#2563eb")

_styles = {
    "name": ParagraphStyle("name", fontName="Helvetica-Bold", fontSize=20, leading=24, textColor=HEADING_COLOR, spaceAfter=4),
    "role": ParagraphStyle("role", fontName="Helvetica-Bold", fontSize=10, leading=13, textColor=BODY_COLOR, spaceAfter=2),
    "contact": ParagraphStyle("contact", fontName="Helvetica", fontSize=8.5, textColor=MUTED_COLOR, spaceAfter=8),
    "section": ParagraphStyle("section", fontName="Helvetica-Bold", fontSize=11, textColor=HEADING_COLOR, spaceBefore=8, spaceAfter=4),
    "body": ParagraphStyle("body", fontName="Helvetica", fontSize=9, textColor=BODY_COLOR, alignment=TA_JUSTIFY, leading=11),
    "skillLine": ParagraphStyle("skillLine", fontName="Helvetica", fontSize=9, textColor=BODY_COLOR, leading=11, spaceAfter=1),
    "jobTitle": ParagraphStyle("jobTitle", fontName="Helvetica-Bold", fontSize=9.5, textColor=HEADING_COLOR, leading=12),
    "jobDate": ParagraphStyle("jobDate", fontName="Helvetica", fontSize=8.5, textColor=MUTED_COLOR, alignment=2, leading=12),
    "bullet": ParagraphStyle("bullet", fontName="Helvetica", fontSize=9, textColor=BODY_COLOR, leading=11, leftIndent=10, spaceAfter=1),
    "projectTitle": ParagraphStyle("projectTitle", fontName="Helvetica", fontSize=9, textColor=BODY_COLOR, leading=11),
    "projectLinks": ParagraphStyle("projectLinks", fontName="Helvetica", fontSize=8.5, textColor=MUTED_COLOR, leading=10, spaceAfter=5),
    "footerHeading": ParagraphStyle("footerHeading", fontName="Helvetica-Bold", fontSize=11.5, textColor=HEADING_COLOR, spaceAfter=6),
    "footerName": ParagraphStyle("footerName", fontName="Helvetica-Bold", fontSize=9, textColor=HEADING_COLOR, leading=11),
    "footerDetail": ParagraphStyle("footerDetail", fontName="Helvetica", fontSize=9, textColor=BODY_COLOR, leading=11, spaceAfter=6),
}


def _hr():
    return HRFlowable(width="100%", thickness=0.75, color=RULE_COLOR, spaceAfter=6)


def _link(text: str, url: str, color=LINK_COLOR) -> str:
    return f'<a href="{url}" color="#{color.hexval()[2:]}">{text}</a>'


def generate_resume_pdf(data: dict[str, Any]) -> bytes:
    buf = io.BytesIO()
    doc = SimpleDocTemplate(
        buf, pagesize=LETTER,
        leftMargin=PAGE_MARGIN, rightMargin=PAGE_MARGIN,
        topMargin=PAGE_MARGIN, bottomMargin=PAGE_MARGIN,
    )
    story = []

    meta = data["meta"]
    story.append(Paragraph(meta["name"], _styles["name"]))

    short_tagline = meta["tagline"].replace(" on the frontend — ", " | ").replace(" on the backend.", "")
    story.append(Paragraph(f"{meta['role']} | {short_tagline}", _styles["role"]))

    contact_parts = [
        meta["location"],
        meta["phone"],
        _link(meta["email"], f"mailto:{meta['email']}", MUTED_COLOR),
        _link(meta["social"]["linkedin"].removeprefix("https://").removeprefix("http://"), meta["social"]["linkedin"], MUTED_COLOR),
        _link(meta["social"]["github"].removeprefix("https://").removeprefix("http://"), meta["social"]["github"], MUTED_COLOR),
    ]
    story.append(Paragraph("  |  ".join(contact_parts), _styles["contact"]))

    # Professional Summary
    story.append(Paragraph("Professional Summary", _styles["section"]))
    story.append(_hr())
    story.append(Paragraph(data["resumeSummary"], _styles["body"]))

    # Core Skills
    story.append(Paragraph("Core Skills", _styles["section"]))
    story.append(_hr())
    for group in data["resumeSkillGroups"]:
        story.append(Paragraph(f"<b>{group['label']}:</b> {group['items']}", _styles["skillLine"]))

    # Professional Experience
    story.append(Paragraph("Professional Experience", _styles["section"]))
    story.append(_hr())
    for job in data["experience"]:
        date_text = f"{job['period']} | {job['location']}"
        title_row = Table(
            [[Paragraph(f"{job['role']} — {job['company']}", _styles["jobTitle"]), Paragraph(date_text, _styles["jobDate"])]],
            colWidths=[doc.width * 0.68, doc.width * 0.32],
        )
        title_row.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
        ]))
        story.append(title_row)
        for bullet in job.get("resumeAchievements") or job["achievements"]:
            story.append(Paragraph(f"•&nbsp;&nbsp;{bullet}", _styles["bullet"]))
        story.append(Spacer(1, 4))

    # Projects
    story.append(Paragraph("Projects (Full Stack &amp; AI, on GitHub)", _styles["section"]))
    story.append(_hr())
    for project in data["projects"]:
        has_demo = bool(project.get("demo")) and project["demo"] != "#"
        description = project.get("resumeDescription") or project["description"]
        story.append(Paragraph(f"<b>{project['title']} —</b> {description}", _styles["projectTitle"]))

        link_parts = []
        if project.get("github"):
            link_parts.append(_link("Code", project["github"]))
        if has_demo:
            link_parts.append(_link("Live Demo", project["demo"]))
        if link_parts:
            story.append(Paragraph("  |  ".join(link_parts), _styles["projectLinks"]))
        else:
            story.append(Spacer(1, 5))

    # Education | Certifications, two columns side by side
    story.append(Spacer(1, 6))
    edu_col = [Paragraph("Education", _styles["footerHeading"]), _hr()]
    for edu in data["education"]:
        edu_col.append(Paragraph(edu["degree"], _styles["footerName"]))
        edu_col.append(Paragraph(f"{edu['school']} | {edu['period']}", _styles["footerDetail"]))

    cert_col = [Paragraph("Certifications", _styles["footerHeading"]), _hr()]
    for cert in data["certifications"]:
        cert_url = cert.get("url", "").strip()
        # Same link mechanism as project/contact links above: each
        # certification carries a real verification URL in the data
        # (Google Drive scan, issuer's own certificate page) that
        # neither this generator's Node predecessor nor an earlier pass
        # of this port rendered as clickable -- fixed here to match how
        # Education.jsx already links certifications on the live site.
        name_text = _link(cert["name"], cert_url) if cert_url else cert["name"]
        cert_col.append(Paragraph(name_text, _styles["footerName"]))
        suffix = f"{cert['issuer']} — {cert['year']}" if cert.get("issuer") else str(cert["year"])
        cert_col.append(Paragraph(suffix, _styles["footerDetail"]))

    footer_table = Table([[edu_col, cert_col]], colWidths=[doc.width * 0.48, doc.width * 0.48])
    footer_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (0, 0), 15),
        ("RIGHTPADDING", (1, 0), (1, 0), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    story.append(footer_table)

    doc.build(story)
    return buf.getvalue()
