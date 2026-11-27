import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  Mail,
  MapPin,
  Mic,
  Phone,
  RotateCcw,
  Send,
  X,
} from "lucide-react";

const PROMPT_CHIPS = [
  "What AI systems do you build?",
  "How fast can we ship an MVP?",
  "Let's talk about a project",
];

function renderInlineBold(text) {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={idx} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function FormattedMessageText({ text, isStreaming = false }) {
  const lines = String(text || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const blocks = [];
  let currentList = [];

  for (const line of lines) {
    const bulletMatch = line.match(/^(?:[-•*]|\d+[.)])\s+(.*)$/);
    if (bulletMatch) {
      currentList.push(bulletMatch[1]);
    } else {
      if (currentList.length > 0) {
        blocks.push({ type: "list", items: currentList });
        currentList = [];
      }
      blocks.push({ type: "paragraph", content: line });
    }
  }
  if (currentList.length > 0) {
    blocks.push({ type: "list", items: currentList });
  }

  return (
    <div className="space-y-1.5 text-[12.5px] leading-[19px] tracking-[0.1px] text-[#E0E2EE] text-pretty">
      {blocks.map((block, idx) => {
        const isLastBlock = idx === blocks.length - 1;
        return block.type === "list" ? (
          <ul key={idx} className="space-y-1 pl-0.5">
            {block.items.map((item, itemIdx) => {
              const isLastItem = isLastBlock && itemIdx === block.items.length - 1;
              return (
                <li key={itemIdx} className="flex items-start gap-2">
                  <span
                    aria-hidden="true"
                    className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#FB7185]"
                  />
                  <span>
                    {renderInlineBold(item)}
                    {isStreaming && isLastItem && (
                      <span
                        aria-hidden="true"
                        className="inline-block w-[2px] h-3.5 bg-[#FB7185] ml-1 align-middle animate-cursor-blink"
                      />
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p key={idx}>
            {renderInlineBold(block.content)}
            {isStreaming && isLastBlock && (
              <span
                aria-hidden="true"
                className="inline-block w-[2px] h-3.5 bg-[#FB7185] ml-1 align-middle animate-cursor-blink"
              />
            )}
          </p>
        );
      })}
    </div>
  );
}

export default function ChatbotPopup({ isOpen, onClose }) {
  const panelRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);
  const recognitionRef = useRef(null);
  const streamDelayRef = useRef(null);
  const streamIntervalRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceTitle, setVoiceTitle] = useState("Listening...");
  const [voiceStatus, setVoiceStatus] = useState(
    "Speak naturally — tap the mic to stop"
  );

  const stopTypewriter = useCallback(() => {
    if (streamDelayRef.current) {
      window.clearTimeout(streamDelayRef.current);
      streamDelayRef.current = null;
    }
    if (streamIntervalRef.current) {
      window.clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  const cleanupRecognition = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch {
        // Ignore stop errors if recognition has already ended
      }
      recognitionRef.current = null;
    }
  }, []);

  const stopVoiceRecognition = useCallback(() => {
    cleanupRecognition();
    setIsListening(false);
    setVoiceTitle("Listening...");
    setVoiceStatus("Speak naturally — tap the mic to stop");
  }, [cleanupRecognition]);

  const handleClose = useCallback(() => {
    stopVoiceRecognition();
    onClose?.();
  }, [onClose, stopVoiceRecognition]);

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
          duration: 0.24,
          ease: "power3.out",
        }
      );
    } else {
      cleanupRecognition();
      gsap.set(panel, { autoAlpha: 0 });
    }
  }, [isOpen, cleanupRecognition]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  useEffect(() => {
    if (!isOpen || isListening) return;
    if (messages.length > 0 || isTyping) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen, isListening]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      cleanupRecognition();
      if (streamDelayRef.current) window.clearTimeout(streamDelayRef.current);
      if (streamIntervalRef.current) window.clearInterval(streamIntervalRef.current);
    };
  }, [cleanupRecognition]);

  const typewriteBotMessage = useCallback(
    ({ text, action = null, contactCard = null }) => {
      stopTypewriter();
      const fullText = String(text || "");
      const botId = `bot-${Date.now()}`;

      setIsTyping(false);
      setIsStreaming(true);
      setMessages((prev) => [
        ...prev,
        {
          id: botId,
          sender: "bot",
          text: "",
          action: null,
          contactCard: null,
          isStreaming: true,
        },
      ]);

      let cursor = 0;
      streamIntervalRef.current = window.setInterval(() => {
        cursor = Math.min(fullText.length, cursor + 3);
        const done = cursor >= fullText.length;

        setMessages((prev) =>
          prev.map((m) =>
            m.id === botId
              ? {
                  ...m,
                  text: fullText.slice(0, cursor),
                  isStreaming: !done,
                  action: done ? action : null,
                  contactCard: done ? contactCard : null,
                }
              : m
          )
        );

        if (done) {
          if (streamIntervalRef.current) {
            window.clearInterval(streamIntervalRef.current);
            streamIntervalRef.current = null;
          }
          setIsStreaming(false);
        }
      }, 20);
    },
    [stopTypewriter]
  );

  const sendMessage = useCallback(
    async (rawText) => {
      const text = rawText.trim();
      if (!text || isTyping || isStreaming) return;

      stopVoiceRecognition();
      stopTypewriter();

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

      const startedAt = Date.now();

      const scheduleReply = (payload) => {
        const remainingDelay = Math.max(0, 420 - (Date.now() - startedAt));
        streamDelayRef.current = window.setTimeout(() => {
          streamDelayRef.current = null;
          if (!controller.signal.aborted) {
            typewriteBotMessage(payload);
          }
        }, remainingDelay);
      };

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

        scheduleReply({
          text: data.reply,
          action: data.action || null,
          contactCard: data.contactCard || null,
        });
      } catch (err) {
        if (err?.name === "AbortError") return;
        scheduleReply({
          text: "Sorry, I couldn't reach the assistant right now.\n- **Email:** info@sagmetic.com\n- **Contact:** Use our form below",
          action: { label: "Open contact form", href: "#contact" },
        });
      }
    },
    [isTyping, isStreaming, messages, stopVoiceRecognition, stopTypewriter, typewriteBotMessage]
  );

  const startSpeechRecognition = () => {
    cleanupRecognition();

    const SpeechRecognition =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (typeof window !== "undefined" && window.isSecureContext === false) {
      setVoiceTitle("HTTPS required");
      setVoiceStatus("Voice input needs HTTPS or localhost — tap Back to type");
      return;
    }

    if (!SpeechRecognition) {
      setVoiceTitle("Voice preview");
      setVoiceStatus("Speech recognition isn't supported in this browser");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      let lastTranscript = "";
      let sentFinal = false;
      let hadError = false;

      recognition.onresult = (event) => {
        let transcript = "";
        let isFinal = false;
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
          if (event.results[i].isFinal) isFinal = true;
        }
        const cleaned = transcript.trim();
        if (cleaned) {
          lastTranscript = cleaned;
          setVoiceTitle("Listening...");
          setVoiceStatus(`"${cleaned}"`);
          if (isFinal && !sentFinal) {
            sentFinal = true;
            sendMessage(cleaned);
          }
        }
      };

      recognition.onerror = (event) => {
        hadError = true;
        const code = event?.error;
        if (code === "not-allowed" || code === "service-not-allowed") {
          setVoiceTitle("Mic blocked");
          setVoiceStatus("Allow microphone access in your browser, or type below");
        } else if (code === "audio-capture") {
          setVoiceTitle("No mic detected");
          setVoiceStatus("Check your microphone connection and try again");
        } else if (code === "network") {
          setVoiceTitle("Voice unavailable");
          setVoiceStatus("Browser speech service blocked/offline — type below");
        } else if (code === "no-speech") {
          setVoiceTitle("Didn't catch that");
          setVoiceStatus("Tap Retry to speak again, or type below");
        } else {
          setVoiceTitle("Voice paused");
          setVoiceStatus("Tap Retry to speak again, or go back to chat");
        }
      };

      recognition.onend = () => {
        recognitionRef.current = null;
        if (sentFinal) return;
        if (lastTranscript) {
          sentFinal = true;
          sendMessage(lastTranscript);
          return;
        }
        if (!hadError) {
          setVoiceTitle("Voice paused");
          setVoiceStatus("Tap Retry to speak again, or go back to chat");
        }
      };

      recognitionRef.current = recognition;
      setVoiceTitle("Listening...");
      setVoiceStatus("Speak naturally — tap the mic to stop");
      recognition.start();
    } catch {
      setVoiceTitle("Voice unavailable");
      setVoiceStatus("Could not start microphone — tap Back to type");
    }
  };

  const toggleVoiceMode = () => {
    if (isListening) {
      stopVoiceRecognition();
      return;
    }

    setIsListening(true);
    startSpeechRecognition();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleReset = () => {
    abortRef.current?.abort();
    stopVoiceRecognition();
    stopTypewriter();
    setIsTyping(false);
    setMessages([]);
    inputRef.current?.focus();
  };

  const handleActionClick = (href) => {
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    handleClose();
  };

  if (!isOpen) return null;

  const showCursorOverlay = inputValue.length === 0 && !isFocused;

  return (
    <>
      <div
        aria-hidden="true"
        onClick={handleClose}
        className="sm:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
      />

      <aside
        ref={panelRef}
        id="assistant-popup"
        role="dialog"
        aria-label="Sagmetic Assistant"
        style={{
          fontFamily: "'Instrument Sans', sans-serif",
          transformOrigin: "bottom right",
        }}
        className="fixed z-50 inset-x-3 bottom-3 sm:inset-x-auto sm:right-2 sm:bottom-4 sm:w-96 max-w-full antialiased selection:bg-[#F43F5E]/30 selection:text-[#E0E2EE]"
      >
        {/* Soft Warm Crimson-to-Ember Outer Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-xl bg-gradient-to-br from-[#F43F5E]/35 via-[#EF4444]/20 to-[#F97316]/20 blur-md opacity-80"
        />

        {/* Frosted Glass Card */}
        <div className="relative flex flex-col overflow-hidden rounded-xl border border-[#E0E2EE]/15 bg-[#181B24]/95 backdrop-blur-2xl shadow-2xl max-h-[min(540px,calc(100dvh-5.5rem))] sm:max-h-[min(580px,calc(100dvh-110px))]">
          {/* Internal Soft Atmospheric Gradient Sheen */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#F43F5E]/10 via-transparent to-[#F97316]/10"
          />
          {/* Specular Crimson Top Rim */}
          <div
            aria-hidden="true"
            className="relative h-px w-full bg-gradient-to-r from-transparent via-[#FB7185]/75 to-transparent shrink-0"
          />

          {/* Header */}
          <header className="relative flex items-center justify-between px-4 pt-4 pb-3 shrink-0">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <img
                  src="/images/logo.png"
                  alt="Sagmetic"
                  className="h-6 w-auto max-w-[165px] object-contain shrink-0"
                />
                <span
                  className="h-1.5 w-1.5 rounded-full bg-[#FB7185] shrink-0"
                  title="Online"
                />
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={handleReset}
                  aria-label="Reset conversation"
                  title="New chat"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[#BBC9CD] transition-colors duration-150 ease-out hover:bg-[#272A33] hover:text-[#E0E2EE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F43F5E] cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="button"
                onClick={handleClose}
                aria-label="Close dialog"
                title="Close (Esc)"
                className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[#BBC9CD] transition-colors duration-150 ease-out hover:bg-[#272A33] hover:text-[#E0E2EE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F43F5E] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Default Text & Prompts Body */}
          {!isListening ? (
            <div className="chat-scrollbar relative flex-1 overflow-y-auto flex flex-col gap-4 px-4 pt-2 pb-4">
              {/* Warm Human Greeting with Subtle Crimson Accent Line */}
              <div className="flex flex-col gap-1 border-l-2 border-[#F43F5E]/70 pl-3">
                <h3 className="text-[16px] leading-[22px] font-semibold text-[#E0E2EE] text-balance">
                  Hey — what are we building?
                </h3>
                <p className="text-[12px] leading-[18px] tracking-[0.1px] text-[#BBC9CD] text-pretty">
                  Ask about our AI work, web &amp; app builds, or project timelines.
                </p>
              </div>

              {/* Dynamic Conversation Thread */}
              {(messages.length > 0 || isTyping) && (
                <div className="flex flex-col gap-2">
                  {messages.map((msg) => {
                    const isUser = msg.sender === "user";
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-lg px-3 py-2 ${
                            isUser
                              ? "bg-[#9F1239]/60 border border-[#F43F5E]/35"
                              : "bg-[#1C1F28]/90 border border-[#E0E2EE]/10"
                          }`}
                        >
                          <FormattedMessageText
                            text={msg.text}
                            isStreaming={Boolean(msg.isStreaming)}
                          />

                          {msg.contactCard && (
                            <div className="mt-2 rounded-lg border border-[#E0E2EE]/10 bg-[#0B0E16]/75 p-2.5 space-y-1.5 text-[11.5px]">
                              {msg.contactCard.email && (
                                <a
                                  href={`mailto:${msg.contactCard.email}`}
                                  className="flex items-center gap-2 text-[#E0E2EE] hover:text-[#FB7185] transition-colors"
                                >
                                  <Mail className="w-3.5 h-3.5 text-[#FB7185] shrink-0" />
                                  <span className="truncate">
                                    {msg.contactCard.email}
                                  </span>
                                </a>
                              )}
                              {msg.contactCard.phone && (
                                <a
                                  href={`tel:${msg.contactCard.phone.replace(/\s+/g, "")}`}
                                  className="flex items-center gap-2 text-[#E0E2EE] hover:text-[#FB7185] transition-colors"
                                >
                                  <Phone className="w-3.5 h-3.5 text-[#FB7185] shrink-0" />
                                  <span>{msg.contactCard.phone}</span>
                                </a>
                              )}
                              {msg.contactCard.address && (
                                <div className="flex items-start gap-2 text-[#BBC9CD] text-[11px] leading-snug pt-0.5">
                                  <MapPin className="w-3.5 h-3.5 text-[#859397] shrink-0 mt-0.5" />
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
                                        className="inline-flex items-center gap-1 rounded-md border border-[#E0E2EE]/12 bg-[#1C1F28]/80 hover:border-[#F43F5E]/50 px-2 py-0.5 text-[10.5px] text-[#E0E2EE] transition-colors"
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
                              className="mt-2 inline-flex items-center gap-1 text-[11.5px] font-medium text-[#FB7185] hover:text-[#E0E2EE] transition-colors cursor-pointer"
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
                    <div className="flex justify-start">
                      <div className="rounded-lg bg-[#1C1F28]/90 border border-[#E0E2EE]/10 px-3 py-2 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FB7185] animate-pulse" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FB7185] animate-pulse [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FB7185] animate-pulse [animation-delay:300ms]" />
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}

              {/* Sleek Pill Prompt Chips (shown on fresh open) */}
              {messages.length === 0 && !isTyping && (
                <div className="flex flex-col gap-2">
                  {PROMPT_CHIPS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      className="group flex w-full items-center justify-between gap-3 rounded-full border border-[#E0E2EE]/12 bg-[#0B0E16]/75 px-4 py-2 text-left transition-all duration-150 ease-out hover:border-[#F43F5E]/60 hover:bg-[#1C1F28]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F43F5E] cursor-pointer"
                    >
                      <span className="text-[14px] leading-[20px] font-medium text-[#E0E2EE]">
                        {prompt}
                      </span>
                      <ArrowRight
                        className="w-4 h-4 text-[#FB7185] transition-transform duration-150 group-hover:translate-x-0.5 shrink-0"
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Siri-Style Animated Voice Blob View */
            <div className="relative flex flex-col items-center justify-center gap-4 px-4 py-6 min-h-60">
              <div className="relative flex h-32 w-32 items-center justify-center">
                <div
                  aria-hidden="true"
                  className="siri-blob-a absolute inset-0 bg-gradient-to-tr from-[#F43F5E]/70 via-[#EC4899]/60 to-[#F97316]/70 blur-xl opacity-80"
                />
                <div
                  aria-hidden="true"
                  className="siri-blob-b absolute inset-2 bg-gradient-to-bl from-[#F97316]/80 via-[#F43F5E]/75 to-[#EF4444]/70 blur-md opacity-90"
                />
                <div
                  aria-hidden="true"
                  className="siri-blob-a absolute inset-4 bg-gradient-to-r from-[#FB7185]/80 via-[#EC4899]/70 to-[#F97316]/80 opacity-90"
                />
                <div className="siri-core relative flex h-14 w-14 items-center justify-center rounded-full bg-[#0B0E16]/60 backdrop-blur-md border border-[#E0E2EE]/25 shadow-lg">
                  <AudioLines className="w-7 h-7 text-[#FB7185]" />
                </div>
              </div>

              <div className="flex flex-col items-center gap-1 text-center">
                <p className="text-[16px] leading-[22px] font-semibold text-[#E0E2EE]">
                  {voiceTitle}
                </p>
                <p className="text-[12px] leading-[18px] tracking-[0.1px] text-[#BBC9CD] max-w-[260px]">
                  {voiceStatus}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {voiceTitle !== "Listening..." && (
                  <button
                    type="button"
                    onClick={startSpeechRecognition}
                    className="rounded-full border border-[#F43F5E]/40 bg-[#F43F5E]/15 px-4 py-1 text-[12px] leading-[16px] tracking-[0.4px] font-semibold text-[#FB7185] transition-colors duration-150 hover:bg-[#F43F5E]/25 hover:text-[#E0E2EE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F43F5E] cursor-pointer"
                  >
                    Retry
                  </button>
                )}

                <button
                  type="button"
                  onClick={stopVoiceRecognition}
                  className="rounded-full border border-[#E0E2EE]/15 bg-[#0B0E16]/80 px-4 py-1 text-[12px] leading-[16px] tracking-[0.4px] font-semibold text-[#BBC9CD] transition-colors duration-150 hover:border-[#F43F5E]/50 hover:text-[#E0E2EE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F43F5E] cursor-pointer"
                >
                  {voiceTitle === "Listening..." ? "Stop listening" : "Back to chat"}
                </button>
              </div>
            </div>
          )}

          {/* Aesthetic Input Bar with Mic on the Left */}
          <footer className="relative px-4 pb-4 pt-1 shrink-0">
            <form
              onSubmit={handleSubmit}
              className="relative flex items-center rounded-full border border-[#E0E2EE]/15 bg-[#0B0E16]/90 pl-1 pr-1 py-1 shadow-inner focus-within:border-[#F43F5E]/70 focus-within:ring-1 focus-within:ring-[#F43F5E]/40 transition-colors duration-150 ease-out"
            >
              {/* Left Mic Trigger Button */}
              <button
                type="button"
                onClick={toggleVoiceMode}
                aria-label="Toggle voice input"
                aria-pressed={isListening}
                className={`mr-2 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-150 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F43F5E] cursor-pointer ${
                  isListening
                    ? "bg-[#F43F5E]/20 text-[#FB7185]"
                    : "text-[#BBC9CD] hover:bg-[#272A33] hover:text-[#FB7185]"
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>

              <div className="relative flex flex-1 items-center min-w-0">
                {showCursorOverlay && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 flex items-center gap-1"
                  >
                    <span className="inline-block h-4 w-0.5 rounded-full bg-[#FB7185] animate-cursor-blink" />
                    <span className="text-[14px] leading-[21px] text-[#BBC9CD]">
                      Write a message...
                    </span>
                  </div>
                )}

                <label htmlFor="chat-input" className="sr-only">
                  Write a message
                </label>
                <input
                  ref={inputRef}
                  id="chat-input"
                  type="text"
                  autoComplete="off"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="w-full border-0 bg-transparent p-0 py-1 text-[16px] sm:text-[14px] leading-[21px] text-[#E0E2EE] focus:outline-none focus:ring-0"
                />
              </div>

              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping || isStreaming}
                aria-label="Send message"
                className="ml-2 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F43F5E] via-[#EF4444] to-[#F97316] text-[#E0E2EE] shadow-lg shadow-[#F43F5E]/35 transition-transform duration-150 ease-out hover:scale-105 active:scale-95 disabled:opacity-45 disabled:hover:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F43F5E] cursor-pointer disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </footer>
        </div>
      </aside>
    </>
  );
}
