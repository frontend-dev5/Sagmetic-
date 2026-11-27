import { generateChatResponse } from "../../api/_lib/llm.js";

const MAX_BODY_BYTES = 64 * 1024;

export default async (req) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const raw = await req.text();
    if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
      return Response.json(
        { error: "Request payload too large" },
        { status: 413 },
      );
    }

    let body = {};
    if (raw) {
      try {
        body = JSON.parse(raw);
      } catch {
        return Response.json({ error: "Invalid JSON body" }, { status: 400 });
      }
    }

    const payload = await generateChatResponse({
      messages: body?.messages,
      env: process.env,
    });

    return Response.json(payload, { status: 200 });
  } catch (err) {
    return Response.json(
      { error: err?.message || "Unable to process chat request" },
      { status: 400 },
    );
  }
};

export const config = {
  path: "/api/chat",
};
