import {
  buildSystemPrompt,
  SAGMETIC_CONTACT,
  SECTION_LINKS,
} from "./knowledge.js";

const DEFAULT_URLS = {
  openai: "https://api.openai.com/v1/chat/completions",
  groq: "https://api.groq.com/openai/v1/chat/completions",
  anthropic: "https://api.anthropic.com/v1/messages",
};

const DEFAULT_MODELS = {
  openai: "gpt-4o-mini",
  groq: "llama-3.3-70b-versatile",
  gemini: "gemini-2.5-flash",
  anthropic: "claude-3-5-haiku-latest",
  "openai-compatible": "gpt-4o-mini",
};

const TOOLS = [
  {
    name: "show_contact_card",
    description:
      "Display Sagmetic Infotech's verified contact card (email, phone, office address, and social links) inside the chat.",
    parameters: {
      type: "object",
      properties: {
        includeAddress: {
          type: "boolean",
          description: "Whether to include the Mohali office address.",
        },
        includeSocials: {
          type: "boolean",
          description: "Whether to include available social media links.",
        },
      },
    },
  },
  {
    name: "navigate_to_section",
    description:
      "Provide a clickable link button that scrolls the user smoothly to a relevant section on the Sagmetic website.",
    parameters: {
      type: "object",
      properties: {
        section: {
          type: "string",
          enum: Object.keys(SECTION_LINKS),
          description: "Target website section identifier.",
        },
        label: {
          type: "string",
          description: "Short button label shown to the user, e.g. 'Open contact form'.",
        },
      },
      required: ["section"],
    },
  },
];

function inferProvider(rawProvider, rawUrl) {
  const normalized = (rawProvider || "").trim().toLowerCase();
  if (normalized) {
    if (normalized === "chatgpt") return "openai";
    if (normalized === "claude") return "anthropic";
    if (normalized === "google") return "gemini";
    return normalized;
  }

  const url = (rawUrl || "").toLowerCase();
  if (url.includes("generativelanguage.googleapis.com") || url.includes(":generatecontent")) {
    return "gemini";
  }
  if (url.includes("anthropic.com") || url.includes("/v1/messages")) {
    return "anthropic";
  }
  if (url.includes("groq.com")) {
    return "groq";
  }
  if (url.includes("openai.com")) {
    return "openai";
  }
  return url ? "openai-compatible" : "groq";
}

function resolveApiKey(provider, env) {
  if (env.LLM_API_KEY) return env.LLM_API_KEY.trim();
  const keyByProvider = {
    groq: env.GROQ_API_KEY,
    gemini: env.GEMINI_API_KEY,
    openai: env.OPENAI_API_KEY,
    anthropic: env.ANTHROPIC_API_KEY,
    "openai-compatible": env.OPENAI_API_KEY,
  };
  return (keyByProvider[provider] || "").trim();
}

function resolveEndpoint(provider, model, rawUrl) {
  const custom = (rawUrl || "").trim();

  if (provider === "gemini") {
    if (!custom) {
      return `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        model
      )}:generateContent`;
    }
    if (custom.includes("{model}")) {
      return custom.replaceAll("{model}", encodeURIComponent(model));
    }
    if (custom.includes(":generateContent")) {
      return custom;
    }
    return `${custom.replace(/\/+$/, "")}/models/${encodeURIComponent(
      model
    )}:generateContent`;
  }

  if (provider === "anthropic") {
    if (!custom) return DEFAULT_URLS.anthropic;
    if (custom.endsWith("/messages")) return custom;
    if (custom.endsWith("/v1")) return `${custom}/messages`;
    return custom;
  }

  // OpenAI, Groq, and any OpenAI-compatible endpoint
  if (!custom) {
    return DEFAULT_URLS[provider] || DEFAULT_URLS.openai;
  }
  if (custom.includes("/chat/completions")) {
    return custom;
  }
  return `${custom.replace(/\/+$/, "")}/chat/completions`;
}

function executeTool(name, args = {}) {
  if (name === "show_contact_card") {
    const activeSocials = SAGMETIC_CONTACT.socials.filter(
      (s) => s.url && s.url.trim().length > 0
    );
    return {
      toolResult: {
        company: SAGMETIC_CONTACT.company,
        email: SAGMETIC_CONTACT.email,
        phone: SAGMETIC_CONTACT.phone,
        address: args.includeAddress === false ? null : SAGMETIC_CONTACT.address,
        socials: args.includeSocials === false ? [] : activeSocials,
      },
      uiPatch: {
        contactCard: {
          email: SAGMETIC_CONTACT.email,
          phone: SAGMETIC_CONTACT.phone,
          address: args.includeAddress === false ? null : SAGMETIC_CONTACT.address,
          socials: args.includeSocials === false ? [] : activeSocials,
        },
      },
    };
  }

  if (name === "navigate_to_section") {
    const target = SECTION_LINKS[args.section] || SECTION_LINKS.contact;
    const action = {
      label: (args.label || target.defaultLabel).slice(0, 40),
      href: target.href,
    };
    return {
      toolResult: { navigatedTo: action.href, label: action.label },
      uiPatch: { action },
    };
  }

  return { toolResult: { error: `Unknown tool: ${name}` }, uiPatch: {} };
}

async function callOpenAICompatible({ endpoint, apiKey, model, systemPrompt, messages }) {
  const openAiTools = TOOLS.map((t) => ({
    type: "function",
    function: {
      name: t.name,
      description: t.description,
      parameters: t.parameters,
    },
  }));

  const payloadMessages = [
    { role: "system", content: systemPrompt },
    ...messages.map((m) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
    })),
  ];

  const headers = {
    "Content-Type": "application/json",
    ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
  };

  const firstRes = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      messages: payloadMessages,
      tools: openAiTools,
      tool_choice: "auto",
      temperature: 0.4,
      max_tokens: 450,
    }),
  });

  const firstData = await firstRes.json();
  if (!firstRes.ok) {
    throw new Error(firstData?.error?.message || `Upstream HTTP ${firstRes.status}`);
  }

  const assistantMsg = firstData?.choices?.[0]?.message;
  const toolCalls = assistantMsg?.tool_calls || [];

  if (toolCalls.length === 0) {
    return { reply: (assistantMsg?.content || "").trim() };
  }

  let uiAction = null;
  let uiContactCard = null;
  const toolResponseMessages = [];

  for (const tc of toolCalls) {
    let parsedArgs = {};
    try {
      parsedArgs = tc.function?.arguments ? JSON.parse(tc.function.arguments) : {};
    } catch {
      parsedArgs = {};
    }
    const { toolResult, uiPatch } = executeTool(tc.function?.name, parsedArgs);
    if (uiPatch.action) uiAction = uiPatch.action;
    if (uiPatch.contactCard) uiContactCard = uiPatch.contactCard;

    toolResponseMessages.push({
      role: "tool",
      tool_call_id: tc.id,
      content: JSON.stringify(toolResult),
    });
  }

  if (assistantMsg?.content?.trim()) {
    return {
      reply: assistantMsg.content.trim(),
      action: uiAction,
      contactCard: uiContactCard,
    };
  }

  const secondRes = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      messages: [...payloadMessages, assistantMsg, ...toolResponseMessages],
      temperature: 0.4,
      max_tokens: 450,
    }),
  });

  const secondData = await secondRes.json();
  const finalReply = secondRes.ok
    ? (secondData?.choices?.[0]?.message?.content || "").trim()
    : "";

  return {
    reply: finalReply || "Here are the details from Sagmetic Infotech.",
    action: uiAction,
    contactCard: uiContactCard,
  };
}

async function callGemini({ endpoint, apiKey, systemPrompt, messages }) {
  const geminiTools = [
    {
      functionDeclarations: TOOLS.map((t) => ({
        name: t.name,
        description: t.description,
        parameters: t.parameters,
      })),
    },
  ];

  const contents = messages.map((m) => ({
    role: m.sender === "user" ? "user" : "model",
    parts: [{ text: m.text }],
  }));

  const headers = {
    "Content-Type": "application/json",
    ...(apiKey ? { "x-goog-api-key": apiKey } : {}),
  };

  const firstRes = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents,
      tools: geminiTools,
      generationConfig: { temperature: 0.4, maxOutputTokens: 450 },
    }),
  });

  const firstData = await firstRes.json();
  if (!firstRes.ok) {
    throw new Error(firstData?.error?.message || `Gemini HTTP ${firstRes.status}`);
  }

  const candidateContent = firstData?.candidates?.[0]?.content;
  const parts = candidateContent?.parts || [];
  const textReply = parts
    .filter((p) => typeof p.text === "string")
    .map((p) => p.text)
    .join("")
    .trim();
  const fnCalls = parts.filter((p) => p.functionCall);

  if (fnCalls.length === 0) {
    return { reply: textReply };
  }

  let uiAction = null;
  let uiContactCard = null;
  const fnResponseParts = [];

  for (const part of fnCalls) {
    const fc = part.functionCall;
    const { toolResult, uiPatch } = executeTool(fc.name, fc.args || {});
    if (uiPatch.action) uiAction = uiPatch.action;
    if (uiPatch.contactCard) uiContactCard = uiPatch.contactCard;
    fnResponseParts.push({
      functionResponse: {
        name: fc.name,
        response: toolResult,
      },
    });
  }

  if (textReply) {
    return {
      reply: textReply,
      action: uiAction,
      contactCard: uiContactCard,
    };
  }

  const secondRes = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [
        ...contents,
        candidateContent,
        { role: "user", parts: fnResponseParts },
      ],
      generationConfig: { temperature: 0.4, maxOutputTokens: 450 },
    }),
  });

  const secondData = await secondRes.json();
  const secondText = secondRes.ok
    ? (secondData?.candidates?.[0]?.content?.parts || [])
        .filter((p) => typeof p.text === "string")
        .map((p) => p.text)
        .join("")
        .trim()
    : "";

  return {
    reply: secondText || "Here are the details from Sagmetic Infotech.",
    action: uiAction,
    contactCard: uiContactCard,
  };
}

async function callAnthropic({ endpoint, apiKey, model, systemPrompt, messages }) {
  const anthropicTools = TOOLS.map((t) => ({
    name: t.name,
    description: t.description,
    input_schema: t.parameters,
  }));

  const payloadMessages = messages.map((m) => ({
    role: m.sender === "user" ? "user" : "assistant",
    content: m.text,
  }));

  const headers = {
    "Content-Type": "application/json",
    "anthropic-version": "2023-06-01",
    ...(apiKey ? { "x-api-key": apiKey } : {}),
  };

  const firstRes = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      system: systemPrompt,
      max_tokens: 450,
      temperature: 0.4,
      messages: payloadMessages,
      tools: anthropicTools,
    }),
  });

  const firstData = await firstRes.json();
  if (!firstRes.ok) {
    throw new Error(firstData?.error?.message || `Anthropic HTTP ${firstRes.status}`);
  }

  const blocks = firstData?.content || [];
  const textReply = blocks
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
  const toolUses = blocks.filter((b) => b.type === "tool_use");

  if (toolUses.length === 0) {
    return { reply: textReply };
  }

  let uiAction = null;
  let uiContactCard = null;
  const toolResults = [];

  for (const tu of toolUses) {
    const { toolResult, uiPatch } = executeTool(tu.name, tu.input || {});
    if (uiPatch.action) uiAction = uiPatch.action;
    if (uiPatch.contactCard) uiContactCard = uiPatch.contactCard;
    toolResults.push({
      type: "tool_result",
      tool_use_id: tu.id,
      content: JSON.stringify(toolResult),
    });
  }

  if (textReply) {
    return {
      reply: textReply,
      action: uiAction,
      contactCard: uiContactCard,
    };
  }

  const secondRes = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      system: systemPrompt,
      max_tokens: 450,
      temperature: 0.4,
      messages: [
        ...payloadMessages,
        { role: "assistant", content: blocks },
        { role: "user", content: toolResults },
      ],
    }),
  });

  const secondData = await secondRes.json();
  const secondText = secondRes.ok
    ? (secondData?.content || [])
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("")
        .trim()
    : "";

  return {
    reply: secondText || "Here are the details from Sagmetic Infotech.",
    action: uiAction,
    contactCard: uiContactCard,
  };
}

export function getFallbackReply(input) {
  const q = (input || "").toLowerCase().trim();

  if (
    q.includes("hello") ||
    q.includes("hi") ||
    q.includes("hey") ||
    q === "yo" ||
    q.includes("good morning") ||
    q.includes("good afternoon") ||
    q.includes("good evening")
  ) {
    return {
      reply:
        "Hey! Here's how we can help:\n- **AI Systems:** Custom chatbots, RAG & automation\n- **Web & Apps:** High-performance digital products\n- **Project Scope:** Timeline & consultation details",
    };
  }

  if (
    q.includes("service") ||
    q.includes("what do you do") ||
    q.includes("offer") ||
    q.includes("ai solution") ||
    q.includes("ai system") ||
    q.includes("build")
  ) {
    return {
      reply:
        "We build end-to-end AI & digital products:\n- **AI Chatbots & RAG:** Domain-trained assistants\n- **AI Automation:** Support & workflow pipelines\n- **Generative AI:** Custom content & media tools\n- **Web & Mobile:** Design, development & SEO",
      action: { label: "View services", href: "#what-we-do" },
    };
  }

  if (
    q.includes("integrat") ||
    q.includes("existing") ||
    q.includes("workflow") ||
    q.includes("automat")
  ) {
    return {
      reply:
        "Yes — we integrate AI into existing products smoothly:\n- **Architecture Audit:** Map data flows & UI touchpoints\n- **Smart Features:** Add RAG search, copilots & automation\n- **Zero Disruption:** Built safely around current users",
      action: { label: "See AI case studies", href: "#case-study" },
    };
  }

  if (
    q.includes("tech") ||
    q.includes("stack") ||
    q.includes("framework") ||
    q.includes("model") ||
    q.includes("openai") ||
    q.includes("react") ||
    q.includes("python")
  ) {
    return {
      reply:
        "Our core engineering stack:\n- **Frontend:** React, Next.js, TypeScript, Tailwind, GSAP, Three.js\n- **Backend:** Python, Node.js, Firebase, AWS\n- **AI & ML:** OpenAI, LangChain, LlamaIndex, TensorFlow",
      action: { label: "View tech stack", href: "#what-we-do" },
    };
  }

  if (
    q.includes("time") ||
    q.includes("long") ||
    q.includes("duration") ||
    q.includes("week") ||
    q.includes("fast") ||
    q.includes("mvp") ||
    q.includes("ship") ||
    q.includes("process")
  ) {
    return {
      reply:
        "Typical delivery timelines & process:\n- **AI Integrations / MVPs:** 3–6 weeks\n- **Full Web/App Products:** 6–12 weeks\n- **Workflow:** 01 Discover → 02 Design → 03 Build",
      action: { label: "See workflow", href: "#ai-workflow" },
    };
  }

  if (
    q.includes("price") ||
    q.includes("cost") ||
    q.includes("budget") ||
    q.includes("quote") ||
    q.includes("consult") ||
    q.includes("contact") ||
    q.includes("hire") ||
    q.includes("book") ||
    q.includes("meeting") ||
    q.includes("start") ||
    q.includes("project") ||
    q.includes("talk") ||
    q.includes("call") ||
    q.includes("email") ||
    q.includes("phone") ||
    q.includes("address") ||
    q.includes("social")
  ) {
    const { uiPatch } = executeTool("show_contact_card", {
      includeAddress: true,
      includeSocials: true,
    });
    return {
      reply:
        "Let's get your project moving:\n- **Free Consultation:** Share your goals in our contact form\n- **Direct Contact:** Reach us via email or phone below\n- **Next Step:** Scope, timeline & AI architecture plan",
      action: { label: "Open contact form", href: "#contact" },
      contactCard: uiPatch.contactCard,
    };
  }

  return {
    reply:
      "Here's what I can help with:\n- **AI Solutions:** Agents, RAG & workflow automation\n- **Engineering:** Web, mobile apps & tech stack\n- **Getting Started:** Timelines & direct contact",
    action: { label: "Contact Sagmetic", href: "#contact" },
  };
}

export async function generateChatResponse({ messages, env = process.env }) {
  const cleanMessages = (Array.isArray(messages) ? messages : [])
    .filter(
      (m) =>
        m &&
        (m.sender === "user" || m.sender === "bot") &&
        typeof m.text === "string" &&
        m.text.trim().length > 0
    )
    .slice(-12);

  const lastUserMessage =
    [...cleanMessages].reverse().find((m) => m.sender === "user")?.text || "";

  if (!lastUserMessage) {
    return {
      reply: "Ask me anything about Sagmetic's services, AI solutions, or contact details.",
      mode: "fallback",
    };
  }

  const provider = inferProvider(env.LLM_PROVIDER, env.LLM_API_URL);
  const apiKey = resolveApiKey(provider, env);
  const model = (env.LLM_MODEL || "").trim() || DEFAULT_MODELS[provider] || "gpt-4o-mini";
  const endpoint = resolveEndpoint(provider, model, env.LLM_API_URL);

  // If developer hasn't set an API key yet (and isn't pointing to a local keyless URL like Ollama)
  const isLocalEndpoint =
    endpoint.startsWith("http://localhost") || endpoint.startsWith("http://127.0.0.1");
  if (!apiKey && !isLocalEndpoint) {
    return {
      ...getFallbackReply(lastUserMessage),
      mode: "fallback",
    };
  }

  const systemPrompt = buildSystemPrompt();

  try {
    let result;
    if (provider === "gemini") {
      result = await callGemini({
        endpoint,
        apiKey,
        systemPrompt,
        messages: cleanMessages,
      });
    } else if (provider === "anthropic") {
      result = await callAnthropic({
        endpoint,
        apiKey,
        model,
        systemPrompt,
        messages: cleanMessages,
      });
    } else {
      result = await callOpenAICompatible({
        endpoint,
        apiKey,
        model,
        systemPrompt,
        messages: cleanMessages,
      });
    }

    return {
      reply: result.reply || getFallbackReply(lastUserMessage).reply,
      action: result.action || null,
      contactCard: result.contactCard || null,
      mode: "llm",
      provider,
    };
  } catch (err) {
    console.error(`[Sagmetic Chat LLM Error - ${provider}]:`, err?.message || err);
    return {
      ...getFallbackReply(lastUserMessage),
      mode: "fallback",
    };
  }
}
