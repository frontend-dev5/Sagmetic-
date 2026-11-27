import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import RobotMascot from "../robotmascot/RobotMascot";
import ChatbotPopup from "./ChatbotPopup";

export default function FloatingMascotDock({
  footerRef,
  splashHoldMs = 1100,
  settleDuration = 1.45,
  onSplashComplete,
}) {
  const dockRef = useRef(null);
  const backdropRef = useRef(null);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onSplashComplete);
  onCompleteRef.current = onSplashComplete;

  const [hiddenAtFooter, setHiddenAtFooter] = useState(false);
  const [splashActive, setSplashActive] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);

  const finishSplash = () => {
    setSplashActive(false);
    window.dispatchEvent(new Event("resize"));
    if (!completedRef.current) {
      completedRef.current = true;
      onCompleteRef.current?.();
    }
  };

  useEffect(() => {
    const dockEl = dockRef.current;
    const backdropEl = backdropRef.current;
    if (!dockEl) return;

    if (window.innerWidth < 1024) {
      gsap.set(dockEl, {
        x: 0,
        y: 0,
        scale: 1,
        autoAlpha: 1,
      });
      if (backdropEl) gsap.set(backdropEl, { autoAlpha: 0 });
      finishSplash();
      return;
    }

    const totalMs =
      Math.round((splashHoldMs / 1000 + settleDuration) * 1000) + 120;
    const fallbackTimer = window.setTimeout(() => {
      finishSplash();
    }, totalMs);

    const ctx = gsap.context(() => {
      gsap.set(dockEl, {
        x: 0,
        y: 0,
        scale: 1,
        transformOrigin: "center center",
      });

      const rect = dockEl.getBoundingClientRect();
      const centerOffsetX = window.innerWidth / 2 - (rect.left + rect.width / 2);
      const centerOffsetY = window.innerHeight / 2 - (rect.top + rect.height / 2);

      gsap.set(dockEl, {
        x: centerOffsetX,
        y: centerOffsetY,
        scale: 2.0,
        transformOrigin: "center center",
        autoAlpha: 1,
      });

      if (backdropEl) {
        gsap.set(backdropEl, { autoAlpha: 1 });
      }

      const tl = gsap.timeline({
        delay: splashHoldMs / 1000,
        onComplete: () => {
          window.clearTimeout(fallbackTimer);
          finishSplash();
        },
      });

      const earlyTriggerOffset = Math.max(0.1, settleDuration - 0.3);

      tl.to(
        dockEl,
        {
          x: 0,
          y: 0,
          scale: 1,
          duration: settleDuration,
          ease: "power3.inOut",
        },
        0,
      ).call(
        () => {
          window.clearTimeout(fallbackTimer);
          finishSplash();
        },
        null,
        earlyTriggerOffset,
      );

      if (backdropEl) {
        tl.to(
          backdropEl,
          {
            autoAlpha: 0,
            duration: settleDuration * 0.78,
            ease: "power2.out",
          },
          0.25,
        );
      }
    });

    return () => {
      window.clearTimeout(fallbackTimer);
      ctx.revert();
    };
  }, [splashHoldMs, settleDuration]);

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
    if (!dockEl || splashActive) return;

    const updateDockPosition = () => {
      const canShowSideBySide = window.innerWidth >= 768;
      const slideLeft = chatOpen && canShowSideBySide ? -368 : 0;
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
  }, [hiddenAtFooter, splashActive, chatOpen]);

  return (
    <>
      <div
        ref={backdropRef}
        aria-hidden={!splashActive}
        className={`hidden lg:flex fixed inset-0 bg-[#050303] items-end justify-center pb-10 ${
          splashActive ? "z-40 pointer-events-auto" : "z-40 pointer-events-none"
        }`}
      >
        <span
          className="text-[11px] uppercase tracking-[0.28em] text-zinc-400"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Sagmetic Infotech
        </span>
      </div>

      <ChatbotPopup isOpen={chatOpen} onClose={() => setChatOpen(false)} />

      <div
        ref={dockRef}
        aria-hidden={hiddenAtFooter && !splashActive}
        className={`fixed bottom-3 right-3 sm:bottom-4 sm:right-4 w-[108px] h-[96px] sm:w-[136px] sm:h-[120px] md:w-[156px] md:h-[138px] xl:w-[185px] xl:h-[160px] 2xl:w-[215px] 2xl:h-[185px] will-change-transform ${
          splashActive ? "z-50" : "z-40"
        } ${hiddenAtFooter && !splashActive ? "pointer-events-none" : ""}`}
      >
        <RobotMascot
          positionX={0}
          splashActive={splashActive}
          chatOpen={chatOpen}
          onRobotClick={() => {
            if (!splashActive) {
              setChatOpen((prev) => !prev);
            }
          }}
          className="w-full h-full"
        />

        {!splashActive && !chatOpen && (
          <button
            type="button"
            onClick={() => setChatOpen(true)}
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
