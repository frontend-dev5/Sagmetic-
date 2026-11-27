import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import AiChipCurrentBg from "./AiChipCurrentBg";
import SplitHeadline from "./SplitHeadline";

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

const TAGLINE_TEXT = "Creative × Technology × AI";

const NAV_ITEMS = [
  { label: "Home", href: "#home", active: true },
  { label: "About Us", href: "#about" },
  { label: "Services", href: "#services", hasDropdown: true },
  { label: "AI Solutions", href: "#ai-solutions" },
  { label: "Case Study", href: "#case-study" },
  { label: "Careers", href: "#careers" },
];

const STATS_ITEMS = [
  { value: "100%", label: "Quality of Work" },
  { value: "200+", label: "Applications built" },
  { value: "20+", label: "Advanced certifications" },
  { value: "10+", label: "Years of Experience" },
  { value: "3000+", label: "Satisfied customers" },
  { value: "95%", label: "Client retention" },
];

const SagmeticHero = ({
  onContactClick,
  splashDone = true,
  splashDelaySeconds,
}) => {
  const [servicesOpen, setServicesOpen] = useState(false);
  const heroRef = useRef(null);
  const agencyRef = useRef(null);
  const taglineRef = useRef(null);

  useEffect(() => {
    const rootEl = heroRef.current;
    if (!rootEl) return;

    const isMobile = window.innerWidth < 1024;
    const canAnimate = isMobile ? true : splashDone;
    if (!canAnimate) return;

    const desktopDelay =
      typeof splashDelaySeconds === "number" ? splashDelaySeconds : 2.15;

    const mm = gsap.matchMedia();

    mm.add("(max-width: 1023px)", () => {
      gsap.fromTo(
        '[data-hero-stagger="true"]',
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.08,
          delay: 0.05,
          ease: "power3.out",
          clearProps: "transform,opacity",
        }
      );

      if (taglineRef.current) {
        gsap.to(taglineRef.current, {
          duration: 1.4,
          delay: 0.15,
          ease: "power2.out",
          scrambleText: {
            text: TAGLINE_TEXT,
            chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ×/&#",
            revealDelay: 0.2,
            speed: 0.3,
          },
        });
      }
    });

    mm.add("(min-width: 1024px)", () => {
      gsap.fromTo(
        '[data-hero-stagger="true"]',
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.1,
          delay: desktopDelay,
          ease: "power3.out",
          clearProps: "transform,opacity",
        }
      );

      if (taglineRef.current) {
        gsap.to(taglineRef.current, {
          duration: 1.7,
          delay: desktopDelay + 0.15,
          ease: "power2.out",
          scrambleText: {
            text: TAGLINE_TEXT,
            chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ×/&#",
            revealDelay: 0.25,
            speed: 0.25,
          },
        });
      }

      if (agencyRef.current) {
        gsap.to(agencyRef.current, {
          y: -18,
          ease: "none",
          scrollTrigger: {
            trigger: rootEl,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      }
    });

    return () => mm.revert();
  }, [splashDone, splashDelaySeconds]);

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative min-h-screen w-full overflow-hidden bg-[#050303] text-white flex flex-col justify-between selection:bg-[#DE2D26] selection:text-white"
    >
      {/* Top crimson ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 -top-[240px] -translate-x-1/2 w-[760px] h-[520px] rounded-full blur-[130px] opacity-55 z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(222,45,38,0.65) 0%, rgba(222,45,38,0.2) 50%, rgba(0,0,0,0) 75%)",
        }}
      />

      {/* Interactive SVG AI chip background (restored across all viewports) */}
      <AiChipCurrentBg triggerRef={heroRef} />

      {/* Pill Navigation Bar */}
      <header className="relative z-30 max-w-[1360px] w-full mx-auto px-4 pt-6">
        <nav className="flex items-center justify-between rounded-full border border-white/[0.09] bg-[#0d0707]/80 px-5 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.65)]">
          <a href="#home" className="flex items-center gap-2.5">
            <img className="md:w-auto w-50" src="/images/logo.png" alt="logo" />
          </a>

          <ul className="hidden md:flex items-center gap-7 text-[12px] font-medium text-zinc-400">
            {NAV_ITEMS.map((item) => (
              <li key={item.label} className="relative">
                {item.hasDropdown ? (
                  <button
                    type="button"
                    onClick={() => setServicesOpen((prev) => !prev)}
                    className="inline-flex items-center gap-1 hover:text-white transition cursor-pointer"
                  >
                    <span>{item.label}</span>
                    <span className="text-[10px]">⌄</span>
                  </button>
                ) : (
                  <a
                    href={item.href}
                    className={`transition ${
                      item.active ? "text-white" : "hover:text-white"
                    }`}
                  >
                    {item.label}
                  </a>
                )}

                {item.hasDropdown && servicesOpen && (
                  <div className="absolute left-0 top-8 w-44 rounded-xl border border-white/10 bg-zinc-950 p-2 text-xs text-zinc-300 shadow-xl">
                    <a
                      href="#services"
                      className="block rounded-lg px-3 py-2 hover:bg-white/5 hover:text-white"
                    >
                      AI &amp; Automation
                    </a>
                    <a
                      href="#services"
                      className="block rounded-lg px-3 py-2 hover:bg-white/5 hover:text-white"
                    >
                      Creative &amp; Brand
                    </a>
                    <a
                      href="#services"
                      className="block rounded-lg px-3 py-2 hover:bg-white/5 hover:text-white"
                    >
                      Web &amp; Product Engineering
                    </a>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={onContactClick}
            className="rounded-full bg-[#DE2D26] hover:bg-[#c6241e] px-5 py-2 text-[12px] font-medium text-white transition cursor-pointer"
          >
            Contact Us
          </button>
        </nav>
      </header>

      {/* Center Hero Headline */}
      <div className="relative z-20 max-w-[1360px] w-full mx-auto px-4 py-12 lg:pb-16 xl:pb-20 2xl:pb-12 flex flex-col items-center text-center select-none">
        <p
          data-hero-stagger="true"
          className="text-[12px] sm:text-[13px] tracking-[0.06em] text-zinc-300 mb-4"
        >
          <span
            ref={taglineRef}
            className="inline-block text-[14px] font-semibold tracking-[0.04em] bg-clip-text text-transparent mb-3"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              backgroundImage:
                "linear-gradient(90deg, #DE2D26 0%, #FFFFFF 50%, #DC2D26 100%)",
            }}
          >
            {TAGLINE_TEXT}
          </span>
        </p>

        <SplitHeadline
          splashDone={splashDone}
          agencyRef={(node) => {
            agencyRef.current = node;
          }}
        />
      </div>

      {/* Bottom Stats Marquee Strip */}
      <div className="group relative z-20 border-t border-white/10 bg-black/75 overflow-hidden py-4 select-none">
        <div className="flex w-max animate-stats-marquee group-hover:[animation-play-state:paused] will-change-transform">
          {[0, 1].map((dupIdx) => (
            <div
              key={dupIdx}
              aria-hidden={dupIdx === 1}
              className="flex items-center shrink-0"
            >
              {STATS_ITEMS.map((stat) => (
                <div
                  key={`${dupIdx}-${stat.label}`}
                  className="flex items-baseline gap-2.5 px-8 whitespace-nowrap"
                >
                  <span className="text-sm font-bold text-white">
                    {stat.value}
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    {stat.label}
                  </span>
                  <span className="ml-4 text-white/15">•</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SagmeticHero;