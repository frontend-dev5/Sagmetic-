import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    title: "Web Designing",
    description:
      "Due to a badly designed e-commerce website, are you losing customers and unable to achieve your online marketing objectives? Do you want to give your website a unique and specialized look? At Sagmetic Infotech, we mix cutting-edge technology with our effective website design know-how to create a high-quality, fully functional website at a cost that will fit comfortably within your budget.",
    cardNumber: "01",
  },
  {
    title: "Web Development",
    description:
      "Sagmetic Infotech offers its customers high-quality web development services. Our skilled team specializes in building beautiful, useful websites that satisfy the requirements of our customers. We use a range of technologies, including CMS and e-commerce platforms, to ensure exceptional results. Discover additional information on how we can assist your company in achieving success in the online realm.",
    cardNumber: "02",
  },
  {
    title: "Search Engine Optimization",
    description:
      "We at Sagmetic Infotech provide high-quality SEO outsourcing services in India and assist your web portal in ranking for the keywords that are most crucial to your business by leveraging years of experience in Internet and search engine optimization. Our skilled team will create an SEO game plan for your brand using our rigorous attention to the specifics of your business, forward-focused analytics, and cutting-edge tool sets.",
    cardNumber: "03",
  },
  {
    title: "Ecommerce Solutions",
    description:
      "For an exceptional, highly responsive, and seamlessly mobile-friendly e-commerce website, don't hesitate to reach out to our team of incredibly talented website designers. We are dedicated to achieving the successful launch of your company's website, as it serves as a paramount representation of your brand. Trust us to go above and beyond to deliver the best possible outcome for your e-commerce platform.",
    cardNumber: "04",
  },
  {
    title: "Social Media Marketing",
    description:
      "Social networking has become ingrained in our culture, shaping our language and driving digital marketing. At Sagmetic Infotech, we strive to be the leading social media marketing firm. We excel in crafting engaging content and ad campaigns that connect with your followers on Facebook, Instagram, and Twitter. Join us to leverage the immense traffic of these platforms.",
    cardNumber: "05",
  },
  {
    title: "WordPress Development",
    description:
      "At Sagmetic Infotech, we provide skilled WordPress development services, such as creating unique themes and plugins as well as designing, migrating, optimizing, maintaining, and supporting websites. Our experienced team of developers makes sure that your website satisfies all of your specific company requirements and goes above and beyond what you had hoped for. Learn more to discuss the specifics of your project.",
    cardNumber: "06",
  },
];

export default function MainServiceCard() {
  const cardsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".service-card");

      cards.forEach((card) => {
        gsap.fromTo(
          card,
          {
            scale: 0.7,
            y: 60,

            opacity: 0,
            transformOrigin: "center center",
          },
          {
            scale: 1,
            y: 0,

            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              end: "top 55%",
              scrub: 1,
            },
          },
        );
      });
    }, cardsRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={cardsRef}>
      {services.map((service, index) => (
        <div
          key={service.cardNumber}
          className="service-card group border border-[#0000001a] rounded-[25px] py-[56px] mb-[30px] hover:shadow-[60px_36px_94px_0px_#0126391C] transition-shadow duration-300 hover:border-transparent relative overflow-hidden"
        >
          <div className="card-inner text-center relative z-[1]">
            <h4 className="font-montserrat font-bold text-[30px] pb-[10px]">
              {service.title}
            </h4>

            <div className="crd-cntnt font-montserrat font-normal text-[18px] text-[#807F7F] max-w-[800px] mx-auto max-3xl:text-[16px]">
              <p>{service.description}</p>
            </div>

            <div className="readmore pt-[23px]">
              <a
                className="text-[#DC2D26] font-montserrat font-normal text-[16px]"
                href="#"
              >
                Read More
              </a>
            </div>
          </div>

          <div className="card-number">
            <p className="bg-[linear-gradient(180deg,rgba(220,45,38,0)_0%,#DC2D26_100%)] bg-clip-text text-transparent text-[216px] font-black font-montserrat uppercase leading-[1] absolute bottom-[-50px] left-0 opacity-20 scale-[0.7] group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 ease-in-out max-3xl:text-[120px] max-3xl:scale-[0.8] max-3xl:bottom-[-30px]">
              {service.cardNumber}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
