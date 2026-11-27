import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function SingleTextSection() {
  const textRef = useRef(null);

  useEffect(() => {
    const split = new SplitText(textRef.current, {
      type: "words, chars",
      wordsClass: "word",
      charsClass: "char",
    });

    // Initial state: all letters grey
    gsap.set(split.chars, {
      color: "#BDBDBD",
      textShadow: "0px 0px 0px rgba(222,45,38,0)",
    });

    const animation = gsap.timeline({
      scrollTrigger: {
        trigger: textRef.current,
        start: "top 85%",
        end: "top 35%",
        scrub: 1,
      },
    });

    split.chars.forEach((char, index) => {
      const position = index * 0.15;

      // Active letter gets red glow
      animation.to(
        char,
        {
          color: "#DE2D26",
          textShadow:
            "0 0 5px rgba(222,45,38,0.9), 0 0 12px rgba(222,45,38,0.7), 0 0 22px rgba(222,45,38,0.4)",
          duration: 0.5,
        },
        position,
      );

      // Letter becomes black after the glow
      animation.to(
        char,
        {
          color: "#000000",
          textShadow: "0 0 0px rgba(222,45,38,0)",
          duration: 0.5,
        },
        position + 0.5,
      );
    });

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
      split.revert();
    };
  }, []);

  return (
    <section className="single-text-section">
      <div className="container">
        <div className="single-text-content max-w-[800px] max-3xl:max-w-[700px] text-center mx-auto pt-[140px] pb-[60px]">
          <p
            ref={textRef}
            className="text-[26px] font-medium font-montserrat max-3xl:text-[22px]"
          >
            We offer a wide range of services designed to provide your business
            with visually stunning, innovative, and feature-packed web
            solutions.
          </p>
        </div>
      </div>
    </section>
  );
}
