import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse/lib/pdf-parse.js'; // Pure JS PDF parser
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Choose LLM Provider: 'anthropic' or 'google'
const PROVIDER = process.env.LLM_PROVIDER || (process.env.ANTHROPIC_API_KEY ? 'anthropic' : 'google');

const resumePath = path.resolve('resume.pdf');
const outputPath = path.resolve('src/data.js');

const JSON_SCHEMA_TEMPLATE = `{
  meta: {
    name: "",
    role: "",
    tagline: "",
    email: "",
    location: "",
    resumeUrl: "#",
    social: {
      github: "",
      linkedin: "",
    },
  },
  hero: {
    greeting: "Hi, my name is",
    roles: [
      // array of 3-4 professional descriptive titles
    ],
    summary: "" // 1-2 sentence hero summary
  },
  about: {
    paragraphs: [
      // 2-3 engaging background paragraphs
    ],
    focusAreas: [
      // 3-4 core frontend/backend focus areas
    ],
    stats: [
      { label: "Years Experience", value: "" },
      { label: "Projects Shipped", value: "" },
      // other key stats matching their career
    ],
  },
  experience: [
    {
      role: "",
      company: "",
      period: "",
      location: "",
      achievements: [
        // list of key impact statements
      ],
      tech: [
        // array of technologies used
      ],
    }
  ],
  projects: [
    {
      title: "",
      description: "",
      tech: [],
      github: "",
      demo: "",
      image: "gradient-1", // incremental name: gradient-1, gradient-2, etc.
    }
  ],
  skills: [
    {
      category: "", // e.g. "Frontend", "Backend & Database", etc.
      icon: "", // one of: "layout-panel-left", "server", "cloud", "wrench"
      items: [] // array of skills
    }
  ],
  education: [
    {
      degree: "",
      school: "",
      period: ""
    }
  ],
  certifications: [
    { name: "", issuer: "", year: "", url: "" }
  ],
}`;

const SYSTEM_PROMPT = `You are an expert resume parsing agent.
Your task is to take the raw text extracted from a resume PDF and convert it into a valid JavaScript ES Module file that exports a single object named 'PORTFOLIO_DATA' fitting the specified schema template.

Instructions:
1. Extract all contact information, work experience, projects, skills, education, and certifications.
2. Structure the data EXACTLY matching this JavaScript schema:
\${JSON_SCHEMA_TEMPLATE}
3. The output must be valid ES Module JavaScript code starting exactly with:
\`\`\`javascript
/**
 * All portfolio content lives here. Sourced from the resume PDF.
 */
const PORTFOLIO_DATA = {
...
};

export default PORTFOLIO_DATA;
\`\`\`
4. Ensure no markdown explanations or text is returned outside of the block.
5. If links are found in the resume, ensure they are fully qualified (e.g. starting with https://).`;

async function callClaude(resumeText) {
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  console.log('Sending resume text to Claude (Claude 3.5 Sonnet)...');
  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-latest',
    max_tokens: 4000,
    system: SYSTEM_PROMPT,
    messages: [
      { role: 'user', content: \`Here is the raw resume text:\\n\\n\${resumeText}\` }
    ]
  });

  return response.content[0].text;
}

async function callGemini(resumeText) {
  const { GoogleGenAI } = await import('@google/genai');
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  console.log('Sending resume text to Gemini (Gemini 2.5 Flash)...');
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_PROMPT,
    },
    contents: \`Here is the raw resume text:\\n\\n\${resumeText}\`,
  });

  return response.text;
}

async function run() {
  try {
    if (!fs.existsSync(resumePath)) {
      console.error(\`Error: resume.pdf not found at \${resumePath}. Please place your resume PDF file there.\`);
      process.exit(1);
    }

    console.log('Reading resume.pdf...');
    const dataBuffer = fs.readFileSync(resumePath);
    const parsedData = await pdf(dataBuffer);
    const resumeText = parsedData.text;

    console.log('Resume text extracted successfully. Character count:', resumeText.length);

    let outputContent = '';
    if (PROVIDER === 'anthropic') {
      if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error('ANTHROPIC_API_KEY is not defined in your environment/dotenv file.');
      }
      outputContent = await callClaude(resumeText);
    } else {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not defined in your environment/dotenv file. Set GEMINI_API_KEY or ANTHROPIC_API_KEY.');
      }
      outputContent = await callGemini(resumeText);
    }

    // Clean up any markdown code fencing returned by the LLM
    let cleanCode = outputContent;
    const match = outputContent.match(/```javascript([\\s\\S]*?)```/);
    if (match) {
      cleanCode = match[1].trim();
    } else {
      const matchPlain = outputContent.match(/```([\\s\\S]*?)```/);
      if (matchPlain) {
        cleanCode = matchPlain[1].trim();
      }
    }

    console.log(\`Writing parsed portfolio data to: \${outputPath}\`);
    fs.writeFileSync(outputPath, cleanCode, 'utf8');
    console.log('Success! Your portfolio data has been updated.');

  } catch (error) {
    console.error('An error occurred during execution:', error);
  }
}

run();
