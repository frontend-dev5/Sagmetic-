import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  ArrowRight,
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  Send,
  X,
} from "lucide-react";

const SUGGESTED_PROMPTS = [
  "What AI services do you build?",
  "What is your tech stack & timeline?",
  "How can I contact Sagmetic?",
];

const INITIAL_MESSAGES = [
  {
    id: "welcome-1",
    sender: "bot",
    text: "Hi! Ask me about our AI solutions, web & app development, tech stack, or how to reach us.",
  },
];

export default function ChatbotPopup({ isOpen, onClose }) {
  const panelRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    if (isOpen) {
      gsap.killTweensOf(panel);
      const isMobile = window.innerWidth < 640;
      gsap.fromTo(
        panel,
        isMobile ? { y: 20, x: 0, autoAlpha: 0 } : { x: 24, y: 0, autoAlpha: 0 },
        {
          x: 0,
          y: 0,
          autoAlpha: 1,
          duration: 0.28,
          ease: "power3.out",
        }
      );
      const focusTimer = window.setTimeout(() => {
        if (window.innerWidth >= 640) {
          inputRef.current?.focus();
        }
      }, 140);
      return () => window.clearTimeout(focusTimer);
    } else {
      gsap.set(panel, { autoAlpha: 0 });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    if (messages.length > 1 || isTyping) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const sendMessage = async (rawText) => {
    const text = rawText.trim();
    if (!text || isTyping) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInputValue("");
    setIsTyping(true);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
        signal: controller.signal,
      });

      const data = await res.json();
      if (!res.ok || !data?.reply) {
        throw new Error(data?.error || "Chat request failed");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: data.reply,
          action: data.action || null,
          contactCard: data.contactCard || null,
        },
      ]);
    } catch (err) {
      if (err?.name === "AbortError") return;
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: "Sorry, I couldn't reach the assistant right now. You can email us at info@sagmetic.com or use the contact form below.",
          action: { label: "Open contact form", href: "#contact" },
        },
      ]);
    } finally {
      if (!controller.signal.aborted) {
        setIsTyping(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleReset = () => {
    abortRef.current?.abort();
    setIsTyping(false);
    setMessages(INITIAL_MESSAGES);
    inputRef.current?.focus();
  };

  const handleActionClick = (href) => {
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className="sm:hidden fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px]"
      />

      <aside
        ref={panelRef}
        role="dialog"
        aria-label="Sagmetic Assistant Chat"
        style={{
          fontFamily: "'Montserrat', sans-serif",
          transformOrigin: "bottom right",
        }}
        className="fixed z-50 inset-x-3 bottom-3 sm:inset-x-auto sm:right-0 sm:bottom-4 sm:w-[368px] max-h-[min(460px,calc(100dvh-5.5rem))] sm:max-h-[min(450px,calc(100dvh-110px))] rounded-2xl sm:rounded-l-2xl sm:rounded-r-none border sm:border-r-0 border-white/12 bg-[#090707]/96 backdrop-blur-xl text-white shadow-[0_20px_60px_rgba(0,0,0,0.82)] flex flex-col overflow-hidden"
      >
      {/* Minimalist Header */}
      <div className="flex items-start justify-between gap-3 px-4 py-3.5 border-b border-white/[0.08] shrink-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="w-2 h-2 rounded-full bg-[#63e6be] shrink-0"
            />
            <h3 className="text-[13px] font-semibold tracking-tight text-white">
              Sagmetic Assistant
            </h3>
          </div>
          <p className="mt-0.5 text-[11px] leading-snug text-zinc-400">
            {isTyping
              ? "Drafting a response..."
              : "AI solutions, services & project timelines"}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0 -mt-0.5">
          {messages.length > 1 && (
            <button
              type="button"
              onClick={handleReset}
              aria-label="Clear conversation"
              title="New chat"
              className="w-7 h-7 rounded-lg hover:bg-white/[0.07] flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close chat"
            title="Close (Esc)"
            className="w-7 h-7 rounded-lg hover:bg-white/[0.07] flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Conversation Stream */}
      <div className="chat-scrollbar flex-1 overflow-y-auto px-4 py-3.5 space-y-2.5">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-[12.5px] leading-[1.55] ${
                  isUser
                    ? "bg-[#DC2D26] text-white"
                    : "bg-white/[0.04] border border-white/[0.08] text-zinc-200"
                }`}
              >
                <p>{msg.text}</p>

                {msg.contactCard && (
                  <div className="mt-2.5 rounded-lg border border-white/10 bg-black/35 p-2.5 space-y-1.5 text-[11.5px]">
                    {msg.contactCard.email && (
                      <a
                        href={`mailto:${msg.contactCard.email}`}
                        className="flex items-center gap-2 text-zinc-200 hover:text-white transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5 text-[#ff7875] shrink-0" />
                        <span className="truncate">{msg.contactCard.email}</span>
                      </a>
                    )}
                    {msg.contactCard.phone && (
                      <a
                        href={`tel:${msg.contactCard.phone.replace(/\s+/g, "")}`}
                        className="flex items-center gap-2 text-zinc-200 hover:text-white transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#ff7875] shrink-0" />
                        <span>{msg.contactCard.phone}</span>
                      </a>
                    )}
                    {msg.contactCard.address && (
                      <div className="flex items-start gap-2 text-zinc-400 text-[11px] leading-snug pt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                        <span>{msg.contactCard.address}</span>
                      </div>
                    )}
                    {Array.isArray(msg.contactCard.socials) &&
                      msg.contactCard.socials.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {msg.contactCard.socials.map((soc) => (
                            <a
                              key={soc.label}
                              href={soc.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] hover:border-white/25 px-2 py-0.5 text-[10.5px] text-zinc-200 hover:text-white transition-colors"
                            >
                              <span>{soc.label}</span>
                              <ArrowUpRight className="w-2.5 h-2.5" />
                            </a>
                          ))}
                        </div>
                      )}
                  </div>
                )}

                {msg.action && (
                  <button
                    type="button"
                    onClick={() => handleActionClick(msg.action.href)}
                    className="mt-2.5 inline-flex items-center gap-1 text-[11.5px] font-medium text-[#ff7875] hover:text-white transition-colors cursor-pointer"
                  >
                    <span>{msg.action.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-[11.5px] text-zinc-400 px-1 py-1">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse [animation-delay:300ms]" />
            </span>
            <span>Sagmetic AI is typing</span>
          </div>
        )}

        {/* Clean Suggested Prompts on initial open */}
        {messages.length === 1 && !isTyping && (
          <div className="pt-2 space-y-1.5">
            <p className="text-[10.5px] font-medium uppercase tracking-wider text-zinc-500">
              Try asking
            </p>
            <div className="flex flex-col gap-1.5">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="group w-full flex items-center justify-between gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20 px-3 py-2 text-left text-[12px] text-zinc-300 hover:text-white transition-colors cursor-pointer"
                >
                  <span>{prompt}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Minimalist Input */}
      <form
        onSubmit={handleSubmit}
        className="px-4 py-3 border-t border-white/[0.08] shrink-0"
      >
        <div className="flex items-center gap-2 rounded-xl border border-white/10 focus-within:border-white/25 bg-white/[0.03] px-3 py-1.5 transition-colors">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Write a message..."
            className="flex-1 min-w-0 bg-transparent text-[16px] sm:text-[12.5px] text-white placeholder:text-zinc-500 outline-none"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            aria-label="Send message"
            className="w-8 h-8 sm:w-7 sm:h-7 rounded-lg bg-[#DC2D26] hover:bg-[#c3231d] disabled:opacity-30 disabled:hover:bg-[#DC2D26] flex items-center justify-center text-white transition-colors shrink-0 cursor-pointer disabled:cursor-not-allowed"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="hidden sm:flex mt-1.5 text-[10px] text-zinc-500 items-center justify-between px-0.5">
          <span>Enter to send</span>
          <span>Esc to close</span>
        </p>
      </form>
    </aside>
    </>
  );
}
