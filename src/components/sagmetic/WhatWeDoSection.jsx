import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

const SERVICES = [
  {
    id: "website-design",
    index: "01",
    label: "WEBSITE DESIGN",
    emblem: "/images/w.png",
  },
  {
    id: "website-development",
    index: "02",
    label: "WEBSITE DEVELOPMENT",
    emblem: "/images/w.png",
  },
  {
    id: "app-development",
    index: "03",
    label: "APP DEVELOPMENT",
    emblem: "/images/w.png",
  },
  {
    id: "ai-solutions-integration",
    index: "04",
    label: "AI SOLUTIONS & INTEGRATION",
    emblem: "/images/w.png",
  },
  {
    id: "search-engine-optimization",
    index: "05",
    label: "SEARCH ENGINE OPTIMIZATION",
    emblem: "/images/w.png",
  },
];

const TECH_STACK = [
  { name: "React", logo: "/images/react.png" },
  { name: "NEXT.js", logo: "/images/nextjs.png" },
  { name: "TypeScript", logo: "/images/typescript.png" },
  { name: "JavaScript", logo: "/images/javascript.png" },
  { name: "python", logo: "/images/python.png" },
  { name: "OpenAI", logo: "/images/openai.png" },
  { name: "LangChain", logo: "/images/langchain.png" },
  { name: "LlamaIndex", logo: "/images/llamaindex.png" },
  { name: "TensorFlow", logo: "/images/tensorflow.png" },
  { name: "Firebase", logo: "/images/firebase.png" },
];

export default function WhatWeDoSection({
  services = SERVICES,
  techItems = TECH_STACK,
  onSelectService,
}) {
  const sectionRef = useRef(null);
  const listWrapRef = useRef(null);
  const rowRefs = useRef([]);
  const labelRefs = useRef([]);
  const activeBgRef = useRef(null);
  const emblemRef = useRef(null);
  const emblemQuickRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

const getLabelOnlyChars = (targetText) => {
  const cleanUpper = String(targetText || "").toUpperCase();
  // Keep only unique non-space characters from the target label itself
  const uniqueChars = Array.from(new Set(cleanUpper.replace(/\s+/g, "").split("")));
  return uniqueChars.length > 0 ? uniqueChars.join("") : cleanUpper;
};

const scrambleServiceLabel = (index, targetText) => {
  const labelEl = labelRefs.current[index];
  if (!labelEl) return;

  const ownLabelChars = getLabelOnlyChars(targetText);

  gsap.killTweensOf(labelEl);
  gsap.to(labelEl, {
    duration: 0.9,
    ease: "power2.out",
    scrambleText: {
      text: targetText,
      chars: ownLabelChars,
      revealDelay: 0.22,
      speed: 0.35,
    },
    overwrite: "auto",
  });
};

  const moveHighlightToRow = (index, instant = false) => {
    const listEl = listWrapRef.current;
    const rowEl = rowRefs.current[index];
    const barEl = activeBgRef.current;
    if (!listEl || !rowEl || !barEl) return;

    const listRect = listEl.getBoundingClientRect();
    const rowRect = rowEl.getBoundingClientRect();
    const topOffset = rowRect.top - listRect.top;

    if (instant) {
      gsap.set(barEl, {
        y: topOffset,
        height: rowRect.height,
      });
      return;
    }

    gsap.to(barEl, {
      y: topOffset,
      height: rowRect.height,
      duration: 0.42,
      ease: "power3.out",
      overwrite: "auto",
    });

    if (emblemRef.current) {
      gsap.fromTo(
        emblemRef.current,
        { scale: 0.9, rotate: -5 },
        {
          scale: 1,
          rotate: 0,
          duration: 0.45,
          ease: "back.out(1.5)",
          overwrite: "auto",
        }
      );
    }
  };

  useEffect(() => {
    moveHighlightToRow(activeIndex, false);
  }, [activeIndex]);

 useEffect(() => {
  const root = sectionRef.current;
  if (!root) return;

  const ctx = gsap.context(() => {
    moveHighlightToRow(0, true);

    if (emblemRef.current) {
      gsap.set(emblemRef.current, {
        transformPerspective: 800,
        rotateX: 0,
        rotateY: 0,
      });

      emblemQuickRef.current = {
        x: gsap.quickTo(emblemRef.current, "x", {
          duration: 0.35,
          ease: "power2.out",
        }),
        y: gsap.quickTo(emblemRef.current, "y", {
          duration: 0.35,
          ease: "power2.out",
        }),
      };
    }

    gsap.from('[data-tech-item="true"]', {
      y: 22,
      autoAlpha: 0,
      duration: 0.55,
      stagger: { amount: 0.35, from: "start" },
      ease: "power3.out",
      scrollTrigger: {
        trigger: '[data-tech-grid="true"]',
        start: "top 85%",
        once: true,
      },
    });
  }, root);

  const handleResize = () => moveHighlightToRow(activeIndex, true);
  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
    ctx.revert();
  };
}, []);

  const handleRowHover = (idx, service) => {
    setActiveIndex(idx);
    scrambleServiceLabel(idx, service.label);
  };

const handleListMouseMove = (e) => {
  const q = emblemQuickRef.current;
  const listEl = listWrapRef.current;
  const emblemEl = emblemRef.current;
  if (!q || !listEl || !emblemEl) return;

  const rect = listEl.getBoundingClientRect();
  const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
  const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

  q.x(normX * 14);
  q.y(normY * 10);

  gsap.to(emblemEl, {
    rotateY: normX * 12,
    rotateX: -normY * 10,
    duration: 0.35,
    ease: "power2.out",
    overwrite: "auto",
  });
};

const handleListMouseLeave = () => {
  const q = emblemQuickRef.current;
  const emblemEl = emblemRef.current;
  if (!q || !emblemEl) return;

  q.x(0);
  q.y(0);

  gsap.to(emblemEl, {
    rotateY: 0,
    rotateX: 0,
    duration: 0.35,
    ease: "power2.out",
    overwrite: "auto",
  });
};
  const currentService = services[activeIndex] || services[0];

  return (
    <section
      ref={sectionRef}
      id="what-we-do"
      className="relative z-10 w-full bg-[#FFFFFF] text-[#000000] pt-28 pb-24 lg:pt-36 lg:pb-32 overflow-x-clip"
    >
      <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-14">
        {/* Section Heading: What We Do. */}
        <h2
          className="text-[#000000] mb-8 lg:mb-10"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700,
            fontSize: "26px",
            lineHeight: "100%",
            letterSpacing: "0%",
          }}
        >
          What We Do.
        </h2>

        {/* Rows Wrapper with Gliding #DC2D26 Highlight Bar & Hover Scramble */}
        <div
          ref={listWrapRef}
          onMouseMove={handleListMouseMove}
          onMouseLeave={handleListMouseLeave}
          className="relative"
        >
          {/* Active #DC2D26 Pill Bar (1800px max width, 169px height, 15px radius) */}
          <div
            ref={activeBgRef}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 top-0 h-[169px] rounded-[15px] bg-[#DC2D26] z-0 will-change-transform"
          />

          {/* Pop-out Emblem aligned to the active row */}
          <div
            ref={emblemRef}
            aria-hidden="true"
            style={{
              top: `${activeIndex * 169 - 22}px`,
              perspective: "800px",
            }}
            className="pointer-events-none hidden md:flex items-center justify-center absolute right-[8%] lg:right-[14%] w-[210px] h-[210px] z-20 transition-[top] duration-300 ease-out will-change-transform"
          >
            <img
              src={currentService?.emblem || "/images/w.png"}
              alt=""
              className="w-full h-full object-contain drop-shadow-[0_22px_28px_rgba(0,0,0,0.28)]"
            />
          </div>

          {/* Service Rows 01 - 05 */}
          <div className="relative z-10 divide-y divide-zinc-200/80 border-b border-zinc-200/80">
            {services.map((service, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={service.id}
                  ref={(el) => {
                    rowRefs.current[idx] = el;
                  }}
                  type="button"
                  onMouseEnter={() => handleRowHover(idx, service)}
                  onFocus={() => handleRowHover(idx, service)}
                  onClick={() => {
                    handleRowHover(idx, service);
                    onSelectService?.(service);
                  }}
                  className="w-full min-h-[120px] lg:h-[169px] px-4 sm:px-8 lg:px-12 flex items-center gap-5 sm:gap-10 lg:gap-14 text-left cursor-pointer"
                >
                  <span
                    className={`shrink-0 transition-colors duration-300 ${
                      isActive ? "text-[#FFFFFF]" : "text-[#111111]"
                    }`}
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 600,
                      fontSize: "26px",
                      lineHeight: "28px",
                      letterSpacing: "0%",
                    }}
                  >
                    {service.index}
                  </span>

                  <span
                    ref={(el) => {
                      labelRefs.current[idx] = el;
                    }}
                    className={`font-futura-headline font-black uppercase text-[32px] sm:text-[56px] xl:text-[86px] transition-colors duration-300 ${
                      isActive ? "text-[#FFFFFF]" : "text-[#D4D4D8]"
                    }`}
                    style={{
                      lineHeight: "100%",
                      letterSpacing: "0%",
                    }}
                  >
                    {service.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Trailing "AND MORE" Row */}
          <div className="relative z-10 min-h-[110px] lg:h-[156px] px-4 sm:px-8 lg:px-12 flex items-center">
            <span
              className="font-futura-headline font-black uppercase text-[#D4D4D8] text-[32px] sm:text-[56px] xl:text-[86px] sm:ml-[58px] lg:ml-[82px]"
              style={{
                lineHeight: "100%",
                letterSpacing: "0%",
              }}
            >
              AND MORE
            </span>
          </div>
        </div>

        {/* 5x2 Technology Grid */}
        <div
          data-tech-grid="true"
          className="mt-16 lg:mt-20 max-w-[1120px] mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 border border-zinc-200/80 rounded-[12px] overflow-hidden bg-[#FFFFFF]"
        >
          {techItems.map((tech) => (
            <div
              key={tech.name}
              data-tech-item="true"
              className="h-[112px] sm:h-[126px] border-b border-r border-zinc-200/80 flex items-center justify-center px-4 hover:bg-zinc-50/80 transition-colors"
            >
              {tech.logo ? (
                <img
                  src={tech.logo}
                  alt={tech.name}
                  className="max-h-8 sm:max-h-9 w-auto object-contain opacity-85 hover:opacity-100 transition-opacity"
                />
              ) : (
                <span
                  className="text-[16px] font-semibold text-[#27272A]"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {tech.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}