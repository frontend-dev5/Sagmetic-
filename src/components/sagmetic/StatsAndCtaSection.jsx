import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const STAT_CARDS = [
  {
    value: "6+",
    label: "Years of Experince",
    badgeBg: "#702FFF",
    wrapperOffsetClass: "lg:mt-0",
    fromVars: { x: -165, y: 0, scale: 0.94, autoAlpha: 0 },
    icon: (
      <svg
        viewBox="0 0 28 28"
        fill="none"
        className="w-7 h-7 text-white"
        aria-hidden="true"
      >
        <path
          d="M9 8V6.5C9 5.67 9.67 5 10.5 5H17.5C18.33 5 19 5.67 19 6.5V8M5 9.5C5 8.67 5.67 8 6.5 8H21.5C22.33 8 23 8.67 23 9.5V20.5C23 21.33 22.33 22 21.5 22H6.5C5.67 22 5 21.33 5 20.5V9.5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5 13.5H23"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    value: "35+",
    label: "Skilled Professionals",
    badgeBg: "#FF8A5B",
    wrapperOffsetClass: "mt-6 sm:mt-12 lg:mt-20",
    fromVars: { x: 0, y: 145, scale: 0.94, autoAlpha: 0 },
    icon: (
      <svg
        viewBox="0 0 28 28"
        fill="none"
        className="w-7 h-7 text-white"
        aria-hidden="true"
      >
        <circle cx="11.5" cy="10" r="3.5" stroke="currentColor" strokeWidth="2" />
        <path
          d="M5 21.5C5 18.46 7.91 16 11.5 16C15.09 16 18 18.46 18 21.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M17.5 8.5C19.43 8.5 21 10.07 21 12C21 13.55 19.99 14.86 18.6 15.32M19.5 16.5C21.71 16.95 23.5 18.8 23.5 21.2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    value: "3.6K",
    label: "Projects Worldwide",
    badgeBg: "#007AFF",
    wrapperOffsetClass: "lg:mt-0",
    fromVars: { x: 0, y: -145, scale: 0.94, autoAlpha: 0 },
    icon: (
      <svg
        viewBox="0 0 28 28"
        fill="none"
        className="w-7 h-7 text-white"
        aria-hidden="true"
      >
        <path
          d="M19.5 5.5C19.5 5.5 22.5 8.5 22.5 14C22.5 16.5 21.6 18.8 20.2 20.5L17.5 17.8L10.2 10.5L7.5 7.8C9.2 6.4 11.5 5.5 14 5.5H19.5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="16.5" cy="11.5" r="1.5" fill="currentColor" />
        <path
          d="M9.5 15.5L6.5 16.5L5.5 22.5L11.5 21.5L12.5 18.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    value: "95%",
    label: "Affordable Cost",
    badgeBg: "#5BCC9F",
    wrapperOffsetClass: "mt-6 sm:mt-12 lg:mt-20",
    fromVars: { x: 165, y: 0, scale: 0.94, autoAlpha: 0 },
    icon: (
      <svg
        viewBox="0 0 28 28"
        fill="none"
        className="w-7 h-7 text-white"
        aria-hidden="true"
      >
        <path
          d="M11.5 8.5H16.5L18 6H10L11.5 8.5ZM11.5 8.5C8.5 10.5 7 13.5 7 17.5C7 20.5 9.5 22.5 14 22.5C18.5 22.5 21 20.5 21 17.5C21 13.5 19.5 10.5 16.5 8.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 12.5V18.5M16 14C16 13.17 15.1 12.5 14 12.5C12.9 12.5 12 13.17 12 14C12 15.5 16 15.2 16 17C16 17.83 15.1 18.5 14 18.5C12.9 18.5 12 17.83 12 17"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function StatsAndCtaSection({
  ctaBgImage = "/images/ctabg.webp",
  onConsultationClick,
}) {
  const sectionRef = useRef(null);
  const statsRowRef = useRef(null);
  const cardRefs = useRef([]);
  const watermarkRef = useRef(null);
  const ctaBoxRef = useRef(null);
  const ctaBgImgRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const aiLineRef = useRef(null);
  const paraRef = useRef(null);
  const ctaBtnRef = useRef(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    let isCancelled = false;
    let ctx;

    const init = async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      if (isCancelled) return;

      ctx = gsap.context(() => {
        const split1 = line1Ref.current
          ? SplitText.create(line1Ref.current, { type: "chars" })
          : null;
        const split2 = line2Ref.current
          ? SplitText.create(line2Ref.current, { type: "chars" })
          : null;
        const splitAi = aiLineRef.current
          ? SplitText.create(aiLineRef.current, { type: "chars" })
          : null;
        const splitPara = paraRef.current
          ? SplitText.create(paraRef.current, { type: "lines", mask: "lines" })
          : null;

        if (watermarkRef.current) {
          gsap.fromTo(
            watermarkRef.current,
            { x: 24 },
            {
              x: -36,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.45,
              },
            }
          );
        }

        // Early, smooth four-direction card settlement
        if (statsRowRef.current) {
          const cardsTl = gsap.timeline({
            scrollTrigger: {
              trigger: statsRowRef.current,
              start: "top 95%",
              end: "bottom 58%",
              scrub: 0.45,
            },
          });

          STAT_CARDS.forEach((card, idx) => {
            const el = cardRefs.current[idx];
            if (!el) return;

            gsap.set(el, card.fromVars);
            cardsTl.to(
              el,
              {
                x: 0,
                y: 0,
                scale: 1,
                autoAlpha: 1,
                duration: 0.42,
                ease: "power2.out",
              },
              idx * 0.03
            );
          });
        }

        if (ctaBoxRef.current && ctaBgImgRef.current) {
          gsap.fromTo(
            ctaBgImgRef.current,
            { scale: 1.08, y: -16 },
            {
              scale: 1,
              y: 16,
              ease: "none",
              scrollTrigger: {
                trigger: ctaBoxRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.5,
              },
            }
          );
        }

        // Early CTA box + character-by-character SplitText heading + copy + button
        if (ctaBoxRef.current) {
          const headingChars = [
            ...(split1?.chars || []),
            ...(split2?.chars || []),
            ...(splitAi?.chars || []),
          ];
          const paraLines = splitPara?.lines || [];

          gsap.set(ctaBoxRef.current, {
            y: 36,
            scale: 0.98,
            autoAlpha: 0,
          });

          if (headingChars.length) {
            gsap.set(headingChars, {
              y: 28,
              autoAlpha: 0,
            });
          }

          if (paraLines.length) {
            gsap.set(paraLines, {
              yPercent: 105,
              autoAlpha: 0,
            });
          }

          if (ctaBtnRef.current) {
            gsap.set(ctaBtnRef.current, {
              y: 24,
              scale: 0.97,
              autoAlpha: 0,
            });
          }

          const ctaTl = gsap.timeline({
            scrollTrigger: {
              trigger: ctaBoxRef.current,
              start: "top 94%",
              end: "bottom 56%",
              scrub: 0.45,
            },
          });

          ctaTl
            .to(
              ctaBoxRef.current,
              {
                y: 0,
                scale: 1,
                autoAlpha: 1,
                duration: 0.28,
                ease: "power2.out",
              },
              0
            )
            .to(
              headingChars,
              {
                y: 0,
                autoAlpha: 1,
                duration: 0.34,
                stagger: { each: 0.01, from: "start" },
                ease: "power3.out",
              },
              0.08
            )
            .to(
              paraLines,
              {
                yPercent: 0,
                autoAlpha: 1,
                duration: 0.25,
                stagger: 0.06,
                ease: "power3.out",
              },
              0.24
            )
            .to(
              ctaBtnRef.current,
              {
                y: 0,
                scale: 1,
                autoAlpha: 1,
                duration: 0.24,
                ease: "power2.out",
              },
              0.32
            );
        }

        return () => {
          split1?.revert();
          split2?.revert();
          splitAi?.revert();
          splitPara?.revert();
        };
      }, root);
    };

    init();

    return () => {
      isCancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="stats-cta"
      className="relative z-10 w-full bg-white text-[#050505] overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28"
    >
      {/* Subtle Oversized Watermark Typography */}
      <div
        ref={watermarkRef}
        aria-hidden="true"
        className="pointer-events-none select-none absolute top-4 left-1/2 -translate-x-1/2 font-futura-headline font-extrabold uppercase text-[96px] sm:text-[150px] lg:text-[210px] leading-none tracking-[0.04em] text-zinc-100/90 whitespace-nowrap z-0 will-change-transform"
      >
        SAGMETIC
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Staggered Up & Down 4 Stat Cards Row */}
        <div
          ref={statsRowRef}
          className="flex flex-wrap xl:flex-nowrap items-start justify-center gap-6 lg:gap-8 py-4 lg:py-8"
        >
          {STAT_CARDS.map((card, idx) => (
            <div
              key={card.label}
              className={`w-full max-w-[331px] sm:w-[331px] shrink-0 ${card.wrapperOffsetClass}`}
            >
              <div
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                className="w-full h-[331px] rounded-[25px] bg-white border border-zinc-100 shadow-[0_18px_45px_rgba(15,15,15,0.06)] px-6 py-8 flex flex-col items-center justify-center text-center transition-transform duration-300 hover:-translate-y-1.5 will-change-transform"
              >
                {/* Icon Badge: 67px x 67px */}
                <div
                  style={{ backgroundColor: card.badgeBg }}
                  className="w-[67px] h-[67px] rounded-full flex items-center justify-center shadow-sm mb-6"
                >
                  {card.icon}
                </div>

                {/* Number: Futura Now Headline, weight=700, size=60px, lh=100%, ls=0% */}
                <div className="font-futura-headline font-bold text-[#050505] text-[60px] leading-none tracking-[0]">
                  {card.value}
                </div>

                {/* Paragraph: Montserrat, weight=600, size=20px, lh=30px, ls=0%, color=#807F7F */}
                <p
                  className="mt-3 text-[#807F7F] text-[20px] leading-[30px] tracking-[0]"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  {card.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Box with Background Image: max-w-[1440px], h-[790px] on lg+, border=1px */}
        <div
          ref={ctaBoxRef}
          className="mt-16 lg:mt-24 max-w-[1440px] w-full mx-auto min-h-[540px] lg:h-[790px] rounded-[28px] border border-[#6F1511]/45 bg-[#3B0A08] px-6 sm:px-12 py-16 lg:py-20 flex flex-col items-center justify-center text-center text-white relative overflow-hidden will-change-transform"
        >
          {/* Background Image + Readability Overlay */}
          <img
            ref={ctaBgImgRef}
            src={ctaBgImage}
            alt=""
            aria-hidden="true"
            width="1440"
            height="790"
            loading="lazy"
            decoding="async"
            className="pointer-events-none absolute inset-0 w-full h-full object-cover object-center will-change-transform"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[#4A0D0A]/65"
          />

          <div className="relative z-10 max-w-[1060px] mx-auto flex flex-col items-center">
            {/* Heading: Futura Now Headline, weight=800, size=106px, lh=118px, ls=0% */}
            <h2 className="overflow-visible font-futura-headline font-extrabold text-white text-[44px] leading-[1.06] sm:text-[74px] sm:leading-[1.08] lg:text-[106px] lg:leading-[118px] tracking-[0]">
              <span ref={line1Ref} className="block">
                Have an
              </span>
              <span ref={line2Ref} className="block">
                Idea? Let&apos;s Build
              </span>
            </h2>

            {/* "It with AI.": Instrument Serif, weight=400, size=116px, lh=148px, ls=0% */}
            <div
              ref={aiLineRef}
              className="overflow-visible font-instrument-serif italic font-normal text-[#FF8A7A] text-[52px] leading-[1.1] sm:text-[86px] sm:leading-[1.15] lg:text-[116px] lg:leading-[148px] tracking-[0]"
            >
              It with AI.
            </div>

            {/* Paragraph: Montserrat, weight=400, size=22px, lh=32px, ls=0% */}
            <p
              ref={paraRef}
              className="mt-4 max-w-[680px] text-white/90 text-[17px] leading-[26px] sm:text-[22px] sm:leading-[32px] tracking-[0]"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 400,
              }}
            >
              From concept to deployment — we turn your ideas into intelligent,
              high-performance digital products.
            </p>

            {/* Button: width=574px, height=123px on lg+, bg=#DC2D26, Futura Now Headline weight=700, size=41px, lh=100%, ls=0%, color=#FFFFFF */}
            <button
              ref={ctaBtnRef}
              type="button"
              onClick={onConsultationClick}
              className="mt-10 lg:mt-12 w-full max-w-[574px] h-[76px] sm:h-[96px] lg:h-[123px] rounded-[160px] bg-[#DC2D26] hover:bg-[#c3231d] active:scale-[0.99] transition-[background-color,transform] duration-200 flex items-center justify-center px-6 cursor-pointer shadow-[0_18px_40px_rgba(0,0,0,0.35)] will-change-transform"
            >
              <span className="font-futura-headline font-bold text-[#FFFFFF] text-[22px] sm:text-[32px] lg:text-[41px] leading-none tracking-[0]">
                Get a Free Consultation
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}