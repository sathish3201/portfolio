/**
 * All portfolio content lives here. Replace these values with your real
 * resume data (this file will be regenerated from your resume PDF).
 */
const PORTFOLIO_DATA = {
  meta: {
    name: "Alex Rivera",
    role: "Full-Stack Software Engineer",
    tagline: "I build fast, accessible, delightful web experiences.",
    email: "alex.rivera.dev@gmail.com",
    location: "Remote / San Francisco, CA",
    resumeUrl: "#",
    social: {
      github: "https://github.com/alexrivera",
      linkedin: "https://linkedin.com/in/alexrivera",
      twitter: "https://twitter.com/alexrivera_dev",
    },
  },

  hero: {
    greeting: "Hi, my name is",
    roles: [
      "Full-Stack Engineer",
      "React & Node Specialist",
      "Cloud Architecture Enthusiast",
      "Open Source Contributor",
    ],
    summary:
      "I design and build performant, scalable web applications — from pixel-perfect interfaces to resilient backend systems. Currently focused on developer tooling and AI-assisted products.",
  },

  about: {
    paragraphs: [
      "I'm a software engineer with 6+ years of experience turning ambiguous problems into shipped, reliable products. My path started in embedded systems, which gave me a deep respect for performance and constraints — something I still carry into every frontend and backend decision I make today.",
      "I care most about developer experience, accessible design, and systems that are easy to reason about six months later. Outside of core feature work, I enjoy mentoring junior engineers, contributing to open-source tooling, and writing about the tradeoffs behind architecture decisions.",
      "Currently, I'm exploring the intersection of AI tooling and traditional software engineering workflows — building agents, copilots, and internal tools that make teams faster without sacrificing code quality.",
    ],
    focusAreas: [
      "Scalable frontend architecture",
      "Developer tooling & DX",
      "Cloud-native backend systems",
      "AI-assisted product workflows",
    ],
    stats: [
      { label: "Years Experience", value: "6+" },
      { label: "Projects Shipped", value: "40+" },
      { label: "Open Source Repos", value: "18" },
      { label: "Teams Mentored", value: "5" },
    ],
  },

  experience: [
    {
      role: "Senior Software Engineer",
      company: "Nimbus Cloud Systems",
      period: "2022 — Present",
      location: "Remote",
      achievements: [
        "Led migration of a monolithic Rails app to a microservices architecture, reducing average API latency by 42%.",
        "Designed and shipped an internal design system used across 12 product teams, cutting frontend dev time by 30%.",
        "Mentored 4 junior engineers, 3 of whom were promoted within a year.",
      ],
      tech: ["React", "TypeScript", "Node.js", "AWS", "GraphQL"],
    },
    {
      role: "Software Engineer",
      company: "Brightline Labs",
      period: "2020 — 2022",
      location: "San Francisco, CA",
      achievements: [
        "Built a real-time collaboration engine (CRDT-based) supporting 10k+ concurrent users.",
        "Improved CI/CD pipeline speed by 55% through parallelized test execution and caching strategies.",
        "Owned the checkout and payments flow, increasing conversion rate by 18%.",
      ],
      tech: ["Vue.js", "Python", "PostgreSQL", "Docker", "Redis"],
    },
    {
      role: "Frontend Developer",
      company: "Pixel & Co.",
      period: "2018 — 2020",
      location: "Austin, TX",
      achievements: [
        "Rebuilt the flagship marketing site, improving Lighthouse performance score from 61 to 96.",
        "Implemented component-driven development workflow using Storybook, adopted org-wide.",
        "Collaborated directly with design to establish a scalable, accessible component library.",
      ],
      tech: ["JavaScript", "React", "Sass", "Webpack"],
    },
  ],

  projects: [
    {
      title: "Aurora Dashboard",
      description:
        "A real-time analytics dashboard with customizable widgets, live data streaming, and role-based access control. Built for teams managing large-scale infrastructure.",
      tech: ["React", "TypeScript", "WebSockets", "D3.js"],
      github: "https://github.com/alexrivera/aurora-dashboard",
      demo: "https://aurora-dashboard.demo.dev",
      image: "gradient-1",
    },
    {
      title: "Flowbase CMS",
      description:
        "A headless, developer-first CMS with a plugin architecture and GraphQL API. Designed for speed and extensibility over convention.",
      tech: ["Node.js", "GraphQL", "PostgreSQL", "Docker"],
      github: "https://github.com/alexrivera/flowbase-cms",
      demo: "https://flowbase.demo.dev",
      image: "gradient-2",
    },
    {
      title: "Synapse AI Agent Toolkit",
      description:
        "An open-source toolkit for building composable AI agents with tool-use, memory, and multi-step planning primitives.",
      tech: ["Python", "FastAPI", "LangChain", "Redis"],
      github: "https://github.com/alexrivera/synapse-toolkit",
      demo: "https://synapse-docs.demo.dev",
      image: "gradient-3",
    },
    {
      title: "Pulse — Habit Tracker",
      description:
        "A minimalist mobile-first habit tracking PWA with offline support, streak analytics, and shareable progress cards.",
      tech: ["React Native", "SQLite", "Expo"],
      github: "https://github.com/alexrivera/pulse-habits",
      demo: "https://pulse-app.demo.dev",
      image: "gradient-4",
    },
  ],

  skills: [
    {
      category: "Frontend",
      icon: "layout-panel-left",
      items: ["React", "TypeScript", "Next.js", "Vue.js", "Tailwind CSS", "Framer Motion"],
    },
    {
      category: "Backend",
      icon: "server",
      items: ["Node.js", "Python", "GraphQL", "REST APIs", "PostgreSQL", "Redis"],
    },
    {
      category: "Cloud & DevOps",
      icon: "cloud",
      items: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform", "GitHub Actions"],
    },
    {
      category: "Tools & Practices",
      icon: "wrench",
      items: ["Git", "Figma", "Storybook", "Jest", "Agile/Scrum", "TDD"],
    },
  ],

  education: [
    {
      degree: "B.S. in Computer Science",
      school: "University of Texas at Austin",
      period: "2014 — 2018",
    },
  ],
};

export default PORTFOLIO_DATA;
