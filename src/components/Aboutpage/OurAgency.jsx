import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function OurAgency() {
    const containerRef = useRef(null);

    useEffect(() => {
        let ctx;
        let cancelled = false;

        const loadSVG = async () => {
            try {
                const response = await fetch("/images/Group 13.svg");
                const svgText = await response.text();

                if (cancelled || !containerRef.current) return;

                containerRef.current.innerHTML = svgText;

                const svg = containerRef.current.querySelector("svg");

                ctx = gsap.context(() => {
                    // Main SVG shape
                    const mainPath = svg.querySelector(
                        "[data-figma-bg-blur-radius]"
                    );

                    // Gradient shadow shape
                    const shadowPath = svg.querySelector(
                        "g[filter] path"
                    );

                    if (!mainPath) return;

                    const pathLength = mainPath.getTotalLength();

                    // Initial state
                    gsap.set(mainPath, {
                        strokeDasharray: pathLength,
                        strokeDashoffset: pathLength,
                        strokeOpacity: 0,
                        fillOpacity: 0,
                    });

                    if (shadowPath) {
                        gsap.set(shadowPath, {
                            fillOpacity: 0,
                        });
                    }

                    // Animation timeline
                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: "top 85%",
                            toggleActions: "play none none none",
                        },
                    });

                    // Draw SVG outline
                    tl.to(mainPath, {
                        strokeDashoffset: 0,
                        strokeOpacity: 1,
                        duration: 2,
                        ease: "power2.inOut",
                    });

                    // Reveal original SVG fill
                    tl.to(mainPath, {
                        fillOpacity: 0.095,
                        duration: 0.8,
                        ease: "power1.out",
                    }, "-=0.5");

                    // Reveal gradient shadow
                    if (shadowPath) {
                        tl.to(shadowPath, {
                            fillOpacity: 0.23,
                            duration: 1,
                            ease: "power2.out",
                        }, "-=0.7");
                    }

                }, containerRef);

            } catch (error) {
                console.error("SVG loading failed:", error);
            }
        };

        loadSVG();

        return () => {
            cancelled = true;
            ctx?.revert();

            if (containerRef.current) {
                containerRef.current.innerHTML = "";
            }
        };
    }, []);

    return (
        <div >
            <div className='container'>
                <div className="max-w-[1280px] mx-auto py-[104px] px-[128px] relative z-50 before:content-[''] before:absolute before:inset-0 before:bg-[#6F1511] before:z-0 rounded-2xl  overflow-hidden">
                    <div className='absolute inset-0 z-10'>
                        <img src="images/benefits-bg.png" alt="Our Agency" className='h-full w-full object-cover' />
                    </div>
                    <div className='relative z-20'>
                        <div className="mb-3">
                            <span className="font-montserrat text-[14px] text-[#DC2D26] font-semibold">
                                What We do
                            </span>
                        </div>
                        <h3 className='leading-tight text-[28px sm:text-[36px] md:text-[45px] lg:text-[66px] font-extrabold  text-white leading-tight max-w-[747px] font-montserrat'>
                            Benefits Of Choosing Our Agency
                        </h3>
                        <div className='mt-6 text-white text-[18px] font-montserrat max-w-[632px]'>
                            <p>
                                We deliver visually charming, innovative and point-rich web results centered towards your business.
                            </p>
                            <br />
                            <p>
                                Our Sagmetic Infotech programs are enforced to drive real growth to your business. You can anticipate the highest norms of specialized excellence and true professionalism from us.

                            </p>
                        </div>
                    </div>

                    <div
                        ref={containerRef}
                        className="absolute bottom-10 right-10 z-10"
                    />



                </div>
            </div>
        </div>
    )
}

export default OurAgency