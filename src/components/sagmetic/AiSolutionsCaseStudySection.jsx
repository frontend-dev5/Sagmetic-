import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const CASE_STUDIES = [
  {
    id: "ai-product-development",
    title: "AI Product Development",
    description: "Build next-gen products with AI at the core.",
    image: "/images/aiproductdevelopment.png",
  },
  {
    id: "generative-ai-solutions",
    title: "Generative AI Solutions",
    description: "Content, images, and media generation for your brand.",
    image: "/images/generativeai.png",
  },
  {
    id: "ai-automation",
    title: "AI Automation",
    description: "Automate operations, support and business workflows.",
    image: "/images/aiautomation.png",
  },
  {
    id: "ai-chatbots-agents",
    title: "AI Chatbots & Assistants",
    description: "Smart, domain-trained chatbots for your business.",
    image: "/images/aichatbots.png",
  },
];

export default function AiSolutionsCaseStudySection({
  items = CASE_STUDIES,
  onSelectCase,
}) {
  const sectionRef = useRef(null);
  const pinWrapRef = useRef(null);
  const trackRef = useRef(null);
  const incomingLineRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headingRef = useRef(null);
  const paraRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0.35);

  useEffect(() => {
    const root = sectionRef.current;
    const pinEl = pinWrapRef.current;
    const trackEl = trackRef.current;
    if (!root || !pinEl || !trackEl) return;

    let isCancelled = false;
    let ctx;

    const init = async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      if (isCancelled) return;

      ctx = gsap.context(() => {
        const splitHeading = SplitText.create(headingRef.current, {
          type: "chars",
        });
        const splitPara = SplitText.create(paraRef.current, {
          type: "lines",
          mask: "lines",
        });

        const headingChars = splitHeading.chars || [];
        const paraLines = splitPara.lines || [];

        if (incomingLineRef.current) {
          const len = incomingLineRef.current.getTotalLength();
          gsap.set(incomingLineRef.current, {
            strokeDasharray: len,
            strokeDashoffset: len,
          });
        }

        gsap.set(eyebrowRef.current, {
          y: 16,
          autoAlpha: 0,
        });

        gsap.set(headingChars, {
          y: 26,
          autoAlpha: 0,
        });

        gsap.set(paraLines, {
          yPercent: 105,
          autoAlpha: 0,
        });

        // Header & trace reveal as section enters
        const introTl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top 78%",
            end: "top 30%",
            scrub: 0.65,
          },
        });

        if (incomingLineRef.current) {
          introTl.to(
            incomingLineRef.current,
            {
              strokeDashoffset: 0,
              duration: 0.35,
              ease: "none",
            },
            0
          );
        }

        introTl
          .to(
            eyebrowRef.current,
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.2,
              ease: "power2.out",
            },
            0.08
          )
          .to(
            headingChars,
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.35,
              stagger: { each: 0.012, from: "start" },
              ease: "power3.out",
            },
            0.14
          )
          .to(
            paraLines,
            {
              yPercent: 0,
              autoAlpha: 1,
              duration: 0.3,
              stagger: 0.07,
              ease: "power3.out",
            },
            0.28
          );

        // GSAP Horizontal Scroll scrubbed with ScrollTrigger
        const getHorizontalDistance = () => {
          const parentWidth = trackEl.parentElement?.clientWidth || trackEl.clientWidth;
          return Math.max(0, trackEl.scrollWidth - parentWidth);
        };

        gsap.set(trackEl, { x: 0, autoAlpha: 1 });

        const horizontalDistance = getHorizontalDistance();
        if (horizontalDistance > 0) {
          gsap.to(trackEl, {
            x: () => -getHorizontalDistance(),
            ease: "none",
            scrollTrigger: {
              trigger: pinEl,
              start: "top 12%",
              end: () => `+=${getHorizontalDistance()}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                setScrollProgress(0.35 + self.progress * 0.65);
              },
            },
          });
        } else {
          setScrollProgress(1);
        }

        return () => {
          splitHeading.revert();
          splitPara.revert();
        };
      }, root);
    };

    init();

    return () => {
      isCancelled = true;
      ctx?.revert();
    };
  }, [items]);

  return (
    <section
      ref={sectionRef}
      id="case-study"
      className="relative z-10 w-full overflow-x-clip bg-[#050303] text-[#FFFFFF] pt-36 pb-20 lg:pt-48 lg:pb-28"
    >
      {/* Subtle circuit line continuing down into the section */}
      {/* <svg
        aria-hidden="true"
        viewBox="0 0 1600 900"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 w-full h-full z-0"
      >
        <path
          d="M 1120 0 L 1120 260 L 1120 420"
          fill="none"
          stroke="#DC2D26"
          strokeOpacity="0.16"
          strokeWidth="1.5"
        />
        <path
          ref={incomingLineRef}
          d="M 1120 0 L 1120 260 L 1120 420"
          fill="none"
          stroke="#DC2D26"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg> */}

      <div
        ref={pinWrapRef}
        className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16"
      >
        {/* Centered Header Block */}
        <div className="max-w-[920px] mx-auto text-center">
          <p
            ref={eyebrowRef}
            className="text-[#DC2D26]"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              lineHeight: "100%",
              letterSpacing: "0%",
            }}
          >
            Case Study
          </p>

          <h2
            ref={headingRef}
            className="mt-4 overflow-visible font-futura-headline font-bold text-[#FFFFFF] text-[38px] leading-[46px] sm:text-[52px] sm:leading-[62px] lg:text-[60px] lg:leading-[73px] tracking-[-0.02em]"
          >
            Our AI-Powered Solutions
          </h2>

          <p
            ref={paraRef}
            className="mt-4 max-w-[660px] mx-auto text-[#D4D4D8] text-[18px] leading-[28px] sm:text-[22px] sm:leading-[32px] tracking-[0]"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 400,
            }}
          >
            From creative design to intelligent automation, we help businesses
            leverage AI to grow, optimize and innovate.
          </p>
        </div>

        {/* Viewport Clip for GSAP Horizontal Scroll */}
        <div className="mt-14 overflow-hidden">
          <div
            ref={trackRef}
            className="flex w-max items-stretch gap-5 will-change-transform"
          >
            {items.map((item) => (
              <article
                key={item.id}
                onClick={() => onSelectCase?.(item)}
                className="group relative w-[330px] sm:w-[410px] lg:w-[460px] h-[470px] shrink-0 rounded-[16px] border border-white/10 hover:border-[#DC2D26]/70 bg-[#0d0909] p-4 flex flex-col justify-between transition-colors duration-300 cursor-pointer"
              >
                {/* Top Media Box */}
                <div className="relative h-[280px] w-full rounded-[12px] overflow-hidden bg-zinc-900 shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    draggable={false}
                    className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Bottom Text Content */}
                <div className="pt-4 pb-2 px-1 flex-1 flex flex-col justify-start text-left">
                  <h3
                    className="font-futura-headline font-bold text-[#FFFFFF] text-[22px] sm:text-[26px] tracking-[0]"
                    style={{ lineHeight: "100%" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="mt-3 text-[#A1A1AA] text-[17px] leading-[26px] sm:text-[20px] sm:leading-[30px] tracking-[0]"
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 400,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Bottom Progress Indicator Bar */}
        <div className="mt-8 max-w-[780px] mx-auto h-[3px] w-full rounded-full bg-white/15 overflow-hidden">
          <div
            className="h-full bg-[#DC2D26] rounded-full transition-[width] duration-75"
            style={{
              width: `${Math.min(100, Math.max(15, scrollProgress * 100))}%`,
            }}
          />
        </div>
      </div>
    </section>
  );
}