import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const FOOTER_COLUMNS = [
  {
    title: "Services",
    links: [
      { label: "Website Design", href: "#services" },
      { label: "Website Development", href: "#services" },
      { label: "App Development", href: "#services" },
      { label: "AI Solutions & Integration", href: "#ai-solutions" },
      { label: "Search Engine Optimization", href: "#services" },
      { label: "And More", href: "#services" },
    ],
  },
  {
    title: "Quick Links",
    links: [
      { label: "About Us", href: "#about" },
      { label: "Blogs", href: "#blogs" },
      { label: "FAQ", href: "#faq" },
      { label: "Testimonials", href: "#testimonials" },
      { label: "Careers", href: "#careers" },
    ],
  },
  {
    title: "Contact",
    type: "contact",
    addressLines: [
      "D-186, 2nd Floor, Phase",
      "8B, Industrial Area,",
      "Mohali, SAS Nagar.",
    ],
    phone: "+91 9915941692",
    email: "info@sagmetic.com",
  },
  {
    title: "Legal Links",
    links: [
      { label: "Terms and conditions", href: "#terms" },
      { label: "Privacy Policy", href: "#privacy" },
    ],
  },
];

const DEFAULT_SOCIAL_ICONS = [
  {
    name: "Facebook",
    href: "#facebook",
    src: "/images/facebook.png",
  },
  {
    name: "Instagram",
    href: "#instagram",
    src: "/images/insta.png",
  },
  {
    name: "LinkedIn",
    href: "#linkedin",
    src: "/images/linkedin.png",
  },
];

export default function ContactAndFooterSection({
  sideBoxBgImage = "/images/contact-side-bg.png",
  socialIcons = DEFAULT_SOCIAL_ICONS,
  onSubmitForm,
}) {
  const sectionRef = useRef(null);
  const contactRowRef = useRef(null);
  const sideBoxRef = useRef(null);
  const formBoxRef = useRef(null);
  const headlineRef = useRef(null);
  const sayHiRef = useRef(null);
  const footerCardRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

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
        const splitHeadline = headlineRef.current
          ? SplitText.create(headlineRef.current, { type: "chars" })
          : null;
        const splitSayHi = sayHiRef.current
          ? SplitText.create(sayHiRef.current, { type: "chars" })
          : null;

        const headingChars = [
          ...(splitHeadline?.chars || []),
          ...(splitSayHi?.chars || []),
        ];

        if (sideBoxRef.current) {
          gsap.set(sideBoxRef.current, { x: -56, y: 24, autoAlpha: 0 });
        }
        if (formBoxRef.current) {
          gsap.set(formBoxRef.current, { x: 56, y: 24, autoAlpha: 0 });
        }
        if (headingChars.length) {
          gsap.set(headingChars, { y: 20, autoAlpha: 0 });
        }
        if (footerCardRef.current) {
          gsap.set(footerCardRef.current, { y: 36, autoAlpha: 0 });
        }

        if (contactRowRef.current) {
          const contactTl = gsap.timeline({
            scrollTrigger: {
              trigger: contactRowRef.current,
              start: "top 92%",
              end: "bottom 52%",
              scrub: 0.45,
            },
          });

          if (sideBoxRef.current) {
            contactTl.to(
              sideBoxRef.current,
              {
                x: 0,
                y: 0,
                autoAlpha: 1,
                duration: 0.34,
                ease: "power2.out",
              },
              0
            );
          }

          if (formBoxRef.current) {
            contactTl.to(
              formBoxRef.current,
              {
                x: 0,
                y: 0,
                autoAlpha: 1,
                duration: 0.34,
                ease: "power2.out",
              },
              0.06
            );
          }

          if (headingChars.length) {
            contactTl.to(
              headingChars,
              {
                y: 0,
                autoAlpha: 1,
                duration: 0.28,
                stagger: { each: 0.012, from: "start" },
                ease: "power3.out",
              },
              0.12
            );
          }
        }

        if (footerCardRef.current) {
          gsap.to(footerCardRef.current, {
            y: 0,
            autoAlpha: 1,
            duration: 0.36,
            ease: "power2.out",
            scrollTrigger: {
              trigger: footerCardRef.current,
              start: "top 94%",
              end: "bottom 62%",
              scrub: 0.45,
            },
          });
        }

        return () => {
          splitHeadline?.revert();
          splitSayHi?.revert();
        };
      }, root);
    };

    init();

    return () => {
      isCancelled = true;
      ctx?.revert();
    };
  }, []);

  const handleChange = (field) => (e) => {
    setSubmitted(false);
    const value =
      field === "message" ? e.target.value.slice(0, 1000) : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmitForm) {
      onSubmitForm(formData);
    }
    setSubmitted(true);
  };

  return (
    <footer
      ref={sectionRef}
      id="contact"
      className="relative z-10 w-full bg-[#040303] text-white overflow-hidden pt-16 pb-8 lg:pt-24 lg:pb-10"
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8">
        {/* Top Row: Side Box (460x538) + Form Container (813x538) */}
        <div
          ref={contactRowRef}
          className="flex flex-col xl:flex-row items-center xl:items-stretch justify-between gap-7"
        >
          {/* Left Side Box: width=460px, height=538px, border=1px, radius=25px */}
          <div
            ref={sideBoxRef}
            style={{ borderColor: "rgba(255, 255, 255, 0.14)" }}
            className="relative w-full max-w-[460px] xl:w-[460px] min-h-[440px] sm:h-[538px] shrink-0 rounded-[25px] border bg-[#120606] px-8 sm:px-10 py-10 sm:py-12 flex flex-col justify-between overflow-hidden will-change-transform"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 22% 14%, rgba(220,45,38,0.22) 0%, rgba(16,6,6,0.72) 55%, rgba(92,14,12,0.58) 100%)",
              }}
            />

            {/* Top Copy: Futura Now Headline 40px/73px/-2% + Instrument Serif 40px/100%/0% #DC2D26 */}
            <div className="relative z-10">
              <h2
                ref={headlineRef}
                className="overflow-visible font-futura-headline font-bold text-white text-[34px] leading-[46px] sm:text-[40px] sm:leading-[73px] tracking-[-0.02em]"
              >
                Don&apos;t be shy,
              </h2>
              <div
                ref={sayHiRef}
                className="overflow-visible font-instrument-serif italic font-normal text-[#DC2D26] text-[36px] sm:text-[40px] leading-none tracking-[0] -mt-1"
              >
                just say hi.
              </div>

              {/* Mail & Number: Montserrat, weight=500, size=16px, lh=100%, ls=0% */}
              <div className="mt-8 space-y-4">
                <a
                  href="mailto:info@sagmetic.com"
                  className="flex items-center gap-3.5 text-[#C9C4C4] hover:text-white text-[16px] leading-none tracking-[0] transition-colors"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 500,
                  }}
                >
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    className="w-4 h-4 shrink-0 text-zinc-400"
                    aria-hidden="true"
                  >
                    <rect
                      x="2.5"
                      y="4"
                      width="15"
                      height="12"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M3.5 5.5L10 10.5L16.5 5.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>info@sagmetic.com</span>
                </a>

                <a
                  href="tel:+919915941692"
                  className="flex items-center gap-3.5 text-[#C9C4C4] hover:text-white text-[16px] leading-none tracking-[0] transition-colors"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 500,
                  }}
                >
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    className="w-4 h-4 shrink-0 text-zinc-400"
                    aria-hidden="true"
                  >
                    <path
                      d="M6.2 3.5C6.6 3.5 7 3.7 7.2 4.1L8.4 6.4C8.6 6.8 8.5 7.3 8.2 7.6L7.1 8.6C7.8 10.1 9 11.3 10.5 12L11.5 10.9C11.8 10.6 12.3 10.5 12.7 10.7L15 11.9C15.4 12.1 15.6 12.5 15.6 12.9V14.4C15.6 15.4 14.8 16.2 13.8 16.2C8.3 15.9 3.9 11.5 3.6 6C3.6 5 4.4 4.2 5.4 4.2L6.2 3.5Z"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>+91 9915941692</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Form Container: width=813px, height=538px, radius=25px, border=1px */}
          <form
            ref={formBoxRef}
            onSubmit={handleSubmit}
            style={{ borderColor: "rgba(255, 255, 255, 0.12)" }}
            className="w-full max-w-[813px] xl:w-[813px] min-h-[480px] sm:h-[538px] shrink-0 rounded-[25px] border bg-[#080505] px-7 sm:px-11 py-9 sm:py-11 flex flex-col justify-between will-change-transform"
          >
            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange("fullName")}
                  placeholder="Full Name"
                  required
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                  className="w-full bg-transparent border-b border-white/15 focus:border-[#DC2D26] pb-3 text-[13px] text-white placeholder:text-zinc-500 outline-none transition-colors"
                />
              </div>

              <div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange("phone")}
                  placeholder="Phone"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                  className="w-full bg-transparent border-b border-white/15 focus:border-[#DC2D26] pb-3 text-[13px] text-white placeholder:text-zinc-500 outline-none transition-colors"
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange("email")}
                  placeholder="Email"
                  required
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                  className="w-full bg-transparent border-b border-white/15 focus:border-[#DC2D26] pb-3 text-[13px] text-white placeholder:text-zinc-500 outline-none transition-colors"
                />
              </div>

              <div>
                <textarea
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleChange("message")}
                  placeholder="Message (optional)"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                  className="w-full resize-none bg-transparent border-b border-white/15 focus:border-[#DC2D26] pb-2 text-[13px] text-white placeholder:text-zinc-500 outline-none transition-colors"
                />
                <div
                  className="mt-1.5 text-right text-[10px] text-zinc-500"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {formData.message.length > 0
                    ? `${formData.message.length} / 1000 symbols`
                    : "1000 symbols"}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              {/* Button: width=138px, height=49px, radius=160px, bg=#DC2D26 */}
              <button
                type="submit"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
                className="w-[138px] h-[49px] rounded-[160px] bg-[#DC2D26] hover:bg-[#c3231d] active:scale-[0.98] transition-[background-color,transform] duration-200 text-white text-[13px] font-medium flex items-center justify-center cursor-pointer"
              >
                Submit
              </button>

              {submitted && (
                <span
                  className="text-xs text-[#DC2D26]"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Thanks! We&apos;ve received your message.
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Bottom Footer Box */}
        <div
          ref={footerCardRef}
          style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
          className="mt-10 rounded-[25px] border bg-[#070404] px-7 sm:px-12 py-10 sm:py-12 will-change-transform"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10">
            {/* Brand + Socials */}
            <div className="lg:col-span-3 flex flex-col justify-between gap-8">
              <a href="#home" className="inline-block w-fit">
                <img
                  src="/images/logo.png"
                  alt="Sagmetic Infotech"
                  className="h-12 sm:h-14 w-auto object-contain"
                />
              </a>

              <div className="flex items-center gap-3">
                {socialIcons.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-label={item.name}
                    style={{
                      width: "45px",
                      height: "45px",
                      borderRadius: "25px",
                      border: "0.5px solid #FFFFFF26",
                    }}
                    className="hover:border-[#DC2D26] flex items-center justify-center overflow-hidden transition-colors shrink-0 p-2.5"
                  >
                    <img
                      src={item.src}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* 4 Link / Contact Columns */}
            <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {FOOTER_COLUMNS.map((col) => (
                <div key={col.title}>
                  {/* Services and other: Montserrat, weight=600, size=20px, lh=30px, ls=0% */}
                  <h3
                    className="text-white text-[20px] leading-[30px] tracking-[0] mb-3"
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    {col.title}
                  </h3>

                  {col.type === "contact" ? (
                    <div
                      className="space-y-4 text-[#807F7F] text-[14px] leading-[22px] tracking-[0]"
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 400,
                      }}
                    >
                      <div>
                        {col.addressLines.map((line) => (
                          <div key={line}>{line}</div>
                        ))}
                      </div>
                      <a
                        href="tel:+919915941692"
                        className="block hover:text-white transition-colors"
                      >
                        {col.phone}
                      </a>
                      <a
                        href="mailto:info@sagmetic.com"
                        className="block hover:text-white transition-colors"
                      >
                        {col.email}
                      </a>
                    </div>
                  ) : (
                    <ul className="space-y-0.5">
                      {col.links.map((link) => (
                        <li key={link.label}>
                          {/* Options: Montserrat, weight=400, size=14px, lh=38px, ls=0%, color=#807F7F */}
                          <a
                            href={link.href}
                            className="block text-[#807F7F] hover:text-white text-[14px] leading-[38px] tracking-[0] transition-colors"
                            style={{
                              fontFamily: "'Montserrat', sans-serif",
                              fontWeight: 400,
                            }}
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <p
          className="mt-7 text-center text-[#807F7F] text-[12px] leading-relaxed"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 400,
          }}
        >
          ©2026 All rights reserved to Sagmetic Infotech.
        </p>
      </div>
    </footer>
  );
}