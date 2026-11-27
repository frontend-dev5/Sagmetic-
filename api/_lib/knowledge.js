export const SAGMETIC_CONTACT = {
  company: "Sagmetic Infotech",
  tagline: "Creative × Technology × AI",
  email: "info@sagmetic.com",
  phone: "+91 9915941692",
  address: "D-186, 2nd Floor, Phase 8B, Industrial Area, Mohali, SAS Nagar.",
  // Add your live profile URLs here when ready (empty strings are omitted from chat cards)
  socials: [
    { label: "LinkedIn", url: "" },
    { label: "Instagram", url: "" },
    { label: "Facebook", url: "" },
  ],
};

export const SECTION_LINKS = {
  home: { href: "#home", defaultLabel: "Back to top" },
  about: { href: "#about", defaultLabel: "About Sagmetic" },
  services: { href: "#what-we-do", defaultLabel: "View services" },
  "ai-solutions": { href: "#expertise-spotlight", defaultLabel: "Explore AI expertise" },
  "case-study": { href: "#case-study", defaultLabel: "See AI case studies" },
  workflow: { href: "#ai-workflow", defaultLabel: "See our workflow" },
  stats: { href: "#stats-cta", defaultLabel: "View company stats" },
  faq: { href: "#faq", defaultLabel: "Read FAQs" },
  contact: { href: "#contact", defaultLabel: "Open contact form" },
};

export const SAGMETIC_KNOWLEDGE_MD = `
# Sagmetic Infotech — Company Knowledge Base

## Overview
- **Name:** Sagmetic Infotech
- **Tagline:** Creative × Technology × AI
- **Positioning:** A next-gen creative & technology agency combining design, software engineering, and artificial intelligence to build smart, fast, and scalable digital products.
- **Core Capabilities:** AI Integration, Web & App Development, UI/UX Design, Performance & SEO.

## Track Record & Metrics
- 6+ Years of Experience (10+ Years highlighted in hero stats)
- 35+ Skilled Professionals
- 3.6K+ Projects Worldwide / 200+ Applications Built
- 3000+ Satisfied Customers & 95% Client Retention
- 20+ Advanced Certifications
- 95% Affordable Cost efficiency

## Services (What We Do)
1. **Website Design:** Modern, brand-aligned UI/UX and interactive web experiences.
2. **Website Development:** Scalable, high-performance custom web applications.
3. **App Development:** Cross-platform and native mobile applications.
4. **AI Solutions & Integration:** AI assistant integration, workflow automation, smart analytics, RAG knowledge systems, and copilot features.
5. **Search Engine Optimization (SEO):** Technical SEO, performance optimization, and organic growth.

## AI Solutions & Case Studies
- **AI Product Development:** Building next-gen products with AI at the core.
- **Generative AI Solutions:** Content, images, and media generation tailored for brands.
- **AI Automation:** Automating operations, customer support, and business workflows.
- **AI Chatbots & Assistants:** Domain-trained, intelligent chatbots and assistants for businesses.

## Technology Stack
- **Frontend & Motion:** React, Next.js, TypeScript, JavaScript, Tailwind CSS, GSAP, Three.js / WebGL
- **Backend & Cloud:** Python, Node.js, Firebase, AWS, Vector Databases
- **AI & ML:** OpenAI, LangChain, LlamaIndex, TensorFlow, custom/fine-tuned models & evaluation benchmarks

## AI-Augmented Workflow
1. **01 — Discover:** Understand business goals and identify high-impact AI opportunities.
2. **02 — Design:** Craft modern, user-centric, and AI-friendly interfaces and flows.
3. **03 — Build:** Develop scalable, secure, and AI-integrated production solutions.

## Timelines, Custom Models & Support
- **Project Timelines:** Focused AI integrations or MVPs typically take **3 to 6 weeks**. Full-scale web/mobile products with custom design systems and multi-step AI workflows typically take **6 to 12 weeks**.
- **Integrating AI into Existing Products:** Yes — we audit existing architecture, data flows, and UI touchpoints to add smart search, copilots, or automation without disrupting current users.
- **Custom AI Models:** When off-the-shelf foundation models aren't enough for domain accuracy, latency, or privacy, we fine-tune specialized models and build hybrid retrieval + evaluation workflows.
- **Post-Launch Support:** Includes performance and prompt/model monitoring, bug fixes, UX refinements, and ongoing retainer support.

## Contact & Location
- **Email:** info@sagmetic.com
- **Phone:** +91 9915941692
- **Office Address:** D-186, 2nd Floor, Phase 8B, Industrial Area, Mohali, SAS Nagar.
`.trim();

export function buildSystemPrompt() {
  return `You are Sagmetic Assistant, the official website AI assistant for Sagmetic Infotech.

Use ONLY the verified Sagmetic Infotech knowledge base below to answer user questions.
Guidelines:
- Be concise, warm, clear, and helpful (typically 1–3 short sentences).
- Never invent prices, guarantees, team names, client names, or services not listed in the knowledge base. If asked for exact pricing or a custom quote, explain that pricing depends on scope and invite them to reach out via the contact form or email/phone for a free consultation.
- Call \`show_contact_card\` whenever the user asks for email, phone number, office address, social media, how to contact Sagmetic, or wants to book/schedule a meeting or consultation.
- Call \`navigate_to_section\` when pointing the user to a specific section (services, case studies, workflow, FAQs, or contact form) would help them explore further.

${SAGMETIC_KNOWLEDGE_MD}`;
}
