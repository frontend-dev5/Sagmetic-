import { lazy, Suspense, useEffect, useRef, useState } from "react";
import gsap from "gsap";

const RobotMascot = lazy(() => import("../robotmascot/RobotMascot"));
const ChatbotPopup = lazy(() => import("./ChatbotPopup"));

export default function FloatingMascotDock({
  footerRef,
  onSplashComplete,
}) {
  const dockRef = useRef(null);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onSplashComplete);
  onCompleteRef.current = onSplashComplete;

  const [hiddenAtFooter, setHiddenAtFooter] = useState(false);
  const [robotReady, setRobotReady] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [hasOpenedChat, setHasOpenedChat] = useState(false);

  const openChat = () => {
    setHasOpenedChat(true);
    setChatOpen(true);
  };

  const toggleChat = () => {
    setHasOpenedChat(true);
    setChatOpen((prev) => !prev);
  };

  const prefetchChat = () => {
    import("./ChatbotPopup");
  };

  useEffect(() => {
    if (!completedRef.current) {
      completedRef.current = true;
      onCompleteRef.current?.();
    }

    const dockEl = dockRef.current;
    if (!dockEl) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        dockEl,
        { y: 18, scale: 0.9, autoAlpha: 0 },
        {
          y: 0,
          scale: 1,
          autoAlpha: 1,
          duration: 0.45,
          ease: "power3.out",
        },
      );
    });

    return () => {
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const enableRobot = () => {
      if (!cancelled) setRobotReady(true);
    };

    if (typeof window.requestIdleCallback === "function") {
      const idleId = window.requestIdleCallback(enableRobot, { timeout: 350 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(idleId);
      };
    }

    const timerId = window.setTimeout(enableRobot, 120);
    return () => {
      cancelled = true;
      window.clearTimeout(timerId);
    };
  }, []);

  useEffect(() => {
    const checkVisibility = () => {
      const footerEl = footerRef?.current;
      const nearBottomOfPage =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 40;

      if (footerEl) {
        const rect = footerEl.getBoundingClientRect();
        const footerInView =
          rect.top <= window.innerHeight * 0.95 && rect.bottom >= 0;
        setHiddenAtFooter(footerInView || nearBottomOfPage);
      } else {
        setHiddenAtFooter(nearBottomOfPage);
      }
    };

    checkVisibility();
    window.addEventListener("scroll", checkVisibility, { passive: true });
    window.addEventListener("resize", checkVisibility);

    return () => {
      window.removeEventListener("scroll", checkVisibility);
      window.removeEventListener("resize", checkVisibility);
    };
  }, [footerRef]);

  useEffect(() => {
    const dockEl = dockRef.current;
    if (!dockEl) return;

    const updateDockPosition = () => {
      const canShowSideBySide = window.innerWidth >= 768;
      const slideLeft = chatOpen && canShowSideBySide ? -396 : 0;
      const hideWithOverlayChat = chatOpen && !canShowSideBySide;
      const shouldHide = hiddenAtFooter || hideWithOverlayChat;

      gsap.to(dockEl, {
        x: slideLeft,
        y: shouldHide ? 18 : 0,
        scale: chatOpen && canShowSideBySide ? 0.9 : 1,
        autoAlpha: shouldHide ? 0 : 1,
        duration: 0.38,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    updateDockPosition();
    window.addEventListener("resize", updateDockPosition);
    return () => window.removeEventListener("resize", updateDockPosition);
  }, [hiddenAtFooter, chatOpen]);

  return (
    <>
      {hasOpenedChat ? (
        <Suspense fallback={null}>
          <ChatbotPopup isOpen={chatOpen} onClose={() => setChatOpen(false)} />
        </Suspense>
      ) : null}

      <div
        ref={dockRef}
        aria-hidden={hiddenAtFooter}
        onPointerEnter={prefetchChat}
        onFocus={prefetchChat}
        className={`fixed bottom-3 right-3 sm:bottom-4 sm:right-4 w-[108px] h-[96px] sm:w-[136px] sm:h-[120px] md:w-[156px] md:h-[138px] xl:w-[185px] xl:h-[160px] 2xl:w-[215px] 2xl:h-[185px] z-40 will-change-transform ${
          hiddenAtFooter ? "pointer-events-none" : ""
        }`}
      >
        {robotReady ? (
          <Suspense fallback={null}>
            <RobotMascot
              positionX={0}
              splashActive={false}
              chatOpen={chatOpen}
              paused={hiddenAtFooter}
              onRobotClick={toggleChat}
              className="w-full h-full"
            />
          </Suspense>
        ) : null}

        {!chatOpen && (
          <button
            type="button"
            onClick={openChat}
            aria-label="Open Sagmetic AI chat"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
            className="lg:hidden absolute -bottom-1 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-[#0d0707]/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-medium text-zinc-200 shadow-lg whitespace-nowrap cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#63e6be]" />
            <span>Ask AI</span>
          </button>
        )}
      </div>
    </>
  );
}
