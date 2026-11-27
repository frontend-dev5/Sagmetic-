import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const STAT_CARDS = [
  {
    value: "6+",
    label: "Years of Experince",
    badgeBg: "#e2d5ff",
    wrapperOffsetClass: "lg:mt-0",
    fromVars: { x: -165, y: 0, scale: 0.94, autoAlpha: 0 },
    iconSrc: "/images/experience.png",
    iconAlt: "Years of Experience icon",
  },
  {
    value: "35+",
    label: "Skilled Professionals",
    badgeBg: "#FFE8DE",
    wrapperOffsetClass: "mt-6 sm:mt-12 lg:mt-20",
    fromVars: { x: 0, y: 145, scale: 0.94, autoAlpha: 0 },
    iconSrc: "/images/professionals.png",
    iconAlt: "Skilled Professionals icon",
  },
  {
    value: "3.6K",
    label: "Projects Worldwide",
    badgeBg: "#CCE4FF",
    wrapperOffsetClass: "lg:mt-0",
    fromVars: { x: 0, y: -145, scale: 0.94, autoAlpha: 0 },
    iconSrc: "/images/projects.png",
    iconAlt: "Projects Worldwide icon",
  },
  {
    value: "95%",
    label: "Affordable Cost",
    badgeBg: "#DEF5EC",
    wrapperOffsetClass: "mt-6 sm:mt-12 lg:mt-20",
    fromVars: { x: 165, y: 0, scale: 0.94, autoAlpha: 0 },
    iconSrc: "/images/cost.png",
    iconAlt: "Affordable Cost icon",
  },
];

export default function StatsAndCtaSection({
  ctaBgImage = "/images/ctabg.png",
  onConsultationClick,
  statCards = STAT_CARDS,
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

          statCards.forEach((card, idx) => {
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
  }, [statCards]);

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
          {statCards.map((card, idx) => (
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
                  className="w-[67px] h-[67px] rounded-full flex items-center justify-center shadow-sm mb-6 p-3.5"
                >
                  <img
                    src={card.iconSrc}
                    alt={card.iconAlt || card.label}
                    className="w-full h-full object-contain"
                  />
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