import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const CAPABILITIES = [
  "AI Integration",
  "Web & App Development",
  "UI/UX Design",
  "Performance & SEO",
];

function MetaMaskHoverButton({
  children,
  onClick,
  variant = "primary",
}) {
  const isPrimary = variant === "primary";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative w-[230px] h-[54px] rounded-[160px] overflow-hidden flex items-center justify-center cursor-pointer transition-colors duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isPrimary
          ? "bg-[#DC2D26] text-[#FFFFFF]"
          : "bg-transparent border border-[#DC2D26] text-[#000000] hover:text-[#FFFFFF]"
      }`}
      style={{
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 500,
        fontSize: "16px",
        lineHeight: "100%",
        letterSpacing: "0%",
      }}
    >
      {/* Center-to-all-directions expanding fill */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 m-auto h-[260px] w-[260px] rounded-full scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isPrimary ? "bg-[#9f1914]" : "bg-[#DC2D26]"
        }`}
      />

      {/* Label: drops down on hover, drops in from top on both enter & leave */}
      <span className="relative z-10 block h-[18px] overflow-hidden leading-[18px]">
        <span className="block transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-[120%]">
          {children}
        </span>
        <span
          aria-hidden="true"
          className="block absolute inset-0 -translate-y-[120%] transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0"
        >
          {children}
        </span>
      </span>
    </button>
  );
}

export default function AboutSagmeticSection({
  onBuildClick,
  onExploreAiClick,
}) {
  const sectionRef = useRef(null);
  const incomingTraceRef = useRef(null);
  const sideLineRef = useRef(null);
  const eyebrowLineRef = useRef(null);
  const headingLine1Ref = useRef(null);
  const headingLine2Ref = useRef(null);
  const paraRef = useRef(null);
  const archCardRef = useRef(null);

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
        const splitH1 = SplitText.create(headingLine1Ref.current, {
          type: "chars",
        });
        const splitH2 = SplitText.create(headingLine2Ref.current, {
          type: "chars",
        });
        const splitPara = SplitText.create(paraRef.current, {
          type: "lines",
          mask: "lines",
        });

        const headingChars = [
          ...(splitH1.chars || []),
          ...(splitH2.chars || []),
        ];
        const paraLines = splitPara.lines || [];

        const tracedPaths = [
          incomingTraceRef.current,
          sideLineRef.current,
        ].filter(Boolean);

        tracedPaths.forEach((path) => {
          const traceLen = path.getTotalLength();
          gsap.set(path, {
            strokeDasharray: traceLen,
            strokeDashoffset: traceLen,
          });
        });

        gsap.set(eyebrowLineRef.current, {
          scaleX: 0,
          transformOrigin: "left center",
        });

        gsap.set('[data-about-eyebrow="true"]', {
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

        gsap.set('[data-about-cta="true"]', {
          y: 22,
          autoAlpha: 0,
        });

        gsap.set(archCardRef.current, {
          y: 44,
          scale: 0.95,
          autoAlpha: 0,
        });

        // Box items appear from the right
        gsap.set('[data-about-cap="true"]', {
          x: 58,
          autoAlpha: 0,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top 78%",
            end: "bottom 35%",
            scrub: 0.65,
          },
        });

        if (incomingTraceRef.current) {
          tl.to(
            incomingTraceRef.current,
            {
              strokeDashoffset: 0,
              duration: 0.25,
              ease: "none",
            },
            0
          );
        }

        tl.to(
          '[data-about-eyebrow="true"]',
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.18,
            ease: "power2.out",
          },
          0.08
        ).to(
          eyebrowLineRef.current,
          {
            scaleX: 1,
            duration: 0.25,
            ease: "power2.out",
          },
          0.1
        );

        tl.to(
          headingChars,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.35,
            stagger: { each: 0.012, from: "start" },
            ease: "power3.out",
          },
          0.16
        )
          .to(
            paraLines,
            {
              yPercent: 0,
              autoAlpha: 1,
              duration: 0.28,
              stagger: 0.07,
              ease: "power3.out",
            },
            0.28
          )
          .to(
            '[data-about-cta="true"]',
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.22,
              ease: "power2.out",
            },
            0.38
          );

        tl.to(
          archCardRef.current,
          {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.35,
            ease: "power3.out",
          },
          0.24
        ).to(
          '[data-about-cap="true"]',
          {
            x: 0,
            autoAlpha: 1,
            duration: 0.3,
            stagger: 0.06,
            ease: "power3.out",
          },
          0.34
        );

        // Sideline touches bottom of the box and runs through the bottom spacing with zero gap
        if (sideLineRef.current) {
          tl.to(
            sideLineRef.current,
            {
              strokeDashoffset: 0,
              duration: 0.3,
              ease: "none",
            },
            0.42
          );
        }

        return () => {
          splitH1.revert();
          splitH2.revert();
          splitPara.revert();
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
      id="about"
      className="relative w-full overflow-hidden bg-white text-[#09090B] pt-24 lg:pt-32 pb-0"
    >
      {/* Incoming line from previous section into About section */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1600 640"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 w-full h-full z-0"
      >
        <path
          d="M 800 0 L 800 44 L 140 44 L 140 96"
          fill="none"
          stroke="rgba(220,45,38,0.12)"
          strokeWidth="1.5"
        />
        <path
          ref={incomingTraceRef}
          d="M 800 0 L 800 44 L 140 44 L 140 96"
          fill="none"
          stroke="#DC2D26"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* 1600px Page Container */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Top Eyebrow + Hairline */}
        <div className="flex items-center gap-6 mb-10 lg:mb-12">
          <span
            data-about-eyebrow="true"
            className="text-[12px] font-medium tracking-[0.02em] text-[#DC2D26] shrink-0"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            About Sagmetic Infotech
          </span>
          <div
            ref={eyebrowLineRef}
            className="h-px flex-1 bg-zinc-200/90"
          />
        </div>

        {/* Main Content: Left Column + Right Arch Card */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12 lg:gap-10">
          <div className="flex-1 min-w-0 max-w-[980px]">
            <h2 className="overflow-visible font-futura-headline font-bold text-[#050505] text-[36px] leading-[1.12] sm:text-[48px] xl:text-[60px] xl:leading-[73px] tracking-[-0.02em]">
              <span ref={headingLine1Ref} className="block xl:whitespace-nowrap">
                We Design, Code &amp; Build Smart{" "}
                <span
                  aria-hidden="true"
                  className="inline-flex items-center justify-center w-8 h-8 xl:w-9 xl:h-9 rounded-full bg-[#DC2D26] text-white text-base align-middle ml-1"
                >
                  ✦
                </span>
              </span>
              <span ref={headingLine2Ref} className="block xl:whitespace-nowrap">
                Digital Experiences with the{" "}
                <span className="font-instrument-serif italic font-normal text-[#DC2D26] text-[42px] sm:text-[54px] xl:text-[66px] xl:leading-[73px] tracking-[-0.02em]">
                  Power of AI.
                </span>
              </span>
            </h2>

            <p
              ref={paraRef}
              className="mt-6 max-w-[660px] text-[#3F3F46] text-[18px] leading-[28px] sm:text-[22px] sm:leading-[32px] tracking-[0]"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 400,
              }}
            >
              A next-gen creative &amp; technology agency combining design,
              development and artificial intelligence to help brands create
              smarter, faster and more impactful digital products.
            </p>

            <div
              data-about-cta="true"
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <MetaMaskHoverButton variant="primary" onClick={onBuildClick}>
                Let&apos;s Build Together
              </MetaMaskHoverButton>

              <MetaMaskHoverButton
                variant="secondary"
                onClick={onExploreAiClick}
              >
                Explore AI Solutions
              </MetaMaskHoverButton>
            </div>
          </div>

          {/* Right Column: Arch Side Box */}
          <div className="w-full lg:w-auto flex justify-center lg:justify-end shrink-0">
            <div
              ref={archCardRef}
              className="relative w-full max-w-[414px] lg:w-[414px] h-[381px] border border-[#DC2D26]/35 bg-[#DC2D26]/[0.02] rounded-tl-[230px] rounded-tr-[230px] rounded-bl-[10px] rounded-br-[10px] px-6 pt-20 pb-8 flex flex-col items-center justify-center text-center"
            >
              <div className="-top-3 right-3 absolute w-14 h-14 flex items-center justify-center">
                <img
                  src="/images/logo.png"
                  alt=""
                  aria-hidden="true"
                  width="260"
                  height="47"
                  loading="lazy"
                  decoding="async"
                  className="max-h-11 w-auto object-contain"
                />
              </div>

              <ul className="space-y-3 text-[#DC2D26] font-instrument-serif text-[26px] sm:text-[30px] leading-[1.2]">
                {CAPABILITIES.map((item) => (
                  <li key={item} data-about-cap="true">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Flush Sideline Below Box: Touches bottom of box and runs all the way through bottom spacing */}
        <div className="w-full h-[120px] lg:h-[160px] leading-none">
          <svg
            aria-hidden="true"
            viewBox="0 0 1600 160"
            preserveAspectRatio="none"
            className="block w-full h-full overflow-visible"
          >
            <path
              d="M 1297 0 L 1297 56 L 1382 96 L 1380 160"
              fill="none"
              stroke="rgba(220,45,38,0.12)"
              strokeWidth="1.5"
            />
            <path
              ref={sideLineRef}
              d="M 1297 0 L 1297 56 L 1380 96 L 1380 160"
              fill="none"
              stroke="#DC2D26"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}