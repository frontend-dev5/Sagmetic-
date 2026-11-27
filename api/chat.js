import { handleChatHttpRequest } from "./_lib/chatHandler.js";

export default async function handler(req, res) {
  return handleChatHttpRequest(req, res, process.env);
}
