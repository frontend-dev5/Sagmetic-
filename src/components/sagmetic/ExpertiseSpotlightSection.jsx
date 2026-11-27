import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function ExpertiseSpotlightSection({
  imageSrc = "/images/section4.png",
  badgeText = "AI + Development",
  headingText = "Web & Mobile Development",
  descriptionText =
    "Build intelligent, scalable and high-performance web and mobile apps with modern tech and AI-powered capabilities like automation, content generation and smart personalization.",
  buttonText = "View Work",
  bottomLineText =
    "AI Assistant Integration | Automation & Workflows | Smart Analytics",
  onViewWorkClick,
}) {
  const sectionRef = useRef(null);
  const expandWrapRef = useRef(null);
  const leftLineRef = useRef(null);
  const rightLineRef = useRef(null);
  const glassBoxRef = useRef(null);
  const headingRef = useRef(null);
  const paraRef = useRef(null);
  const ctaRef = useRef(null);
  const bottomLineRef = useRef(null);

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
        const splitHeading = SplitText.create(headingRef.current, {
          type: "chars",
        });

        const headingChars = splitHeading.chars || [];

        [leftLineRef.current, rightLineRef.current].forEach((path) => {
          if (!path) return;
          const len = path.getTotalLength();
          gsap.set(path, {
            strokeDasharray: len,
            strokeDashoffset: len,
          });
        });

        gsap.set(expandWrapRef.current, {
          scale: 0.88,
          y: 36,
          autoAlpha: 0,
          transformOrigin: "center center",
        });

        gsap.set(glassBoxRef.current, {
          y: 26,
          autoAlpha: 0,
        });

        gsap.set('[data-spotlight-badge="true"]', {
          y: 14,
          autoAlpha: 0,
        });

        gsap.set(headingChars, {
          y: 20,
          autoAlpha: 0,
        });

        gsap.set(paraRef.current, {
          y: 20,
          autoAlpha: 0,
        });

        gsap.set(ctaRef.current, {
          y: 16,
          autoAlpha: 0,
        });

        gsap.set(bottomLineRef.current, {
          y: 18,
          autoAlpha: 0,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top 102%",
            end: "bottom 38%",
            scrub: 0.65,
          },
        });

        if (leftLineRef.current) {
          tl.to(
            leftLineRef.current,
            {
              strokeDashoffset: 0,
              duration: 0.45,
              ease: "none",
            },
            0
          );
        }

        if (rightLineRef.current) {
          tl.to(
            rightLineRef.current,
            {
              strokeDashoffset: 0,
              duration: 0.45,
              ease: "none",
            },
            0.05
          );
        }

        tl.to(
          expandWrapRef.current,
          {
            scale: 1,
            y: 0,
            autoAlpha: 1,
            duration: 0.38,
            ease: "power3.out",
          },
          0.04
        )
          .to(
            glassBoxRef.current,
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.28,
              ease: "power3.out",
            },
            0.2
          )
          .to(
            '[data-spotlight-badge="true"]',
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.18,
              ease: "power2.out",
            },
            0.26
          )
          .to(
            headingChars,
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.28,
              stagger: { each: 0.01, from: "start" },
              ease: "power3.out",
            },
            0.3
          )
          .to(
            paraRef.current,
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.26,
              ease: "power3.out",
            },
            0.38
          )
          .to(
            ctaRef.current,
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.2,
              ease: "power2.out",
            },
            0.46
          )
          .to(
            bottomLineRef.current,
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.24,
              ease: "power2.out",
            },
            0.5
          );

        return () => {
          splitHeading.revert();
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
      id="expertise-spotlight"
      className="relative z-20 w-full overflow-hidden -mt-6 lg:-mt-8 -mb-24 lg:-mb-32 py-4 flex justify-center"
    >
      {/* Left & Right ScrollTrigger Lines */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1600 920"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 w-full h-full z-10"
      >
        <path
          d="M 64 0 L 64 340 L 96 372 L 96 920"
          fill="none"
          stroke="#DC2D26"
          strokeOpacity="0.15"
          strokeWidth="1.5"
        />
        <path
          ref={leftLineRef}
          d="M 64 0 L 64 340 L 96 372 L 96 920"
          fill="none"
          stroke="#DC2D26"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <path
          d="M 1536 0 L 1536 340 L 1504 372 L 1504 920"
          fill="none"
          stroke="#DC2D26"
          strokeOpacity="0.15"
          strokeWidth="1.5"
        />
        <path
          ref={rightLineRef}
          d="M 1536 0 L 1536 340 L 1504 372 L 1504 920"
          fill="none"
          stroke="#DC2D26"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Expanding 1798px x 828px Frame, radius 25px */}
      <div
        ref={expandWrapRef}
        className="relative z-20 w-full max-w-[1798px] min-h-[560px] sm:min-h-[680px] lg:h-[828px] rounded-[25px] overflow-hidden flex flex-col justify-between px-4 sm:px-10 lg:px-16 pt-12 pb-6 will-change-transform"
      >
        {/* Background Media Only */}
        <img
          src={imageSrc}
          alt={headingText}
          className="pointer-events-none absolute inset-0 w-full h-full object-cover object-center z-0"
        />

        {/* Right-Aligned 585px x 563px Blur-Only Box (no added background fill) */}
        <div className="relative z-10 my-auto flex justify-center lg:justify-end lg:pr-[6%] xl:pr-[9%]">
          <div
            className="w-full max-w-[585px] min-h-[420px] lg:w-[585px] lg:h-[563px] rounded-[20px] p-[2px] shrink-0 bg-transparent backdrop-blur-md border-2 border-gray-500/50 "
            // style={{
            //   background:
            //     "linear-gradient(155deg, #FFFFFF 0%, #CCCCCC 50%, #999999 100%)",
            // }}
          >
            <div
              ref={glassBoxRef}
              className="w-full h-full rounded-[18px] px-7 py-9 sm:px-11 flex flex-col items-center justify-center text-center"
              style={{
                backgroundColor: "transparent",
                backdropFilter: "blur(44px)",
                WebkitBackdropFilter: "blur(44px)",
              }}
            >
              {/* Tag Box: 195px x 40px, radius 3px, border 0.5px (#DC2D266B 42%, #DC2D261A 10%), bg (#DE2D26, #FFFFFF) */}
              <div
                data-spotlight-badge="true"
                className="w-[195px] h-[40px] rounded-[3px] p-[0.5px] flex items-center"
                // style={{
                //   background:
                //     "linear-gradient(90deg, rgba(220,45,38,0.42) 0%, rgba(220,45,38,0.10) 100%)",
                // }}
              >
                <div
                  className="w-full h-full rounded-[2.5px] flex items-center justify-center px-2  backdrop-blur-md"
                >
                  <span
                    className="text-[#DC2D26] truncate"
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 600,
                      fontSize: "18px",
                      lineHeight: "100%",
                      letterSpacing: "0%",
                    }}
                  >
                    {badgeText}
                  </span>
                </div>
              </div>

              {/* Heading: Futura Now Headline, 700, 40px, lh 50px, ls 0% */}
              <h3
                ref={headingRef}
                className="mt-6 max-w-[460px] font-futura-headline font-bold text-[#FFFFFF] text-[30px] leading-[38px] sm:text-[40px] sm:leading-[50px] tracking-[0]"
              >
                {headingText}
              </h3>

              {/* Paragraph: Montserrat, 400, 20px, lh 32px, ls 0% */}
              <p
                ref={paraRef}
                className="mt-4 max-w-[480px] text-[#FFFFFF] text-[16px] leading-[26px] sm:text-[20px] sm:leading-[32px] tracking-[0]"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 400,
                }}
              >
                {descriptionText}
              </p>

              {/* Button: 161px x 54px, radius 160px, bg #DC2D26, Montserrat, 16px, lh 100%, ls 0% */}
              <div ref={ctaRef} className="mt-7">
                <button
                  type="button"
                  onClick={onViewWorkClick}
                  className="w-[161px] h-[54px] rounded-[160px] bg-[#DC2D26] text-[#FFFFFF] flex items-center justify-center cursor-pointer"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 500,
                    fontSize: "16px",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                  }}
                >
                  {buttonText}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Line: Instrument Serif, 400, 25px, lh 46px, ls 0%, color #FFFFFF */}
        <p
          ref={bottomLineRef}
          className="relative z-10 font-instrument-serif font-normal text-[#FFFFFF] text-[20px] sm:text-[25px] leading-[34px] sm:leading-[46px] tracking-[0] text-center"
        >
          {bottomLineText}
        </p>
      </div>
    </section>
  );
}