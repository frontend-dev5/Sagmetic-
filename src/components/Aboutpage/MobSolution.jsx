
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function MobSolution() {
    const iconRef = useRef(null);
    const pathRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const path = pathRef.current;
            const length = path.getTotalLength();

            // Initial SVG stroke state
            gsap.set(path, {
                strokeDasharray: length,
                strokeDashoffset: length,
                fillOpacity: 0,
            });

            // Draw animation
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: iconRef.current,
                    start: "top 85%",
                    toggleActions: "play none none none",
                },
            });

            tl.to(path, {
                strokeDashoffset: 0,
                duration: 1.8,
                ease: "power2.inOut",
            });

            // Fill gradient after drawing
            tl.to(path, {
                fillOpacity: 1,
                duration: 0.6,
                ease: "power1.out",
            }, "-=0.3");

        }, iconRef);

        return () => ctx.revert();
    }, []);

    // ------- 
      const headingRef = useRef(null);

  const text =
    "Web and mobile solution company that ensures effective digital presence.";

  const words = text.split(" ");

  useEffect(() => {
    const heading = headingRef.current;

    if (!heading) return;

    const ctx = gsap.context(() => {
      const letters = heading.querySelectorAll(".char");

      gsap.set(letters, {
        opacity: 0,
        y: 70,
        rotateX: -90,
        transformOrigin: "50% 50%",
      });

      gsap.to(letters, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        stagger: 0.035,
        ease: "back.out(1.5)",

        scrollTrigger: {
          trigger: heading,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
      });
    }, heading);

    return () => ctx.revert();
  }, []);



    return (
        <>
            <section className='pb-[120px] px-[15px] md:px-[30px] lg:px-[50px]'>
                <div className='container'>
                    <div className="mb-3">
                        <span className="font-montserrat text-[14px] text-[#DC2D26] font-semibold">
                            What We do
                        </span>
                    </div>
                    <h2
                        ref={headingRef}
                        aria-label={text}
                        className="max-w-[980px] leading-tight font-montserrat text-[28px] sm:text-[36px] md:text-[45px] lg:text-[56px] font-extrabold text-black"
                    >
                        <span className="sr-only">{text}</span>

                        <span aria-hidden="true">
                            {words.map((word, wordIndex) => (
                                <span
                                    key={wordIndex}
                                    className="inline-block whitespace-nowrap mr-[0.25em]"
                                >
                                    {word.split("").map((char, charIndex) => (
                                        <span
                                            key={charIndex}
                                            className="char inline-block"
                                        >
                                            {char}
                                        </span>
                                    ))}
                                </span>
                            ))}
                        </span>
                    </h2>

                    <div className='grid grid-cols-12 mt-12'>
                        <div className='col-span-6 flex flex-col justify-between '>

                            <div ref={iconRef}>
                                <svg
                                    width="80"
                                    height="80"
                                    viewBox="0 0 80 80"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M66 0H14C6.26801 0 0 6.26801 0 14V66C0 73.732 6.26801 80 14 80H66C73.732 80 80 73.732 80 66V14C80 6.26801 73.732 0 66 0Z"
                                        fill="#DC2D26"
                                        fillOpacity="0.04"
                                    />

                                    <path
                                        ref={pathRef}
                                        d="M31.8491 20.8L11.1992 40L29.4479 56.9674L34.2504 52.5022L20.8042 40L31.8491 29.7306L42.894 40L39.9992 42.6917L34.7031 37.7674L29.9007 42.2327L48.1493 59.2001L68.7992 40L48.1493 20.8L39.9992 28.3779L31.8491 20.8ZM44.8017 32.8432L52.499 40L44.8017 47.1569L48.1493 50.2695L59.1942 40L48.1493 29.7306L44.8017 32.8432Z"
                                        fill="url(#missionGradient)"
                                        fillOpacity="0"
                                        stroke="url(#missionGradient)"
                                        strokeWidth="1.5"
                                        strokeLinejoin="round"
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                    />

                                    <defs>
                                        <linearGradient
                                            id="missionGradient"
                                            x1="26.8335"
                                            y1="54.2727"
                                            x2="28.3577"
                                            y2="29.9275"
                                            gradientUnits="userSpaceOnUse"
                                        >
                                            <stop stopColor="#DC2D26" />
                                            <stop offset="1" stopColor="#6F1511" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <div>
                                <img
                                    src="images/circle.svg"
                                    alt="Circle"
                                    className="slow-rotate"
                                />
                            </div>
                        </div>
                        <div className='col-span-6'>
                            <div className='text-[18px] text-[#807F7F] font-montserrat '>
                                <p>
                                    We take great pride in our work and strive to deliver exceptional results with every project we undertake. Our web development team has expertise in creating stunning websites that are both aesthetically pleasing and user-friendly. Our web design team focuses on designing websites that are both visually appealing and functional, making sure they provide a wonderful user experience. We also provide digital marketing services that help businesses get their message across to the right audience. Our team of professionals can help businesses enhance their online presence and draw in more clients through social media marketing and search engine optimization.
                                </p>
                                <br />
                                <p>
                                    At Sagmetic Infotech, we think that the success of our clients immediately affects our own success. We are dedicated to giving them the best possible service and support, so they can accomplish their goals and objectives. To find out more about how we can help the growth and success of your company online, get in touch with us right away.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default MobSolution