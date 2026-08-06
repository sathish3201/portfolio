/**
 * All portfolio content lives here. Sourced from Chakali Sathish's resume.
 */
const PORTFOLIO_DATA = {
  meta: {
    name: "Sathish Chakali",
    role: "PL/SQL & ETL Developer",
    tagline: "I build and support reliable Oracle data warehouse pipelines.",
    email: "sathishchakali1023@gmail.com",
    location: "Hyderabad, India",
    resumeUrl: "/portfolio/Sathish_Chakali_Resume.pdf",
    social: {
      github: "https://github.com/sathish3201",
      linkedin: "https://linkedin.com/in/sathish-chakali-91221b320",
    },
  },

  hero: {
    greeting: "Hi, my name is",
    roles: [
      "PL/SQL Developer",
      "ETL & Data Warehouse Support",
      "Oracle Performance Tuning",
      "AI-Assisted Automation Learner",
    ],
    summary:
      "I develop and support Oracle-based data warehouse systems in production ETL environments — building PL/SQL packages, tuning SQL performance, and resolving data-load failures within SLA. Currently expanding into AI-assisted workflow automation.",
  },

  about: {
    paragraphs: [
      "I'm a PL/SQL developer with 1.6+ years of hands-on experience developing and supporting Oracle-based data warehouse systems in a production ETL environment at Accenture. I work on building and troubleshooting ETL/batch data pipelines, PL/SQL package, procedure, and trigger development, SQL performance tuning, and exception handling for data quality and validation.",
      "I have a proven record of resolving production data-load failures and ETL job ABENDs within SLA as part of a cross-functional support team — diagnosing issues across file transfers, batch schedules, and query performance to keep upstream and downstream data flowing.",
      "I'm a fast learner of new tools and platforms, and I'm currently building AI-assisted automation skills using n8n and Claude/LLM integration to make data support workflows faster and more reliable.",
    ],
    focusAreas: [
      "Oracle PL/SQL development",
      "ETL pipeline support & troubleshooting",
      "SQL performance tuning",
      "AI-assisted workflow automation",
    ],
    stats: [
      { label: "Years Experience", value: "1.6+" },
      { label: "Daily/Weekly Jobs Supported", value: "Multiple" },
      { label: "Support Pod Size", value: "3" },
      { label: "Certifications", value: "4" },
    ],
  },

  experience: [
    {
      role: "Package Development Associate, Oracle Development & Support",
      company: "Accenture",
      period: "Oct 2024 — Present",
      location: "Hybrid",
      achievements: [
        "Monitor enterprise data warehouse batch jobs and ETL schedules, proactively identifying and resolving missing files and ABENDs to sustain on-time production run completion.",
        "Develop, debug, and deploy Oracle PL/SQL packages, procedures, functions, and triggers to deliver production code fixes, reducing recurring defects and cutting manual rework.",
        "Analyze and tune SQL query performance using Optimizer Hints and DBMS_STATS, improving execution time on high-volume data warehouse queries.",
        "Diagnose and resolve data-load and file-transfer failures via PuTTY and WinSCP, maintaining uninterrupted upstream and downstream ETL data flow across daily/weekly jobs.",
        "Triage and resolve production support tickets within SLA as part of a 3-member hybrid support pod, using SQL Developer and VS Code for root-cause analysis and fixes.",
        "Document recurring incidents and code-fix patterns in a shared knowledge base, reducing repeat-ticket volume and speeding resolution time for the wider team.",
      ],
      tech: ["Oracle PL/SQL", "SQL Developer", "DBMS_STATS", "PuTTY", "WinSCP", "Unix/Linux"],
    },
  ],

  projects: [
    {
      title: "Oracle ETL Warehouse Pipeline",
      description:
        "A star-schema Oracle data warehouse with a PL/SQL package that loads staging data into dimension and fact tables, with per-row exception handling, error logging, and batch-run tracking modeled on production ETL support workflows.",
      tech: ["Oracle PL/SQL", "ETL", "Data Warehousing", "SQL"],
      github: "https://github.com/sathish3201/etl-warehouse-pipeline",
      demo: "#",
      image: "gradient-1",
    },
    {
      title: "SQL Performance Tuning Case Study",
      description:
        "A documented before/after tuning exercise on a 2M-row Oracle table: DBMS_STATS, a targeted composite index, and Optimizer Hints, with EXPLAIN PLAN evidence for both states.",
      tech: ["Oracle SQL", "DBMS_STATS", "Optimizer Hints", "EXPLAIN PLAN"],
      github: "https://github.com/sathish3201/sql-performance-tuning-case-study",
      demo: "#",
      image: "gradient-2",
    },
    {
      title: "ETL Incident Triage Automation",
      description:
        "An n8n workflow that classifies ETL job failures using Claude and drafts ready-to-paste incident tickets, automating the manual triage step in production data support.",
      tech: ["n8n", "Claude/LLM", "Workflow Automation"],
      github: "https://github.com/sathish3201/etl-incident-triage-automation",
      demo: "#",
      image: "gradient-3",
    },
    {
      title: "MockGenius AI — SaaS Mock Interview Platform",
      description:
        "An AI-powered SaaS application that simulates technical mock interviews. Features JWT authentication, AI-generated interview questions, speech-to-text response submission, instant LLM-based grading with detailed feedback, and a dashboard with score progression analytics.",
      tech: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "Groq/Llama API"],
      github: "https://github.com/sathish3201/mockgenius-ai",
      demo: "https://mockgenius-ai-1.onrender.com",
      image: "gradient-4",
    },
  ],

  skills: [
    {
      category: "PL/SQL & Database",
      icon: "server",
      items: [
        "Oracle PL/SQL",
        "Packages, Procedures, Functions, Triggers",
        "SQL Performance Tuning",
        "Optimizer Hints",
        "DBMS_STATS",
      ],
    },
    {
      category: "ETL & Data Warehousing",
      icon: "cloud",
      items: [
        "ETL Design & Support",
        "Data Warehousing",
        "Batch Job Scheduling",
        "ABEND Resolution",
        "Data Quality, Cleansing & Validation",
      ],
    },
    {
      category: "Tools & Support",
      icon: "wrench",
      items: [
        "SQL Developer",
        "VS Code",
        "PuTTY",
        "WinSCP",
        "Unix/Linux",
        "Incident & Ticket Management",
      ],
    },
    {
      category: "Emerging Skills",
      icon: "layout-panel-left",
      items: ["AI-Assisted Workflow Automation", "n8n", "Claude/LLM Integration", "Agile/Hybrid Collaboration"],
    },
  ],

  education: [
    {
      degree: "B.Tech, Computer Engineering — CGPA: 8.5/10",
      school: "CMR Engineering College, Hyderabad",
      period: "Graduated",
    },
    {
      degree: "Intermediate (XII)",
      school: "Sandeepani Junior College, Kamareddy",
      period: "2019",
    },
    {
      degree: "SSC (X) — CGPA: 9.3",
      school: "Zilla Parishad High School, Kondapoor, Kamareddy",
      period: "2017",
    },
  ],

  certifications: [
    { name: "Java Full Stack Certification", issuer: "Wipro TalentNext", year: "2023", url: "" },
    { name: "AI/ML Virtual Internship Certificate", issuer: "", year: "2023", url: "" },
    { name: "Smart Coder Certification — Global Rank 1402/22591", issuer: "Smart Interviews", year: "2022", url: "" },
    { name: "HTML Attributes & Tags", issuer: "GL Academy", year: "2022", url: "" },
  ],
};

export default PORTFOLIO_DATA;
