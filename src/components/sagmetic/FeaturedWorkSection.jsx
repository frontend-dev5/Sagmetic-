import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function FeaturedWorkSection({
  eyebrowText = "Featured Work",
  headingLine1 = "AI-Enabled Digital",
  headingAccent = "Solutions",
  descriptionText =
    "Real products, real impact — powered by modern technology and AI.",
  buttonText = "Explore Case Studies",
  showcaseImage = "/images/featuredshowcase.webp",
  onExploreClick,
}) {
  const sectionRef = useRef(null);
  const eyebrowRef = useRef(null);
  const line1Ref = useRef(null);
  const accentRef = useRef(null);
  const paraRef = useRef(null);
  const showcaseRef = useRef(null);
  const ctaRef = useRef(null);

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
        const splitLine1 = SplitText.create(line1Ref.current, { type: "chars" });
        const splitAccent = SplitText.create(accentRef.current, { type: "chars" });
        const splitPara = SplitText.create(paraRef.current, {
          type: "lines",
          mask: "lines",
        });

        const headingChars = [
          ...(splitLine1.chars || []),
          ...(splitAccent.chars || []),
        ];
        const paraLines = splitPara.lines || [];

        gsap.set(eyebrowRef.current, {
          y: 16,
          autoAlpha: 0,
        });

        gsap.set(headingChars, {
          y: 28,
          autoAlpha: 0,
        });

        gsap.set(paraLines, {
          yPercent: 105,
          autoAlpha: 0,
        });

        gsap.set(showcaseRef.current, {
          y: 44,
          scale: 0.96,
          autoAlpha: 0,
          transformOrigin: "center bottom",
        });

        gsap.set(ctaRef.current, {
          y: 20,
          autoAlpha: 0,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top 95%",
            end: "bottom 62%",
            scrub: 0.65,
          },
        });

        tl.to(
          eyebrowRef.current,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.16,
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
              duration: 0.26,
              stagger: 0.07,
              ease: "power3.out",
            },
            0.22
          )
          .to(
            showcaseRef.current,
            {
              y: 0,
              scale: 1,
              autoAlpha: 1,
              duration: 0.36,
              ease: "power3.out",
            },
            0.28
          )
          .to(
            ctaRef.current,
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.22,
              ease: "power2.out",
            },
            0.44
          );

        return () => {
          splitLine1.revert();
          splitAccent.revert();
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
      id="featured-work"
      className="relative z-10 w-full overflow-hidden bg-[#FFFFFF] text-[#000000] pt-24 pb-24 lg:pt-32 lg:pb-32"
    >
      {/* Subtle architectural grid lines in background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-45"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.035) 1px, transparent 1px)",
          backgroundSize: "160px 160px",
        }}
      />

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-14">
        {/* Centered Header Block */}
        <div className="max-w-[1240px] mx-auto text-center">
          {/* Eyebrow: Featured Work */}
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
            {eyebrowText}
          </p>

          {/* Main Heading & Solutions Accent */}
          <h2 className="mt-4 overflow-visible font-futura-headline font-extrabold text-[#000000] text-[42px] leading-[48px] sm:text-[72px] sm:leading-[80px] lg:text-[108px] lg:leading-[118px] tracking-[0]">
            <span ref={line1Ref} className="block">
              {headingLine1}
            </span>
            <span
              ref={accentRef}
              className="block font-instrument-serif italic font-normal text-[#DC2D26] text-[48px] leading-[56px] sm:text-[82px] sm:leading-[96px] lg:text-[116px] lg:leading-[148px] tracking-[0]"
            >
              {headingAccent}
            </span>
          </h2>

          {/* Subtitle Paragraph */}
          <p
            ref={paraRef}
            className="mt-3 max-w-[680px] mx-auto text-[#524E4E] text-[18px] leading-[28px] sm:text-[22px] sm:leading-[32px] tracking-[0]"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 400,
            }}
          >
            {descriptionText}
          </p>
        </div>

        {/* Single Wide Showcase Image with Bottom Fade */}
        <div
          className="relative mt-12 sm:mt-16 max-w-[1600px] mx-auto"
          style={{ perspective: "1600px" }}
        >
          <div
            ref={showcaseRef}
            className="relative w-full h-[260px] sm:h-[380px] lg:h-[460px] rounded-[16px] overflow-hidden will-change-transform"
          >
            <img
              src={showcaseImage}
              alt="Featured AI-enabled digital solution"
              width="1784"
              height="499"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#FFFFFF] via-[#FFFFFF]/80 to-transparent"
            />
          </div>
        </div>

        {/* Centered CTA Button overlapping bottom fade (MetaMask center-out hover fill) */}
        <div ref={ctaRef} className="relative z-20 -mt-7 flex justify-center">
          <button
            type="button"
            onClick={onExploreClick}
            className="group relative overflow-hidden min-w-[216px] h-[54px] px-8 rounded-full bg-[#DC2D26] text-[#FFFFFF] inline-flex items-center justify-center shadow-[0_14px_34px_rgba(220,45,38,0.28)] cursor-pointer"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 500,
              fontSize: "16px",
              lineHeight: "100%",
              letterSpacing: "0%",
            }}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full bg-[#09090B] scale-x-0 origin-center transition-transform duration-300 ease-out group-hover:scale-x-100"
            />
            <span className="relative z-10">{buttonText}</span>
          </button>
        </div>
      </div>
    </section>
  );
}