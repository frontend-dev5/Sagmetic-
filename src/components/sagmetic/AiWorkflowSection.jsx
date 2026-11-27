import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const STUDIO_CALLOUTS = [
  "AI Integration",
  "Web & App Development",
  "UI/UX Design",
  "Performance & SEO",
];

const WORKFLOW_STEPS = [
  {
    index: "01",
    title: "Discover",
    description: "Understand your goals and identify AI opportunities.",
    icon: (
      <svg
        viewBox="0 0 28 28"
        fill="none"
        className="w-7 h-7 text-[#DC2D26]"
        aria-hidden="true"
      >
        <circle cx="12.5" cy="12.5" r="7.5" stroke="currentColor" strokeWidth="2" />
        <path
          d="M18 18L23.5 23.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    index: "02",
    title: "Design",
    description: "Craft modern, user-centric and AI-friendly designs.",
    icon: (
      <svg
        viewBox="0 0 28 28"
        fill="none"
        className="w-7 h-7 text-[#DC2D26]"
        aria-hidden="true"
      >
        <path
          d="M14 4L22 12L11 23H5V17L14 4Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="16.5" cy="9.5" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    index: "03",
    title: "Build",
    description: "Develop scalable, secure and AI-integrated solutions.",
    icon: (
      <svg
        viewBox="0 0 28 28"
        fill="none"
        className="w-7 h-7 text-[#DC2D26]"
        aria-hidden="true"
      >
        <path
          d="M10 9L5 14L10 19M18 9L23 14L18 19M15.5 6.5L12.5 21.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function AiWorkflowSection({
  studioImage = "/images/aiworkflow.webp",
  steps = WORKFLOW_STEPS,
}) {
  const sectionRef = useRef(null);
  const workflowBlockRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const bottomHeadingLine1Ref = useRef(null);
  const bottomHeadingLine2Ref = useRef(null);
  const workflowWordRef = useRef(null);

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
        const splitLine1 = bottomHeadingLine1Ref.current
          ? SplitText.create(bottomHeadingLine1Ref.current, { type: "lines" })
          : null;
        const splitLine2 = bottomHeadingLine2Ref.current
          ? SplitText.create(bottomHeadingLine2Ref.current, { type: "lines" })
          : null;

        gsap.from('[data-studio-capability="true"]', {
          x: 24,
          autoAlpha: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: '[data-studio-block="true"]',
            start: "top 78%",
            once: true,
          },
        });

        const bottomLines = [
          ...(splitLine1?.lines || []),
          ...(splitLine2?.lines || []),
        ];

        if (bottomLines.length) {
          gsap.from(bottomLines, {
            y: 30,
            autoAlpha: 0,
            duration: 0.75,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: workflowBlockRef.current,
              start: "top 82%",
              once: true,
            },
          });
        }

        if (workflowWordRef.current) {
          gsap.from(workflowWordRef.current, {
            y: 24,
            autoAlpha: 0,
            duration: 0.75,
            delay: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: workflowBlockRef.current,
              start: "top 82%",
              once: true,
            },
          });
        }

        // ScrollTrigger horizontal movement only on the bottom cards container
        if (workflowBlockRef.current && cardsContainerRef.current) {
          const getHorizontalDistance = () => {
            const track = cardsContainerRef.current;
            if (!track) return 0;
            const parentWidth = track.parentElement?.clientWidth || track.clientWidth;
            return Math.max(0, track.scrollWidth - parentWidth);
          };

          gsap.to(cardsContainerRef.current, {
            x: () => -getHorizontalDistance(),
            ease: "none",
            scrollTrigger: {
              trigger: workflowBlockRef.current,
              start: "top 78%",
              end: "bottom 25%",
              scrub: 0.65,
              invalidateOnRefresh: true,
            },
          });
        }

        return () => {
          splitLine1?.revert();
          splitLine2?.revert();
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
      id="ai-workflow"
      className="relative z-10 w-full bg-[#090505] text-white overflow-hidden"
    >
      {/* Top Studio Image Block with only the 4 real headings */}
      <div
        data-studio-block="true"
        className="relative w-full min-h-[460px] lg:min-h-[969px] overflow-hidden flex items-end"
      >
        <img
          src={studioImage}
          alt="Engineering and design team collaborating on AI digital products"
          width="1920"
          height="969"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        <div className="relative z-10 max-w-[1600px] w-full mx-auto px-6 sm:px-10 lg:px-16 py-14 lg:py-20 lg:mb-20 flex justify-end items-center">
          <ul className="w-full max-w-[583px] space-y-1.5 text-left">
            {STUDIO_CALLOUTS.map((item) => (
              <li
                key={item}
                data-studio-capability="true"
                className="font-futura-headline font-bold text-white text-[26px] sm:text-[36px] lg:text-[42px] leading-[1.15] tracking-[-0.02em] drop-shadow-[0_2px_12px_rgba(0,0,0,0.75)]"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Workflow Block with ScrollTrigger horizontal animation on the cards container */}
      <div
        ref={workflowBlockRef}
        className="relative max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 pt-14 pb-20 lg:pt-18 lg:pb-24"
      >
        <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-12 xl:gap-10">
          {/* Left Column: Bottom Part Heading + Instrument Serif "Workflow" */}
          <div className="xl:w-[430px] shrink-0">
            <h2 className="font-futura-headline font-bold text-white text-[40px] leading-[48px] sm:text-[52px] sm:leading-[62px] lg:text-[60px] lg:leading-[73px] tracking-[-0.02em]">
              <span ref={bottomHeadingLine1Ref} className="block">
                A Smarter,
              </span>
              <span ref={bottomHeadingLine2Ref} className="block">
                AI-Augmented
              </span>
            </h2>

            <div
              ref={workflowWordRef}
              className="mt-1 font-instrument-serif italic font-normal text-[#DC2D26] text-[48px] sm:text-[56px] lg:text-[60px] leading-none tracking-[0]"
            >
              Workflow
            </div>
          </div>

          {/* Right Column: Scroll-scrubbed Horizontal Cards Container */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <div
              ref={cardsContainerRef}
              className="flex gap-7 w-max will-change-transform"
            >
              {steps.map((step) => (
                <article
                  key={step.index}
                  className="w-[320px] sm:w-[460px] h-[437px] shrink-0 rounded-[20px] border-2 border-[#DC2D26]/40 bg-gradient-to-b from-[#1f0b0b]/85 via-[#130606]/90 to-[#090505] p-7 sm:p-8 flex flex-col justify-between"
                >
                  {/* Top Row: 78px x 78px Circular Icon + 01/02 Numeral */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-[78px] h-[78px] rounded-[166px] border-2 border-[#DC2D26]/65 bg-[#DC2D26]/10 flex items-center justify-center shrink-0">
                      {step.icon}
                    </div>

                    <span className="font-futura-headline font-extrabold text-[56px] sm:text-[72px] leading-none tracking-[-0.02em] text-white/10">
                      {step.index}
                    </span>
                  </div>

                  {/* Bottom Row: Box Heading (26px) + Paragraph (20px Montserrat) */}
                  <div className="space-y-3">
                    <h3 className="font-futura-headline font-bold text-white text-[26px] leading-none tracking-[0]">
                      {step.title}
                    </h3>
                    <p
                      className="text-[#B8B2B2] text-[20px] leading-[30px] tracking-[0]"
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 400,
                      }}
                    >
                      {step.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}