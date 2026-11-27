
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function WhoWeAre() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);

  const words = [
    "BUILD",
    "BETTER",
    "WEBSITE",
    "A",
    "LOT",
    "QUICKER",
    "WITH",
    "SAGMETIC",
    "INFOTECH",
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const wordElements =
        headingRef.current.querySelectorAll(".word-fill");

      // Initial grey state
      gsap.set(wordElements, {
        clipPath: "inset(0 100% 0 0)",
      });

      // Start animation when heading enters viewport
      gsap.to(wordElements, {
        clipPath: "inset(0 0% 0 0)",
        duration: 0.3,
        stagger: 0.3,
        ease: "none",

        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
          markers: false,
        },
      });
    }, headingRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-[60px] md:py-[90px] lg:py-[135px] px-[15px] md:px-[30px] lg:px-[50px]"
    >
      <div className="container">

        <div className="text-center mb-6">
          <span className="text-[14px] text-[#DC2D26] font-semibold">
            Who We Are
          </span>
        </div>

        <div className="max-w-[1100px] mx-auto mb-[65px]">

          <h2
            ref={headingRef}
            className="font-gaucho text-[50px] md:text-[80px] lg:text-[106px] font-medium text-center leading-[0.95]"
          >
            {words.map((word, index) => (
              <span
                key={index}
                className="relative inline-block mr-[0.18em] text-[#E5E5E5]"
              >
                {word}

                <span
                  className="word-fill absolute inset-0 text-[#000000] pointer-events-none"
                  aria-hidden="true"
                >
                  {word}
                </span>
              </span>
            ))}
          </h2>

        </div>

        <div className="grid grid-cols-12 max-w-[1290px] mx-auto">

          <div className="col-span-5 flex items-center">
            <div>
              <h4 className="font-montserrat text-[20px] md:text-[25px] lg:text-[30px] font-bold text-black max-w-[300px]">
                Welcome to <span className="text-[#DC2D26]">Sagmetic</span> Infotech
              </h4>

              <div className="text-[18px] text-[#807F7F] font-montserrat">
                <p>
                  A company founded in 2017 with a passion for creating outstanding digital experiences. We offer a wide range of services at Sagmetic Infotech, including web development, web design, and digital marketing, to assist businesses in expanding and succeeding online. Our team of experienced professionals is committed to provide our customers the best possible services.
                </p>

                <br />

                <p>
                  Since every company is different, we take the time to comprehend the particular requirements and objectives of each of our clients. By doing so, we can tailor our services to meet their exact requirements and provide them with a personalized experience that sets them apart from the competition.
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-7">
            <div className="flex justify-end pl-5">
              <img
                src="images/whowe-img.png"
                alt="Who We Are Image"
                className="rounded-2xl"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default WhoWeAre;
